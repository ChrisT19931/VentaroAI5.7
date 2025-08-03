import { getSupabaseClient } from './supabase';
import { User } from '@supabase/supabase-js';

export interface WebGenProject {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  html_content?: string;
  css_content?: string;
  js_content?: string;
  thumbnail?: string;
  is_published: boolean;
  published_url?: string;
  created_at?: string;
  updated_at?: string;
  last_edited_at?: string;
}

export interface WebGenAsset {
  id?: string;
  project_id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at?: string;
}

export class WebGenService {
  /**
   * Create a new web generator project
   */
  static async createProject(user: User, projectData: Partial<WebGenProject>): Promise<WebGenProject | null> {
    try {
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('web_gen_projects')
        .insert({
          user_id: user.id,
          name: projectData.name || 'Untitled Project',
          description: projectData.description || '',
          html_content: projectData.html_content || '',
          css_content: projectData.css_content || '',
          js_content: projectData.js_content || '',
          is_published: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating project:', error);
        return null;
      }
      
      return data as WebGenProject;
    } catch (error) {
      console.error('Error in createProject:', error);
      return null;
    }
  }
  
  /**
   * Get all projects for a user
   */
  static async getUserProjects(userId: string): Promise<WebGenProject[]> {
    try {
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('web_gen_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user projects:', error);
        return [];
      }
      
      return data as WebGenProject[];
    } catch (error) {
      console.error('Error in getUserProjects:', error);
      return [];
    }
  }
  
  /**
   * Get a project by ID
   */
  static async getProjectById(projectId: string): Promise<WebGenProject | null> {
    try {
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('web_gen_projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }
      
      return data as WebGenProject;
    } catch (error) {
      console.error('Error in getProjectById:', error);
      return null;
    }
  }
  
  /**
   * Update a project
   */
  static async updateProject(projectId: string, updates: Partial<WebGenProject>): Promise<WebGenProject | null> {
    try {
      const supabase = await getSupabaseClient();
      
      // Add last_edited_at timestamp
      const updatesWithTimestamp = {
        ...updates,
        last_edited_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('web_gen_projects')
        .update(updatesWithTimestamp)
        .eq('id', projectId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating project:', error);
        return null;
      }
      
      return data as WebGenProject;
    } catch (error) {
      console.error('Error in updateProject:', error);
      return null;
    }
  }
  
  /**
   * Delete a project
   */
  static async deleteProject(projectId: string): Promise<boolean> {
    try {
      const supabase = await getSupabaseClient();
      
      const { error } = await supabase
        .from('web_gen_projects')
        .delete()
        .eq('id', projectId);
      
      if (error) {
        console.error('Error deleting project:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      return false;
    }
  }
  
  /**
   * Upload an asset for a project
   */
  static async uploadAsset(projectId: string, file: File): Promise<WebGenAsset | null> {
    try {
      const supabase = await getSupabaseClient();
      
      // Upload file to storage
      const filePath = `web-gen/${projectId}/${file.name}`;
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (storageError) {
        console.error('Error uploading asset to storage:', storageError);
        return null;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('assets')
        .getPublicUrl(filePath);
      
      // Create asset record in database
      const { data, error } = await supabase
        .from('web_gen_assets')
        .insert({
          project_id: projectId,
          name: file.name,
          file_path: publicUrlData.publicUrl,
          file_type: file.type,
          file_size: file.size
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating asset record:', error);
        return null;
      }
      
      return data as WebGenAsset;
    } catch (error) {
      console.error('Error in uploadAsset:', error);
      return null;
    }
  }
  
  /**
   * Get all assets for a project
   */
  static async getProjectAssets(projectId: string): Promise<WebGenAsset[]> {
    try {
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('web_gen_assets')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Error fetching project assets:', error);
        return [];
      }
      
      return data as WebGenAsset[];
    } catch (error) {
      console.error('Error in getProjectAssets:', error);
      return [];
    }
  }
  
  /**
   * Delete an asset
   */
  static async deleteAsset(assetId: string): Promise<boolean> {
    try {
      const supabase = await getSupabaseClient();
      
      // First get the asset to know the file path
      const { data: asset, error: fetchError } = await supabase
        .from('web_gen_assets')
        .select('*')
        .eq('id', assetId)
        .single();
      
      if (fetchError || !asset) {
        console.error('Error fetching asset:', fetchError);
        return false;
      }
      
      // Delete from storage
      // Extract the path from the public URL
      const urlParts = (asset as WebGenAsset).file_path.split('assets/');
      if (urlParts.length > 1) {
        const storagePath = urlParts[1];
        const { error: storageError } = await supabase
          .storage
          .from('assets')
          .remove([storagePath]);
        
        if (storageError) {
          console.error('Error deleting asset from storage:', storageError);
          // Continue anyway to delete the database record
        }
      }
      
      // Delete the database record
      const { error } = await supabase
        .from('web_gen_assets')
        .delete()
        .eq('id', assetId);
      
      if (error) {
        console.error('Error deleting asset record:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteAsset:', error);
      return false;
    }
  }
  
  /**
   * Publish a project (set is_published to true and generate a published URL)
   */
  static async publishProject(projectId: string): Promise<WebGenProject | null> {
    try {
      const supabase = await getSupabaseClient();
      
      // Generate a published URL (in a real implementation, this would involve
      // deploying the site to a hosting service)
      const publishedUrl = `${window.location.origin}/web-gen/published/${projectId}`;
      
      const { data, error } = await supabase
        .from('web_gen_projects')
        .update({
          is_published: true,
          published_url: publishedUrl,
          last_edited_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();
      
      if (error) {
        console.error('Error publishing project:', error);
        return null;
      }
      
      return data as WebGenProject;
    } catch (error) {
      console.error('Error in publishProject:', error);
      return null;
    }
  }
  
  /**
   * Unpublish a project
   */
  static async unpublishProject(projectId: string): Promise<WebGenProject | null> {
    try {
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('web_gen_projects')
        .update({
          is_published: false,
          last_edited_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();
      
      if (error) {
        console.error('Error unpublishing project:', error);
        return null;
      }
      
      return data as WebGenProject;
    } catch (error) {
      console.error('Error in unpublishProject:', error);
      return null;
    }
  }
}