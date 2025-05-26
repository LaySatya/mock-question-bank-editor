import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const BulkEditQuestionsModal = ({ questions, onClose, onSave }) => {
  const [status, setStatus] = useState('');
  const [generalFeedback, setGeneralFeedback] = useState('');

  const handleSave = () => {
    const updated = questions.map(q => ({
      ...q,
      ...(status ? { status } : {}),
      ...(generalFeedback ? { generalFeedback } : {})
    }));
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-2xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold">
            Bulk Edit Questions (Mixed Types)
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-40 px-3 py-2 border border-gray-300 rounded-md"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">-- No Change --</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">General feedback</label>
            <textarea
              className="w-full px-3 py-2 min-h-[80px] border border-gray-300 rounded-md"
              value={generalFeedback}
              onChange={e => setGeneralFeedback(e.target.value)}
              placeholder="Set feedback for all selected questions"
            ></textarea>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            <strong>Note:</strong> Only fields above will be updated for all selected questions. Type-specific fields cannot be edited in bulk for mixed types.
          </div>
        </div>
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditQuestionsModal;