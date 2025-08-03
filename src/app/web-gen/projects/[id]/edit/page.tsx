'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdvancedWebBuilder from '@/components/web-gen/AdvancedWebBuilder';
import { ArrowLeft, ExternalLink, Download, Share2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  lastEdited: string;
  thumbnail?: string;
  pages?: any[];
}

interface Page {
  id: string;
  name: string;
  route: string;
  components: any[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const ProjectEditPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const projectId = params.id as string;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    loadProject();
  }, [session, status, projectId]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/web-gen/projects/${projectId}`);
      if (response.ok) {
        const projectData = await response.json();
        setProject(projectData);
      } else {
        console.error('Failed to load project');
        router.push('/web-gen/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      router.push('/web-gen/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (html: string, css: string, pages: Page[]) => {
    if (!project) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/web-gen/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html,
          css,
          pages,
          lastEdited: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setProject(prev => prev ? { ...prev, html, css, pages, lastEdited: new Date().toISOString() } : null);
        setLastSaved(new Date());
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!project) return;

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <style>
${project.css}
  </style>
</head>
<body>
${project.html}
</body>
</html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!project) return;

    try {
      // Create a shareable link
      const shareUrl = `${window.location.origin}/web-gen/preview/${projectId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: project.name,
          text: project.description,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => router.push('/web-gen/projects')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/web-gen/projects')}
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Back to Projects</span>
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
              <p className="text-sm text-gray-600">
                {lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : `Last edited ${new Date(project.lastEdited).toLocaleString()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {saving && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Saving...</span>
              </div>
            )}
            
            <button
              onClick={() => window.open(`/web-gen/preview/${projectId}`, '_blank')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <ExternalLink size={16} />
              <span>Preview</span>
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Web Builder */}
      <AdvancedWebBuilder
        projectId={projectId}
        initialContent={project.html}
        initialCss={project.css}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProjectEditPage;