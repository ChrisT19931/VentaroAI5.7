'use client';

import React, { useState } from 'react';
import { advancedTemplates, AdvancedTemplate, generateTemplateHTML } from '@/lib/advanced-templates';
import { Eye, Download, Palette, Layout, ShoppingCart, User, Briefcase } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onSelect: (template: AdvancedTemplate) => void;
  onClose: () => void;
}

const categoryIcons = {
  Business: Briefcase,
  Portfolio: User,
  'E-commerce': ShoppingCart,
  Blog: Layout,
  Creative: Palette
};

export default function TemplateSelector({ isOpen, onSelect, onClose }: TemplateSelectorProps) {
  if (!isOpen) return null;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<AdvancedTemplate | null>(null);

  const categories = ['All', ...Array.from(new Set(advancedTemplates.map(t => t.category)))];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? advancedTemplates 
    : advancedTemplates.filter(t => t.category === selectedCategory);

  const handlePreview = (template: AdvancedTemplate) => {
    setPreviewTemplate(template);
  };

  const handleSelectTemplate = (template: AdvancedTemplate) => {
    onSelect(template);
    onClose();
  };

  const downloadTemplate = (template: AdvancedTemplate) => {
    const html = generateTemplateHTML(template);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Choose a Template</h2>
              <p className="text-blue-100 mt-1">Select a professional template to start building your website</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar - Categories */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Layout;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="font-medium">{category}</span>
                  </button>
                );
              })}
            </div>

            {/* Template Stats */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Template Stats</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Templates:</span>
                  <span className="font-medium">{advancedTemplates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-medium">{categories.length - 1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filtered:</span>
                  <span className="font-medium">{filteredTemplates.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {!previewTemplate ? (
              /* Template Grid */
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Template Thumbnail */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Layout size={48} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">{template.name}</p>
                          </div>
                        </div>
                        
                        {/* Theme Color Preview */}
                        <div className="absolute top-3 right-3 flex gap-1">
                          <div 
                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: template.theme.colors.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: template.theme.colors.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: template.theme.colors.accent }}
                          />
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800">{template.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {template.description}
                        </p>

                        {/* Template Features */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {template.components.length} Components
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {template.pages.length} Pages
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {template.theme.name}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePreview(template)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            <Eye size={16} />
                            Preview
                          </button>
                          <button
                            onClick={() => downloadTemplate(template)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Download HTML"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleSelectTemplate(template)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <Layout size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Templates Found</h3>
                    <p className="text-gray-500">No templates match the selected category.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Template Preview */
              <div className="h-full flex flex-col">
                {/* Preview Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{previewTemplate.name}</h3>
                    <p className="text-gray-600 text-sm">{previewTemplate.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadTemplate(previewTemplate)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handleSelectTemplate(previewTemplate)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Use This Template
                    </button>
                    <button
                      onClick={() => setPreviewTemplate(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back to Grid
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-gray-100 p-4">
                  <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
                    <iframe
                      srcDoc={generateTemplateHTML(previewTemplate)}
                      className="w-full h-full border-0"
                      title={`Preview of ${previewTemplate.name}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}