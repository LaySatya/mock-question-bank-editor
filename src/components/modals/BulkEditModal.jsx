// components/modals/BulkEditModal.jsx - Fixed imports for your structure
import React, { useState, useEffect } from 'react';
import { useBulkEditAPI } from '../questions/hooks/useBulkEditAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faFolder } from '@fortawesome/free-solid-svg-icons';
import { TagManager, CategorySelector, BulkActionsPanel, ChangesPreview } from '../questions/shared/BulkEditComponents';

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
    category: '',
    tags: {
      add: [],
      remove: []
    }
  });

  const [individualChanges, setIndividualChanges] = useState({});
  const [errors, setErrors] = useState({});

  // 🔧 USE SHARED API HOOKS
  const {
    tags,
    tagsLoading,
    tagsError,
    addCustomTag,
    refreshTags,
    categories,
    categoriesLoading,
    categoriesError,
    refreshCategories,
    existingTags,
    hasExistingTags,
    bulkUpdateStatus,
    bulkLoading,
    bulkError,
    isLoading,
    refreshAll
  } = useBulkEditAPI(questions);

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
        category: q.category || '',
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
      if (bulkChanges.category) {
        updatedChanges[q.id].category = bulkChanges.category;
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

  const handleSave = async () => {
    if (!validateChanges()) {
      alert('Please fix the validation errors before saving.');
      return;
    }

    try {
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
    } catch (error) {
      console.error(' Save failed:', error);
      alert(`Failed to save changes: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <span className="text-blue-600 font-bold text-xs">BULK</span>
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
              <BulkActionsPanel
                title="Apply to Selected Questions"
                description={`Make changes to all ${questions.length} selected questions at once`}
                onApply={applyBulkChanges}
                applyButtonText="Apply Changes to All Questions"
                loading={bulkLoading}
              >
                {/* Basic Settings */}
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
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
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
                
                {/* Category Selector */}
                <CategorySelector
                  categories={categories}
                  selectedCategory={bulkChanges.category}
                  onChange={(value) => handleBulkChange('category', value)}
                  loading={categoriesLoading}
                  error={categoriesError}
                  onRefresh={refreshCategories}
                  placeholder="No change"
                  label="Category"
                />
                
                {/* General Feedback */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">General Feedback</label>
                  <textarea
                    value={bulkChanges.generalFeedback}
                    onChange={(e) => handleBulkChange('generalFeedback', e.target.value)}
                    placeholder="Leave empty for no change"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Tag Management */}
                <TagManager
                  availableTags={tags}
                  existingTags={existingTags}
                  selectedAddTags={bulkChanges.tags.add}
                  selectedRemoveTags={bulkChanges.tags.remove}
                  onTagOperation={handleTagOperation}
                  onAddCustomTag={addCustomTag}
                  loading={tagsLoading}
                  error={tagsError}
                  onRefresh={refreshTags}
                  showSmartRemoval={true}
                  customTagPlaceholder="Enter new tag name"
                />
              </BulkActionsPanel>

              {/* Preview Section */}
              <ChangesPreview
                questions={questions}
                individualChanges={individualChanges}
                title="Preview Changes"
                maxHeight="16rem"
              />
            </div>
          ) : (
            // Individual Edit Mode
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-2">⚠️</span>
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
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
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
                    
                    {/* Category for individual questions */}
                    <div className="mt-4">
                      <CategorySelector
                        categories={categories}
                        selectedCategory={individualChanges[q.id]?.category || ''}
                        onChange={(value) => handleIndividualChange(q.id, 'category', value)}
                        loading={categoriesLoading}
                        error={categoriesError}
                        placeholder="Select category..."
                        label="Category"
                        showNoChange={false}
                      />
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
                <span className="mr-1">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                {Object.keys(errors).length} validation error{Object.keys(errors).length !== 1 ? 's' : ''}
              </span>
            )}
             {tags.length > 0 && (
              <span className="text-gray-500 ml-4">
                <FontAwesomeIcon icon={faTags} className="mr-1" />
                {tags.length} tags loaded from API
              </span>
            )}
            {categories.length > 0 && (
              <span className="text-gray-500 ml-4">
                <FontAwesomeIcon icon={faFolder} className="mr-1" />
                {categories.length} categories loaded
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
              disabled={Object.keys(errors).length > 0 || isLoading}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                Object.keys(errors).length > 0 || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;