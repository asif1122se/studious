"use client";

import React, { useState, useEffect } from 'react';
import { HiFolder, HiChevronRight, HiCheck, HiHome } from 'react-icons/hi';
import { trpc } from '@/utils/trpc';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  hasChildren?: boolean;
}

interface FolderNavigatorProps {
  classId: string;
  currentFolderId?: string;
  onSelect: (folderId: string, folderName: string) => void;
  onCancel: () => void;
  title?: string;
  showFiles?: boolean;
}

export default function FolderNavigator({ 
  classId,
  currentFolderId: initialFolderId, 
  onSelect, 
  onCancel,
  title = "Select Destination Folder",
  showFiles = false
}: FolderNavigatorProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(initialFolderId || null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<Array<{ id: string; name: string }>>([]);

  // Get root folder
  const { data: rootFolder } = trpc.folder.getRootFolder.useQuery({ classId });

  // Get current folder details
  const { data: currentFolder, refetch: refetchCurrentFolder } = trpc.folder.get.useQuery({ 
    folderId: currentFolderId!, 
    classId 
  }, {
    enabled: !!currentFolderId,
  });

  // Get child folders - use the childFolders from the current folder query
  // If we're at the root level, use rootFolder.childFolders, otherwise use currentFolder.childFolders
  const childFolders = currentFolderId === rootFolder?.id 
    ? rootFolder?.childFolders || []
    : currentFolder?.childFolders || [];


  // Initialize with root folder
  useEffect(() => {
    if (rootFolder && !currentFolderId) {
      setCurrentFolderId(rootFolder.id);
      setBreadcrumb([{ id: rootFolder.id, name: rootFolder.name }]);
    }
  }, [rootFolder, currentFolderId]);

  const handleFolderClick = (folderId: string, folderName: string) => {
    setSelectedFolderId(folderId);
  };

  const handleFolderDoubleClick = (folderId: string, folderName: string) => {
    // Navigate into folder
    setCurrentFolderId(folderId);
    setBreadcrumb(prev => [...prev, { id: folderId, name: folderName }]);
    setSelectedFolderId(null); // Clear selection when navigating
    // Only refetch if we're not at the root level
    if (folderId !== rootFolder?.id) {
      refetchCurrentFolder();
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1 && rootFolder) {
      // Root
      setCurrentFolderId(rootFolder.id);
      setBreadcrumb([{ id: rootFolder.id, name: rootFolder.name }]);
    } else {
      // Specific folder
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setBreadcrumb(newBreadcrumb);
      setCurrentFolderId(newBreadcrumb[newBreadcrumb.length - 1].id);
    }
    setSelectedFolderId(null); // Clear selection when navigating
    // Only refetch if we're not going to the root level
    if (index !== -1) {
      refetchCurrentFolder();
    }
  };

  const handleParentClick = () => {
    if (breadcrumb.length > 1) {
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      setCurrentFolderId(newBreadcrumb[newBreadcrumb.length - 1].id);
      setSelectedFolderId(null); // Clear selection when navigating
      // Only refetch if we're not going to the root level
      if (newBreadcrumb[newBreadcrumb.length - 1].id !== rootFolder?.id) {
        refetchCurrentFolder();
      }
    }
  };

  const handleConfirm = () => {
    if (selectedFolderId) {
      const selectedFolder = breadcrumb.find(f => f.id === selectedFolderId) || 
                           childFolders.find(f => f.id === selectedFolderId);
      if (selectedFolder) {
        onSelect(selectedFolder.id, selectedFolder.name);
      }
    }
  };

  if (!rootFolder || !currentFolderId) return null;

  return (
    <div className="w-[40rem] max-w-full mx-auto flex flex-col space-y-5">
      <div>
        <h3 className="text-lg font-medium text-foreground-primary">{title}</h3>
        <p className="text-sm text-foreground-muted mt-1">
          Select a destination folder for your item
        </p>
      </div>

        {/* Breadcrumb */}
        <div className="flex flex-col space-y-3">
          <label className="text-xs font-bold">Current Location</label>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm">
              <button
                onClick={() => handleBreadcrumbClick(-1)}
                className="flex items-center space-x-1 hover:underline"
              >
                <HiHome className="w-4 h-4" />
                <span>{rootFolder.name}</span>
              </button>
              {breadcrumb.slice(1).map((item, index) => (
                <div key={item.id} className="flex items-center space-x-1">
                  <HiChevronRight className="w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => handleBreadcrumbClick(index + 1)}
                    className="hover:underline"
                  >
                    {item.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Show Parent Button */}
            {breadcrumb.length > 1 && (
              <Button.SM
                onClick={handleParentClick}
                title="Go to parent folder"
                className="text-gray-600 hover:text-gray-800"
              >
                <HiChevronRight className="w-4 h-4 rotate-180" />
              </Button.SM>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="text-sm font-bold">Available Folders</label>
          <div className="max-h-96 overflow-y-auto border border-border-secondary rounded-md">
            <div className="p-2">
              {/* Current folder option */}
              <div 
                className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                  selectedFolderId === currentFolderId
                    ? 'bg-primary-100 text-primary-500' 
                    : 'hover:bg-background-muted'
                }`}
                onClick={() => handleFolderClick(currentFolderId!, currentFolder?.name || breadcrumb[breadcrumb.length - 1]?.name || rootFolder?.name || '')}
              >
                <HiFolder className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium">
                  {currentFolderId === rootFolder?.id 
                    ? rootFolder?.name 
                    : currentFolder?.name || breadcrumb[breadcrumb.length - 1]?.name || 'Loading...'}
                </span>
                <span className="text-xs text-gray-500">(Current folder)</span>
                {selectedFolderId === currentFolderId && (
                  <HiCheck className="w-4 h-4 text-primary-500 ml-auto" />
                )}
              </div>
              
              {/* Child folders */}
              {childFolders.length > 0 && (
                <>
                  <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />
                  {childFolders.map((folder) => {
                    const isSelected = selectedFolderId === folder.id;
                    return (
                      <div
                        key={folder.id}
                        className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary-100 text-primary-500' 
                            : 'hover:bg-background-muted'
                        }`}
                        onClick={() => handleFolderClick(folder.id, folder.name)}
                        onDoubleClick={() => handleFolderDoubleClick(folder.id, folder.name)}
                      >
                        <HiFolder className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-medium flex-1">{folder.name}</span>
                        {isSelected && (
                          <HiCheck className="w-4 h-4 text-primary-500" />
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        
          <div className="p-3 bg-background-muted dark:bg-background-subtle rounded-md border border-border-secondary">
            <div className="text-sm text-foreground-secondary">
              Selected: <span className="font-medium text-foreground-primary">
                {selectedFolderId ? breadcrumb.find(f => f.id === selectedFolderId)?.name || 
                 childFolders.find(f => f.id === selectedFolderId)?.name : 'None'}
              </span>
            </div>
          </div>

        <div className="flex flex-row items-center justify-end space-x-3 text-sm">
          <Button.Light onClick={onCancel}>
            Cancel
          </Button.Light>
          <Button.Primary 
            onClick={handleConfirm}
            disabled={!selectedFolderId}
            className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-md"
          >
            Select Folder
          </Button.Primary>
        </div>
      </div>
    );
} 