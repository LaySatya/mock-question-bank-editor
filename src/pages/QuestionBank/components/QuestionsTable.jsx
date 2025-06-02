// components/QuestionsTable.jsx
import React from 'react';
import { ChevronDown, Edit, Eye, Copy, Clock, Trash, CheckCircle, AlertTriangle } from 'lucide-react';

const QuestionsTable = ({
  questions,
  filteredQuestions,
  selectedQuestions,
  setSelectedQuestions,
  showQuestionText,
  editingQuestion,
  setEditingQuestion,
  newQuestionTitle,
  setNewQuestionTitle,
  setShowSaveConfirm,
  openActionDropdown,
  setOpenActionDropdown,
  openStatusDropdown,
  setOpenStatusDropdown,
  dropdownRefs,
  onPreview,
  onEdit,
  onDuplicate,
  onHistory,
  onDelete,
  onStatusChange,
  username
}) => {
  const getQuestionTypeIcon = (type) => {
    switch(type) {
      case 'multiple': return <img src="/src/assets/icon/Multiple-choice.svg" className="w-6 h-6" alt="icon" />;
      case 'matching': return <img src="/src/assets/icon/Matching.svg" className="w-6 h-6" alt="icon" />;
      case 'essay': return <img src="/src/assets/icon/Essay.svg" className="w-6 h-6" alt="icon" />;
      case 'shortanswer': return <img src="/src/assets/icon/Short-answer.svg" className="w-6 h-6" alt="icon" />;
      case 'truefalse': return <img src="/src/assets/icon/True-False.svg" className="w-6 h-6" alt="icon" />;
      default: return <span className="w-6 h-6 inline-block">•</span>;
    }
  };

  const getTagColor = (tag) => {
    // Difficulty tags
    if (['easy'].includes(tag)) return 'bg-green-100 text-green-800';
    if (['medium'].includes(tag)) return 'bg-yellow-100 text-yellow-800';
    if (['hard'].includes(tag)) return 'bg-red-100 text-red-800';
    
    // Subject tags
    if (['programming', 'algorithms', 'data structures'].includes(tag)) return 'bg-purple-100 text-purple-800';
    if (['databases', 'sql'].includes(tag)) return 'bg-indigo-100 text-indigo-800';
    if (['networking', 'security'].includes(tag)) return 'bg-orange-100 text-orange-800';
    if (['web development', 'html', 'css', 'javascript'].includes(tag)) return 'bg-blue-100 text-blue-800';
    if (['operating systems'].includes(tag)) return 'bg-gray-100 text-gray-800';
    
    // Technology tags
    if (['python', 'java', 'c++'].includes(tag)) return 'bg-cyan-100 text-cyan-800';
    
    // Assessment type tags
    if (['quiz', 'practice'].includes(tag)) return 'bg-teal-100 text-teal-800';
    if (['exam', 'assignment'].includes(tag)) return 'bg-pink-100 text-pink-800';
    if (['lab', 'project'].includes(tag)) return 'bg-emerald-100 text-emerald-800';
    
    // Default
    return 'bg-gray-100 text-gray-600';
  };

  const toggleQuestionSelection = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const startEditingTitle = (question) => {
    setEditingQuestion(question.id);
    setNewQuestionTitle(question.title);
  };

  const initiateQuestionSave = (questionId) => {
    if (newQuestionTitle.trim() === '') return;
    setShowSaveConfirm(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b px-2 py-2 text-center">
              <input 
                type="checkbox"
                className="h-4 w-4"
                onChange={handleSelectAll}
                checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
              />
            </th>
            <th className="border-b px-4 py-2 text-left font-medium text-blue-500">
              <div className="flex items-center">
                <span>T</span>
                <span className="text-gray-500">▲</span>
                <span className="ml-2">Actions</span>
              </div>
            </th>
            <th className="border-b px-4 py-2 text-left font-medium">
              <div>
                Question
                <div className="text-xs font-normal text-gray-600">
                  Question name / ID number
                </div>
              </div>
            </th>
            <th className="border-b px-4 py-2 text-left font-medium">Status</th>
            <th className="border-b px-4 py-2 text-left font-medium">Version</th>
            <th className="border-b px-4 py-2 text-left font-medium">
              <div>
                Created by
                <div className="text-xs font-normal text-blue-500">
                  First name / Surname / Date
                </div>
              </div>
            </th>
            <th className="border-b px-4 py-2 text-center font-medium">Comments</th>
            <th className="border-b px-4 py-2 text-center font-medium">Usage</th>
            <th className="border-b px-4 py-2 text-left font-medium">
              <div className="flex items-center">
                Last used
                <span className="ml-2 text-blue-500 bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">?</span>
              </div>
            </th>
            <th className="border-b px-4 py-2 text-left font-medium">
              <div>
                Modified by
                <div className="text-xs font-normal text-blue-500">
                  First name / Surname / Date
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border-b px-2 py-3 text-center">
                <input 
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedQuestions.includes(question.id)}
                  onChange={() => toggleQuestionSelection(question.id)}
                />
              </td>
              
              <td className="border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-center text-2xl">{getQuestionTypeIcon(question.questionType)}</span>
                  <div className="relative" ref={el => dropdownRefs.current[question.id] = el}>
                    <button 
                      className="text-blue-500 hover:underline flex items-center"
                      onClick={() => setOpenActionDropdown(openActionDropdown === question.id ? null : question.id)}
                    >
                      Edit <ChevronDown size={14} className="ml-1" />
                    </button>
                    
                    {openActionDropdown === question.id && (
                      <div className="absolute left-0 mt-1 w-40 bg-white rounded shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={() => {
                            onPreview(question);
                            setOpenActionDropdown(null);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          <Eye size={14} className="mr-2" />
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            onEdit(question);
                            setOpenActionDropdown(null);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          <Edit size={14} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDuplicate(question)}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          <Copy size={14} className="mr-2" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => {
                            onHistory(question);
                            setOpenActionDropdown(null);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          <Clock size={14} className="mr-2" />
                          History
                        </button>
                        <button
                          onClick={() => onDelete(question.id)}
                          className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                        >
                          <Trash size={14} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              
              <td className="border-b px-4 py-3">
                {showQuestionText && (
                  editingQuestion === question.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newQuestionTitle}
                        onChange={(e) => setNewQuestionTitle(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        autoFocus
                        onBlur={() => initiateQuestionSave(question.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') initiateQuestionSave(question.id);
                          if (e.key === 'Escape') setEditingQuestion(null);
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <button
                        className="flex items-center gap-1 text-left w-full bg-transparent border-0 p-0 hover:underline focus:outline-none"
                        onClick={() => startEditingTitle(question)}
                        style={{ cursor: 'pointer' }}
                        tabIndex={0}
                      >
                        <span>{question.title}</span>
                        <Edit size={14} className="text-gray-700" />
                      </button>
                      {Array.isArray(question.tags) && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {question.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </td>
              
              <td className="border-b px-4 py-3">
                <div className="relative">
                  <button 
                    className="border rounded px-3 py-1 bg-white flex items-center"
                    onClick={() => setOpenStatusDropdown(openStatusDropdown === question.id ? null : question.id)}
                  >
                    {question.status === 'ready' ? 'Ready' : 'Draft'} <ChevronDown size={14} className="ml-1" />
                  </button>
                  
                  {openStatusDropdown === question.id && (
                    <div className="absolute left-0 mt-1 w-32 bg-white rounded shadow-lg z-10 border border-gray-200">
                      <button
                        onClick={() => onStatusChange(question.id, 'ready')}
                        className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                      >
                        <CheckCircle size={14} className="mr-2 text-green-600" />
                        Ready
                      </button>
                      <button
                        onClick={() => onStatusChange(question.id, 'draft')}
                        className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                      >
                        <AlertTriangle size={14} className="mr-2 text-amber-600" />
                        Draft
                      </button>
                    </div>
                  )}
                </div>
              </td>
              
              <td className="border-b px-4 py-3">{question.version}</td>
              
              <td className="border-b px-4 py-3">
                <div>
                  <div>{question.createdBy.name}</div>
                  <div className="text-gray-600">{question.createdBy.role}</div>
                  <div className="text-xs text-gray-600">{question.createdBy.date}</div>
                </div>
              </td>
              
              <td className="border-b px-4 py-3 text-center text-blue-500 font-medium">
                <button
                  onClick={() => alert(`View ${question.comments} comments for this question`)}
                  className="hover:underline focus:outline-none"
                >
                  {question.comments}
                </button>
              </td>
              
              <td className="border-b px-4 py-3 text-center text-blue-500 font-medium">
                <button
                  onClick={() => alert(`This question is used in ${question.usage} quizzes`)}
                  className="hover:underline focus:outline-none"
                >
                  {question.usage}
                </button>
              </td>
              
              <td className="border-b px-4 py-3">{question.lastUsed}</td>
              
              <td className="border-b px-4 py-3">
                <div>
                  <div>{question.modifiedBy.name}</div>
                  <div className="text-gray-600">{question.modifiedBy.role}</div>
                  <div className="text-xs text-gray-600">{question.modifiedBy.date}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsTable;