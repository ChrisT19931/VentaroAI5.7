'use client';

import React, { useEffect, useState } from 'react';
import { WebGenProject } from '@/lib/web-gen-service';
import { useRouter } from 'next/navigation';

export default function PublishedWebsite({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const router = useRouter();
  const [project, setProject] = useState<WebGenProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/web-gen?projectId=${projectId}`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to load project');
        }
        
        const data = await response.json();
        const projectData = data.project;
        
        if (!projectData) {
          setError('Project not found');
          return;
        }
        
        if (!projectData.is_published) {
          setError('This project is not published');
          return;
        }
        
        setProject(projectData);
      } catch (err) {
        console.error('Error loading published project:', err);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Render the HTML and CSS content directly
  useEffect(() => {
    if (project && project.html_content && project.css_content) {
      // Create a style element for the CSS
      const styleElement = document.createElement('style');
      styleElement.textContent = project.css_content;
      document.head.appendChild(styleElement);
      
      // Set the HTML content
      const contentContainer = document.getElementById('published-content');
      if (contentContainer) {
        contentContainer.innerHTML = project.html_content;
      }
      
      // Clean up function
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/web-gen/projects')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="published-website">
      {/* Add a small banner at the top for navigation */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-2 flex justify-between items-center z-50">
        <div className="text-sm font-medium">
          {project?.name} - Published Website
        </div>
        <button
          onClick={() => router.push('/web-gen/projects')}
          className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
        >
          Back to Projects
        </button>
      </div>
      
      {/* Add padding to account for the banner */}
      <div className="pt-10">
        <div id="published-content"></div>
      </div>
    </div>
  );
}