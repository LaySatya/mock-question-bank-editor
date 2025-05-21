import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const TrueFalseQuestionDemo = ({ question = {}, onClose, onSave }) => {
  const [title, setTitle] = useState(question.title || '');
  const [questionText, setQuestionText] = useState(question.questionText || '');
  const [defaultMark, setDefaultMark] = useState(question.defaultMark ?? 1);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || 'true');
  const [feedbackTrue, setFeedbackTrue] = useState(question.feedbackTrue || '');
  const [feedbackFalse, setFeedbackFalse] = useState(question.feedbackFalse || '');

  return (
    <div className="max-w-3xl mx-auto border border-gray-300 rounded-lg shadow-lg w-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-semibold">True/False Question</h2>
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      {/* Content */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question name*</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question text*</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[120px]"
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default mark</label>
            <input
              type="number"
              value={defaultMark}
              min="0"
              step="0.1"
              onChange={e => setDefaultMark(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correct answer</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={correctAnswer === 'true'}
                  onChange={() => setCorrectAnswer('true')}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2">True</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={correctAnswer === 'false'}
                  onChange={() => setCorrectAnswer('false')}
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
                value={feedbackTrue}
                onChange={e => setFeedbackTrue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">For "False" response:</label>
              <input
                className="w-full border rounded p-2"
                value={feedbackFalse}
                onChange={e => setFeedbackFalse(e.target.value)}
              />
            </div>
          </div>
        </div>
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
          onClick={() => {
            if (typeof onSave === 'function')
              onSave({
                ...question,
                title,
                questionText,
                defaultMark,
                correctAnswer,
                feedbackTrue,
                feedbackFalse
              });
            onClose();
          }}
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuestionDemo;