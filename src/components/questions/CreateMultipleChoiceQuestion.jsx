// components/questions/CreateMultipleChoiceQuestion.jsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useMultipleChoiceForm } from './hooks/useMultipleChoiceForm';
import { useBulkEdit } from './hooks/useBulkEdit';
import { 
  TagDropdown, 
  TextEditor, 
  FormField, 
  ValidationErrors 
} from './components/SharedComponents';
import QuestionSettings from './components/QuestionSettings';
import ChoiceEditor from './components/ChoiceEditor';
import GradingInfo from './components/GradingInfo';
import { AVAILABLE_TAGS, DEFAULT_CHOICES } from './constants/questionConstants';

const CreateMultipleChoiceQuestion = ({ 
  question = {}, 
  questions, 
  onClose, 
  onSave, 
  isBulk 
}) => {
  const questionsToEdit = questions || (question ? [question] : []);

  // Single question form logic
  const {
    formData,
    errors,
    updateField,
    updateChoice,
    addChoice,
    removeChoice,
    handleTagToggle,
    validate,
    resetForm
  } = useMultipleChoiceForm(question);

  // Bulk edit logic
  const {
    bulkQuestions,
    bulkTagDropdowns,
    handleBulkChange,
    handleBulkChoiceChange,
    handleBulkTagToggle,
    toggleBulkTagDropdown,
    handleBulkAddChoice,
    handleBulkRemoveChoice
  } = useBulkEdit(questionsToEdit, isBulk);

  // Reset form when question changes
  useEffect(() => {
    resetForm(question);
  }, [question.id, isBulk, resetForm]);

  // Save handlers
  const handleSingleSave = () => {
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  const handleBulkSave = () => {
    onSave(bulkQuestions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <Header 
          isBulk={isBulk} 
          hasExistingQuestion={question && question.id}
          onClose={onClose} 
        />

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            {isBulk ? (
              <BulkEditForm
                questions={bulkQuestions}
                tagDropdowns={bulkTagDropdowns}
                onBulkChange={handleBulkChange}
                onBulkChoiceChange={handleBulkChoiceChange}
                onBulkTagToggle={handleBulkTagToggle}
                onToggleBulkTagDropdown={toggleBulkTagDropdown}
                onBulkAddChoice={handleBulkAddChoice}
                onBulkRemoveChoice={handleBulkRemoveChoice}
              />
            ) : (
              <SingleEditForm
                formData={formData}
                errors={errors}
                onUpdateField={updateField}
                onUpdateChoice={updateChoice}
                onAddChoice={addChoice}
                onRemoveChoice={removeChoice}
                onTagToggle={handleTagToggle}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer 
          onClose={onClose}
          onSave={isBulk ? handleBulkSave : handleSingleSave}
        />
      </div>
    </div>
  );
};

// Header Component
const Header = ({ isBulk, hasExistingQuestion, onClose }) => (
  <div className="p-4 border-b flex justify-between items-center bg-gray-50">
    <h2 className="text-xl font-semibold">
      {isBulk
        ? 'Bulk Edit Multiple Choice Questions'
        : (hasExistingQuestion ? 'Edit Multiple Choice Question' : 'Create Multiple Choice Question')}
    </h2>
    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
      <X size={24} />
    </button>
  </div>
);

// Footer Component
const Footer = ({ onClose, onSave }) => (
  <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
    <button
      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      onClick={onClose}
    >
      Cancel
    </button>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center transition-colors"
      onClick={onSave}
    >
      <Save size={16} className="mr-2" />
      Save Changes
    </button>
  </div>
);

// Single Edit Form Component
const SingleEditForm = ({
  formData,
  errors,
  onUpdateField,
  onUpdateChoice,
  onAddChoice,
  onRemoveChoice,
  onTagToggle
}) => {
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  return (
    <>
      {/* Validation errors */}
      <ValidationErrors errors={errors} />

      {/* Question Name */}
      <FormField label="Question name" required error={errors.title}>
        <input
          type="text"
          value={formData.title}
          onChange={e => onUpdateField('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter a descriptive name for this question"
        />
      </FormField>

      {/* Question Text */}
      <FormField label="Question text" required error={errors.questionText}>
        <TextEditor
          value={formData.questionText}
          onChange={value => onUpdateField('questionText', value)}
          placeholder="Enter the question text here..."
          error={errors.questionText}
          minHeight="120px"
        />
      </FormField>

      {/* Tags/Level */}
      <FormField label="Tags/Level" required error={errors.tags}>
        <TagDropdown
          tags={formData.tags}
          onTagToggle={onTagToggle}
          isOpen={tagDropdownOpen}
          onToggle={() => setTagDropdownOpen(open => !open)}
          availableTags={AVAILABLE_TAGS}
          error={!!errors.tags}
        />
      </FormField>

      {/* Settings Grid */}
      <QuestionSettings
        defaultMark={formData.defaultMark}
        penaltyFactor={formData.penaltyFactor}
        onUpdateField={onUpdateField}
      />

      {/* General Feedback */}
      <FormField label="General feedback">
        <TextEditor
          value={formData.generalFeedback}
          onChange={value => onUpdateField('generalFeedback', value)}
          placeholder="Optional feedback shown to all students after they answer"
          minHeight="80px"
        />
      </FormField>

      {/* Question Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.multipleAnswers}
              onChange={e => onUpdateField('multipleAnswers', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Multiple answers allowed
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.shuffleAnswers}
              onChange={e => onUpdateField('shuffleAnswers', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Shuffle the choices
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.showInstructions}
              onChange={e => onUpdateField('showInstructions', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Show standard instructions
            </span>
          </label>
        </div>
      </div>

      {/* Answer Choices */}
      <ChoiceEditor
        choices={formData.choices}
        onUpdateChoice={onUpdateChoice}
        onAddChoice={onAddChoice}
        onRemoveChoice={onRemoveChoice}
        errors={errors.choices}
      />

      {/* Grading Information */}
      <GradingInfo choices={formData.choices} />
    </>
  );
};

// Bulk Edit Form Component
const BulkEditForm = ({
  questions,
  tagDropdowns,
  onBulkChange,
  onBulkChoiceChange,
  onBulkTagToggle,
  onToggleBulkTagDropdown,
  onBulkAddChoice,
  onBulkRemoveChoice
}) => (
  <>
    {questions.map((q, idx) => (
      <div key={q.id || idx} className="mb-8 border-b pb-8">
        <div className="font-bold mb-2">Question #{idx + 1}</div>
        
        {/* Question Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question name* <span className="text-red-500">Required</span>
          </label>
          <input
            type="text"
            value={q.title}
            onChange={e => onBulkChange(idx, 'title', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter a descriptive name for this question"
          />
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question text* <span className="text-red-500">Required</span>
          </label>
          <TextEditor
            value={q.questionText}
            onChange={value => onBulkChange(idx, 'questionText', value)}
            placeholder="Enter the question text here..."
            minHeight="120px"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags/Level* <span className="text-red-500">Required</span>
          </label>
          <TagDropdown
            tags={q.tags || []}
            onTagToggle={tag => onBulkTagToggle(idx, tag)}
            isOpen={!!tagDropdowns[idx]}
            onToggle={() => onToggleBulkTagDropdown(idx)}
            availableTags={AVAILABLE_TAGS}
          />
        </div>

        {/* Settings */}
        <QuestionSettings
          defaultMark={q.defaultMark}
          penaltyFactor={q.penaltyFactor}
          onUpdateField={(field, value) => onBulkChange(idx, field, value)}
        />

        {/* General Feedback */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            General feedback
          </label>
          <TextEditor
            value={q.generalFeedback}
            onChange={value => onBulkChange(idx, 'generalFeedback', value)}
            placeholder="Optional feedback shown to all students after they answer"
            minHeight="80px"
          />
        </div>

        {/* Question Options */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={q.multipleAnswers}
                onChange={e => onBulkChange(idx, 'multipleAnswers', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Multiple answers allowed
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={q.shuffleAnswers}
                onChange={e => onBulkChange(idx, 'shuffleAnswers', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Shuffle the choices
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={q.showInstructions}
                onChange={e => onBulkChange(idx, 'showInstructions', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Show standard instructions
              </span>
            </label>
          </div>
        </div>

        {/* Answer Choices for Bulk */}
        <ChoiceEditor
          choices={q.choices}
          onUpdateChoice={(cIdx, field, value) => onBulkChoiceChange(idx, cIdx, field, value)}
          onAddChoice={() => onBulkAddChoice(idx)}
          onRemoveChoice={(cIdx) => onBulkRemoveChoice(idx, cIdx)}
          isBulk={true}
        />

        {/* Grading Info for this question */}
        <GradingInfo choices={q.choices} />
      </div>
    ))}
  </>
);

export default CreateMultipleChoiceQuestion;