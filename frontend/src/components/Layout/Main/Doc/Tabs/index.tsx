import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface TabsProps {
  uuid?: string;
  hasUnsavedChanges?: boolean;
  editingContent?: any;
}

const Tabs: React.FC<TabsProps> = ({ uuid, hasUnsavedChanges = false, editingContent }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!uuid) return null;

  const getCurrentTab = () => {
    if (location.pathname.includes('/edit')) return 'edit';
    if (location.pathname.includes('/preview')) return 'preview';
    return 'view';
  };

  const currentTab = getCurrentTab();

  const handleTabClick = (tab: 'view' | 'edit' | 'preview') => {
    let path = `/doc/${uuid}`;

    if (tab === 'edit') {
      path += '/edit';
      if (editingContent) {
        navigate(path, { state: { editingContent } });
        return;
      }
    } else if (tab === 'preview') {
      path += '/preview';
      if (editingContent) {
        navigate(path, { state: { editingContent } });
        return;
      }
    }

    navigate(path);
  };

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabClick('view')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              currentTab === 'view'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            View
          </button>
          <button
            onClick={() => handleTabClick('edit')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              currentTab === 'edit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Edit
            {hasUnsavedChanges && (
              <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
            )}
          </button>
          <button
            onClick={() => handleTabClick('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              currentTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Preview
            {hasUnsavedChanges && (
              <span className="ml-1 w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes"></span>
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
