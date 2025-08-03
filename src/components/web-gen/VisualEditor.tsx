'use client';

import React, { useState, useRef, useCallback } from 'react';
import { TemplateComponent } from '@/lib/advanced-templates';
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle, 
  Layout, 
  Grid, 
  List, 
  Play, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Quote,
  Calendar,
  Users,
  Zap,
  Target,
  Award,
  Briefcase,
  Heart,
  Eye,
  EyeOff,
  Move,
  Copy,
  Trash2,
  Settings,
  Plus
} from 'lucide-react';

interface VisualEditorProps {
  components: TemplateComponent[];
  onComponentsChange: (components: TemplateComponent[]) => void;
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
}

interface DraggedComponent {
  type: string;
  id?: string;
  isNew?: boolean;
}

const componentLibrary = [
  { type: 'Header', icon: Layout, label: 'Header', category: 'Navigation' },
  { type: 'Hero', icon: Star, label: 'Hero Section', category: 'Content' },
  { type: 'Features', icon: Grid, label: 'Features Grid', category: 'Content' },
  { type: 'About', icon: Users, label: 'About Section', category: 'Content' },
  { type: 'Services', icon: Briefcase, label: 'Services', category: 'Content' },
  { type: 'Testimonials', icon: Quote, label: 'Testimonials', category: 'Content' },
  { type: 'Contact', icon: Mail, label: 'Contact Form', category: 'Forms' },
  { type: 'Footer', icon: Layout, label: 'Footer', category: 'Navigation' },
  { type: 'Gallery', icon: ImageIcon, label: 'Image Gallery', category: 'Media' },
  { type: 'Video', icon: Play, label: 'Video Player', category: 'Media' },
  { type: 'Text', icon: Type, label: 'Text Block', category: 'Content' },
  { type: 'Button', icon: Square, label: 'Button', category: 'Interactive' },
  { type: 'Card', icon: Square, label: 'Card', category: 'Content' },
  { type: 'List', icon: List, label: 'List', category: 'Content' },
  { type: 'Stats', icon: Target, label: 'Statistics', category: 'Content' },
  { type: 'Timeline', icon: Calendar, label: 'Timeline', category: 'Content' },
  { type: 'Pricing', icon: Award, label: 'Pricing Table', category: 'Content' },
  { type: 'Newsletter', icon: Mail, label: 'Newsletter', category: 'Forms' },
  { type: 'Map', icon: MapPin, label: 'Map', category: 'Media' },
  { type: 'Social', icon: Heart, label: 'Social Links', category: 'Interactive' }
];

const categories = Array.from(new Set(componentLibrary.map(c => c.category)));

export default function VisualEditor({ components, onComponentsChange, theme }: VisualEditorProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<DraggedComponent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showComponentLibrary, setShowComponentLibrary] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const filteredComponents = selectedCategory === 'All' 
    ? componentLibrary 
    : componentLibrary.filter(c => c.category === selectedCategory);

  const generateComponentId = () => {
    return `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createNewComponent = (type: string): TemplateComponent => {
    const baseComponent = {
      id: generateComponentId(),
      type,
      name: type,
      visible: true,
      order: components.length
    };

    switch (type) {
      case 'Header':
        return {
          ...baseComponent,
          props: {
            logo: 'Your Logo',
            navigation: ['Home', 'About', 'Services', 'Contact'],
            style: 'modern'
          }
        };
      case 'Hero':
        return {
          ...baseComponent,
          props: {
            title: 'Welcome to Our Website',
            subtitle: 'We create amazing experiences for our customers',
            buttonText: 'Get Started',
            buttonLink: '#contact',
            backgroundImage: '',
            style: 'centered'
          }
        };
      case 'Features':
        return {
          ...baseComponent,
          props: {
            title: 'Our Features',
            features: [
              { icon: 'zap', title: 'Fast Performance', description: 'Lightning fast loading times' },
              { icon: 'shield', title: 'Secure', description: 'Bank-level security for your data' },
              { icon: 'heart', title: 'User Friendly', description: 'Intuitive and easy to use interface' }
            ],
            columns: 3
          }
        };
      case 'About':
        return {
          ...baseComponent,
          props: {
            title: 'About Us',
            content: 'We are a team of passionate professionals dedicated to delivering exceptional results.',
            image: '',
            layout: 'side-by-side'
          }
        };
      case 'Contact':
        return {
          ...baseComponent,
          props: {
            title: 'Contact Us',
            fields: ['name', 'email', 'message'],
            submitText: 'Send Message',
            showMap: false
          }
        };
      case 'Footer':
        return {
          ...baseComponent,
          props: {
            copyright: '© 2024 Your Company. All rights reserved.',
            links: ['Privacy Policy', 'Terms of Service', 'Contact'],
            socialLinks: ['facebook', 'twitter', 'linkedin'],
            style: 'simple'
          }
        };
      case 'Text':
        return {
          ...baseComponent,
          props: {
            content: 'Add your text content here...',
            style: 'paragraph',
            alignment: 'left'
          }
        };
      case 'Button':
        return {
          ...baseComponent,
          props: {
            text: 'Click Me',
            link: '#',
            style: 'primary',
            size: 'medium'
          }
        };
      default:
        return {
          ...baseComponent,
          props: {}
        };
    }
  };

  const handleDragStart = (e: React.DragEvent, component: any, isNew = false) => {
    setDraggedComponent({
      type: component.type,
      id: isNew ? undefined : component.id,
      isNew
    });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    
    if (!draggedComponent) return;

    if (draggedComponent.isNew) {
      // Adding new component
      const newComponent = createNewComponent(draggedComponent.type);
      const newComponents = [...components];
      
      if (targetIndex !== undefined) {
        newComponents.splice(targetIndex, 0, newComponent);
      } else {
        newComponents.push(newComponent);
      }
      
      // Update order
      newComponents.forEach((comp, index) => {
        comp.order = index;
      });
      
      onComponentsChange(newComponents);
    } else {
      // Reordering existing component
      const draggedIndex = components.findIndex(c => c.id === draggedComponent.id);
      if (draggedIndex === -1) return;
      
      const newComponents = [...components];
      const [draggedItem] = newComponents.splice(draggedIndex, 1);
      
      const insertIndex = targetIndex !== undefined ? targetIndex : newComponents.length;
      newComponents.splice(insertIndex, 0, draggedItem);
      
      // Update order
      newComponents.forEach((comp, index) => {
        comp.order = index;
      });
      
      onComponentsChange(newComponents);
    }
    
    setDraggedComponent(null);
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(selectedComponent === componentId ? null : componentId);
  };

  const handleComponentDelete = (componentId: string) => {
    const newComponents = components.filter(c => c.id !== componentId);
    // Update order
    newComponents.forEach((comp, index) => {
      comp.order = index;
    });
    onComponentsChange(newComponents);
    setSelectedComponent(null);
  };

  const handleComponentDuplicate = (componentId: string) => {
    const componentToDuplicate = components.find(c => c.id === componentId);
    if (!componentToDuplicate) return;
    
    const duplicatedComponent = {
      ...componentToDuplicate,
      id: generateComponentId(),
      order: componentToDuplicate.order + 1
    };
    
    const newComponents = [...components];
    newComponents.splice(componentToDuplicate.order + 1, 0, duplicatedComponent);
    
    // Update order
    newComponents.forEach((comp, index) => {
      comp.order = index;
    });
    
    onComponentsChange(newComponents);
  };

  const handleComponentToggleVisibility = (componentId: string) => {
    const newComponents = components.map(c => 
      c.id === componentId ? { ...c, visible: !c.visible } : c
    );
    onComponentsChange(newComponents);
  };

  const renderComponentPreview = (component: TemplateComponent) => {
    const isSelected = selectedComponent === component.id;
    const opacity = component.visible ? 1 : 0.5;
    
    return (
      <div
        key={component.id}
        className={`relative border-2 rounded-lg p-4 mb-2 cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        style={{ opacity }}
        draggable
        onDragStart={(e) => handleDragStart(e, component, false)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, component.order)}
        onClick={() => handleComponentSelect(component.id)}
      >
        {/* Component Preview Content */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-sm">{component.type}</span>
            {!component.visible && (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </div>
          
          {isSelected && (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComponentToggleVisibility(component.id);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                title={component.visible ? 'Hide' : 'Show'}
              >
                {component.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComponentDuplicate(component.id);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComponentDelete(component.id);
                }}
                className="p-1 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Simplified component preview */}
        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
          {component.type === 'Header' && (
            <div className="flex justify-between items-center">
              <span>Logo</span>
              <div className="flex gap-2">
                {component.props?.navigation?.slice(0, 3).map((item: string, i: number) => (
                  <span key={i} className="px-1">{item}</span>
                ))}
              </div>
            </div>
          )}
          {component.type === 'Hero' && (
            <div className="text-center">
              <div className="font-bold mb-1">{component.props?.title || 'Hero Title'}</div>
              <div className="text-xs mb-2">{component.props?.subtitle || 'Hero subtitle'}</div>
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs inline-block">
                {component.props?.buttonText || 'Button'}
              </div>
            </div>
          )}
          {component.type === 'Features' && (
            <div>
              <div className="font-bold mb-1">{component.props?.title || 'Features'}</div>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-1 rounded text-center">
                    <div className="w-2 h-2 bg-blue-500 rounded mx-auto mb-1"></div>
                    <div className="text-xs">Feature {i}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {component.type === 'Contact' && (
            <div>
              <div className="font-bold mb-1">{component.props?.title || 'Contact'}</div>
              <div className="space-y-1">
                <div className="bg-white h-2 rounded"></div>
                <div className="bg-white h-2 rounded"></div>
                <div className="bg-white h-4 rounded"></div>
                <div className="bg-blue-500 h-2 rounded w-1/3"></div>
              </div>
            </div>
          )}
          {!['Header', 'Hero', 'Features', 'Contact'].includes(component.type) && (
            <div className="text-center py-2">
              {component.type} Component
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Component Library Sidebar */}
      {showComponentLibrary && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Library Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Components</h3>
              <button
                onClick={() => setShowComponentLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
            
            {/* Category Filter */}
            <div className="space-y-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Component Library */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2">
              {filteredComponents.map((component) => {
                const IconComponent = component.icon;
                return (
                  <div
                    key={component.type}
                    className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, component, true)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <IconComponent className="w-6 h-6 text-gray-600 mb-2" />
                      <span className="text-xs font-medium text-gray-700">
                        {component.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!showComponentLibrary && (
              <button
                onClick={() => setShowComponentLibrary(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Components
              </button>
            )}
            
            <div className="text-sm text-gray-600">
              {components.length} component{components.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                previewMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
          </div>
        </div>
        
        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 overflow-y-auto p-6"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e)}
        >
          {previewMode ? (
            /* Preview Mode - Show actual rendered components */
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
              <div className="p-8">
                <div className="text-center text-gray-500 py-12">
                  <Layout className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Preview Mode</h3>
                  <p>This would show the actual rendered website preview</p>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode - Show component list */
            <div className="max-w-2xl mx-auto">
              {components.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Layout className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Components Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Drag components from the sidebar to start building your page
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {components
                    .sort((a, b) => a.order - b.order)
                    .map(component => renderComponentPreview(component))}
                  
                  {/* Drop zone at the end */}
                  <div 
                    className="h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e)}
                  >
                    Drop components here
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}