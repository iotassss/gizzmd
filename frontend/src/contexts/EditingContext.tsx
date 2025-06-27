import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface EditingContent {
  title: string;
  content: string;
  tags: string;
  created_at?: string;
  edited_at?: string;
}

interface EditingContextType {
  editingContent: { [documentId: string]: EditingContent };
  setEditingContent: (documentId: string, content: EditingContent | null) => void;
  hasUnsavedChanges: (documentId: string, originalDocument?: any) => boolean;
  clearEditingContent: (documentId: string) => void;
  getEditingContent: (documentId: string) => EditingContent | null;
}

const EditingContext = createContext<EditingContextType | undefined>(undefined);

export const useEditingContext = () => {
  const context = useContext(EditingContext);
  if (context === undefined) {
    throw new Error('useEditingContext must be used within an EditingProvider');
  }
  return context;
};

interface EditingProviderProps {
  children: ReactNode;
}

export const EditingProvider: React.FC<EditingProviderProps> = ({ children }) => {
  const [editingContent, setEditingContentState] = useState<{ [documentId: string]: EditingContent }>({});

  const setEditingContent = (documentId: string, content: EditingContent | null) => {
    setEditingContentState(prev => {
      if (content === null) {
        const newState = { ...prev };
        delete newState[documentId];
        return newState;
      }
      return {
        ...prev,
        [documentId]: content
      };
    });
  };

  const hasUnsavedChanges = (documentId: string, originalDocument?: any) => {
    const editing = editingContent[documentId];
    if (!editing || !originalDocument) return false;

    return (
      editing.title !== originalDocument.title ||
      editing.content !== originalDocument.content ||
      editing.tags !== originalDocument.tags
    );
  };

  const clearEditingContent = (documentId: string) => {
    setEditingContent(documentId, null);
  };

  const getEditingContent = (documentId: string) => {
    return editingContent[documentId] || null;
  };

  return (
    <EditingContext.Provider value={{
      editingContent,
      setEditingContent,
      hasUnsavedChanges,
      clearEditingContent,
      getEditingContent
    }}>
      {children}
    </EditingContext.Provider>
  );
};
