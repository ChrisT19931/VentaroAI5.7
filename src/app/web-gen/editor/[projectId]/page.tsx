'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { WebGenProject, WebGenAsset } from '@/lib/web-gen-service';
import 'grapesjs/dist/css/grapes.min.css';
import '@/app/web-gen/web-gen.css';

export default function WebGenEditor({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const { user, isAuthenticated, isLoading } = useSimpleAuth();
  const router = useRouter();
  const [project, setProject] = useState<WebGenProject | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const editorRef = useRef<any>(null);
  const editorInstance = useRef<any>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Load project data
    const loadProject = async () => {
      if (!projectId) return;
      
      setIsLoadingProject(true);
      try {
        const response = await fetch(`/api/web-gen?projectId=${projectId}`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to load project');
        }
        
        const projectData = await response.json();
        
        if (!projectData) {
          // Project not found or not accessible
          router.push('/web-gen/projects');
          return;
        }
        
        setProject(projectData);
      } catch (error) {
        console.error('Error loading project:', error);
        router.push('/web-gen/projects');
      } finally {
        setIsLoadingProject(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, router]);

  useEffect(() => {
    // Initialize GrapesJS editor when project is loaded
    const initEditor = async () => {
      if (!project || !editorRef.current || editorInstance.current) return;

      try {
        // Dynamically import GrapesJS and plugins
        const [grapesjs, blocksBasic, presetWebpage, styleBg] = await Promise.all([
          import('grapesjs'),
          import('grapesjs-blocks-basic'),
          import('grapesjs-preset-webpage'),
          import('grapesjs-style-bg')
        ]);

        // Initialize editor
        const editor = grapesjs.default.init({
          container: editorRef.current,
          height: 'calc(100vh - 60px)',
          width: 'auto',
          storageManager: false,
          deviceManager: {
            devices: [
              {
                name: 'Desktop',
                width: '',
              },
              {
                name: 'Tablet',
                width: '768px',
                widthMedia: '992px',
              },
              {
                name: 'Mobile',
                width: '320px',
                widthMedia: '480px',
              },
            ],
          },
          assetManager: {
            upload: `/api/web-gen/assets?projectId=${project.id}`,
            uploadName: 'file',
            assets: [],
            uploadText: 'Drop files here or click to upload',
            addBtnText: 'Add Images',
            autoAdd: true,
            headers: {
              'X-Project-Id': project.id,
            },
            // Custom uploadFile to handle the response from our API
            uploadFile: async (e: any) => {
              const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
              const formData = new FormData();
              
              for (const file of files) {
                formData.append('file', file);
              }
              
              try {
                const response = await fetch(`/api/web-gen/assets?projectId=${project.id}`, {
                  method: 'POST',
                  body: formData,
                });
                
                if (!response.ok) {
                  throw new Error('Upload failed');
                }
                
                const result = await response.json();
                return result.assets;
              } catch (error) {
                console.error('Error uploading assets:', error);
                return { error: true };
              }
            },
          },
          panels: {
            defaults: [
              {
                id: 'panel-devices',
                el: '.panel__devices',
                buttons: [{
                  id: 'device-desktop',
                  label: 'Desktop',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                }, {
                  id: 'device-tablet',
                  label: 'Tablet',
                  command: 'set-device-tablet',
                  togglable: false,
                }, {
                  id: 'device-mobile',
                  label: 'Mobile',
                  command: 'set-device-mobile',
                  togglable: false,
                }],
              },
              {
                id: 'panel-actions',
                el: '.panel__actions',
                buttons: [
                  {
                    id: 'save',
                    className: 'btn-save',
                    label: 'Save',
                    command: 'save-project',
                  },
                  {
                    id: 'publish',
                    className: 'btn-publish',
                    label: project.is_published ? 'Unpublish' : 'Publish',
                    command: project.is_published ? 'unpublish-project' : 'publish-project',
                  },
                  {
                    id: 'exit',
                    className: 'btn-exit',
                    label: 'Exit',
                    command: 'exit-editor',
                  },
                ],
              },
              {
                id: 'panel-basic-actions',
                el: '.panel__basic-actions',
                buttons: [
                  {
                    id: 'visibility',
                    active: true,
                    className: 'btn-toggle-borders',
                    label: '<i class="fa fa-square-o"></i>',
                    command: 'sw-visibility',
                  },
                  {
                    id: 'export',
                    className: 'btn-open-export',
                    label: '<i class="fa fa-code"></i>',
                    command: 'export-template',
                    context: 'export-template',
                  },
                  {
                    id: 'undo',
                    className: 'btn-undo',
                    label: '<i class="fa fa-undo"></i>',
                    command: 'undo',
                  },
                  {
                    id: 'redo',
                    className: 'btn-redo',
                    label: '<i class="fa fa-repeat"></i>',
                    command: 'redo',
                  },
                  {
                    id: 'clear',
                    className: 'btn-clear',
                    label: 'Clear',
                    command: 'clear-canvas',
                  },
                ],
              },
            ],
          },
          plugins: [
            blocksBasic.default,
            presetWebpage.default,
            styleBg.default,
          ],
          pluginsOpts: {
            [blocksBasic.default]: {},
            [presetWebpage.default]: {},
            [styleBg.default]: {},
          },
        });

        // Load project content
        if (project.html_content) {
          editor.setComponents(project.html_content);
        }
        
        if (project.css_content) {
          editor.setStyle(project.css_content);
        }
        
        // Load project assets
        const loadAssets = async () => {
          try {
            const response = await fetch(`/api/web-gen/assets?projectId=${project.id}`, {
              method: 'GET',
            });
            
            if (response.ok) {
              const result = await response.json();
              if (result.assets && result.assets.length > 0) {
                const assetManager = editor.AssetManager;
                assetManager.add(result.assets.map((asset: WebGenAsset) => ({
                  src: asset.url,
                  name: asset.filename,
                  type: 'image',
                  height: 'auto',
                  width: 'auto',
                })));
              }
            }
          } catch (error) {
            console.error('Error loading assets:', error);
          }
        };
        
        loadAssets();

        // Add custom commands
        editor.Commands.add('save-project', {
          run: () => saveProject(editor),
        });

        editor.Commands.add('publish-project', {
          run: () => publishProject(),
        });

        editor.Commands.add('unpublish-project', {
          run: () => unpublishProject(),
        });

        editor.Commands.add('exit-editor', {
          run: () => router.push('/web-gen/projects'),
        });

        editor.Commands.add('clear-canvas', {
          run: () => {
            if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
              editor.runCommand('core:canvas-clear');
            }
          },
        });

        // Set up auto-save
        editor.on('component:update', () => {
          if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
          }
          
          autoSaveTimerRef.current = setTimeout(() => {
            saveProject(editor, true);
          }, 5000); // Auto-save after 5 seconds of inactivity
        });

        editorInstance.current = editor;
      } catch (error) {
        console.error('Error initializing GrapesJS editor:', error);
      }
    };

    if (project && !isLoadingProject) {
      initEditor();
    }

    // Cleanup function
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [project, isLoadingProject, router]);

  const saveProject = async (editor: any, isAutoSave = false) => {
    if (!project || !editor || isSaving) return;

    setIsSaving(true);

    try {
      const htmlContent = editor.getHtml();
      const cssContent = editor.getCss();
      
      // Generate thumbnail from current state
      const thumbnailUrl = await generateThumbnail(editor);

      // Use the API route instead of direct service call
      const response = await fetch('/api/web-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save',
          projectId: project.id,
          data: {
            html_content: htmlContent,
            css_content: cssContent,
            thumbnail: thumbnailUrl || project.thumbnail,
          }
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setProject(result.project);
        setLastSaved(new Date());
        if (!isAutoSave) {
          alert('Project saved successfully!');
        }
      } else {
        throw new Error(result.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      if (!isAutoSave) {
        alert('Error saving project. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const generateThumbnail = async (editor: any): Promise<string | null> => {
    try {
      // This is a simplified version. In a real implementation, you might want to use
      // a service like html-to-image or a server-side rendering solution.
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Fill with a light background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some text to indicate it's a thumbnail
      ctx.fillStyle = '#64748b';
      ctx.font = '20px Arial';
      ctx.fillText(project.name, 20, 40);
      
      // In a real implementation, you would render the actual website content
      // For now, we'll just return the canvas as a data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  };

  const publishProject = async () => {
    if (!project) return;
    
    try {
      // Save current state first
      if (editorInstance.current) {
        await saveProject(editorInstance.current);
      }
      
      // Use the API route instead of direct service call
      const response = await fetch('/api/web-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'publish',
          projectId: project.id,
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setProject(result.project);
        alert(`Project published successfully! It's now available at ${result.project.published_url}`);
        
        // Update the publish button label
        if (editorInstance.current) {
          const btn = editorInstance.current.Panels.getButton('panel-actions', 'publish');
          if (btn) {
            btn.set('label', 'Unpublish');
            btn.set('command', 'unpublish-project');
          }
        }
      } else {
        throw new Error(result.error || 'Failed to publish project');
      }
    } catch (error) {
      console.error('Error publishing project:', error);
      alert('Error publishing project. Please try again.');
    }
  };

  const unpublishProject = async () => {
    if (!project) return;
    
    try {
      // Use the API route instead of direct service call
      const response = await fetch('/api/web-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unpublish',
          projectId: project.id,
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setProject(result.project);
        alert('Project unpublished successfully.');
        
        // Update the publish button label
        if (editorInstance.current) {
          const btn = editorInstance.current.Panels.getButton('panel-actions', 'publish');
          if (btn) {
            btn.set('label', 'Publish');
            btn.set('command', 'publish-project');
          }
        }
      } else {
        throw new Error(result.error || 'Failed to unpublish project');
      }
    } catch (error) {
      console.error('Error unpublishing project:', error);
      alert('Error unpublishing project. Please try again.');
    }
  };

  if (isLoading || isLoadingProject) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{project?.name || 'Web Editor'}</h1>
          {lastSaved && (
            <span className="text-xs text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <div className="panel__devices"></div>
          <div className="panel__basic-actions"></div>
          <div className="panel__actions"></div>
        </div>
      </div>
      
      <div className="flex-grow">
        <div ref={editorRef} id="gjs" className="editor-container"></div>
      </div>
    </div>
  );
}