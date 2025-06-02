// components/BulkActionsRow.jsx
import React from 'react';
import { Edit, Trash, Copy, Download } from 'lucide-react';

const BulkActionsRow = ({
  selectedQuestions,
  setSelectedQuestions,
  setShowBulkEditModal,
  onBulkDelete
}) => {
  return (
    <div className="p-4 bg-blue-50 flex flex-wrap gap-2 items-center">
      <span>{selectedQuestions.length} questions selected</span>
      
      <button 
        className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded flex items-center text-sm"
        onClick={() => {
          if (selectedQuestions.length > 0) {
            setShowBulkEditModal(true);
          } else {
            alert('Please select at least one question to edit.');
          }
        }}
      >
        <Edit size={14} className="mr-1" /> Edit
      </button>
      
      <button 
        className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded flex items-center text-sm"
        onClick={onBulkDelete}
      >
        <Trash size={14} className="mr-1" /> Delete
      </button>
      
      <button 
        className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded flex items-center text-sm"
        onClick={() => alert('Bulk duplicate would be handled here')}
      >
        <Copy size={14} className="mr-1" /> Duplicate
      </button>
      
      <button 
        className="bg-green-100 hover:bg-green-200 text-green-800 py-1 px-3 rounded flex items-center text-sm"
        onClick={() => alert('Export to XML would happen here')}
      >
        <Download size={14} className="mr-1" /> Export XML
      </button>
      
      <button 
        className="ml-auto text-blue-600 hover:underline text-sm"
        onClick={() => setSelectedQuestions([])}
      >
        Clear selection
      </button>
    </div>
  );
};

export default BulkActionsRow;
