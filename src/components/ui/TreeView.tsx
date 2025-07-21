'use client';

import React, { useState, useCallback } from 'react';

type TreeNodeData = {
  /**
   * Unique identifier for the node
   */
  id: string;
  
  /**
   * Label to display for the node
   */
  label: React.ReactNode;
  
  /**
   * Optional icon to display before the label
   */
  icon?: React.ReactNode;
  
  /**
   * Children nodes
   */
  children?: TreeNodeData[];
  
  /**
   * Whether the node is disabled
   */
  disabled?: boolean;
  
  /**
   * Additional data to associate with the node
   */
  data?: any;
};

type TreeViewProps = {
  /**
   * Data for the tree nodes
   */
  data: TreeNodeData[];
  
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (nodeId: string, nodeData: TreeNodeData) => void;
  
  /**
   * IDs of initially expanded nodes
   */
  defaultExpandedIds?: string[];
  
  /**
   * IDs of expanded nodes (controlled component)
   */
  expandedIds?: string[];
  
  /**
   * Callback when a node is expanded or collapsed
   */
  onNodeToggle?: (nodeId: string, isExpanded: boolean) => void;
  
  /**
   * ID of the initially selected node
   */
  defaultSelectedId?: string;
  
  /**
   * ID of the selected node (controlled component)
   */
  selectedId?: string;
  
  /**
   * Whether to allow multiple selection
   */
  multiSelect?: boolean;
  
  /**
   * IDs of initially selected nodes (for multiSelect)
   */
  defaultSelectedIds?: string[];
  
  /**
   * IDs of selected nodes (controlled component, for multiSelect)
   */
  selectedIds?: string[];
  
  /**
   * Whether to show lines connecting nodes
   */
  showLines?: boolean;
  
  /**
   * Whether to animate expand/collapse
   */
  animated?: boolean;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

type TreeNodeProps = {
  /**
   * Node data
   */
  node: TreeNodeData;
  
  /**
   * Level of nesting (0 for root nodes)
   */
  level: number;
  
  /**
   * Whether the node is expanded
   */
  isExpanded: boolean;
  
  /**
   * Whether the node is selected
   */
  isSelected: boolean;
  
  /**
   * Callback when the node is toggled (expanded/collapsed)
   */
  onToggle: (nodeId: string) => void;
  
  /**
   * Callback when the node is selected
   */
  onSelect: (nodeId: string, nodeData: TreeNodeData) => void;
  
  /**
   * Whether to show lines connecting nodes
   */
  showLines?: boolean;
  
  /**
   * Whether to animate expand/collapse
   */
  animated?: boolean;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
};

// TreeNode component
function TreeNode({
  node,
  level,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  showLines = false,
  animated = true,
  size = 'md',
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  
  // Handle toggle
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && !node.disabled) {
      onToggle(node.id);
    }
  };
  
  // Handle select
  const handleSelect = () => {
    if (!node.disabled) {
      onSelect(node.id, node);
    }
  };
  
  // Determine size classes
  const sizeConfig = {
    sm: {
      node: 'py-1 text-xs',
      indent: 'w-4',
      icon: 'w-3 h-3',
      toggle: 'w-3 h-3',
    },
    md: {
      node: 'py-1.5 text-sm',
      indent: 'w-5',
      icon: 'w-4 h-4',
      toggle: 'w-4 h-4',
    },
    lg: {
      node: 'py-2 text-base',
      indent: 'w-6',
      icon: 'w-5 h-5',
      toggle: 'w-5 h-5',
    },
  }[size];
  
  return (
    <div>
      {/* Node */}
      <div
        className={`
          flex items-center
          ${sizeConfig.node}
          ${isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}
          ${node.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          rounded-md px-1
        `}
        onClick={handleSelect}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled}
      >
        {/* Indentation and lines */}
        {level > 0 && (
          <div className="flex">
            {Array.from({ length: level }).map((_, i) => (
              <div
                key={i}
                className={`
                  ${sizeConfig.indent} relative
                  ${showLines ? 'border-l border-gray-300' : ''}
                `}
              />
            ))}
          </div>
        )}
        
        {/* Toggle button */}
        <div
          className={`
            ${sizeConfig.toggle} flex-shrink-0
            ${hasChildren ? 'cursor-pointer' : 'invisible'}
          `}
          onClick={handleToggle}
        >
          {hasChildren && (
            <svg
              className={`transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>
        
        {/* Icon */}
        {node.icon && (
          <div className={`${sizeConfig.icon} mr-1.5 flex-shrink-0`}>
            {node.icon}
          </div>
        )}
        
        {/* Label */}
        <div className="truncate">{node.label}</div>
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div
          className={`
            ${animated ? 'transition-all duration-200 ease-in-out' : ''}
            ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
          `}
          role="group"
        >
          {node.children?.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              isExpanded={isExpanded}
              isSelected={isSelected}
              onToggle={onToggle}
              onSelect={onSelect}
              showLines={showLines}
              animated={animated}
              size={size}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main TreeView component
export default function TreeView({
  data,
  onNodeSelect,
  defaultExpandedIds = [],
  expandedIds,
  onNodeToggle,
  defaultSelectedId,
  selectedId,
  multiSelect = false,
  defaultSelectedIds = [],
  selectedIds,
  showLines = false,
  animated = true,
  size = 'md',
  className = '',
}: TreeViewProps) {
  // State for expanded nodes (uncontrolled)
  const [expandedNodesState, setExpandedNodesState] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  );
  
  // State for selected nodes (uncontrolled)
  const [selectedNodeState, setSelectedNodeState] = useState<string | undefined>(
    defaultSelectedId
  );
  const [selectedNodesState, setSelectedNodesState] = useState<Set<string>>(
    new Set(defaultSelectedIds)
  );
  
  // Use controlled or uncontrolled state
  const isExpandedControlled = expandedIds !== undefined;
  const expandedNodes = isExpandedControlled
    ? new Set(expandedIds)
    : expandedNodesState;
  
  const isSelectedControlled = selectedId !== undefined || selectedIds !== undefined;
  const selectedNode = selectedId !== undefined ? selectedId : selectedNodeState;
  const selectedNodes = selectedIds !== undefined
    ? new Set(selectedIds)
    : selectedNodesState;
  
  // Handle node toggle
  const handleNodeToggle = useCallback(
    (nodeId: string) => {
      const isExpanded = !expandedNodes.has(nodeId);
      
      if (!isExpandedControlled) {
        const newExpandedNodes = new Set(expandedNodes);
        if (isExpanded) {
          newExpandedNodes.add(nodeId);
        } else {
          newExpandedNodes.delete(nodeId);
        }
        setExpandedNodesState(newExpandedNodes);
      }
      
      onNodeToggle?.(nodeId, isExpanded);
    },
    [expandedNodes, isExpandedControlled, onNodeToggle]
  );
  
  // Handle node select
  const handleNodeSelect = useCallback(
    (nodeId: string, nodeData: TreeNodeData) => {
      if (!isSelectedControlled) {
        if (multiSelect) {
          const newSelectedNodes = new Set(selectedNodes);
          if (newSelectedNodes.has(nodeId)) {
            newSelectedNodes.delete(nodeId);
          } else {
            newSelectedNodes.add(nodeId);
          }
          setSelectedNodesState(newSelectedNodes);
        } else {
          setSelectedNodeState(nodeId);
        }
      }
      
      onNodeSelect?.(nodeId, nodeData);
    },
    [isSelectedControlled, multiSelect, onNodeSelect, selectedNodes]
  );
  
  // Check if a node is selected
  const isNodeSelected = (nodeId: string): boolean => {
    if (multiSelect) {
      return selectedNodes.has(nodeId);
    }
    return nodeId === selectedNode;
  };
  
  // Render tree nodes recursively
  const renderTreeNodes = (nodes: TreeNodeData[], level: number = 0) => {
    return nodes.map((node) => (
      <TreeNode
        key={node.id}
        node={node}
        level={level}
        isExpanded={expandedNodes.has(node.id)}
        isSelected={isNodeSelected(node.id)}
        onToggle={handleNodeToggle}
        onSelect={handleNodeSelect}
        showLines={showLines}
        animated={animated}
        size={size}
      />
    ));
  };
  
  return (
    <div
      className={`${className}`}
      role="tree"
      aria-multiselectable={multiSelect}
    >
      {renderTreeNodes(data)}
    </div>
  );
}