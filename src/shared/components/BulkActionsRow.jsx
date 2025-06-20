import React, { useState, useRef, useEffect } from 'react';
import {
  faEdit, faTrash, faCopy, faDownload, faChevronDown, faUsers, faEye, faChartBar, faExclamationTriangle, faCheckCircle, faBug,faTag, faPlusCircle, faMinusCircle 
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
  onBulkStatusChange,
   uestions,           
  setQuestions, 
  onBulkTagAction
}) => {

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const statusDropdownRef = useRef(null);
  const moreActionsRef = useRef(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagAction, setTagAction] = useState('add');
  const [selectedTag, setSelectedTag] = useState('');
  const tagDropdownRef = useRef(null);
   // Tag state
  const [allTags, setAllTags] = useState([]);
  const [removableTags, setRemovableTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);


    // Fetch all tags for "Add Tag"
  useEffect(() => {
    if (tagAction === 'add' && showTagDropdown) {
      setLoadingTags(true);
      fetch('http://127.0.0.1:8000/api/questions/tags', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log('Fetched tags:', data);
          // Handle all possible response shapes
          if (Array.isArray(data)) {
            setAllTags(data);
          } else if (Array.isArray(data.tags)) {
            setAllTags(data.tags);
          } else if (Array.isArray(data.data)) {
            setAllTags(data.data);
          } else {
            setAllTags([]);
          }
          setLoadingTags(false);
        })
        .catch(() => {
          setAllTags([]);
          setLoadingTags(false);
        });
    }
  }, [tagAction, showTagDropdown]);

    // Fetch intersection of tags for "Remove Tag"
  useEffect(() => {
    const fetchTagsForQuestions = async () => {
      if (tagAction === 'remove' && showTagDropdown && selectedQuestions.length > 0) {
        setLoadingTags(true);
        try {
          // Fetch tags for each selected question
          const tagLists = await Promise.all(
            selectedQuestions.map(qid =>
              fetch(`http://127.0.0.1:8000/api/questions/question-tags?questionid=${qid}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Accept': 'application/json'
                }
              })
                .then(res => res.json())
                .then(data => (data.tags || []))
            )
          );
          // Find intersection of tag ids
          let intersection = tagLists[0] || [];
          for (let i = 1; i < tagLists.length; i++) {
            intersection = intersection.filter(tag =>
              tagLists[i].some(t => t.id === tag.id)
            );
          }
          setRemovableTags(intersection);
        } catch {
          setRemovableTags([]);
        }
        setLoadingTags(false);
      }
    };
    fetchTagsForQuestions();
  }, [tagAction, showTagDropdown, selectedQuestions]);


  useEffect(() => {

    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false);
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
        const handleBulkTag = async () => {
        if (!selectedTag) return;
        if (!selectedQuestions.length) return;
        const token = localStorage.getItem('token');
        const url = 'http://127.0.0.1:8000/api/questions/bulk-tags';
        const method = tagAction === 'add' ? 'POST' : 'DELETE';
        const body = JSON.stringify({
          questionids: selectedQuestions,
          tagids: [selectedTag]
        });
        const res = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body
        });
        const data = await res.json();
        if (data.success) {
          alert(`${tagAction === 'add' ? 'Added' : 'Removed'} tag successfully!`);
          // Update local questions state for instant UI feedback
          setQuestions(prevQuestions =>
            prevQuestions.map(q => {
              if (!selectedQuestions.includes(q.id)) return q;
              let newTags = Array.isArray(q.tags) ? [...q.tags] : [];
              if (tagAction === 'add') {
                // Only add if not already present
                if (!newTags.some(t => t.id === Number(selectedTag))) {
                  const tagObj = allTags.find(t => t.id === Number(selectedTag));
                  if (tagObj) newTags.push(tagObj);
                }
              } else {
                // Remove tag
                newTags = newTags.filter(t => t.id !== Number(selectedTag));
              }
              return { ...q, tags: newTags };
            })
          );
          setShowTagDropdown(false);
          setSelectedTag('');
          setSelectedQuestions([]); // Optionally clear selection
        } else {
          alert('Some tags could not be processed.');
        }
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
          {/* Tag Bulk Actions Dropdown */}
      <div className="relative" ref={tagDropdownRef}>
        <button
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
          onClick={() => setShowTagDropdown(!showTagDropdown)}
          disabled={selectedQuestions.length === 0}
        >
          <FontAwesomeIcon icon={faTag} />
          Tag Actions
          <FontAwesomeIcon icon={faChevronDown} className={`ml-1 transition-transform ${showTagDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showTagDropdown && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow z-50 min-w-[200px] p-3">
            <div className="flex items-center gap-2 mb-2">
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${tagAction === 'add' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTagAction('add')}
              >
                <FontAwesomeIcon icon={faPlusCircle} /> Add Tag
              </button>
              <button
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${tagAction === 'remove' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setTagAction('remove')}
              >
                <FontAwesomeIcon icon={faMinusCircle} /> Remove Tag
              </button>
            </div>
              <select
              className="w-full border rounded px-2 py-1 text-sm mb-2"
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
            >
              <option value="">Select tag...</option>
              {(tagAction === 'add' ? allTags : removableTags).map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
            <button
              className={`w-full py-1 rounded text-white font-semibold ${tagAction === 'add' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
              onClick={handleBulkTag}
              disabled={!selectedTag}
            >
              {tagAction === 'add' ? 'Add Tag' : 'Remove Tag'}
            </button>
          </div>
        )}
      </div>




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
      {/* <div className="px-4 py-2 bg-white border-t border-gray-100">
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
      </div> */}
    </div>
  );
};

export default BulkActionsRow;