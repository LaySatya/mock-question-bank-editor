// components/modals/BulkEditModal.jsx - Enhanced bulk edit with Moodle styling
import React, { useState, useEffect } from 'react';

const BulkEditModal = ({ 
  questions, 
  onClose, 
  onSave,
  username = "Unknown User"
}) => {
  const [editMode, setEditMode] = useState('basic'); // 'basic' or 'advanced'
  const [bulkChanges, setBulkChanges] = useState({
    status: '',
    defaultMark: '',
    penaltyFactor: '',
    generalFeedback: '',
    tags: {
      add: [],
      remove: []
    }
  });

  const [individualChanges, setIndividualChanges] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize individual changes with current question data
  useEffect(() => {
    const initial = {};
    questions.forEach(q => {
      initial[q.id] = {
        title: q.title || '',
        status: q.status || 'draft',
        defaultMark: q.defaultMark || 1,
        penaltyFactor: q.penaltyFactor || 0,
        generalFeedback: q.generalFeedback || '',
        tags: q.tags || []
      };
    });
    setIndividualChanges(initial);
  }, [questions]);

  const handleBulkChange = (field, value) => {
    setBulkChanges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagOperation = (operation, tag) => {
    setBulkChanges(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [operation]: prev.tags[operation].includes(tag)
          ? prev.tags[operation].filter(t => t !== tag)
          : [...prev.tags[operation], tag]
      }
    }));
  };

  const handleIndividualChange = (questionId, field, value) => {
    setIndividualChanges(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
  };

  const applyBulkChanges = () => {
    const updatedChanges = { ...individualChanges };
    
    questions.forEach(q => {
      if (bulkChanges.status) {
        updatedChanges[q.id].status = bulkChanges.status;
      }
      if (bulkChanges.defaultMark !== '') {
        updatedChanges[q.id].defaultMark = Number(bulkChanges.defaultMark);
      }
      if (bulkChanges.penaltyFactor !== '') {
        updatedChanges[q.id].penaltyFactor = Number(bulkChanges.penaltyFactor);
      }
      if (bulkChanges.generalFeedback) {
        updatedChanges[q.id].generalFeedback = bulkChanges.generalFeedback;
      }
      
      // Handle tags
      let newTags = [...updatedChanges[q.id].tags];
      bulkChanges.tags.add.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
      bulkChanges.tags.remove.forEach(tag => {
        newTags = newTags.filter(t => t !== tag);
      });
      updatedChanges[q.id].tags = newTags;
    });
    
    setIndividualChanges(updatedChanges);
  };

  const validateChanges = () => {
    const newErrors = {};
    
    Object.entries(individualChanges).forEach(([questionId, changes]) => {
      if (!changes.title?.trim()) {
        newErrors[`${questionId}_title`] = 'Question title is required';
      }
      if (changes.defaultMark < 0) {
        newErrors[`${questionId}_defaultMark`] = 'Default mark must be positive';
      }
      if (changes.penaltyFactor < 0 || changes.penaltyFactor > 1) {
        newErrors[`${questionId}_penaltyFactor`] = 'Penalty factor must be between 0 and 1';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateChanges()) {
      alert('Please fix the validation errors before saving.');
      return;
    }

    const updatedQuestions = questions.map(q => ({
      ...q,
      ...individualChanges[q.id],
      version: `v${parseInt(q.version.substring(1)) + 1}`,
      modifiedBy: {
        name: username,
        role: "",
        date: new Date().toLocaleString()
      },
      history: [
        ...q.history,
        {
          version: `v${parseInt(q.version.substring(1)) + 1}`,
          date: new Date().toLocaleDateString(),
          author: username,
          changes: "Bulk edited"
        }
      ]
    }));

    onSave(updatedQuestions);
  };

  const AVAILABLE_TAGS = [
    'easy', 'medium', 'hard', 'programming', 'algorithms', 'databases', 
    'networking', 'web development', 'security', 'python', 'java', 'javascript',
    'quiz', 'exam', 'practice', 'assignment'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <span className="text-blue-600 font-bold">BULK</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bulk Edit Questions</h2>
              <p className="text-sm text-gray-600">Editing {questions.length} questions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setEditMode('basic')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                editMode === 'basic' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Basic Edit
            </button>
            <button
              onClick={() => setEditMode('advanced')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                editMode === 'advanced' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Individual Edit
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {editMode === 'basic' ? (
            // Basic/Bulk Edit Mode
            <div className="space-y-8">
              {/* Bulk Changes Section */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply to All Questions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={bulkChanges.status}
                      onChange={(e) => handleBulkChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No change</option>
                      <option value="ready">Ready</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Mark</label>
                    <input
                      type="number"
                      value={bulkChanges.defaultMark}
                      onChange={(e) => handleBulkChange('defaultMark', e.target.value)}
                      placeholder="No change"
                      min="0"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Penalty Factor</label>
                    <input
                      type="number"
                      value={bulkChanges.penaltyFactor}
                      onChange={(e) => handleBulkChange('penaltyFactor', e.target.value)}
                      placeholder="No change"
                      min="0"
                      max="1"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">General Feedback</label>
                  <textarea
                    value={bulkChanges.generalFeedback}
                    onChange={(e) => handleBulkChange('generalFeedback', e.target.value)}
                    placeholder="Leave empty for no change"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Tags Management */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tag Management</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Add Tags (to all questions)</label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagOperation('add', tag)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              bulkChanges.tags.add.includes(tag)
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {tag}
                            {bulkChanges.tags.add.includes(tag) && <span className="inline ml-1">[ADDED]</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Remove Tags (from all questions)</label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagOperation('remove', tag)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              bulkChanges.tags.remove.includes(tag)
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {tag}
                            {bulkChanges.tags.remove.includes(tag) && <span className="inline ml-1">[REMOVE]</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={applyBulkChanges}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Apply Changes to All Questions
                  </button>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Changes</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {questions.map(q => (
                    <div key={q.id} className="bg-white rounded-md p-3 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{individualChanges[q.id]?.title || q.title}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            Status: <span className="font-medium">{individualChanges[q.id]?.status}</span> | 
                            Mark: <span className="font-medium">{individualChanges[q.id]?.defaultMark}</span> | 
                            Tags: <span className="font-medium">{individualChanges[q.id]?.tags?.length || 0}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">ID: {q.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Individual Edit Mode
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-2">WARNING:</span>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Individual Edit Mode</h3>
                    <p className="text-sm text-yellow-700">Edit each question individually. Changes will only apply to the specific question you modify.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                      <span className="text-sm text-gray-500">ID: {q.id}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
                        <input
                          type="text"
                          value={individualChanges[q.id]?.title || ''}
                          onChange={(e) => handleIndividualChange(q.id, 'title', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`${q.id}_title`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`${q.id}_title`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`${q.id}_title`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={individualChanges[q.id]?.status || 'draft'}
                          onChange={(e) => handleIndividualChange(q.id, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="ready">Ready</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Mark</label>
                        <input
                          type="number"
                          value={individualChanges[q.id]?.defaultMark || 1}
                          onChange={(e) => handleIndividualChange(q.id, 'defaultMark', Number(e.target.value))}
                          min="0"
                          step="1"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`${q.id}_defaultMark`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`${q.id}_defaultMark`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`${q.id}_defaultMark`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Factor</label>
                        <input
                          type="number"
                          value={individualChanges[q.id]?.penaltyFactor || 0}
                          onChange={(e) => handleIndividualChange(q.id, 'penaltyFactor', Number(e.target.value))}
                          min="0"
                          max="1"
                          step="0.1"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[`${q.id}_penaltyFactor`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`${q.id}_penaltyFactor`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`${q.id}_penaltyFactor`]}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">General Feedback</label>
                      <textarea
                        value={individualChanges[q.id]?.generalFeedback || ''}
                        onChange={(e) => handleIndividualChange(q.id, 'generalFeedback', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {Object.keys(errors).length > 0 && (
              <span className="text-red-600 flex items-center">
                <span className="mr-1">ERROR:</span>
                {Object.keys(errors).length} validation error{Object.keys(errors).length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={Object.keys(errors).length > 0}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                Object.keys(errors).length > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;