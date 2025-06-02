// components/questions/components/ChoiceEditor.jsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TextEditor, FormField } from './SharedComponents';

const ChoiceEditor = ({ choices, onUpdateChoice, onAddChoice, onRemoveChoice, errors = [], isBulk = false }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-700">Answer Choices</h3>
    </div>
    <div className="space-y-4">
      {choices.map((choice, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-700">Choice {index + 1}</h4>
            <div className="flex gap-2">
              {choices.length > 2 && (
                <button
                  onClick={() => onRemoveChoice(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {index === choices.length - 1 && (
                <button
                  onClick={onAddChoice}
                  className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  type="button"
                >
                  <Plus size={14} className="mr-1" />
                  Add
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <FormField 
              label="Answer text" 
              required 
              error={errors && errors[index]}
            >
              <TextEditor
                value={choice.text}
                onChange={value => onUpdateChoice(index, 'text', value)}
                placeholder={`Enter choice ${index + 1} text...`}
                error={errors && errors[index]}
                minHeight="60px"
              />
            </FormField>
          </div>
          
          <div className="mb-3">
            <FormField label="Grade (%)">
              <input
                type="number"
                value={choice.grade}
                onChange={e => onUpdateChoice(index, 'grade', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="-100"
                max="100"
                step="0.1"
              />
            </FormField>
          </div>
          
          <FormField label="Feedback for this choice">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={choice.feedback}
              onChange={e => onUpdateChoice(index, 'feedback', e.target.value)}
              placeholder="Optional feedback for this choice..."
            />
          </FormField>
        </div>
      ))}
    </div>
  </div>
);

export default ChoiceEditor;