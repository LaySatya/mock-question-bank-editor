import React, { useState } from 'react';
import { X, ChevronDown, AlertTriangle, CheckCircle, Save } from 'lucide-react';

const CreateTrueFalseQuestion = ({ onClose, onSave, existingQuestion = null }) => {
  // Initialize state with existing question data or defaults
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
  
  const [errors, setErrors] = useState({});
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!question.title.trim()) newErrors.title = "Question name is required";
    if (!question.questionText.trim()) newErrors.questionText = "Question text is required";
    if (question.defaultMark <= 0) newErrors.defaultMark = "Default mark must be greater than 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
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
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle rich text editor changes (simplified - you'd integrate your actual editor)
  const handleRichTextChange = (name, content) => {
    setQuestion(prev => ({
      ...prev,
      [name]: content
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold">
            {existingQuestion ? 'Edit True/False Question' : 'Create True/False Question'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Question Name */}
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

            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question text*</label>
              <div className={`border ${errors.questionText ? 'border-red-500' : 'border-gray-300'} rounded-md`}>
                {/* Toolbar (simplified) */}
                <div className="flex items-center p-1 border-b border-gray-300 bg-gray-50">
                  <select className="border-none bg-transparent px-2 py-1 mr-1 text-sm">
                    <option>Paragraph</option>
                  </select>
                  <div className="border-r border-gray-300 mx-1 h-6"></div>
                  <button className="p-1 hover:bg-gray-200 rounded">B</button>
                  <button className="p-1 hover:bg-gray-200 rounded">I</button>
                  <button className="p-1 hover:bg-gray-200 rounded">U</button>
                </div>
                
                {/* Editor area */}
                <textarea
                  name="questionText"
                  value={question.questionText}
                  onChange={handleChange}
                  className="w-full px-3 py-2 min-h-[120px] focus:outline-none"
                  placeholder="Type your question here..."
                ></textarea>
              </div>
              {errors.questionText && <p className="mt-1 text-sm text-red-500">{errors.questionText}</p>}
            </div>
            
            {/* Default Mark */}
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
            
            {/* Penalty */}
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
            
            {/* General Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General feedback</label>
              <div className="border border-gray-300 rounded-md">
                {/* Simplified toolbar */}
                <div className="flex items-center p-1 border-b border-gray-300 bg-gray-50">
                  <select className="border-none bg-transparent px-2 py-1 mr-1 text-sm">
                    <option>Paragraph</option>
                  </select>
                  <div className="border-r border-gray-300 mx-1 h-6"></div>
                  <button className="p-1 hover:bg-gray-200 rounded">B</button>
                  <button className="p-1 hover:bg-gray-200 rounded">I</button>
                  <button className="p-1 hover:bg-gray-200 rounded">U</button>
                </div>
                
                {/* Editor area */}
                <textarea
                  name="generalFeedback"
                  value={question.generalFeedback}
                  onChange={handleChange}
                  className="w-full px-3 py-2 min-h-[80px] focus:outline-none"
                  placeholder="Feedback that shows regardless of the answer chosen"
                ></textarea>
              </div>
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
            
            {/* Show Instructions */}
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
            
            {/* Feedback for responses */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Feedback for each response</h3>
              
              {/* Feedback for True */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">For "True" response</label>
                <div className="border border-gray-300 rounded-md">
                  {/* Simplified toolbar */}
                  <div className="flex items-center p-1 border-b border-gray-300 bg-gray-50">
                    <select className="border-none bg-transparent px-2 py-1 mr-1 text-sm">
                      <option>Paragraph</option>
                    </select>
                    <div className="border-r border-gray-300 mx-1 h-6"></div>
                    <button className="p-1 hover:bg-gray-200 rounded">B</button>
                    <button className="p-1 hover:bg-gray-200 rounded">I</button>
                    <button className="p-1 hover:bg-gray-200 rounded">U</button>
                  </div>
                  
                  {/* Editor area */}
                  <textarea
                    name="feedbackTrue"
                    value={question.feedbackTrue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 min-h-[80px] focus:outline-none"
                    placeholder="Feedback shown when student selects 'True'"
                  ></textarea>
                </div>
              </div>
              
              {/* Feedback for False */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">For "False" response</label>
                <div className="border border-gray-300 rounded-md">
                  {/* Simplified toolbar */}
                  <div className="flex items-center p-1 border-b border-gray-300 bg-gray-50">
                    <select className="border-none bg-transparent px-2 py-1 mr-1 text-sm">
                      <option>Paragraph</option>
                    </select>
                    <div className="border-r border-gray-300 mx-1 h-6"></div>
                    <button className="p-1 hover:bg-gray-200 rounded">B</button>
                    <button className="p-1 hover:bg-gray-200 rounded">I</button>
                    <button className="p-1 hover:bg-gray-200 rounded">U</button>
                  </div>
                  
                  {/* Editor area */}
                  <textarea
                    name="feedbackFalse"
                    value={question.feedbackFalse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 min-h-[80px] focus:outline-none"
                    placeholder="Feedback shown when student selects 'False'"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Question Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question status</label>
              <div className="relative">
                <button 
                  className="border rounded px-3 py-2 bg-white flex items-center justify-between w-40"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <span className="flex items-center">
                    {question.status === 'ready' ? (
                      <><CheckCircle size={16} className="mr-2 text-green-600" /> Ready</>
                    ) : (
                      <><AlertTriangle size={16} className="mr-2 text-amber-600" /> Draft</>
                    )}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute left-0 mt-1 w-40 bg-white rounded shadow-lg z-10 border border-gray-200">
                    <button
                      onClick={() => {
                        setQuestion(prev => ({ ...prev, status: 'ready' }));
                        setShowStatusDropdown(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      <CheckCircle size={16} className="mr-2 text-green-600" />
                      Ready
                    </button>
                    <button
                      onClick={() => {
                        setQuestion(prev => ({ ...prev, status: 'draft' }));
                        setShowStatusDropdown(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      <AlertTriangle size={16} className="mr-2 text-amber-600" />
                      Draft
                    </button>
                  </div>
                )}
              </div>
            </div>
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
                onClick={handleSubmit}
                className=" btn px-4 py-2 bg-blue-500 text-white  hover:bg-blue-600 flex items-center"
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