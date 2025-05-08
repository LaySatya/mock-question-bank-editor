import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, 
  Edit, Trash, Copy, Eye, 
  MessageCircle, Clock, CheckCircle, AlertCircle, 
  BarChart2, FileText, Info, Layers, X,
  PlusCircle
} from 'lucide-react';

const QuestionBank = () => {
  const navigate = useNavigate();

  // Comprehensive mock data for questions
  const mockQuestions = [
    {
      id: 1,
      questiontext: "What is the primary concept of Object-Oriented Programming?",
      category: "Computer Science",
      type: "Multiple Choice",
      difficulty: "Medium",
      status: "draft",
      tags: ["OOP", "Programming Concepts"],
      updated: "2025-04-28",
      options: [
        "Inheritance",
        "Encapsulation",
        "Polymorphism",
        "All of the above"
      ],
      correctAnswer: "All of the above",
      versions: [
        { 
          id: 1, 
          date: "2025-04-28", 
          author: "Prof. Smith", 
          changes: "Initial creation" 
        },
        { 
          id: 2, 
          date: "2025-05-01", 
          author: "Dr. Johnson", 
          changes: "Added more detailed explanation" 
        }
      ],
      comments: [
        { 
          id: 1, 
          author: "Dr. Brown", 
          text: "Need to clarify the definition", 
          date: "2025-05-02" 
        }
      ],
      usage: {
        quizCount: 3,
        lastUsed: "2025-04-15",
        facilityIndex: 0.65,
        discriminativeEfficiency: 0.42
      },
      needsChecking: false
    },
    {
      id: 2,
      questiontext: "What is a closure in JavaScript?",
      category: "Web Development",
      type: "Short Answer",
      difficulty: "Hard",
      status: "ready",
      tags: ["JavaScript", "Advanced Concepts"],
      updated: "2025-05-01",
      correctAnswer: "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.",
      versions: [
        { 
          id: 1, 
          date: "2025-05-01", 
          author: "Dr. Williams", 
          changes: "Initial creation" 
        }
      ],
      comments: [],
      usage: {
        quizCount: 1,
        lastUsed: "2025-05-10",
        facilityIndex: 0.55,
        discriminativeEfficiency: 0.38
      },
      needsChecking: true
    },
    {
      id: 3,
      questiontext: "Which data structure would be most efficient for implementing a priority queue?",
      category: "Computer Science",
      type: "Multiple Choice",
      difficulty: "Hard",
      status: "ready",
      tags: ["Data Structures", "Algorithms"],
      updated: "2025-04-30",
      options: [
        "Array",
        "Linked List",
        "Binary Heap",
        "Hash Table"
      ],
      correctAnswer: "Binary Heap",
      versions: [
        { 
          id: 1, 
          date: "2025-04-30", 
          author: "Prof. Johnson", 
          changes: "Initial creation" 
        }
      ],
      comments: [
        { 
          id: 1, 
          author: "Dr. Chen", 
          text: "Should we mention Fibonacci heaps as well?", 
          date: "2025-05-01" 
        }
      ],
      usage: {
        quizCount: 2,
        lastUsed: "2025-05-05",
        facilityIndex: 0.48,
        discriminativeEfficiency: 0.65
      },
      needsChecking: false
    },
    {
      id: 4,
      questiontext: "What is the correct SQL statement to select all records from a table named 'Students' where the 'Age' is greater than 18?",
      category: "Database Systems",
      type: "Short Answer",
      difficulty: "Easy",
      status: "ready",
      tags: ["SQL", "Database Queries"],
      updated: "2025-04-20",
      correctAnswer: "SELECT * FROM Students WHERE Age > 18;",
      versions: [
        { 
          id: 1, 
          date: "2025-04-20", 
          author: "Prof. Garcia", 
          changes: "Initial creation" 
        }
      ],
      comments: [],
      usage: {
        quizCount: 5,
        lastUsed: "2025-05-08",
        facilityIndex: 0.82,
        discriminativeEfficiency: 0.35
      },
      needsChecking: false
    },
    {
      id: 5,
      questiontext: "What is the principle of Occam's Razor?",
      category: "Philosophy",
      type: "Multiple Choice",
      difficulty: "Medium",
      status: "draft",
      tags: ["Philosophy", "Critical Thinking"],
      updated: "2025-05-02",
      options: [
        "The simplest explanation is usually the correct one",
        "Knowledge comes from sensory experience",
        "Truth is subjective and varies by perspective",
        "Reality is an illusion created by our perceptions"
      ],
      correctAnswer: "The simplest explanation is usually the correct one",
      versions: [
        { 
          id: 1, 
          date: "2025-05-02", 
          author: "Dr. Phillips", 
          changes: "Initial creation" 
        }
      ],
      comments: [
        { 
          id: 1, 
          author: "Prof. Lee", 
          text: "This is a simplification. Consider rephrasing to 'Among competing hypotheses, the one with the fewest assumptions should be selected.'", 
          date: "2025-05-03" 
        }
      ],
      usage: {
        quizCount: 0,
        lastUsed: null,
        facilityIndex: null,
        discriminativeEfficiency: null
      },
      needsChecking: true
    },
    {
      id: 6,
      questiontext: "Which of the following is NOT a principle of good user interface design?",
      category: "User Experience",
      type: "Multiple Choice",
      difficulty: "Medium",
      status: "ready",
      tags: ["UI/UX", "Design Principles"],
      updated: "2025-04-25",
      options: [
        "Consistency",
        "Visibility of system status",
        "Error prevention",
        "Maximizing the user's memory load"
      ],
      correctAnswer: "Maximizing the user's memory load",
      versions: [
        { 
          id: 1, 
          date: "2025-04-25", 
          author: "Prof. Martinez", 
          changes: "Initial creation" 
        }
      ],
      comments: [],
      usage: {
        quizCount: 2,
        lastUsed: "2025-05-01",
        facilityIndex: 0.70,
        discriminativeEfficiency: 0.55
      },
      needsChecking: false
    },
    {
      id: 7,
      questiontext: "What is the chemical formula for photosynthesis?",
      category: "Biology",
      type: "Short Answer",
      difficulty: "Medium",
      status: "ready",
      tags: ["Photosynthesis", "Chemical Reactions"],
      updated: "2025-04-15",
      correctAnswer: "6CO2 + 6H2O + light energy → C6H12O6 + 6O2",
      versions: [
        { 
          id: 1, 
          date: "2025-04-15", 
          author: "Dr. Nguyen", 
          changes: "Initial creation" 
        }
      ],
      comments: [],
      usage: {
        quizCount: 4,
        lastUsed: "2025-05-07",
        facilityIndex: 0.68,
        discriminativeEfficiency: 0.45
      },
      needsChecking: false
    },
    {
      id: 8,
      questiontext: "True or False: In JavaScript, '==' compares values without checking types, while '===' compares both values and types.",
      category: "Web Development",
      type: "True/False",
      difficulty: "Easy",
      status: "ready",
      tags: ["JavaScript", "Operators"],
      updated: "2025-04-10",
      correctAnswer: "True",
      versions: [
        { 
          id: 1, 
          date: "2025-04-10", 
          author: "Prof. Davis", 
          changes: "Initial creation" 
        }
      ],
      comments: [],
      usage: {
        quizCount: 6,
        lastUsed: "2025-05-06",
        facilityIndex: 0.85,
        discriminativeEfficiency: 0.30
      },
      needsChecking: false
    },
    {
      id: 9,
      questiontext: "Explain the concept of marginal utility in economics.",
      category: "Economics",
      type: "Essay",
      difficulty: "Hard",
      status: "draft",
      tags: ["Microeconomics", "Utility Theory"],
      updated: "2025-05-04",
      correctAnswer: "Marginal utility refers to the additional satisfaction or benefit (utility) a consumer derives from consuming one more unit of a good or service. It typically diminishes with increased consumption, which explains the law of diminishing marginal utility - as more of a good is consumed, the additional satisfaction derived from each additional unit decreases.",
      versions: [
        { 
          id: 1, 
          date: "2025-05-04", 
          author: "Prof. Williams", 
          changes: "Initial creation" 
        }
      ],
      comments: [
        { 
          id: 1, 
          author: "Dr. Thompson", 
          text: "Should require examples in the answer.", 
          date: "2025-05-05" 
        }
      ],
      usage: {
        quizCount: 0,
        lastUsed: null,
        facilityIndex: null,
        discriminativeEfficiency: null
      },
      needsChecking: true
    },
    {
      id: 10,
      questiontext: "Fill in the blank: The _____ is the part of the computer that executes instructions.",
      category: "Computer Hardware",
      type: "Fill in the Blank",
      difficulty: "Easy",
      status: "ready",
      tags: ["Computer Architecture", "Hardware Components"],
      updated: "2025-04-05",
      correctAnswer: "CPU (Central Processing Unit)",
      versions: [
        { 
          id: 1, 
          date: "2025-04-05", 
          author: "Dr. Rogers", 
          changes: "Initial creation" 
        }
      ],
      comments: [],
      usage: {
        quizCount: 7,
        lastUsed: "2025-05-03",
        facilityIndex: 0.92,
        discriminativeEfficiency: 0.25
      },
      needsChecking: false
    },
    {
      id: 11,
      questiontext: "Fill in the blank: The _____ is the part of the computer that executes instructions.",
      category: "Computer Hardware",
      type: "Fill in the Blank",
      difficulty: "Easy",
      status: "ready",
      tags: ["Computer Architecture", "Hardware Components"],
      updated: "2025-04-05",
      correctAnswer: "CPU (Central Processing Unit)",
      versions: [
        { 
          id: 1, 
          date: "2025-04-05", 
          author: "Dr. Rogers", 
          changes: "Initial creation" 
        }
      ],
      comments: [],
      usage: {
        quizCount: 7,
        lastUsed: "2025-05-03",
        facilityIndex: 0.92,
        discriminativeEfficiency: 0.25
      },
      needsChecking: false
    }
  ];

  // Mock courses
  const mockCourses = [
    { 
      id: 1, 
      name: "Object-Oriented Programming", 
      department: "Computer Science",
      semester: "Fall 2025"
    },
    { 
      id: 2, 
      name: "Advanced Web Development", 
      department: "Web Technologies",
      semester: "Spring 2025"
    }
  ];

  // State Management
  const [questions, setQuestions] = useState(mockQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    difficulty: 'All',
    type: 'All',
    status: 'All'
  });
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [versionHistory, setVersionHistory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  // Handler for Add Question button
  const handleAddQuestion = () => {
    navigate('/question-bank/editor', { 
      state: { 
        mode: 'create',
        courseContext: null // You can add course context if needed
      } 
    });
  };

  // Select all questions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  // Toggle individual question selection
  const toggleQuestionSelection = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id) 
        : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkEdit = () => {
    if (selectedQuestions.length > 0) {
      navigate('/question-bank/editor', { 
        state: { 
          questionIds: selectedQuestions,
          courseContext: null // You can add course context if needed
        } 
      });
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedQuestions.length} questions?`)) {
      setQuestions(prev => 
        prev.filter(q => !selectedQuestions.includes(q.id))
      );
      setSelectedQuestions([]);
    }
  };

  const handleBulkDuplicate = () => {
    const duplicatedQuestions = selectedQuestions.map(id => {
      const originalQuestion = questions.find(q => q.id === id);
      return {
        ...originalQuestion,
        id: Date.now() + Math.random(),
        questiontext: `Copy of: ${originalQuestion.questiontext}`,
        status: 'draft',
        versions: [
          ...(originalQuestion.versions || []),
          { 
            id: Date.now(), 
            date: new Date().toISOString().split('T')[0], 
            author: 'Current User', 
            changes: 'Duplicated question' 
          }
        ]
      };
    });

    setQuestions(prev => [...prev, ...duplicatedQuestions]);
    setSelectedQuestions([]);
  };

  // Filtering and Pagination
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = searchQuery === '' || 
        q.questiontext.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filters.category === 'All' || 
        q.category === filters.category;
      
      const matchesDifficulty = filters.difficulty === 'All' || 
        q.difficulty === filters.difficulty;
      
      const matchesType = filters.type === 'All' || 
        q.type === filters.type;
      
      const matchesStatus = filters.status === 'All' || 
        q.status === filters.status;
      
      return matchesSearch && 
             matchesCategory && 
             matchesDifficulty && 
             matchesType && 
             matchesStatus;
    });
  }, [questions, searchQuery, filters]);

  // Paginated Questions
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage]);

  // Pagination Handlers
  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Helper Components
  const VersionHistoryModal = ({ question, onClose }) => {
    if (!question) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Version History</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {question.versions.map((version, index) => (
              <div 
                key={version.id} 
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Version {index + 1}</span>
                  <span className="text-sm text-gray-500">{version.date}</span>
                </div>
                <div className="text-sm">
                  <p><strong>Author:</strong> {version.author}</p>
                  <p><strong>Changes:</strong> {version.changes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const QuestionPreviewModal = ({ question, onClose }) => {
    if (!question) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Question Preview</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <strong className="block mb-2">Question Text:</strong>
              <p className="text-gray-700">{question.questiontext}</p>
            </div>

            {question.options && (
              <div>
                <strong className="block mb-2">Options:</strong>
                <ul className="list-disc pl-5">
                  {question.options.map((option, index) => (
                    <li key={index} className="text-gray-700">{option}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong className="block mb-2">Type:</strong>
                <span className={`inline-block px-2 py-1 rounded ${getTypeColor(question.type)}`}>
                  {question.type}
                </span>
              </div>

              <div>
                <strong className="block mb-2">Difficulty:</strong>
                <span className={`font-medium ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>

              <div>
                <strong className="block mb-2">Status:</strong>
                <span className={`
                  px-2 py-1 rounded text-xs
                  ${question.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                `}>
                  {question.status}
                </span>
              </div>

              <div>
                <strong className="block mb-2">Usage:</strong>
                <p>Used in {question.usage.quizCount} quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Color helpers
  const getTypeColor = (type) => {
    switch (type) {
      case 'Multiple Choice': return 'bg-blue-100 text-blue-800';
      case 'True/False': return 'bg-green-100 text-green-800';
      case 'Short Answer': return 'bg-purple-100 text-purple-800';
      case 'Essay': return 'bg-yellow-100 text-yellow-800';
      case 'Fill in the Blank': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-amber-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with Add Question Button */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Question Bank</h1>
          <button 
            onClick={handleAddQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm transition-colors duration-200"
          >
            <PlusCircle size={18} />
            <span>Add Question</span>
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedQuestions.length > 0 && (
          <div className="bg-blue-50 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-800">
                {selectedQuestions.length} questions selected
              </span>
              <button 
                onClick={handleBulkEdit}
                className="btn btn-sm btn-outline flex items-center space-x-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button 
                onClick={handleBulkDelete}
                className="btn btn-sm btn-outline btn-error flex items-center space-x-2"
              >
                <Trash size={16} />
                <span>Delete</span>
              </button>
              <button 
                onClick={handleBulkDuplicate}
                className="btn btn-sm btn-outline flex items-center space-x-2"
              >
                <Copy size={16} />
                <span>Duplicate</span>
              </button>
            </div>
            <button 
              onClick={() => setSelectedQuestions([])}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-grow">
              <input 
                type="text"
                className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {/* Category Filter */}
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
              >
                <option value="All">All Categories</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Web Development">Web Development</option>
                {/* Add more categories */}
              </select>

              {/* Difficulty Filter */}
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({...prev, difficulty: e.target.value}))}
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* Status Filter */}
              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
              >
                <option value="All">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="ready">Ready</option>
                <option value="needs_review">Needs Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input 
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Versions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedQuestions.map(question => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => toggleQuestionSelection(question.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {question.questiontext}
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-1 mt-1">
                      {question.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                      {question.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${
                        question.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        question.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }
                    `}>
                      {question.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setVersionHistory(question)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Layers size={16} className="mr-2" />
                      {question.versions.length} Versions
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <BarChart2 size={16} className="mr-2 text-gray-500" />
                      {question.usage.quizCount} Quizzes
                    </div>
                    {question.needsChecking && (
                      <div className="text-red-600 flex items-center mt-1">
                        <AlertCircle size={14} className="mr-1" />
                        Needs Review
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setPreviewQuestion(question)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Preview question"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/question-edit/${question.id}`)}
                        className="text-green-600 hover:text-green-800"
                        aria-label="Edit question"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          const duplicatedQuestion = {
                            ...question,
                            id: Date.now(),
                            status: 'draft',
                            versions: [
                              ...question.versions,
                              { 
                                id: Date.now(), 
                                date: new Date().toISOString().split('T')[0], 
                                author: 'Current User', 
                                changes: 'Duplicated question' 
                              }
                            ]
                          };
                          setQuestions(prev => [...prev, duplicatedQuestion]);
                        }}
                        className="text-purple-600 hover:text-purple-800"
                        aria-label="Duplicate question"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(currentPage - 1) * questionsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * questionsPerPage, filteredQuestions.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium">
              {filteredQuestions.length}
            </span>{' '}
            questions
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(filteredQuestions.length / questionsPerPage)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Modals */}
        {previewQuestion && (
          <QuestionPreviewModal 
            question={previewQuestion} 
            onClose={() => setPreviewQuestion(null)} 
          />
        )}

        {versionHistory && (
          <VersionHistoryModal 
            question={versionHistory} 
            onClose={() => setVersionHistory(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default QuestionBank;