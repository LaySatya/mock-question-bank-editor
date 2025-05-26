import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const CreateTrueFalseQuestion = ({ onClose, onSave, existingQuestion = null, questions, isBulk }) => {
  const questionsToEdit = questions || (existingQuestion ? [existingQuestion] : []);
  // Single edit state
  const [question, setQuestion] = useState({
    title: existingQuestion?.title || '',
    questionText: existingQuestion?.questionText || '',
    defaultMark: existingQuestion?.defaultMark || 1,
    generalFeedback: existingQuestion?.generalFeedback || '',
    correctAnswer: existingQuestion?.correctAnswer || 'true',
    penalty: existingQuestion?.penalty || 0,
    showInstructions: existingQuestion?.showInstructions || false,
    feedbackTrue: existingQuestion?.feedbackTrue || '',
    feedbackFalse: existingQuestion?.feedbackFalse || '',
    status: existingQuestion?.status || 'draft'
  });
  // Bulk edit state
  const [bulkQuestions, setBulkQuestions] = useState(
    isBulk
      ? questionsToEdit.map(q => ({
          ...q,
          title: q.title || '',
          questionText: q.questionText || '',
          defaultMark: q.defaultMark || 1,
          generalFeedback: q.generalFeedback || '',
          correctAnswer: q.correctAnswer || 'true',
          penalty: q.penalty || 0,
          showInstructions: q.showInstructions || false,
          feedbackTrue: q.feedbackTrue || '',
          feedbackFalse: q.feedbackFalse || '',
          status: q.status || 'draft'
        }))
      : []
  );
  const [errors, setErrors] = useState({});

  // Bulk edit: handle changes for each question
  const handleBulkChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    setBulkQuestions(prev =>
      prev.map((q, i) =>
        i === idx ? { ...q, [name]: type === 'checkbox' ? checked : value } : q
      )
    );
  };

  // Bulk edit: handle save
  const handleBulkSave = () => {
    onSave(bulkQuestions);
    onClose();
  };

  // Single edit: validation
  const validateForm = () => {
    const newErrors = {};
    if (!question.title.trim()) newErrors.title = "Question name is required";
    if (!question.questionText.trim()) newErrors.questionText = "Question text is required";
    if (question.defaultMark <= 0) newErrors.defaultMark = "Default mark must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Single edit: submit
  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...question,
        questionType: 'truefalse',
        createdBy: {
          name: "Current User",
          role: "",
          date: new Date().toLocaleString()
        },
        modifiedBy: {
          name: "Current User",
          role: "",
          date: new Date().toLocaleString()
        },
        version: existingQuestion ? 
          `v${parseInt(existingQuestion.version?.substring(1) || '0') + 1}` : 
          'v1',
        history: [
          ...(existingQuestion?.history || []),
          { 
            version: existingQuestion ? 
              `v${parseInt(existingQuestion.version?.substring(1) || '0') + 1}` : 
              'v1',
            date: new Date().toLocaleDateString(),
            author: "Current User",
            changes: existingQuestion ? "Updated question" : "Created question"
          }
        ]
      });
      onClose();
    }
  };

  // Single edit: handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold">
            {isBulk
              ? 'Bulk Edit True/False Questions'
              : (existingQuestion ? 'Edit True/False Question' : 'Create True/False Question')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            {isBulk ? (
              bulkQuestions.map((q, idx) => (
                <div key={q.id || idx} className="mb-8 border-b pb-8">
                  <div className="font-bold mb-2">Question #{idx + 1}</div>
                  {/* Question Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question name*</label>
                    <input
                      type="text"
                      name="title"
                      value={q.title}
                      onChange={e => handleBulkChange(idx, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter a descriptive name"
                    />
                  </div>
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question text*</label>
                    <textarea
                      name="questionText"
                      value={q.questionText}
                      onChange={e => handleBulkChange(idx, e)}
                      className="w-full px-3 py-2 min-h-[120px] border border-gray-300 rounded-md"
                      placeholder="Type your question here..."
                    ></textarea>
                  </div>
                  {/* Default Mark */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default mark</label>
                    <input
                      type="number"
                      name="defaultMark"
                      value={q.defaultMark}
                      onChange={e => handleBulkChange(idx, e)}
                      min="0"
                      step="0.1"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/* Penalty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penalty for each incorrect try</label>
                    <input
                      type="number"
                      name="penalty"
                      value={q.penalty}
                      onChange={e => handleBulkChange(idx, e)}
                      min="0"
                      step="0.1"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/* General Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">General feedback</label>
                    <textarea
                      name="generalFeedback"
                      value={q.generalFeedback}
                      onChange={e => handleBulkChange(idx, e)}
                      className="w-full px-3 py-2 min-h-[80px] border border-gray-300 rounded-md"
                      placeholder="Feedback that shows regardless of the answer chosen"
                    ></textarea>
                  </div>
                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correct answer</label>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          value="true"
                          checked={q.correctAnswer === 'true'}
                          onChange={e => handleBulkChange(idx, e)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">True</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          value="false"
                          checked={q.correctAnswer === 'false'}
                          onChange={e => handleBulkChange(idx, e)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">False</span>
                      </label>
                    </div>
                  </div>
                  {/* Show Instructions */}
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="showInstructions"
                        checked={q.showInstructions}
                        onChange={e => handleBulkChange(idx, e)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show instructions</span>
                    </label>
                  </div>
                  {/* Feedback for responses */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3">Feedback for each response</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">For "True" response</label>
                      <textarea
                        name="feedbackTrue"
                        value={q.feedbackTrue}
                        onChange={e => handleBulkChange(idx, e)}
                        className="w-full px-3 py-2 min-h-[80px] border border-gray-300 rounded-md"
                        placeholder="Feedback shown when student selects 'True'"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">For "False" response</label>
                      <textarea
                        name="feedbackFalse"
                        value={q.feedbackFalse}
                        onChange={e => handleBulkChange(idx, e)}
                        className="w-full px-3 py-2 min-h-[80px] border border-gray-300 rounded-md"
                        placeholder="Feedback shown when student selects 'False'"
                      ></textarea>
                    </div>
                  </div>
                  {/* Question Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question status</label>
                    <select
                      name="status"
                      value={q.status}
                      onChange={e => handleBulkChange(idx, e)}
                      className="w-40 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="draft">Draft</option>
                      <option value="ready">Ready</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Single-question form */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question name*</label>
                  <input
                    type="text"
                    name="title"
                    value={question.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="Enter a descriptive name"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question text*</label>
                  <textarea
                    name="questionText"
                    value={question.questionText}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 min-h-[120px] border ${errors.questionText ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="Type your question here..."
                  ></textarea>
                  {errors.questionText && <p className="mt-1 text-sm text-red-500">{errors.questionText}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default mark</label>
                  <input
                    type="number"
                    name="defaultMark"
                    value={question.defaultMark}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className={`w-24 px-3 py-2 border ${errors.defaultMark ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {errors.defaultMark && <p className="mt-1 text-sm text-red-500">{errors.defaultMark}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penalty for each incorrect try</label>
                  <input
                    type="number"
                    name="penalty"
                    value={question.penalty}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">General feedback</label>
                  <textarea
                    name="generalFeedback"
                    value={question.generalFeedback}
                    onChange={handleChange}
                    className="w-full px-3 py-2 min-h-[80px] border border-gray-300 rounded-md"
                    placeholder="Feedback that shows regardless of the answer chosen"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct answer</label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="true"
                        checked={question.correctAnswer === 'true'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">True</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="false"
                        checked={question.correctAnswer === 'false'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">False</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="showInstructions"
                      checked={question.showInstructions}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show instructions</span>
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Feedback for each response</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">For "True" response</label>
                    <textarea
                      name="feedbackTrue"
                      value={question.feedbackTrue}
                      onChange={handleChange}
                      className="w-full px-3 py-2 min-h-[80px] border border-gray-300 rounded-md"
                      placeholder="Feedback shown when student selects 'True'"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">For "False" response</label>
                    <textarea
                      name="feedbackFalse"
                      value={question.feedbackFalse}
                      onChange={handleChange}
                      className="w-full px-3 py-2 min-h-[80px] border border-gray-300 rounded-md"
                      placeholder="Feedback shown when student selects 'False'"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question status</label>
                  <select
                    name="status"
                    value={question.status}
                    onChange={handleChange}
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="ready">Ready</option>
                  </select>
                </div>
              </>
            )}
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
            onClick={isBulk ? handleBulkSave : handleSubmit}
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

export default CreateTrueFalseQuestion;