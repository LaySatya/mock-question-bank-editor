import React from 'react';

const BulkEditQuestionsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-2xl h-[70vh] flex flex-col items-center justify-center">
        <img
          src="/src/assets/stop.gif"
          alt="Building in progress"
          className="w-40 h-40 mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bulk Edit is Coming Soon!</h2>
        <p className="text-gray-600 mb-8 text-center">
          We are building this feature right now.<br />
          Please check back later. Thank you for your patience!
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BulkEditQuestionsModal;