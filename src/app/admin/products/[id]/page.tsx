'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  file_url: string;
  is_active: boolean;
  features: string[];
  created_at: string;
};

export default function ProductForm({ params }: { params: { id: string } }) {
  const { id } = params;
  const isNewProduct = id === 'new';
  const { data: session, status } = useSession();
  const user = session?.user;
  const authLoading = status === 'loading';
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    description: '',
    image_url: '',
    file_url: '',
    is_active: true,
    features: [''],
    created_at: new Date().toISOString(),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/signin?callbackUrl=/admin');
      return;
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (isAdmin && !isNewProduct) {
      fetchProduct();
    } else if (isAdmin && isNewProduct) {
      setIsLoading(false);
    }
  }, [isAdmin, id]);

  const checkAdminStatus = async () => {
    try {
      // Check if user is admin
      const isAdmin = user?.email === 'chris.t@ventarosales.com';
      setIsAdmin(isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // Parse features if stored as JSON string
        let features = data.features || [''];
        if (typeof features === 'string') {
          try {
            features = JSON.parse(features);
          } catch (e) {
            features = [features];
          }
        }

        setProduct({
          ...data,
          features: Array.isArray(features) ? features : ['']
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...product.features];
    updatedFeatures[index] = value;
    setProduct(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const addFeature = () => {
    setProduct(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (product.features.length > 1) {
      const updatedFeatures = [...product.features];
      updatedFeatures.splice(index, 1);
      setProduct(prev => ({
        ...prev,
        features: updatedFeatures
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      let imageUrl = product.image_url;
      let fileUrl = product.file_url;

      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'product-images');
      }

      // Upload product file if provided
      if (productFile) {
        fileUrl = await uploadFile(productFile, 'product-files');
      }

      const productData = {
        ...product,
        image_url: imageUrl,
        file_url: fileUrl,
        features: product.features.filter(f => f.trim() !== '')
      };

      let result;

      if (isNewProduct) {
        // Create new product
        result = await supabase
          .from('products')
          .insert([{ ...productData, id: undefined }]) // Remove id for new products
          .select()
          .single();
      } else {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', id)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setSuccess(isNewProduct ? 'Product created successfully!' : 'Product updated successfully!');
      
      if (isNewProduct && result.data) {
        // Redirect to edit page for the new product
        setTimeout(() => {
          router.push(`/admin/products/${result.data.id}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      setError(error.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isNewProduct ? 'Add New Product' : 'Edit Product'}
          </h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 input-field"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 input-field"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <div className="mt-1 flex items-center">
                  {(product.image_url || imageFile) && (
                    <div className="mr-4">
                      <img
                        src={imageFile ? URL.createObjectURL(imageFile) : product.image_url}
                        alt="Product preview"
                        className="h-24 w-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <label className="cursor-pointer btn-outline py-2 px-4">
                    {product.image_url ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Digital Product File</label>
                <div className="mt-1 flex items-center">
                  {(product.file_url || productFile) && (
                    <div className="mr-4 text-sm text-gray-500">
                      {productFile ? productFile.name : 'Current file: ' + product.file_url.split('/').pop()}
                    </div>
                  )}
                  <label className="cursor-pointer btn-outline py-2 px-4">
                    {product.file_url ? 'Change File' : 'Upload File'}
                    <input
                      type="file"
                      onChange={handleProductFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Product Features</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  + Add Feature
                </button>
              </div>
              <div className="mt-2 space-y-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="input-field flex-grow"
                    />
                    {product.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={product.is_active}
                onChange={(e) => setProduct(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active (visible in store)
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary flex items-center"
              >
                {isSaving && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSaving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}