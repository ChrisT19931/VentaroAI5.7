import { supabaseAdmin } from '@/lib/supabase';

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  try {
    // Generate a unique filename to avoid collisions
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${path}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('File upload error:', error.message);
    throw error;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @param bucket The storage bucket name
 * @returns A boolean indicating success or failure
 */
export async function deleteFile(url: string, bucket: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathWithBucket = urlObj.pathname;
    
    // Remove the bucket name and leading slash from the path
    const path = pathWithBucket.replace(`/${bucket}/`, '');
    
    // Delete the file from Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
    
    return true;
  } catch (error: any) {
    console.error('File deletion error:', error.message);
    return false;
  }
}

/**
 * Generates a signed URL for a file in Supabase Storage
 * @param path The path of the file within the bucket
 * @param bucket The storage bucket name
 * @param expiresIn The number of seconds until the signed URL expires (default: 60 minutes)
 * @returns The signed URL
 */
export async function getSignedUrl(
  path: string,
  bucket: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      throw new Error(`Error generating signed URL: ${error.message}`);
    }
    
    return data.signedUrl;
  } catch (error: any) {
    console.error('Signed URL generation error:', error.message);
    throw error;
  }
}

/**
 * Checks if a file exists in Supabase Storage
 * @param path The path of the file within the bucket
 * @param bucket The storage bucket name
 * @returns A boolean indicating if the file exists
 */
export async function fileExists(path: string, bucket: string): Promise<boolean> {
  try {
    // List files with the given path as a prefix
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/'), {
        limit: 1,
        offset: 0,
        search: path.split('/').pop(),
      });
    
    if (error) {
      throw new Error(`Error checking file existence: ${error.message}`);
    }
    
    return data && data.length > 0;
  } catch (error: any) {
    console.error('File existence check error:', error.message);
    return false;
  }
}