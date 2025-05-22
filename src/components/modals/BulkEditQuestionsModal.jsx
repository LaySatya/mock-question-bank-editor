import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

// True/False bulk edit form styled like TrueFalseQuestionDemo
function BulkEditTrueFalse({ questions, onClose, onSave }) {
  const [editedQuestions, setEditedQuestions] = useState(
    questions.map(q => ({
      ...q,
      defaultMark: q.defaultMark ?? 1,
      feedbackTrue: q.feedbackTrue || '',
      feedbackFalse: q.feedbackFalse || ''
    }))
  );

  return (
    <div className="max-w-3xl mx-auto border border-gray-300 rounded-lg shadow-lg w-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-semibold">Bulk Edit True/False Questions</h2>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      {/* Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto space-y-8">
        {editedQuestions.map((q, idx) => (
          <div key={q.id} className="border rounded p-4 bg-gray-50">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question name*</label>
                <input
                  type="text"
                  value={q.title}
                  onChange={e => {
                    const updated = [...editedQuestions];
                    updated[idx].title = e.target.value;
                    setEditedQuestions(updated);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question text*</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[120px]"
                  value={q.questionText}
                  onChange={e => {
                    const updated = [...editedQuestions];
                    updated[idx].questionText = e.target.value;
                    setEditedQuestions(updated);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default mark</label>
                <input
                  type="number"
                  value={q.defaultMark}
                  min="0"
                  step="0.1"
                  onChange={e => {
                    const updated = [...editedQuestions];
                    updated[idx].defaultMark = Number(e.target.value);
                    setEditedQuestions(updated);
                  }}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correct answer</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={q.correctAnswer === 'true'}
                      onChange={() => {
                        const updated = [...editedQuestions];
                        updated[idx].correctAnswer = 'true';
                        setEditedQuestions(updated);
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">True</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={q.correctAnswer === 'false'}
                      onChange={() => {
                        const updated = [...editedQuestions];
                        updated[idx].correctAnswer = 'false';
                        setEditedQuestions(updated);
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">False</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Feedback for each response</h3>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">For "True" response:</label>
                  <input
                    className="w-full border rounded p-2"
                    value={q.feedbackTrue}
                    onChange={e => {
                      const updated = [...editedQuestions];
                      updated[idx].feedbackTrue = e.target.value;
                      setEditedQuestions(updated);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">For "False" response:</label>
                  <input
                    className="w-full border rounded p-2"
                    value={q.feedbackFalse}
                    onChange={e => {
                      const updated = [...editedQuestions];
                      updated[idx].feedbackFalse = e.target.value;
                      setEditedQuestions(updated);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          onClick={() => onSave(editedQuestions)}
        >
          <Save size={16} className="mr-2" />
          Save All Changes
        </button>
      </div>
    </div>
  );
}


// Multiple Choice bulk edit form (simple version)
function BulkEditMultipleChoice({ questions, onClose, onSave }) {
  const [editedQuestions, setEditedQuestions] = useState(
    questions.map(q => ({ ...q }))
  );
  return (
    <div>
      {editedQuestions.map((q, idx) => (
        <div key={q.id} className="border rounded p-4 bg-gray-50 mb-4">
          <div className="font-semibold mb-2">{q.title || `Question #${q.id}`}</div>
          <label className="block mb-1 font-medium">Status:</label>
          <select
            className="w-full border rounded p-2 mb-2"
            value={q.status}
            onChange={e => {
              const updated = [...editedQuestions];
              updated[idx].status = e.target.value;
              setEditedQuestions(updated);
            }}
          >
            <option value="ready">Ready</option>
            <option value="draft">Draft</option>
          </select>
          <label className="block mb-1 font-medium">Question Text:</label>
          <input
            className="w-full border rounded p-2 mb-2"
            value={q.questionText}
            onChange={e => {
              const updated = [...editedQuestions];
              updated[idx].questionText = e.target.value;
              setEditedQuestions(updated);
            }}
          />
          {/* Add more MCQ fields as needed */}
        </div>
      ))}
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onSave(editedQuestions)}
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
}

const BulkEditQuestionsModal = ({ questions, onClose, onSave }) => {
  // Assume all selected questions are the same type
  const type = questions[0]?.questionType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl pointer-events-auto p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Edit {questions.length} Questions ({type === 'truefalse' ? 'True/False' : type === 'multiple' ? 'Multiple Choice' : type})
        </h2>
        {type === 'truefalse' && (
          <BulkEditTrueFalse questions={questions} onClose={onClose} onSave={onSave} />
        )}
        {type === 'multiple' && (
          <BulkEditMultipleChoice questions={questions} onClose={onClose} onSave={onSave} />
        )}
        {/* Add more types as needed */}
      </div>
    </div>
  );
};

export default BulkEditQuestionsModal;