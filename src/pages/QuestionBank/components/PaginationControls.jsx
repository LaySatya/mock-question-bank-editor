// components/PaginationControls.jsx
import React from 'react';

const PaginationControls = ({
  currentPage,
  setCurrentPage,
  startIdx,
  endIdx,
  totalQuestions
}) => {
  return (
    <div className="p-4 border-t border-gray-200 flex justify-between items-center">
      <div className="text-sm text-gray-700">
        Showing {totalQuestions === 0 ? 0 : startIdx + 1} to {Math.min(endIdx, totalQuestions)} of {totalQuestions} questions
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={endIdx >= totalQuestions}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
