import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const defaultChoices = [
  { text: '', grade: 100, feedback: '' },
  { text: '', grade: 0, feedback: '' },
  { text: '', grade: 0, feedback: '' },
  { text: '', grade: 0, feedback: '' }
];

const CreateMultipleChoiceQuestion = ({ question = {}, questions, onClose, onSave, isBulk }) => {
  
  const questionsToEdit = questions || (question ? [question] : []);
const TagDropdown = ({ tags, onTagToggle, isOpen, onToggle, error, availableTags }) => {
  const dropdownRef = useRef();
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => onToggle(true)}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md cursor-pointer bg-white flex items-center justify-between min-h-[42px]`}
      >
        <div className="flex flex-wrap gap-1">
          {tags.length > 0 ? (
            tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {tag}
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onTagToggle(tag); }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500">Select tags...</span>
          )}
        </div>
        <span className="ml-2">▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {availableTags.map(tag => (
            <div
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                tags.includes(tag) ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <span>{tag}</span>
              {tags.includes(tag) && <span className="text-blue-600">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const availableTags = [
  // Difficulty
  'easy', 'medium', 'hard',
  // Core IT Subjects
  'programming', 'algorithms', 'data structures', 'databases', 'networking', 'operating systems',
  'web development', 'software engineering', 'security', 'ai', 'machine learning',
  // Languages/Technologies
  'python', 'java', 'c++', 'javascript', 'html', 'css', 'sql',
  // Assessment context
  'quiz', 'exam', 'assignment', 'practice', 'lab', 'project',
  // Status
  'draft', 'review', 'approved', 'archived'
];
    const [tags, setTags] = useState(question.tags || []);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  
  const [bulkTagDropdowns, setBulkTagDropdowns] = useState({});
  const handleTagToggle = (tag) => {
  setTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );
};

const toggleBulkTagDropdown = (idx) => {
  setBulkTagDropdowns(prev => ({
    ...prev,
    [idx]: !prev[idx]
  }));
};

const handleBulkTagToggle = (idx, tag) => {
  setBulkQuestions(prev =>
    prev.map((q, i) =>
      i === idx
        ? {
            ...q,
            tags: q.tags && q.tags.includes(tag)
              ? q.tags.filter(t => t !== tag)
              : [...(q.tags || []), tag]
          }
        : q
    )
  );
};

  // Bulk edit state
  const [bulkQuestions, setBulkQuestions] = useState(
    isBulk
      ? questionsToEdit.map(q => ({
          ...q,
          title: q.title || '',
          questionText: q.questionText || '',
          defaultMark: q.defaultMark ?? 1,
          penaltyFactor: q.penaltyFactor ?? 0.1,
          generalFeedback: q.generalFeedback || '',
          multipleAnswers: q.multipleAnswers ?? false,
          shuffleAnswers: q.shuffleAnswers ?? true,
          showInstructions: q.showInstructions ?? true,
          choices: q.choices && q.choices.length > 0 ? q.choices : defaultChoices
        }))
      : []
  );
    useEffect(() => {
      setTitle(question.title || '');
      setQuestionText(question.questionText || '');
      setDefaultMark(question.defaultMark ?? 1);
      setPenaltyFactor(question.penaltyFactor ?? 0.1);
      setGeneralFeedback(question.generalFeedback || '');
      setMultipleAnswers(question.multipleAnswers ?? false);
      setShuffleAnswers(question.shuffleAnswers ?? true);
      setShowInstructions(question.showInstructions ?? true);
      setChoices(question.choices && question.choices.length > 0 ? question.choices : defaultChoices);
      setErrors({});
    }, [question.id, isBulk]); 
  // Single edit state
  const [title, setTitle] = useState(question.title || '');
  const [questionText, setQuestionText] = useState(question.questionText || '');
  const [defaultMark, setDefaultMark] = useState(question.defaultMark ?? 1);
  const [penaltyFactor, setPenaltyFactor] = useState(question.penaltyFactor ?? 0.1);
  const [generalFeedback, setGeneralFeedback] = useState(question.generalFeedback || '');
  const [multipleAnswers, setMultipleAnswers] = useState(question.multipleAnswers ?? false);
  const [shuffleAnswers, setShuffleAnswers] = useState(question.shuffleAnswers ?? true);
  const [showInstructions, setShowInstructions] = useState(question.showInstructions ?? true);
  const [choices, setChoices] = useState(question.choices && question.choices.length > 0 ? question.choices : defaultChoices);
  const [errors, setErrors] = useState({});

  // Bulk edit handlers
  const handleBulkChange = (idx, field, value) => {
    setBulkQuestions(prev =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const handleBulkChoiceChange = (qIdx, cIdx, field, value) => {
    setBulkQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const newChoices = [...q.choices];
        newChoices[cIdx][field] = value;
        return { ...q, choices: newChoices };
      })
    );
  };

  const handleBulkAddChoice = (qIdx) => {
    setBulkQuestions(prev =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, choices: [...q.choices, { text: '', grade: 0, feedback: '' }] }
          : q
      )
    );
  };

  const handleBulkRemoveChoice = (qIdx, cIdx) => {
    setBulkQuestions(prev =>
      prev.map((q, i) =>
        i === qIdx && q.choices.length > 2
          ? { ...q, choices: q.choices.filter((_, idx) => idx !== cIdx) }
          : q
      )
    );
  };

  // Bulk edit: Save
  const handleBulkSave = () => {
    if (typeof onSave === 'function') {
      onSave(bulkQuestions);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Single edit handlers
  const addChoice = () => {
    setChoices([...choices, { text: '', grade: 0, feedback: '' }]);
  };

  const removeChoice = (index) => {
    if (choices.length > 2) {
      setChoices(choices.filter((_, i) => i !== index));
    }
  };

  const updateChoice = (index, field, value) => {
    const newChoices = [...choices];
    newChoices[index][field] = value;
    setChoices(newChoices);
  };

  const handleGradeChange = (index, value) => {
    const numValue = parseFloat(value) || 0;
    updateChoice(index, 'grade', numValue);
  };

  // Validation (single)
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Question name is required';
    if (!questionText.trim()) newErrors.questionText = 'Question text is required';
    if (!tags || tags.length === 0) newErrors.tags = 'At least one tag is required';
  
    // Per-choice validation
    const choiceErrors = choices.map((choice, idx) => {
      if (!choice.text.trim()) return 'Choice text is required';
      return null;
    });
    if (choiceErrors.some(Boolean)) newErrors.choices = choiceErrors;
  
    if (!choices.some(choice => choice.grade > 0)) newErrors.grade = 'At least one choice must have a positive grade';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save handler (single)
  const handleSave = () => {
    if (!validate()) return;
    const questionData = {
      title,
      questionText,
      defaultMark,
      penaltyFactor,
      generalFeedback,
      multipleAnswers,
      shuffleAnswers,
      showInstructions,
      choices,
      tags
    };
    if (typeof onSave === 'function') {
      onSave(questionData);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold">
            {isBulk
              ? 'Bulk Edit Multiple Choice Questions'
              : (question && question.id ? 'Edit Multiple Choice Question' : 'Create Multiple Choice Question')}
          </h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question name* <span className="text-red-500">Required</span>
                    </label>
                    <input
                      type="text"
                      value={q.title}
                      onChange={e => handleBulkChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter a descriptive name for this question"
                    />
                  </div>
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question text* <span className="text-red-500">Required</span>
                    </label>
                    <div className="border border-gray-300 rounded-md">
                    {/* Toolbar */}
                    <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">¶</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">A</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔤</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">⋯</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🎥</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">📁</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">
                        <img src="src/assets/icon_text/H5p.svg" className="w-6 h-6" alt="icon" />
                      </button>
                    </div>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                      value={q.questionText}
                      onChange={e => handleBulkChange(idx, 'questionText', e.target.value)}
                      placeholder="Enter the question text here..."
                    />
                  </div>
                  </div>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags/Level*  <span className="text-red-500">Required</span></label>
              <TagDropdown
                tags={q.tags || []}
                onTagToggle={tag => handleBulkTagToggle(idx, tag)}
                isOpen={!!bulkTagDropdowns[idx]}
                onToggle={() => toggleBulkTagDropdown(idx)}
                availableTags={availableTags}
                error={!!(errors.bulkTags && errors.bulkTags[idx])}
              />
              </div>
                  {/* Default Mark and Penalty Factor */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default mark
                      </label>
                      <input
                        type="number"
                        value={q.defaultMark}
                        min="0"
                        step="0.1"
                        onChange={e => handleBulkChange(idx, 'defaultMark', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Penalty factor
                      </label>
                      <input
                        type="number"
                        value={q.penaltyFactor}
                        min="0"
                        max="1"
                        step="0.1"
                        onChange={e => handleBulkChange(idx, 'penaltyFactor', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  {/* General Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      General feedback
                    </label>
                    <div className="border border-gray-300 rounded-md">
                    {/* Toolbar */}
                    <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">¶</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">A</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔤</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">⋯</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🎥</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">📁</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">
                        <img src="src/assets/icon_text/H5p.svg" className="w-6 h-6" alt="icon" />
                      </button>
                    </div>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                      value={q.generalFeedback}
                      onChange={e => handleBulkChange(idx, 'generalFeedback', e.target.value)}
                      placeholder="Optional feedback shown to all students after they answer"
                    />
                  </div>
                  </div>
                  {/* Question Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={q.multipleAnswers}
                          onChange={e => handleBulkChange(idx, 'multipleAnswers', e.target.checked)}
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
                          onChange={e => handleBulkChange(idx, 'shuffleAnswers', e.target.checked)}
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
                          onChange={e => handleBulkChange(idx, 'showInstructions', e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Show standard instructions
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* Answer Choices */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Answer Choices</h3>
                    </div>
                    <div className="space-y-4">
                      {q.choices.map((choice, cIdx) => (
                        <div key={cIdx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-gray-700">Choice {cIdx + 1}</h4>
                            <div className="flex gap-2">
                              {q.choices.length > 2 && (
                                <button
                                  onClick={() => handleBulkRemoveChoice(idx, cIdx)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  type="button"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                              {cIdx === q.choices.length - 1 && (
                                <button
                                  onClick={() => handleBulkAddChoice(idx)}
                                  className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                  type="button"
                                >
                                  <Plus size={14} className="mr-1" />
                                  Add
                                </button>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Answer text  <span className="text-red-500">Required</span>
                            </label>
                            <div className="border border-gray-300 rounded-md">
                    {/* Toolbar */}
                    <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">¶</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">A</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔤</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">⋯</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🎥</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">📁</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">
                        <img src="src/assets/icon_text/H5p.svg" className="w-6 h-6" alt="icon" />
                      </button>
                    </div>
                            <textarea
                              className="w-full px-3 py-2 border rounded-md min-h-[60px]"
                              value={choice.text}
                              onChange={e => handleBulkChoiceChange(idx, cIdx, 'text', e.target.value)}
                              placeholder={`Enter choice ${cIdx + 1} text...`}
                            />
                          </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Grade (%)
                            </label>
                            <input
                              type="number"
                              value={choice.grade}
                              onChange={e => handleBulkChoiceChange(idx, cIdx, 'grade', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border rounded-md"
                              min="-100"
                              max="100"
                              step="0.1"
                            />
                          </div>
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Feedback for this choice
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border rounded-md"
                              value={choice.feedback}
                              onChange={e => handleBulkChoiceChange(idx, cIdx, 'feedback', e.target.value)}
                              placeholder="Optional feedback for this choice..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Grading Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-blue-800 mb-2">Grading Information</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• For single answer questions: One choice should have 100% grade</p>
                      <p>• For multiple answer questions: Positive grades should add up to 100%</p>
                      <p>• Use negative grades to penalize incorrect choices</p>
                      <p>
                        • Current total of positive grades: {q.choices.filter(c => c.grade > 0).reduce((sum, c) => sum + c.grade, 0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Validation errors */}
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-100 border border-red-300 text-red-700 rounded p-3 mb-4">
                    {Object.values(errors).map((msg, i) =>
                      Array.isArray(msg)
                        ? msg.map((m, j) => m && <div key={j}>{m}</div>)
                        : <div key={i}>{msg}</div>
                    )}
                  </div>
                )}
                {/* Single-question form (your existing code) */}
                {/* ...keep your current single-question form here... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question name* <span className="text-red-500">Required</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter a descriptive name for this question"
                  />
                  {errors.title && (
                    <div className="text-red-600 text-xs mt-1">{errors.title}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question text* <span className="text-red-500">Required</span>
                  </label>
                  <div className="border border-gray-300 rounded-md">
                    {/* Toolbar */}
                    <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">¶</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">A</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔤</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">⋯</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🎥</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">📁</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">
                        <img src="src/assets/icon_text/H5p.svg" className="w-6 h-6" alt="icon" />
                      </button>
                    </div>
                  <textarea
                    className={`w-full px-3 py-2 border rounded-md min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.questionText ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    placeholder="Enter the question text here..."
                  />
                  {errors.questionText && (
                    <div className="text-red-600 text-xs mt-1">{errors.questionText}</div>
                  )}
                </div>
                </div>
                    {/* tag/level */}
                 <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags/Level* <span className="text-red-500">Required</span>
                  </label>
                  <TagDropdown
                    tags={tags}
                    onTagToggle={handleTagToggle}
                    isOpen={tagDropdownOpen}
                    onToggle={() => setTagDropdownOpen(open => !open)}
                    availableTags={availableTags}
                    error={!!errors.tags}
                  />
                  {errors.tags && (
                    <div className="text-red-600 text-xs mt-1">{errors.tags}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default mark
                    </label>
                    <input
                      type="number"
                      value={defaultMark}
                      min="0"
                      step="0.1"
                      onChange={e => setDefaultMark(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penalty factor
                    </label>
                    <input
                      type="number"
                      value={penaltyFactor}
                      min="0"
                      max="1"
                      step="0.1"
                      onChange={e => setPenaltyFactor(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    General feedback
                  </label>
                  <div className="border border-gray-300 rounded-md">
                    {/* Toolbar */}
                    <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">¶</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">A</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔤</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">⋯</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🎥</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">📁</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">
                        <img src="src/assets/icon_text/H5p.svg" className="w-6 h-6" alt="icon" />
                      </button>
                    </div>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={generalFeedback}
                    onChange={e => setGeneralFeedback(e.target.value)}
                    placeholder="Optional feedback shown to all students after they answer"
                  />
                </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={multipleAnswers}
                        onChange={e => setMultipleAnswers(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Multiple answers allowed
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={shuffleAnswers}
                        onChange={e => setShuffleAnswers(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Shuffle the choices
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showInstructions}
                        onChange={e => setShowInstructions(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Show standard instructions
                      </span>
                    </label>
                  </div>
                </div>
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
                                onClick={() => removeChoice(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                                type="button"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            {index === choices.length - 1 && (
                              <button
                                onClick={addChoice}
                                className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                type="button"
                              >
                                <Plus size={14} className="mr-1" />
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Answer text  <span className="text-red-500">Required</span>
                          </label>
                          <div className="border border-gray-300 rounded-md">
                    {/* Toolbar */}
                    <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">¶</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm underline">U</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">A</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔤</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">⋯</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🔗</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🖼️</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">🎥</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">📁</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-sm">
                        <img src="src/assets/icon_text/H5p.svg" className="w-6 h-6" alt="icon" />
                      </button>
                    </div>
                          <textarea
                            className={`w-full px-3 py-2 border rounded-md min-h-[60px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.choices && errors.choices[index] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            value={choice.text}
                            onChange={e => updateChoice(index, 'text', e.target.value)}
                            placeholder={`Enter choice ${index + 1} text...`}
                          />
                          {errors.choices && errors.choices[index] && (
                            <div className="text-red-600 text-xs mt-1">{errors.choices[index]}</div>
                          )}
                        </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Grade (%)
                          </label>
                          <input
                            type="number"
                            value={choice.grade}
                            onChange={e => handleGradeChange(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="-100"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Feedback for this choice
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={choice.feedback}
                            onChange={e => updateChoice(index, 'feedback', e.target.value)}
                            placeholder="Optional feedback for this choice..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Grading Information</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• For single answer questions: One choice should have 100% grade</p>
                    <p>• For multiple answer questions: Positive grades should add up to 100%</p>
                    <p>• Use negative grades to penalize incorrect choices</p>
                    <p>• Current total of positive grades: {choices.filter(c => c.grade > 0).reduce((sum, c) => sum + c.grade, 0)}%</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center transition-colors"
            onClick={isBulk ? handleBulkSave : handleSave}
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMultipleChoiceQuestion;