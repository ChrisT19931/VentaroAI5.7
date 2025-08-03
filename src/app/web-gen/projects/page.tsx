'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, ExternalLink, Trash2, Monitor, Sparkles, Settings, Wand2, Palette } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { WebGenProject } from '@/lib/web-gen-service';
import Link from 'next/link';
import Image from 'next/image';
import AIConfigModal from '@/components/web-gen/AIConfigModal';
import TemplateSelector from '@/components/web-gen/TemplateSelector';
import { AdvancedTemplate, generateTemplateHTML, generateTemplateCSS } from '@/lib/advanced-templates';

export default function WebGenProjects() {
  const { user, isAuthenticated, isLoading } = useSimpleAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<WebGenProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(false);
  const [aiStyle, setAiStyle] = useState<'modern' | 'classic' | 'minimal' | 'creative'>('modern');
  const [aiColorScheme, setAiColorScheme] = useState<'blue' | 'green' | 'purple' | 'orange' | 'dark' | 'light'>('blue');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIConfig, setShowAIConfig] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AdvancedTemplate | null>(null);
  const [aiConfig, setAiConfig] = useState({
    provider: 'internal' as 'openai' | 'anthropic' | 'internal',
    apiKey: '',
    model: '',
    temperature: 0.7,
    maxTokens: 2000
  });
  const [aiFeatures, setAiFeatures] = useState<string[]>([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Load user's projects
    const loadProjects = async () => {
      if (user) {
        setIsLoadingProjects(true);
        try {
          const response = await fetch(`/api/web-gen?userId=${user.id}`, {
            method: 'GET',
          });
          
          if (!response.ok) {
            throw new Error('Failed to load projects');
          }
          
          const data = await response.json();
          setProjects(data.projects || []);
        } catch (error) {
          console.error('Error loading projects:', error);
        } finally {
          setIsLoadingProjects(false);
        }
      }
    };

    if (user) {
      loadProjects();
    }
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProjectName.trim()) return;

    setIsCreating(true);
    let generatedContent = null;

    try {
      // Use selected template
      if (selectedTemplate) {
        generatedContent = {
          html: generateTemplateHTML(selectedTemplate),
          css: generateTemplateCSS(selectedTemplate)
        };
      }
      // Generate AI content if requested
      else if (useAI && newProjectDescription.trim()) {
        setIsGenerating(true);
        try {
          const aiResponse = await fetch('/api/web-gen/ai-generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: newProjectDescription.trim(),
              projectName: newProjectName.trim(),
              style: aiStyle,
              colorScheme: aiColorScheme,
              features: aiFeatures,
              pages: ['home', 'about', 'contact'],
              aiConfig: aiConfig.provider !== 'internal' ? {
                provider: aiConfig.provider,
                apiKey: aiConfig.apiKey,
                model: aiConfig.model,
                temperature: aiConfig.temperature,
                maxTokens: aiConfig.maxTokens
              } : undefined
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            if (aiData.success) {
              generatedContent = {
                html: aiData.html,
                css: aiData.css
              };
            }
          } else {
            const errorData = await aiResponse.json();
            console.error('AI generation failed:', errorData.error);
            alert(`AI generation failed: ${errorData.error}`);
          }
        } catch (error) {
          console.error('AI generation failed:', error);
          alert('AI generation failed. Please try again.');
        } finally {
          setIsGenerating(false);
        }
      }

      const response = await fetch('/api/web-gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          project: {
            name: newProjectName.trim(),
            description: newProjectDescription.trim(),
            user_id: user.id,
            is_published: false,
            content: generatedContent?.html || '',
            css: generatedContent?.css || ''
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      const newProject = data.project;

      if (newProject) {
        setProjects([newProject, ...projects]);
        setNewProjectName('');
        setNewProjectDescription('');
        setUseAI(false);
        setSelectedTemplate(null);
        setShowCreateForm(false);
        // Navigate to the editor for the new project
        router.push(`/web-gen/editor/${newProject.id}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (template: AdvancedTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    // Optionally pre-fill project name with template name
    if (!newProjectName) {
      setNewProjectName(template.name);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/web-gen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'delete',
            projectId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        const data = await response.json();
        if (data.success) {
          setProjects(projects.filter(p => p.id !== projectId));
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Web Projects</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Web Projects</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          {showCreateForm ? 'Cancel' : 'Create New Project'}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-black mb-1">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Awesome Website"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-black mb-1">
                Description {useAI ? '(required for AI generation)' : '(optional)'}
              </label>
              <textarea
                id="projectDescription"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder={useAI ? "Describe your website in detail (e.g., 'A modern portfolio website for a photographer with gallery, about section, and contact form')" : "Brief description of your website"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                rows={useAI ? 4 : 3}
                required={useAI}
              />
            </div>
            
            {/* Template and AI Generation Options */}
            <div className="border-t pt-4">
              <div className="space-y-4">
                {/* Template Selection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-black">Use Template</span>
                    {selectedTemplate && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {selectedTemplate.name}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTemplateSelector(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {selectedTemplate ? 'Change Template' : 'Browse Templates'}
                  </button>
                </div>
                
                {/* AI Generation Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useAI"
                      checked={useAI}
                      onChange={(e) => setUseAI(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={!!selectedTemplate}
                    />
                    <label htmlFor="useAI" className="flex items-center space-x-2 text-sm font-medium text-black">
                      <Wand2 className="w-4 h-4 text-purple-500" />
                      <span>Generate with AI</span>
                    </label>
                    {selectedTemplate && (
                      <span className="text-xs text-gray-500">(disabled when template selected)</span>
                    )}
                  </div>
                  
                  {useAI && (
                    <button
                      type="button"
                      onClick={() => setShowAIConfig(true)}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>AI Settings</span>
                    </button>
                  )}
                </div>
              </div>
              
              {useAI && (
                <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Style
                      </label>
                      <select
                        value={aiStyle}
                        onChange={(e) => setAiStyle(e.target.value as typeof aiStyle)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="minimal">Minimal</option>
                        <option value="creative">Creative</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Color Scheme
                      </label>
                      <select
                        value={aiColorScheme}
                        onChange={(e) => setAiColorScheme(e.target.value as typeof aiColorScheme)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="orange">Orange</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Features Selection */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Features to Include
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'contact-form', label: 'Contact Form' },
                        { id: 'newsletter', label: 'Newsletter' },
                        { id: 'testimonials', label: 'Testimonials' },
                        { id: 'gallery', label: 'Image Gallery' },
                        { id: 'blog', label: 'Blog Section' },
                        { id: 'social-links', label: 'Social Links' }
                      ].map((feature) => (
                        <label key={feature.id} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={aiFeatures.includes(feature.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAiFeatures([...aiFeatures, feature.id]);
                              } else {
                                setAiFeatures(aiFeatures.filter(f => f !== feature.id));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-black">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Provider Info */}
                  <div className="flex items-center justify-between text-xs text-gray-600 bg-white bg-opacity-50 rounded p-2">
                    <span>Provider: {aiConfig.provider === 'internal' ? 'Internal Templates' : aiConfig.provider.toUpperCase()}</span>
                    {aiConfig.provider !== 'internal' && aiConfig.model && (
                      <span>Model: {aiConfig.model}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreating || !newProjectName.trim() || (useAI && !selectedTemplate && !newProjectDescription.trim())}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Generating with AI...
                  </>
                ) : isCreating ? (
                  'Creating...'
                ) : selectedTemplate ? (
                  'Create from Template'
                ) : useAI ? (
                  'Create with AI'
                ) : (
                  'Create & Edit'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Configuration Modal */}
      <AIConfigModal
        isOpen={showAIConfig}
        onClose={() => setShowAIConfig(false)}
        onSave={setAiConfig}
        currentConfig={aiConfig}
      />

      {/* Template Selector Modal */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleSelectTemplate}
      />

      {isLoadingProjects ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {project.thumbnail ? (
                  <img 
                    src={project.thumbnail} 
                    alt={project.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    No Preview
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 text-black">{project.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Last edited: {new Date(project.last_edited_at || project.updated_at || '').toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                     <button
                       onClick={() => router.push(`/web-gen/projects/${project.id}/edit`)}
                       className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-3 rounded transition duration-200 flex items-center gap-1"
                     >
                       <Edit size={14} />
                       Edit
                     </button>
                     <button
                       onClick={() => window.open(`/web-gen/preview/${project.id}`, '_blank')}
                       className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-3 rounded transition duration-200 flex items-center gap-1"
                     >
                       <ExternalLink size={14} />
                       Preview
                     </button>
                   </div>
                  <button
                    onClick={() => handleDeleteProject(project.id!)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition duration-200 flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2 text-black">No projects yet</h3>
          <p className="text-black mb-4">Create your first web project to get started</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
}