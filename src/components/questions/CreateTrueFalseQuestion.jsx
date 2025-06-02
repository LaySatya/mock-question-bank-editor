// components/questions/CreateTrueFalseQuestion.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, ChevronDown, AlertCircle, HelpCircle } from 'lucide-react';
import { useTrueFalseForm } from './hooks/useTrueFalseForm';
import { useBulkTrueFalseEdit } from './hooks/useBulkTrueFalseEdit';
import { TagDropdown, TextEditor, FormField, NumberInput, RadioGroup, Checkbox, Select } from './components/SharedComponents';
import { AVAILABLE_TAGS } from './constants/questionConstants';

const CreateTrueFalseQuestion = ({ 
  onClose, 
  onSave, 
  existingQuestion = null, 
  questions, 
  isBulk 
}) => {
  const questionsToEdit = questions || (existingQuestion ? [existingQuestion] : []);

  // Single question form logic
  const {
    question,
    errors,
    updateField,
    handleTagToggle,
    validate,
    resetForm
  } = useTrueFalseForm(existingQuestion);

  // Bulk edit logic
  const {
    bulkQuestions,
    bulkTagDropdowns,
    handleBulkChange,
    handleBulkTagToggle,
    toggleBulkTagDropdown
  } = useBulkTrueFalseEdit(questionsToEdit, isBulk);

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    multipleTries: false,
    tags: true
  });
  const [allExpanded, setAllExpanded] = useState(false);

  // Reset form when question changes
  useEffect(() => {
    resetForm(existingQuestion);
  }, [existingQuestion, resetForm]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle expand all / collapse all
  const handleExpandAll = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    setExpandedSections({
      general: newExpandedState,
      multipleTries: newExpandedState,
      tags: newExpandedState
    });
  };

  // Save handlers
  const handleSingleSave = () => {
    if (!validate()) return;
    onSave({
      ...question,
      questionType: 'truefalse'
    });
    onClose();
  };

  const handleBulkSave = () => {
    const processedQuestions = bulkQuestions.map(q => ({
      ...q,
      questionType: 'truefalse'
    }));
    onSave(processedQuestions);
    onClose();
  };

  const correctAnswerOptions = [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'ready', label: 'Ready' }
  ];

  const showInstructionsOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-5xl h-[95vh] flex flex-col">
        {/* Header */}
        <Header 
          isBulk={isBulk} 
          hasExistingQuestion={!!existingQuestion}
          onClose={onClose}
          onExpandAll={handleExpandAll}
          allExpanded={allExpanded}
        />
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
            {isBulk ? (
              <BulkEditForm
                questions={bulkQuestions}
                tagDropdowns={bulkTagDropdowns}
                onBulkChange={handleBulkChange}
                onBulkTagToggle={handleBulkTagToggle}
                onToggleBulkTagDropdown={toggleBulkTagDropdown}
                correctAnswerOptions={correctAnswerOptions}
                statusOptions={statusOptions}
              />
            ) : (
              <SingleEditForm
                question={question}
                errors={errors}
                onUpdateField={updateField}
                onTagToggle={handleTagToggle}
                showTagDropdown={showTagDropdown}
                setShowTagDropdown={setShowTagDropdown}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
                correctAnswerOptions={correctAnswerOptions}
                statusOptions={statusOptions}
                showInstructionsOptions={showInstructionsOptions}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer 
          onClose={onClose}
          onSave={isBulk ? handleBulkSave : handleSingleSave}
          isBulk={isBulk}
        />
      </div>
    </div>
  );
};

// Header Component
const Header = ({ isBulk, hasExistingQuestion, onClose, onExpandAll, allExpanded }) => (
  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isBulk
            ? 'Bulk Edit True/False Questions'
            : (hasExistingQuestion ? 'Edit True/False Question' : 'Adding a True/False Question')}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {isBulk 
            ? 'Edit multiple True/False questions at once'
            : 'Create or modify a True/False question with feedback options'
          }
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {!isBulk && (
          <button 
            onClick={onExpandAll}
            className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        )}
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  </div>
);

// Footer Component
const Footer = ({ onClose, onSave, isBulk }) => (
  <div className="p-6 border-t border-gray-200 bg-gray-50">
    <div className="flex justify-between items-center">
      <div className="flex items-center text-sm text-red-600">
        <AlertCircle size={16} className="mr-1" />
        Required
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 flex items-center transition-all shadow-md"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </button>
        {!isBulk && (
          <button
            onClick={onSave}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
          >
            Save and Continue Editing
          </button>
        )}
      </div>
    </div>
  </div>
);

// Section Header Component
const SectionHeader = ({ title, isExpanded, onToggle, icon: Icon, required = false }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-all duration-200 ${
      isExpanded 
        ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' 
        : 'bg-gray-50 hover:bg-gray-100'
    }`}
  >
    <div className="flex items-center space-x-3">
      <ChevronDown 
        size={20} 
        className={`transform transition-transform duration-200 ${
          isExpanded ? 'rotate-0 text-blue-600' : '-rotate-90 text-gray-600'
        }`}
      />
      <div className="flex items-center space-x-2">
        {Icon && <Icon size={20} className={isExpanded ? 'text-blue-600' : 'text-gray-600'} />}
        <h3 className={`text-lg font-semibold ${
          isExpanded ? 'text-blue-900' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>
    </div>
    <div className={`text-sm ${isExpanded ? 'text-blue-600' : 'text-gray-500'}`}>
      {isExpanded ? 'Click to collapse' : 'Click to expand'}
    </div>
  </button>
);

// Single Edit Form Component
const SingleEditForm = ({
  question,
  errors,
  onUpdateField,
  onTagToggle,
  showTagDropdown,
  setShowTagDropdown,
  expandedSections,
  onToggleSection,
  correctAnswerOptions,
  statusOptions,
  showInstructionsOptions
}) => (
  <div className="space-y-6">
    {/* Validation Errors */}
    {Object.keys(errors).length > 0 && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <AlertCircle size={20} className="text-red-600 mr-2" />
          <h4 className="text-red-800 font-medium">Please fix the following errors:</h4>
        </div>
        <ul className="list-disc list-inside text-red-700 space-y-1">
          {Object.entries(errors).map(([field, message]) => (
            <li key={field}>{message}</li>
          ))}
        </ul>
      </div>
    )}

    {/* General Section */}
    <div className="space-y-4">
      <SectionHeader
        title="General"
        isExpanded={expandedSections.general}
        onToggle={() => onToggleSection('general')}
        required={true}
      />
      
      {expandedSections.general && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 animate-in fade-in duration-200">
          {/* Category */}
          <FormField label="Category">
            <Select
              value="Default for P-test (8)"
              onChange={() => {}}
              options={[{ value: "Default for P-test (8)", label: "Default for P-test (8)" }]}
              className="w-full"
            />
          </FormField>

          {/* Question Name */}
          <FormField label="Question name" required error={errors.title}>
            <input
              type="text"
              value={question.title}
              onChange={e => onUpdateField('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter a descriptive name for this question"
            />
          </FormField>

          {/* Question Text */}
          <FormField label="Question text" required error={errors.questionText}>
            <TextEditor
              value={question.questionText}
              onChange={value => onUpdateField('questionText', value)}
              placeholder="Type your question here..."
              error={errors.questionText}
              minHeight="200px"
            />
          </FormField>

          {/* Question Status and Default Mark */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField label="Question status">
              <Select
                value={question.status}
                onChange={value => onUpdateField('status', value)}
                options={statusOptions}
                className="w-full"
              />
            </FormField>
            
            <FormField label="Default mark" error={errors.defaultMark}>
              <NumberInput
                value={question.defaultMark}
                onChange={value => onUpdateField('defaultMark', value)}
                min={0}
                step={0.1}
                className="w-full"
                error={errors.defaultMark}
              />
            </FormField>

            <FormField label="ID number">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Auto-generated"
                disabled
              />
            </FormField>
          </div>

          {/* General Feedback */}
          <FormField label="General feedback">
            <TextEditor
              value={question.generalFeedback}
              onChange={value => onUpdateField('generalFeedback', value)}
              placeholder="Feedback that shows regardless of the answer chosen"
              minHeight="120px"
            />
          </FormField>

          {/* Correct Answer */}
          <FormField label="Correct answer">
            <Select
              value={question.correctAnswer}
              onChange={value => onUpdateField('correctAnswer', value)}
              options={correctAnswerOptions}
              className="w-48"
            />
          </FormField>

          {/* Show Instructions */}
          <FormField label="Show standard instructions">
            <div className="flex items-center space-x-2">
              <Select
                value={question.showInstructions ? 'true' : 'false'}
                onChange={value => onUpdateField('showInstructions', value === 'true')}
                options={showInstructionsOptions}
                className="w-32"
              />
              <HelpCircle size={16} className="text-blue-500" />
            </div>
          </FormField>

          {/* Feedback for Responses */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Feedback for each response</h4>
            
            <FormField label="Feedback for the response 'True'">
              <TextEditor
                value={question.feedbackTrue}
                onChange={value => onUpdateField('feedbackTrue', value)}
                placeholder="Feedback shown when student selects 'True'"
                minHeight="120px"
              />
            </FormField>

            <FormField label="Feedback for the response 'False'">
              <TextEditor
                value={question.feedbackFalse}
                onChange={value => onUpdateField('feedbackFalse', value)}
                placeholder="Feedback shown when student selects 'False'"
                minHeight="120px"
              />
            </FormField>
          </div>
        </div>
      )}
    </div>

    {/* Multiple Tries Section */}
    <div className="space-y-4">
      <SectionHeader
        title="Multiple tries"
        isExpanded={expandedSections.multipleTries}
        onToggle={() => onToggleSection('multipleTries')}
      />
      
      {expandedSections.multipleTries && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-in fade-in duration-200">
          <FormField label="Penalty for each incorrect try">
            <div className="flex items-center space-x-2">
              <NumberInput
                value={question.penalty}
                onChange={value => onUpdateField('penalty', value)}
                min={0}
                step={0.1}
                className="w-32"
              />
              <HelpCircle size={16} className="text-blue-500" />
            </div>
          </FormField>
        </div>
      )}
    </div>

    {/* Tags Section */}
    <div className="space-y-4">
      <SectionHeader
        title="Tags"
        isExpanded={expandedSections.tags}
        onToggle={() => onToggleSection('tags')}
        required={true}
      />
      
      {expandedSections.tags && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-in fade-in duration-200">
          <FormField label="Tags" required error={errors.tags}>
            <TagDropdown
              tags={question.tags}
              onTagToggle={onTagToggle}
              isOpen={showTagDropdown}
              onToggle={() => setShowTagDropdown(!showTagDropdown)}
              error={errors.tags}
              availableTags={AVAILABLE_TAGS}
            />
            <p className="text-sm text-gray-500 mt-2">
              Select tags to categorize and filter this question. You can search for existing tags or create new ones.
            </p>
          </FormField>
        </div>
      )}
    </div>
  </div>
);

// Bulk Edit Form Component (Simplified for space)
const BulkEditForm = ({
  questions,
  tagDropdowns,
  onBulkChange,
  onBulkTagToggle,
  onToggleBulkTagDropdown,
  correctAnswerOptions,
  statusOptions
}) => (
  <div className="space-y-8">
    {questions.map((q, idx) => (
      <div key={q.id || idx} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Question #{idx + 1}</h3>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-16"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <FormField label="Question name" required>
              <input
                type="text"
                value={q.title}
                onChange={e => onBulkChange(idx, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a descriptive name"
              />
            </FormField>

            <FormField label="Tags/Level" required>
              <TagDropdown
                tags={q.tags}
                onTagToggle={(tag) => onBulkTagToggle(idx, tag)}
                isOpen={!!tagDropdowns[idx]}
                onToggle={() => onToggleBulkTagDropdown(idx)}
                availableTags={AVAILABLE_TAGS}
              />
            </FormField>

            <FormField label="Correct answer">
              <Select
                value={q.correctAnswer}
                onChange={value => onBulkChange(idx, 'correctAnswer', value)}
                options={correctAnswerOptions}
                className="w-full"
              />
            </FormField>

            <FormField label="Question status">
              <Select
                value={q.status}
                onChange={value => onBulkChange(idx, 'status', value)}
                options={statusOptions}
                className="w-full"
              />
            </FormField>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <FormField label="Question text" required>
              <textarea
                value={q.questionText}
                onChange={e => onBulkChange(idx, 'questionText', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                placeholder="Type your question here..."
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Default mark">
                <NumberInput
                  value={q.defaultMark}
                  onChange={value => onBulkChange(idx, 'defaultMark', value)}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </FormField>

              <FormField label="Penalty">
                <NumberInput
                  value={q.penalty}
                  onChange={value => onBulkChange(idx, 'penalty', value)}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </FormField>
            </div>

            <FormField>
              <Checkbox
                checked={q.showInstructions}
                onChange={checked => onBulkChange(idx, 'showInstructions', checked)}
                label="Show instructions"
              />
            </FormField>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Feedback for each response</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField label='For "True" response'>
              <textarea
                value={q.feedbackTrue}
                onChange={e => onBulkChange(idx, 'feedbackTrue', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Feedback shown when student selects 'True'"
              />
            </FormField>

            <FormField label='For "False" response'>
              <textarea
                value={q.feedbackFalse}
                onChange={e => onBulkChange(idx, 'feedbackFalse', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Feedback shown when student selects 'False'"
              />
            </FormField>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CreateTrueFalseQuestion;