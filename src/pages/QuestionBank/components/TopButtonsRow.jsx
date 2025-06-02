// components/TopButtonsRow.jsx
import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

const TopButtonsRow = ({
  showQuestionsDropdown,
  setShowQuestionsDropdown,
  questionsDropdownRef,
  handleFileUpload,
  setShowCreateModal,
  showQuestionText,
  setShowQuestionText
}) => {
  return (
    <div className="p-4 flex flex-wrap gap-2 items-center">
      {/* Questions dropdown */}
      <div className="relative" ref={questionsDropdownRef}>
        <button 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded flex items-center"
          onClick={() => setShowQuestionsDropdown(!showQuestionsDropdown)}
        >
          Questions <ChevronDown size={14} className="ml-2" />
        </button>
        
        {showQuestionsDropdown && (
          <div className="absolute left-0 mt-1 w-48 bg-gray-500 rounded shadow-lg z-10 border border-gray-500">
            <button className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600">
              <Check size={16} className="mr-2" /> Questions
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600">
              Categories
            </button>
            <label className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600 cursor-pointer">
              <input
                type="file"
                accept=".xml"
                className="hidden"
                onChange={handleFileUpload}
              />
              Import
            </label>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600"
              onClick={() => alert("Export functionality would go here")}
            >
              Export
            </button>
          </div>
        )}
      </div>

      <button
        className="bg-blue-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
        onClick={() => setShowCreateModal(true)}
      >
        Create a new question ...
      </button>
      
      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded flex items-center">
        Add columns <ChevronDown size={14} className="ml-1" />
      </button>
      
      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded">
        Reset columns
      </button>
      
      <div className="flex items-center ml-4">
        <span className="mr-2">Show question text in the question list?</span>
        <select
          className="border rounded py-1 px-2"
          value={showQuestionText ? "Yes" : "No"}
          onChange={e => setShowQuestionText(e.target.value === "Yes")}
        >
          <option value="Yes">Yes, text only</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );
};

export default TopButtonsRow;