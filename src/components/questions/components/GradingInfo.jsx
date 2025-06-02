// components/questions/components/GradingInfo.jsx
import React from 'react';

const GradingInfo = ({ choices }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h4 className="font-medium text-blue-800 mb-2">Grading Information</h4>
    <div className="text-sm text-blue-700 space-y-1">
      <p>• For single answer questions: One choice should have 100% grade</p>
      <p>• For multiple answer questions: Positive grades should add up to 100%</p>
      <p>• Use negative grades to penalize incorrect choices</p>
      <p>
        • Current total of positive grades: {choices.filter(c => c.grade > 0).reduce((sum, c) => sum + c.grade, 0)}%
      </p>
    </div>
  </div>
);

export default GradingInfo;

// components/questions/components/index.js
// This file exports all components from one place
export { TagDropdown, TextEditor, FormField, NumberInput, RadioGroup, Checkbox, Select, ValidationErrors, LoadingSpinner, Card, Badge } from './SharedComponents';
export { default as QuestionSettings } from './QuestionSettings';
export { default as ChoiceEditor } from './ChoiceEditor';
export { default as GradingInfo } from './GradingInfo';