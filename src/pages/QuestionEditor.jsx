import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Save, X, Plus, Trash2, AlertCircle, Info 
} from 'lucide-react';

const QuestionEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Comprehensive mock data for questions
  const mockQuestions = [
    {
      id: 1,
      questiontext: "What is the capital of France?",
      category: "Geography",
      type: "Multiple Choice",
      difficulty: "Easy",
      tags: ["Europe", "Capitals"],
      options: ['Paris', 'London', 'Berlin', 'Rome'],
      correctAnswer: 'Paris'
    },
    {
      id: 2,
      questiontext: "Water boils at 100 degrees Celsius at sea level.",
      category: "Science",
      type: "True/False",
      difficulty: "Easy",
      tags: ["Physics", "Matter"],
      correctAnswer: 'True'
    },
    {
      id: 3,
      questiontext: "Explain the process of photosynthesis.",
      category: "Science",
      type: "Essay",
      difficulty: "Medium",
      tags: ["Biology", "Plants"],
      correctAnswer: ''
    },
    {
      id: 4,
      questiontext: "Solve for x: 3x + 7 = 22",
      category: "Mathematics",
      type: "Short Answer",
      difficulty: "Medium",
      tags: ["Algebra", "Equations"],
      correctAnswer: '5'
    },
    {
      id: 5,
      questiontext: "HTML stands for ___________.",
      category: "Computer Science",
      type: "Fill in the Blank",
      difficulty: "Easy",
      tags: ["Web Development", "Programming"],
      correctAnswer: 'Hypertext Markup Language'
    }
  ];

  // Comprehensive dropdown options
  const categoriesDropdown = [
    'Select Category',
    'Geography', 
    'Science', 
    'Mathematics', 
    'Computer Science', 
    'Language Arts',
    'History',
    'Literature',
    'Physics',
    'Chemistry',
    'Biology'
  ];

  const questionTypesDropdown = [
    'Select Question Type',
    'Multiple Choice', 
    'True/False', 
    'Short Answer', 
    'Essay', 
    'Fill in the Blank'
  ];

  const difficultiesDropdown = [
    'Select Difficulty',
    'Easy', 
    'Medium', 
    'Hard'
  ];

  // State management
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);

  // Extract question IDs from navigation state
  const { questionIds = [] } = location.state || {};

  // Fetch questions on component mount
  useEffect(() => {
    // Filter questions based on passed IDs
    const filteredQuestions = mockQuestions
      .filter(q => questionIds.includes(q.id))
      .map(q => ({ 
        ...q, 
        originalQuestion: { ...q },
        tempId: `temp-${q.id}` // Add unique temp ID for React key
      }));

    // Set questions
    setQuestions(filteredQuestions);
  }, [questionIds]);

  // Comprehensive input change handler
  const handleInputChange = (tempId, field, value) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.tempId === tempId 
          ? { 
              ...q, 
              [field]: value,
              isModified: true 
            } 
          : q
      )
    );
    setIsModified(true);
    
    // Clear any existing errors for this field
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[`${tempId}-${field}`];
      return newErrors;
    });
  };

  // Option management for Multiple Choice
  const handleAddOption = (tempId) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.tempId === tempId 
          ? { 
              ...q, 
              options: [...(q.options || []), ''], 
              isModified: true 
            } 
          : q
      )
    );
    setIsModified(true);
  };

  const handleRemoveOption = (tempId, index) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.tempId === tempId 
          ? { 
              ...q, 
              options: q.options.filter((_, i) => i !== index),
              isModified: true 
            } 
          : q
      )
    );
    setIsModified(true);
  };

  // Validation logic
  const validateQuestions = () => {
    const newErrors = {};

    questions.forEach(q => {
      // Question text validation
      if (!q.questiontext || q.questiontext.trim() === '') {
        newErrors[`${q.tempId}-questiontext`] = 'Question text is required';
      }

      // Category validation
      if (!q.category || q.category === 'Select Category') {
        newErrors[`${q.tempId}-category`] = 'Please select a category';
      }

      // Type validation
      if (!q.type || q.type === 'Select Question Type') {
        newErrors[`${q.tempId}-type`] = 'Please select a question type';
      }

      // Difficulty validation
      if (!q.difficulty || q.difficulty === 'Select Difficulty') {
        newErrors[`${q.tempId}-difficulty`] = 'Please select difficulty';
      }

      // Type-specific validations
      switch(q.type) {
        case 'Multiple Choice':
          if (!q.options || q.options.length < 2) {
            newErrors[`${q.tempId}-options`] = 'At least two options are required';
          }
          if (!q.correctAnswer) {
            newErrors[`${q.tempId}-correctAnswer`] = 'Please select a correct answer';
          }
          break;
        case 'True/False':
          if (!q.correctAnswer) {
            newErrors[`${q.tempId}-correctAnswer`] = 'Please select True or False';
          }
          break;
        case 'Short Answer':
        case 'Fill in the Blank':
          if (!q.correctAnswer) {
            newErrors[`${q.tempId}-correctAnswer`] = 'Correct answer is required';
          }
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save handler
  const handleSave = () => {
    // Validate first
    if (!validateQuestions()) {
      alert('Please correct the errors before saving.');
      return;
    }

    // Prepare data for saving (remove temp fields)
    const questionsToSave = questions.map(({ 
      tempId, 
      originalQuestion, 
      isModified, 
      ...rest 
    }) => rest);

    // Mock save logic (replace with actual API call)
    console.log('Saving questions:', questionsToSave);
    alert('Questions saved successfully!');
    
    // Navigate back to question bank
    navigate('/question-bank');
  };

  // Render method
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Edit {questions.length} Question{questions.length > 1 ? 's' : ''}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/question-bank')}
            className="btn btn-ghost flex items-center"
          >
            <X size={16} className="mr-2" /> Cancel
          </button>
          <button
            onClick={handleSave}
            className={`btn btn-primary flex items-center ${!isModified ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isModified}
          >
            <Save size={16} className="mr-2" /> Save Changes
          </button>
        </div>
      </div>

      {/* Questions Editor */}
      {questions.map((question) => (
        <div 
          key={question.tempId} 
          className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
        >
          {/* Question Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              value={question.questiontext}
              onChange={(e) => handleInputChange(question.tempId, 'questiontext', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 
                ${errors[`${question.tempId}-questiontext`] ? 'border-red-500' : ''}`}
              rows={3}
              placeholder="Enter your question text"
            />
            {errors[`${question.tempId}-questiontext`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`${question.tempId}-questiontext`]}
              </p>
            )}
          </div>

          {/* Category, Type, Difficulty Row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={question.category}
                onChange={(e) => handleInputChange(question.tempId, 'category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500
                  ${errors[`${question.tempId}-category`] ? 'border-red-500' : ''}`}
              >
                {categoriesDropdown.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors[`${question.tempId}-category`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`${question.tempId}-category`]}
                </p>
              )}
            </div>

            {/* Question Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={question.type}
                onChange={(e) => handleInputChange(question.tempId, 'type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500
                  ${errors[`${question.tempId}-type`] ? 'border-red-500' : ''}`}
              >
                {questionTypesDropdown.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors[`${question.tempId}-type`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`${question.tempId}-type`]}
                </p>
              )}
            </div>

            {/* Difficulty Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={question.difficulty}
                onChange={(e) => handleInputChange(question.tempId, 'difficulty', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500
                  ${errors[`${question.tempId}-difficulty`] ? 'border-red-500' : ''}`}
              >
                {difficultiesDropdown.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
              {errors[`${question.tempId}-difficulty`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`${question.tempId}-difficulty`]}
                </p>
              )}
            </div>
          </div>

          {/* Tags Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={question.tags.join(', ')}
              onChange={(e) => handleInputChange(
                question.tempId, 
                'tags', 
                e.target.value.split(',').map(tag => tag.trim())
              )}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter tags (e.g., Science, Physics)"
            />
          </div>

          {/* Question Type Specific Sections */}
          {question.type === 'Multiple Choice' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[index] = e.target.value;
                      handleInputChange(question.tempId, 'options', newOptions);
                    }}
                    className={`w-full px-3 py-2 border rounded-md mr-2 focus:ring-blue-500
                      ${errors[`${question.tempId}-options`] ? 'border-red-500' : ''}`}
                    placeholder={`Option ${index + 1}`}
                  />
                  {question.options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(question.tempId, index)}
                      className="btn btn-ghost btn-sm text-red-500"
                      aria-label="Remove option"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {errors[`${question.tempId}-options`] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`${question.tempId}-options`]}
                </p>
              )}
              <button 
                onClick={() => handleAddOption(question.tempId)}
                className="btn btn-outline btn-sm mt-2 flex items-center"
              >
                <Plus size={16} className="mr-2" /> Add Option
              </button>
            </div>
          )}

          {/* Correct Answer Section */}
          {['Multiple Choice', 'True/False', 'Short Answer', 'Fill in the Blank'].includes(question.type) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer
              </label>
              {question.type === 'Multiple Choice' ? (
                <select
                value={question.correctAnswer}
                onChange={(e) => handleInputChange(question.tempId, 'correctAnswer', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500
                  ${errors[`${question.tempId}-correctAnswer`] ? 'border-red-500' : ''}`}
              >
                <option value="">Select Correct Answer</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : question.type === 'True/False' ? (
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="True"
                    checked={question.correctAnswer === 'True'}
                    onChange={() => handleInputChange(question.tempId, 'correctAnswer', 'True')}
                    className="form-radio"
                  />
                  <span className="ml-2">True</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="False"
                    checked={question.correctAnswer === 'False'}
                    onChange={() => handleInputChange(question.tempId, 'correctAnswer', 'False')}
                    className="form-radio"
                  />
                  <span className="ml-2">False</span>
                </label>
              </div>
            ) : (
              <input
                type="text"
                value={question.correctAnswer || ''}
                onChange={(e) => handleInputChange(question.tempId, 'correctAnswer', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500
                  ${errors[`${question.tempId}-correctAnswer`] ? 'border-red-500' : ''}`}
                placeholder="Enter correct answer"
              />
            )}
            {errors[`${question.tempId}-correctAnswer`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`${question.tempId}-correctAnswer`]}
              </p>
            )}
          </div>
        )}

        {/* Additional Notes/Explanation for Essay Questions */}
        {question.type === 'Essay' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grading Guidelines/Key Points (Optional)
            </label>
            <textarea
              value={question.correctAnswer || ''}
              onChange={(e) => handleInputChange(question.tempId, 'correctAnswer', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500"
              rows={4}
              placeholder="Provide key points or grading criteria for the essay question"
            />
          </div>
        )}
      </div>
    ))}

    {/* Error Summary */}
    {Object.keys(errors).length > 0 && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
        <AlertCircle className="text-red-500 mr-3 mt-1" size={24} />
        <div>
          <h3 className="text-red-800 font-semibold mb-2">
            Please correct the following errors:
          </h3>
          <ul className="list-disc list-inside text-red-700">
            {Object.entries(errors).map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    )}

    {/* Additional Information */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
      <Info className="text-blue-500 mr-3 mt-1" size={24} />
      <div>
        <h3 className="text-blue-800 font-semibold mb-2">
          Tips for Creating Effective Questions
        </h3>
        <ul className="list-disc list-inside text-blue-700">
          <li>Ensure question text is clear and concise</li>
          <li>Choose appropriate difficulty level</li>
          <li>Provide accurate correct answers</li>
          <li>Use meaningful tags for easy categorization</li>
        </ul>
      </div>
    </div>
  </div>
);
};

export default QuestionEditor;