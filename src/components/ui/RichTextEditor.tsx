'use client';

import React, { useState, useRef, useEffect } from 'react';

type RichTextEditorProps = {
  /**
   * Initial content of the editor
   */
  initialContent?: string;
  
  /**
   * Callback when content changes
   */
  onChange?: (content: string) => void;
  
  /**
   * Label for the editor
   */
  label?: string;
  
  /**
   * Placeholder text
   */
  placeholder?: string;
  
  /**
   * Whether the editor is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether the editor is required
   */
  required?: boolean;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Minimum height of the editor
   */
  minHeight?: string;
  
  /**
   * Maximum height of the editor
   */
  maxHeight?: string;
  
  /**
   * Whether the editor should take up the full width
   */
  fullWidth?: boolean;
  
  /**
   * Toolbar options to display
   */
  toolbarOptions?: Array<
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'heading'
    | 'link'
    | 'bulletList'
    | 'numberedList'
    | 'alignLeft'
    | 'alignCenter'
    | 'alignRight'
    | 'indent'
    | 'outdent'
    | 'clear'
  >;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * ID for the editor element
   */
  id?: string;
};

// Default toolbar options
const DEFAULT_TOOLBAR_OPTIONS = [
  'bold',
  'italic',
  'underline',
  'heading',
  'link',
  'bulletList',
  'numberedList',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'clear',
];

export default function RichTextEditor({
  initialContent = '',
  onChange,
  label,
  placeholder = 'Enter text here...',
  disabled = false,
  required = false,
  helperText,
  error,
  minHeight = '200px',
  maxHeight = '500px',
  fullWidth = false,
  toolbarOptions = DEFAULT_TOOLBAR_OPTIONS,
  className = '',
  id,
}: RichTextEditorProps) {
  // State for editor content
  const [content, setContent] = useState(initialContent);
  
  // Refs for DOM elements
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Generate unique ID if not provided
  const editorId = id || `editor-${Math.random().toString(36).substring(2, 9)}`;
  
  // Handle content change
  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange?.(newContent);
    }
  };
  
  // Initialize editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);
  
  // Toolbar button handlers
  const execCommand = (command: string, value: string | null = null) => {
    if (disabled) return;
    
    document.execCommand(command, false, value);
    handleContentChange();
    editorRef.current?.focus();
  };
  
  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');
  const handleStrike = () => execCommand('strikeThrough');
  const handleHeading = () => execCommand('formatBlock', '<h2>');
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };
  const handleBulletList = () => execCommand('insertUnorderedList');
  const handleNumberedList = () => execCommand('insertOrderedList');
  const handleAlignLeft = () => execCommand('justifyLeft');
  const handleAlignCenter = () => execCommand('justifyCenter');
  const handleAlignRight = () => execCommand('justifyRight');
  const handleIndent = () => execCommand('indent');
  const handleOutdent = () => execCommand('outdent');
  const handleClear = () => execCommand('removeFormat');
  
  // Toolbar button map
  const toolbarButtonMap = {
    bold: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 10a2.5 2.5 0 01-2.5 2.5H6v-10h4.5a2.5 2.5 0 010 5H11a2.5 2.5 0 012.5 2.5z" />
        </svg>
      ),
      title: 'Bold',
      action: handleBold,
    },
    italic: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm-5 9a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1h-10a.5.5 0 01-.5-.5z" />
        </svg>
      ),
      title: 'Italic',
      action: handleItalic,
    },
    underline: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 14a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm3-7a3 3 0 116 0 3 3 0 01-6 0z" />
        </svg>
      ),
      title: 'Underline',
      action: handleUnderline,
    },
    strike: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 10h8M6 14h8M6 18h8M6 6h8" strokeWidth="2" stroke="currentColor" />
        </svg>
      ),
      title: 'Strikethrough',
      action: handleStrike,
    },
    heading: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 4a1.5 1.5 0 110 3h-9a1.5 1.5 0 010-3h9zm0 6a1.5 1.5 0 110 3h-9a1.5 1.5 0 010-3h9zm0 6a1.5 1.5 0 110 3h-9a1.5 1.5 0 010-3h9z" />
        </svg>
      ),
      title: 'Heading',
      action: handleHeading,
    },
    link: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Link',
      action: handleLink,
    },
    bulletList: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Bullet List',
      action: handleBulletList,
    },
    numberedList: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Numbered List',
      action: handleNumberedList,
    },
    alignLeft: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Align Left',
      action: handleAlignLeft,
    },
    alignCenter: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Align Center',
      action: handleAlignCenter,
    },
    alignRight: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7 4a1 1 0 011-1h6a1 1 0 110 2H11a1 1 0 01-1-1zm-7 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7 4a1 1 0 011-1h6a1 1 0 110 2H11a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Align Right',
      action: handleAlignRight,
    },
    indent: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Indent',
      action: handleIndent,
    },
    outdent: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Outdent',
      action: handleOutdent,
    },
    clear: {
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Clear Formatting',
      action: handleClear,
    },
  };
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={editorId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`
          border rounded-md overflow-hidden
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
          {toolbarOptions.map((option) => {
            const button = toolbarButtonMap[option as keyof typeof toolbarButtonMap];
            return (
              <button
                key={option}
                type="button"
                onClick={button.action}
                disabled={disabled}
                className={`
                  p-1.5 rounded-md
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                `}
                title={button.title}
              >
                {button.icon}
              </button>
            );
          })}
        </div>
        
        {/* Editor */}
        <div
          ref={editorRef}
          id={editorId}
          contentEditable={!disabled}
          className={`
            p-3 focus:outline-none
            ${disabled ? 'bg-gray-100' : 'bg-white'}
          `}
          style={{
            minHeight,
            maxHeight,
            overflowY: 'auto',
          }}
          onInput={handleContentChange}
          onBlur={handleContentChange}
          data-placeholder={placeholder}
          aria-multiline="true"
          role="textbox"
          aria-label={label || 'Rich text editor'}
          aria-required={required}
          aria-invalid={!!error}
        />
      </div>
      
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// Add placeholder styles to global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    [contenteditable][data-placeholder]:empty:before {
      content: attr(data-placeholder);
      color: #9ca3af;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}