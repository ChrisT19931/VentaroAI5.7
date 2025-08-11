'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function WebGenFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    style: 'modern',
    colorScheme: 'blue',
    email: '',
    pages: ['home', 'about', 'services', 'contact'],
    features: ['contact-form', 'responsive-design']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'pages' | 'features') => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          [category]: [...prev[category], value]
        };
      } else {
        return {
          ...prev,
          [category]: prev[category].filter(item => item !== value)
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/web-gen/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate website');
      }

      const result = await response.json();
      toast.success('Website generated successfully!');
      
      // Store the generated website in localStorage for demo purposes
      localStorage.setItem('generatedWebsite', JSON.stringify({
        html: result.data.html,
        css: result.data.css,
        projectName: formData.projectName
      }));
      
      // Redirect to preview page
      router.push('/web-gen/preview');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          AI Website Generator
        </h1>
        
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Name */}
                <div className="col-span-2">
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="My Business Website"
                  />
                </div>
                
                {/* Description */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Website Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Describe your website in detail. What is it for? What sections should it have? What's the tone and feel?"
                  />
                </div>
                
                {/* Style */}
                <div>
                  <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-1">
                    Design Style
                  </label>
                  <select
                    id="style"
                    name="style"
                    value={formData.style}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                
                {/* Color Scheme */}
                <div>
                  <label htmlFor="colorScheme" className="block text-sm font-medium text-gray-300 mb-1">
                    Color Scheme
                  </label>
                  <select
                    id="colorScheme"
                    name="colorScheme"
                    value={formData.colorScheme}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                
                {/* Email */}
                <div className="col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Email (to receive the generated website)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="your@email.com"
                  />
                </div>
                
                {/* Pages */}
                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-300 mb-2">Pages to Include</legend>
                    <div className="space-y-2">
                      {['home', 'about', 'services', 'contact', 'portfolio', 'blog', 'shop', 'team'].map(page => (
                        <div key={page} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`page-${page}`}
                            value={page}
                            checked={formData.pages.includes(page)}
                            onChange={(e) => handleCheckboxChange(e, 'pages')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                          />
                          <label htmlFor={`page-${page}`} className="ml-2 text-sm text-gray-300 capitalize">
                            {page}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
                
                {/* Features */}
                <div>
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-300 mb-2">Features to Include</legend>
                    <div className="space-y-2">
                      {[
                        'contact-form', 
                        'newsletter', 
                        'testimonials', 
                        'responsive-design',
                        'social-media-links',
                        'image-gallery',
                        'pricing-table',
                        'faq-section'
                      ].map(feature => (
                        <div key={feature} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`feature-${feature}`}
                            value={feature}
                            checked={formData.features.includes(feature)}
                            onChange={(e) => handleCheckboxChange(e, 'features')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                          />
                          <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-300 capitalize">
                            {feature.replace(/-/g, ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Website...
                    </>
                  ) : (
                    'Generate My Website'
                  )}
                </button>
              </div>
              
              <div className="text-xs text-gray-400 text-center">
                By clicking "Generate My Website", you agree to our terms of service and privacy policy.
                <br />
                Website generation typically takes 15-30 seconds depending on complexity.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}