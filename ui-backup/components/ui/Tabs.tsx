'use client';

import React, { useState, useEffect } from 'react';

type Tab = {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  orientation?: 'horizontal' | 'vertical';
};

export default function Tabs({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  className = '',
  tabListClassName = '',
  tabPanelClassName = '',
  orientation = 'horizontal',
}: TabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
  );

  useEffect(() => {
    if (defaultTabId) {
      setActiveTabId(defaultTabId);
    }
  }, [defaultTabId]);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const getTabStyles = (tab: Tab) => {
    const isActive = tab.id === activeTabId;
    const isDisabled = tab.disabled;

    const baseClasses = 'flex items-center px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
    
    if (isDisabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-md ${isActive
          ? 'bg-primary-600 text-white'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
        }`;
      case 'underline':
        return `${baseClasses} border-b-2 ${isActive
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
        }`;
      default: // 'default'
        return `${baseClasses} rounded-t-md ${isActive
          ? 'bg-white border border-gray-200 border-b-white text-primary-600'
          : 'bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100'
        }`;
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div className={`${orientation === 'vertical' ? 'flex' : ''} ${className}`}>
      <div
        className={`${orientation === 'vertical' ? 'flex-shrink-0' : ''} ${tabListClassName}`}
        role="tablist"
        aria-orientation={orientation}
      >
        <div className={`${orientation === 'vertical' ? 'flex-col' : 'flex'} ${variant === 'default' ? 'border-b border-gray-200' : ''}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTabId === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={getTabStyles(tab)}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              tabIndex={activeTabId === tab.id ? 0 : -1}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        id={`panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.id}`}
        className={`${orientation === 'vertical' ? 'flex-grow ml-4' : 'mt-4'} ${tabPanelClassName}`}
      >
        {activeTab.content}
      </div>
    </div>
  );
}