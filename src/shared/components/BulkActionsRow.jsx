import React, { useState, useRef, useEffect } from 'react';
import {
  faEdit, faTrash, faCopy, faDownload, faChevronDown, faUsers, faEye, faChartBar, faExclamationTriangle, faCheckCircle, faBug
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const statusOptions = [
  {
    value: 'draft',
    label: 'Draft',
    color: 'text-yellow-800',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
  },
  {
    value: 'ready',
    label: 'Ready',
    color: 'text-green-800',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
  }
];

const BulkActionsRow = ({
  selectedQuestions,
  setSelectedQuestions,
  setShowBulkEditModal,
  onBulkDelete,
  onBulkStatusChange
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const statusDropdownRef = useRef(null);
  const moreActionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
        setShowMoreActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (!selectedQuestions.length) {
      alert('Please select at least one question.');
      return;
    }
    if (window.confirm(`Change status of ${selectedQuestions.length} question(s) to "${newStatus}"?`)) {
      if (onBulkStatusChange) {
        await onBulkStatusChange(selectedQuestions, newStatus);
      }
    }
    setShowStatusDropdown(false);
  };

  if (selectedQuestions.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm mb-4 font-sans">
      {/* Main Actions Bar */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        {/* Selection Info */}
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center">
            <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
          </span>
          <span className="text-sm text-gray-800">
            {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
          </span>
          <button
            className="ml-3 text-xs text-blue-600 hover:text-blue-800 underline"
            onClick={() => setSelectedQuestions([])}
          >
            Clear
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
            onClick={() => setShowBulkEditModal(true)}
            disabled={selectedQuestions.length === 0}
          >
            <FontAwesomeIcon icon={faEdit} />
            Bulk Edit
          </button>

          {/* Status Dropdown */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              disabled={selectedQuestions.length === 0}
            >
              Set Status
              <FontAwesomeIcon icon={faChevronDown} className={`ml-1 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow z-50 min-w-[140px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 border-b border-gray-200">
                    Question status
                  </div>
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm transition"
                      onClick={() => handleStatusChange(status.value)}
                    >
                      <span>{status.icon}</span>
                      <span className={`font-normal ${status.color}`}>{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* More Actions Dropdown */}
          <div className="relative" ref={moreActionsRef}>
            <button
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              onClick={() => setShowMoreActions(!showMoreActions)}
              disabled={selectedQuestions.length === 0}
            >
              <FontAwesomeIcon icon={faChevronDown} />
              More
            </button>
            {showMoreActions && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow z-50 min-w-[160px]">
                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-gray-600 bg-gray-100 border-b border-gray-200">
                    Actions
                  </div>
                  <button className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm transition">
                    <FontAwesomeIcon icon={faCopy} className="text-gray-600" />
                    Duplicate
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm transition">
                    <FontAwesomeIcon icon={faDownload} className="text-gray-600" />
                    Export XML
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm transition">
                    <FontAwesomeIcon icon={faEye} className="text-gray-600" />
                    Preview
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm transition">
                    <FontAwesomeIcon icon={faChartBar} className="text-gray-600" />
                    Statistics
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm transition">
                    <FontAwesomeIcon icon={faBug} className="text-purple-600" />
                    Debug
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delete */}
          <button
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 border border-red-700 rounded hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-400 transition"
            onClick={onBulkDelete}
            disabled={selectedQuestions.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </button>
        </div>
      </div>

      {/* Quick Status Actions */}
      <div className="px-4 py-2 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Quick actions:</span>
          <div className="flex gap-1">
                        {statusOptions.map((status) => (
              <button
                key={`quick-${status.value}`}
                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded transition hover:bg-opacity-90
                  ${status.value === 'draft'
                    ? 'bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500'
                    : 'bg-blue-400 text-white border-blue-600 hover:bg-blue-600'
                  }`
                }
                onClick={() => handleStatusChange(status.value)}
                disabled={selectedQuestions.length === 0}
                title={`Set selected questions to ${status.label}`}
              >
                <span>{status.icon}</span>
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsRow;