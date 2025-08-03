'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Code, 
  Eye, 
  Layers, 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Grid, 
  Square, 
  Circle, 
  Triangle,
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Settings,
  Plus,
  Trash2,
  Copy,
  Move,
  MousePointer,
  Hand,
  Share2,
  FileText
} from 'lucide-react';
import VisualEditor from './VisualEditor';
import { TemplateComponent, AdvancedTemplate } from '@/lib/advanced-templates';

interface BuilderComponent {
  id: string;
  type: 'header' | 'hero' | 'features' | 'gallery' | 'contact' | 'footer' | 'text' | 'image' | 'button' | 'form';
  content: any;
  styles: {
    position: { x: number; y: number };
    size: { width: number; height: number };
    styling: { [key: string]: string };
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  pages: Page[];
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  settings: {
    responsive: boolean;
    animations: boolean;
    seo: boolean;
  };
}

interface Page {
  id: string;
  name: string;
  route: string;
  components: BuilderComponent[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

interface AdvancedWebBuilderProps {
  projectId: string;
  initialContent?: string;
  initialCss?: string;
  onSave: (html: string, css: string, pages: Page[]) => void;
}

const AdvancedWebBuilder: React.FC<AdvancedWebBuilderProps> = ({
  projectId,
  initialContent = '',
  initialCss = '',
  onSave
}) => {
  const [pages, setPages] = useState<Page[]>([{
    id: 'home',
    name: 'Home',
    route: '/',
    components: [],
    seo: { title: '', description: '', keywords: '' }
  }]);
  const [currentPageId, setCurrentPageId] = useState('home');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [tool, setTool] = useState<'select' | 'move' | 'add'>('select');
  const [showComponentLibrary, setShowComponentLibrary] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(true);
  const [history, setHistory] = useState<Page[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'templates' | 'assets'>('components');

  const currentPage = pages.find(p => p.id === currentPageId) || pages[0];

  // Component templates
  const componentTemplates = {
    hero: {
      type: 'hero' as const,
      content: {
        title: 'Welcome to Our Website',
        subtitle: 'Create amazing experiences with our platform',
        buttonText: 'Get Started',
        backgroundImage: ''
      },
      styles: {
        position: { x: 0, y: 0 },
        size: { width: 100, height: 60 },
        styling: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }
    },
    features: {
      type: 'features' as const,
      content: {
        title: 'Our Features',
        items: [
          { icon: '🚀', title: 'Fast Performance', description: 'Lightning fast loading times' },
          { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
          { icon: '📱', title: 'Responsive', description: 'Works on all devices' }
        ]
      },
      styles: {
        position: { x: 0, y: 60 },
        size: { width: 100, height: 40 },
        styling: {
          backgroundColor: '#f9fafb',
          padding: '3rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }
      }
    },
    gallery: {
      type: 'gallery' as const,
      content: {
        title: 'Gallery',
        images: [
          { src: '/api/placeholder/400/300', alt: 'Image 1', caption: 'Beautiful image 1' },
          { src: '/api/placeholder/400/300', alt: 'Image 2', caption: 'Beautiful image 2' },
          { src: '/api/placeholder/400/300', alt: 'Image 3', caption: 'Beautiful image 3' }
        ]
      },
      styles: {
        position: { x: 0, y: 100 },
        size: { width: 100, height: 50 },
        styling: {
          backgroundColor: '#ffffff',
          padding: '3rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }
      }
    },
    contact: {
      type: 'contact' as const,
      content: {
        title: 'Contact Us',
        fields: [
          { type: 'text', name: 'name', label: 'Name', required: true },
          { type: 'email', name: 'email', label: 'Email', required: true },
          { type: 'textarea', name: 'message', label: 'Message', required: true }
        ],
        submitText: 'Send Message'
      },
      styles: {
        position: { x: 0, y: 150 },
        size: { width: 100, height: 40 },
        styling: {
          backgroundColor: '#f3f4f6',
          padding: '3rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }
      }
    }
  };

  // Add component to current page
  const addComponent = (template: keyof typeof componentTemplates) => {
    const newComponent: BuilderComponent = {
      id: `${template}-${Date.now()}`,
      ...componentTemplates[template]
    };

    const updatedPages = pages.map(page => 
      page.id === currentPageId 
        ? { ...page, components: [...page.components, newComponent] }
        : page
    );
    
    setPages(updatedPages);
    addToHistory(updatedPages);
  };

  // Generate HTML from components
  const generateHTML = () => {
    return generateCode().html;
  };

  // Update component
  const updateComponent = (componentId: string, updates: Partial<BuilderComponent>) => {
    const updatedPages = pages.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            components: page.components.map(comp => 
              comp.id === componentId ? { ...comp, ...updates } : comp
            )
          }
        : page
    );
    
    setPages(updatedPages);
  };

  // Delete component
  const deleteComponent = (componentId: string) => {
    const updatedPages = pages.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            components: page.components.filter(comp => comp.id !== componentId)
          }
        : page
    );
    
    setPages(updatedPages);
    addToHistory(updatedPages);
    setSelectedComponent(null);
  };

  // History management
  const addToHistory = (newPages: Page[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPages)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(history[historyIndex + 1]);
    }
  };

  // Generate HTML/CSS from components
  const generateCode = () => {
    const html = pages.map(page => {
      const pageHtml = page.components.map(comp => {
        switch (comp.type) {
          case 'hero':
            return `
              <section class="hero-${comp.id}" style="${Object.entries(comp.styles.styling).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <div class="hero-content">
                  <h1>${comp.content.title}</h1>
                  <p>${comp.content.subtitle}</p>
                  <button class="cta-button">${comp.content.buttonText}</button>
                </div>
              </section>
            `;
          case 'features':
            return `
              <section class="features-${comp.id}" style="${Object.entries(comp.styles.styling).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <h2>${comp.content.title}</h2>
                <div class="features-grid">
                  ${comp.content.items.map((item: any) => `
                    <div class="feature-item">
                      <div class="feature-icon">${item.icon}</div>
                      <h3>${item.title}</h3>
                      <p>${item.description}</p>
                    </div>
                  `).join('')}
                </div>
              </section>
            `;
          case 'gallery':
            return `
              <section class="gallery-${comp.id}" style="${Object.entries(comp.styles.styling).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <h2>${comp.content.title}</h2>
                <div class="gallery-grid">
                  ${comp.content.images.map((img: any) => `
                    <div class="gallery-item">
                      <img src="${img.src}" alt="${img.alt}" />
                      <p>${img.caption}</p>
                    </div>
                  `).join('')}
                </div>
              </section>
            `;
          case 'contact':
            return `
              <section class="contact-${comp.id}" style="${Object.entries(comp.styles.styling).map(([k, v]) => `${k}: ${v}`).join('; ')}">
                <h2>${comp.content.title}</h2>
                <form class="contact-form">
                  ${comp.content.fields.map((field: any) => `
                    <div class="form-group">
                      <label for="${field.name}">${field.label}</label>
                      ${field.type === 'textarea' 
                        ? `<textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>`
                        : `<input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} />`
                      }
                    </div>
                  `).join('')}
                  <button type="submit">${comp.content.submitText}</button>
                </form>
              </section>
            `;
          default:
            return '';
        }
      }).join('');
      
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${page.seo.title || page.name}</title>
          <meta name="description" content="${page.seo.description}">
          <meta name="keywords" content="${page.seo.keywords}">
        </head>
        <body>
          ${pageHtml}
        </body>
        </html>
      `;
    });

    const css = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .hero-content {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .hero-content h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }
      
      .hero-content p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }
      
      .cta-button {
        background: #3b82f6;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.3s;
      }
      
      .cta-button:hover {
        background: #2563eb;
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .feature-item {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
      }
      
      .gallery-item img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 0.5rem;
      }
      
      .contact-form {
        max-width: 500px;
        margin: 2rem auto 0;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 1rem;
      }
      
      .form-group textarea {
        height: 120px;
        resize: vertical;
      }
      
      @media (max-width: 768px) {
        .hero-content h1 {
          font-size: 2rem;
        }
        
        .features-grid {
          grid-template-columns: 1fr;
        }
        
        .gallery-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
      }
    `;

    return { html: html[0] || '', css };
  };

  // Save project
  const handleSave = () => {
    const { html, css } = generateCode();
    onSave(html, css, pages);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded ${viewMode === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Tablet size={20} />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Smartphone size={20} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Editor Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditorMode('visual')}
              className={`px-3 py-1 rounded text-sm ${editorMode === 'visual' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Eye size={16} className="inline mr-1" />
              Visual
            </button>
            <button
              onClick={() => setEditorMode('code')}
              className={`px-3 py-1 rounded text-sm ${editorMode === 'code' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Code size={16} className="inline mr-1" />
              Code
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTool('select')}
              className={`p-2 rounded ${tool === 'select' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <MousePointer size={16} />
            </button>
            <button
              onClick={() => setTool('move')}
              className={`p-2 rounded ${tool === 'move' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Hand size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* History */}
          <div className="flex items-center space-x-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo size={16} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Redo size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}
            className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded flex items-center space-x-2"
          >
            <FileText size={16} />
            <span>Templates</span>
          </button>
          
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          
          <button
            className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded flex items-center space-x-2"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Pages & Components */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Pages */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Pages</h3>
            <div className="space-y-2">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageId(page.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    currentPageId === page.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Components Library */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('components')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === 'components'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Layout size={16} className="inline mr-1" />
                  Components
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === 'templates'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText size={16} className="inline mr-1" />
                  Templates
                </button>
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === 'assets'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Image size={16} className="inline mr-1" />
                  Assets
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'components' && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Components</h4>
                  {Object.keys(componentTemplates).map(template => (
                    <button
                      key={template}
                      onClick={() => addComponent(template as keyof typeof componentTemplates)}
                      className="w-full text-left px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span className="capitalize">{template}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Page Templates</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                      <p className="text-xs text-gray-600">Landing Page</p>
                    </div>
                    <div className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                      <p className="text-xs text-gray-600">Portfolio</p>
                    </div>
                    <div className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer">
                      <div className="w-full h-16 bg-gray-100 rounded mb-2"></div>
                      <p className="text-xs text-gray-600">Blog</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assets' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Media Library</h4>
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400">
                    <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload Assets</p>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square bg-gray-100 rounded border"></div>
                    <div className="aspect-square bg-gray-100 rounded border"></div>
                    <div className="aspect-square bg-gray-100 rounded border"></div>
                    <div className="aspect-square bg-gray-100 rounded border"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {editorMode === 'visual' ? (
              <VisualEditor
                components={currentPage.components.map(comp => ({
                  ...comp,
                  name: comp.type,
                  props: comp.content || {},
                  order: 0,
                  visible: true
                }))}
                onComponentsChange={(newComponents) => {
                  const convertedComponents = newComponents.map(comp => ({
                    id: comp.id,
                    type: comp.type as 'header' | 'hero' | 'features' | 'gallery' | 'contact' | 'footer' | 'text' | 'image' | 'button' | 'form',
                    content: comp.props || {},
                    styles: {
                      position: { x: 0, y: 0 },
                      size: { width: 100, height: 100 },
                      styling: comp.styles || {}
                    }
                  }));
                  const updatedPages = pages.map(page => 
                    page.id === currentPageId 
                      ? { ...page, components: convertedComponents }
                      : page
                  );
                  setPages(updatedPages);
                  addToHistory(updatedPages);
                }}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
                viewMode={viewMode}
                theme={{
                  colors: {
                    primary: '#3B82F6',
                    secondary: '#6B7280',
                    accent: '#10B981',
                    background: '#FFFFFF',
                    text: '#1F2937'
                  },
                  fonts: {
                    heading: 'Inter, sans-serif',
                    body: 'Inter, sans-serif'
                  }
                }}
              />
            ) : (
              <div className="h-full bg-gray-900">
                <div className="h-full flex">
                  {/* Code Editor */}
                  <div className="flex-1">
                    <textarea
                      value={generateCode().html}
                      onChange={() => {}}
                      className="w-full h-full p-4 bg-gray-900 text-green-400 font-mono text-sm border-none resize-none focus:outline-none"
                      placeholder="HTML code will appear here..."
                      style={{
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        lineHeight: '1.5'
                      }}
                    />
                  </div>
                  
                  {/* Live Preview */}
                  <div className="w-1/2 border-l border-gray-700">
                    <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-3">
                      <span className="text-xs text-gray-400">Live Preview</span>
                    </div>
                    <div className="h-full bg-white overflow-auto">
                      <iframe
                        srcDoc={generateCode().html}
                        className="w-full h-full border-none"
                        title="Live Preview"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {showStylePanel && selectedComponent && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Properties</h3>
            
            {(() => {
              const component = currentPage.components.find(c => c.id === selectedComponent);
              if (!component) return null;

              return (
                <div className="space-y-4">
                  {/* Content Properties */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Content</h4>
                    {component.type === 'hero' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Title</label>
                          <input
                            type="text"
                            value={component.content.title}
                            onChange={(e) => updateComponent(component.id, {
                              content: { ...component.content, title: e.target.value }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Subtitle</label>
                          <textarea
                            value={component.content.subtitle}
                            onChange={(e) => updateComponent(component.id, {
                              content: { ...component.content, subtitle: e.target.value }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm h-16 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Button Text</label>
                          <input
                            type="text"
                            value={component.content.buttonText}
                            onChange={(e) => updateComponent(component.id, {
                              content: { ...component.content, buttonText: e.target.value }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Style Properties */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Styling</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                        <input
                          type="color"
                          value={component.styles.styling.backgroundColor || '#ffffff'}
                          onChange={(e) => updateComponent(component.id, {
                            styles: {
                              ...component.styles,
                              styling: { ...component.styles.styling, backgroundColor: e.target.value }
                            }
                          })}
                          className="w-full h-8 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                        <input
                          type="color"
                          value={component.styles.styling.color || '#000000'}
                          onChange={(e) => updateComponent(component.id, {
                            styles: {
                              ...component.styles,
                              styling: { ...component.styles.styling, color: e.target.value }
                            }
                          })}
                          className="w-full h-8 border border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Padding</label>
                        <input
                          type="text"
                          value={component.styles.styling.padding || ''}
                          onChange={(e) => updateComponent(component.id, {
                            styles: {
                              ...component.styles,
                              styling: { ...component.styles.styling, padding: e.target.value }
                            }
                          })}
                          placeholder="e.g., 2rem"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedWebBuilder;