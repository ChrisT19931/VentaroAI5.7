'use client';

import React, { useState, useRef, useCallback } from 'react';

type FileUploadProps = {
  /**
   * Callback when files are selected
   */
  onFilesSelected: (files: File[]) => void;
  
  /**
   * Accepted file types
   */
  accept?: string;
  
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  
  /**
   * Maximum number of files
   */
  maxFiles?: number;
  
  /**
   * Whether to allow multiple files
   */
  multiple?: boolean;
  
  /**
   * Whether the upload is disabled
   */
  disabled?: boolean;
  
  /**
   * Label for the upload area
   */
  label?: string;
  
  /**
   * Helper text
   */
  helperText?: string;
  
  /**
   * Error message
   */
  error?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to show the file preview
   */
  showPreview?: boolean;
  
  /**
   * Whether to show the file list
   */
  showFileList?: boolean;
  
  /**
   * Custom render function for file preview
   */
  renderPreview?: (file: File) => React.ReactNode;
};

export default function FileUpload({
  onFilesSelected,
  accept,
  maxSize,
  maxFiles = 1,
  multiple = false,
  disabled = false,
  label = 'Upload files',
  helperText,
  error,
  className = '',
  showPreview = true,
  showFileList = true,
  renderPreview,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileSelection = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const newFiles: File[] = [];
    const newErrors: Record<string, string> = {};
    
    // Convert FileList to array and validate files
    Array.from(selectedFiles).forEach(file => {
      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type || `application/${file.name.split('.').pop()}`;
        
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.endsWith(type);
          } else if (type.endsWith('/*')) {
            const baseType = type.slice(0, -2);
            return fileType.startsWith(baseType);
          } else {
            return fileType === type;
          }
        });
        
        if (!isAccepted) {
          newErrors[file.name] = `File type not accepted. Accepted types: ${accept}`;
          return;
        }
      }
      
      // Check file size
      if (maxSize && file.size > maxSize) {
        newErrors[file.name] = `File size exceeds the limit of ${formatFileSize(maxSize)}`;
        return;
      }
      
      newFiles.push(file);
    });
    
    // Check max files
    const totalFiles = multiple ? [...files, ...newFiles] : newFiles;
    if (totalFiles.length > maxFiles) {
      newErrors['maxFiles'] = `Maximum ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed`;
      return;
    }
    
    // Update state
    setFiles(totalFiles);
    setFileErrors(newErrors);
    
    // Call callback if there are no errors
    if (Object.keys(newErrors).length === 0) {
      onFilesSelected(totalFiles);
    }
  }, [files, multiple, maxFiles, maxSize, accept, onFilesSelected]);
  
  // Handle click on the upload area
  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelection(droppedFiles);
  };
  
  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
  };
  
  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get file icon based on file type
  const getFileIcon = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (file.type.startsWith('image/')) {
      return 'image';
    } else if (file.type.startsWith('video/')) {
      return 'video';
    } else if (file.type.startsWith('audio/')) {
      return 'audio';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'word';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'excel';
    } else if (['ppt', 'pptx'].includes(extension)) {
      return 'powerpoint';
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return 'archive';
    } else {
      return 'file';
    }
  };
  
  // Render file preview
  const renderFilePreview = (file: File, index: number) => {
    if (renderPreview) {
      return renderPreview(file);
    }
    
    const fileType = getFileIcon(file);
    
    if (fileType === 'image' && showPreview) {
      return (
        <div className="relative group">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-20 w-20 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-between p-2 border rounded-md">
        <div className="flex items-center">
          <FileIcon type={fileType} />
          <div className="ml-2">
            <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleRemoveFile(index)}
          className="text-red-500 hover:text-red-700"
          aria-label="Remove file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    );
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-md p-6 text-center cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={handleInputChange}
        />
        
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {isDragging ? 'Drop files here' : 'Drag and drop files here, or click to select files'}
          </p>
          {helperText && (
            <p className="mt-1 text-xs text-gray-500">{helperText}</p>
          )}
          {accept && (
            <p className="mt-1 text-xs text-gray-500">
              Accepted file types: {accept}
            </p>
          )}
          {maxSize && (
            <p className="mt-1 text-xs text-gray-500">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
          )}
          {maxFiles > 1 && (
            <p className="mt-1 text-xs text-gray-500">
              Maximum files: {maxFiles}
            </p>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {/* File errors */}
      {Object.keys(fileErrors).length > 0 && (
        <div className="mt-2">
          {Object.entries(fileErrors).map(([fileName, errorMessage]) => (
            <p key={fileName} className="text-sm text-red-600">
              {errorMessage}
            </p>
          ))}
        </div>
      )}
      
      {/* File list */}
      {showFileList && files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected files ({files.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`}>
                {renderFilePreview(file, index)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type FileIconProps = {
  type: string;
};

function FileIcon({ type }: FileIconProps) {
  const iconColor = {
    image: 'text-green-500',
    video: 'text-purple-500',
    audio: 'text-pink-500',
    pdf: 'text-red-500',
    word: 'text-blue-500',
    excel: 'text-green-600',
    powerpoint: 'text-orange-500',
    archive: 'text-yellow-500',
    file: 'text-gray-500',
  }[type];
  
  return (
    <div className={`flex-shrink-0 ${iconColor}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {type === 'image' && (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </>
        )}
        {type === 'video' && (
          <>
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="10" y1="8" x2="14" y2="12"></line>
            <line x1="14" y1="8" x2="10" y2="12"></line>
          </>
        )}
        {type === 'audio' && (
          <>
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </>
        )}
        {type === 'pdf' && (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M9 15v-2h6v2"></path>
          </>
        )}
        {(type === 'word' || type === 'excel' || type === 'powerpoint') && (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </>
        )}
        {type === 'archive' && (
          <>
            <path d="M21 8v13H3V8"></path>
            <path d="M1 3h22v5H1z"></path>
            <path d="M10 12h4"></path>
          </>
        )}
        {type === 'file' && (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </>
        )}
      </svg>
    </div>
  );
}