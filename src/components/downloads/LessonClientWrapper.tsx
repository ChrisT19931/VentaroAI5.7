'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

export default function LessonClientWrapper({ lessonName }: { lessonName: string }) {
  const [LessonComponent, setLessonComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Dynamic import within client component
        const Component = dynamic(() => import(`./lessons/${lessonName}`), {
          ssr: false,
          loading: () => <div className="text-white">Loading lesson...</div>
        });
        setLessonComponent(() => Component);
      } catch (error) {
        console.error('Failed to load lesson component:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComponent();
  }, [lessonName]);
  
  if (isLoading) {
    return <div className="text-white">Loading lesson...</div>;
  }
  
  if (!LessonComponent) {
    return <div className="text-white">Failed to load lesson content.</div>;
  }
  
  return <LessonComponent />;
}