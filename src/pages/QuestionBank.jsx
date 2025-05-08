import { useState, useMemo } from 'react';
import { 
  Search, Filter, ChevronDown, Book, 
  Edit, Trash, Copy, Download, 
  Settings, BarChart2, Upload 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestionBank = () => {
  
  // Mock data for questions
  const mockQuestions = [
    {
      id: 1,
      questiontext: "What is the capital of France?",
      category: "Geography",
      type: "Multiple Choice",
      difficulty: "Easy",
      tags: ["Europe", "Capitals"],
      updated: "2025-04-28"
    },
    {
      id: 2,
      questiontext: "Water boils at 100 degrees Celsius at sea level.",
      category: "Science",
      type: "True/False",
      difficulty: "Easy",
      tags: ["Physics", "Matter"],
      updated: "2025-04-29"
    },
    {
      id: 3,
      questiontext: "Explain the process of photosynthesis.",
      category: "Science",
      type: "Essay",
      difficulty: "Medium",
      tags: ["Biology", "Plants"],
      updated: "2025-04-30"
    },
    {
      id: 4,
      questiontext: "Solve for x: 3x + 7 = 22",
      category: "Mathematics",
      type: "Short Answer",
      difficulty: "Medium",
      tags: ["Algebra", "Equations"],
      updated: "2025-05-01"
    },
    {
      id: 5,
      questiontext: "HTML stands for ___________.",
      category: "Computer Science",
      type: "Fill in the Blank",
      difficulty: "Easy",
      tags: ["Web Development", "Programming"],
      updated: "2025-05-02"
    },
    {
      id: 6,
      questiontext: "What data structure uses LIFO principle?",
      category: "Computer Science",
      type: "Multiple Choice",
      difficulty: "Hard",
      tags: ["Data Structures", "Programming"],
      updated: "2025-05-03"
    },
    {
      id: 7,
      questiontext: "What are the primary colors of light?",
      category: "Science",
      type: "Multiple Choice",
      difficulty: "Medium",
      tags: ["Physics", "Light"],
      updated: "2025-05-04"
    },
    {
      id: 8,
      questiontext: "Who wrote \"Romeo and Juliet\"?",
      category: "Language Arts",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Literature", "Drama"],
      updated: "2025-05-05"
    },
    {
      id: 9,
      questiontext: "Explain the water cycle in detail.",
      category: "Science",
      type: "Essay",
      difficulty: "Medium",
      tags: ["Earth Science", "Meteorology"],
      updated: "2025-05-06"
    },
    {
      id: 10,
      questiontext: "What is the chemical symbol for water?",
      category: "Science",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Chemistry", "Basics"],
      updated: "2025-05-07"
    },
    {
      id: 11,
      questiontext: "Who developed the theory of relativity?",
      category: "Science",
      type: "Short Answer",
      difficulty: "Medium",
      tags: ["Physics", "Scientists"],
      updated: "2025-05-08"
    },
    {
      id: 12,
      questiontext: "What is the largest planet in our solar system?",
      category: "Science",
      type: "Multiple Choice",
      difficulty: "Easy",
      tags: ["Astronomy", "Planets"],
      updated: "2025-05-09"
    },
    {
      id: 13,
      questiontext: "What is the square root of 144?",
      category: "Mathematics",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Algebra", "Basics"],
      updated: "2025-05-10"
    },
    {
      id: 14,
      questiontext: "What is the process by which plants make their food?",
      category: "Science",
      type: "Essay",
      difficulty: "Medium",
      tags: ["Biology", "Photosynthesis"],
      updated: "2025-05-11"
    },
    {
      id: 15,
      questiontext: "What is the capital of Japan?",
      category: "Geography",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Asia", "Capitals"],
      updated: "2025-05-12"
    },
    {
      id: 16,
      questiontext: "What is the primary language spoken in Brazil?",
      category: "Geography",
      type: "Short Answer",
      difficulty: "Medium",
      tags: ["Languages", "South America"],
      updated: "2025-05-13"
    },
    {
      id: 17,
      questiontext: "What is the value of Pi up to two decimal places?",
      category: "Mathematics",
      type: "Short Answer",
      difficulty: "Medium",
      tags: ["Geometry", "Constants"],
      updated: "2025-05-14"
    },
    {
      id: 18,
      questiontext: "Who painted the Mona Lisa?",
      category: "Art",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Renaissance", "Artists"],
      updated: "2025-05-15"
    },
    {
      id: 19,
      questiontext: "What is the powerhouse of the cell?",
      category: "Science",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Biology", "Cells"],
      updated: "2025-05-16"
    },
    {
      id: 20,
      questiontext: "What is the freezing point of water in Celsius?",
      category: "Science",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Physics", "Basics"],
      updated: "2025-05-17"
    },
    {
      id: 21,
      questiontext: "What is the capital of Australia?",
      category: "Geography",
      type: "Short Answer",
      difficulty: "Medium",
      tags: ["Capitals", "Oceania"],
      updated: "2025-05-18"
    },
    {
      id: 22,
      questiontext: "What is the smallest prime number?",
      category: "Mathematics",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Numbers", "Basics"],
      updated: "2025-05-19"
    },
    {
      id: 23,
      questiontext: "What is the main ingredient in guacamole?",
      category: "Food",
      type: "Short Answer",
      difficulty: "Easy",
      tags: ["Cooking", "Ingredients"],
      updated: "2025-05-20"
    },
    {
      id: 24,
      questiontext: "What is the name of the longest river in the world?",
      category: "Geography",
      type: "Short Answer",
      difficulty: "Medium",
      tags: ["Rivers", "World"],
      updated: "2025-05-21"
    },
    {
      id: 25,
      questiontext: "What is the speed of light in a vacuum (in m/s)?",
      category: "Science",
      type: "Short Answer",
      difficulty: "Hard",
      tags: ["Physics", "Constants"],
      updated: "2025-05-22"
    }
  ];
 
  // Mock data for courses
  const mockCourses = [
    { id: 1, name: "Mathematics 101" },
    { id: 2, name: "Introduction to Biology" },
    { id: 3, name: "World Geography" },
    { id: 4, name: "Chemistry Fundamentals" }
  ];
 
  // State
  const navigate = useNavigate();
  const [questions] = useState(mockQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  //use for edit 
  const handleEdit = () => {
    if (selectedQuestions.length === 0) return;
    navigate('/question-bank/editor', { state: { questionIds: selectedQuestions } });
  };
  
  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(questions.map(q => q.category)));
    return ['All', ...uniqueCategories];
  }, [questions]);

  // Extract unique types for filter dropdown
  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(questions.map(q => q.type)));
    return ['All', ...uniqueTypes];
  }, [questions]);

  // Extract unique difficulties for filter dropdown
  const difficulties = useMemo(() => {
    const uniqueDifficulties = Array.from(new Set(questions.map(q => q.difficulty)));
    return ['All', ...uniqueDifficulties];
  }, [questions]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        q.questiontext.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter  
      const matchesCategory = categoryFilter === 'All' || 
        q.category === categoryFilter;
      
      // Difficulty filter
      const matchesDifficulty = difficultyFilter === 'All' || 
        q.difficulty === difficultyFilter;
      
      // Type filter
      const matchesType = typeFilter === 'All' || 
        q.type === typeFilter;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
    });
  }, [questions, searchQuery, categoryFilter, difficultyFilter, typeFilter]);
// Pagination state
const [currentPage, setCurrentPage] = useState(1);
const questionsPerPage = 10; // Limit the number of questions per page

// Calculate total pages
const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

// Paginated questions
const paginatedQuestions = useMemo(() => {
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  return filteredQuestions.slice(startIndex, endIndex);
}, [filteredQuestions, currentPage, questionsPerPage]);

// Handle next page
const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
  }
};

// Handle previous page
const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
  }
};


  // Toggle question selection
  const toggleQuestionSelection = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  // Select all filtered questions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setDifficultyFilter('All');
    setTypeFilter('All');
  };

  // Handle delete confirmation
  const confirmDelete = (id) => {
    setQuestionToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Handle actual deletion (mock implementation)
  const handleDelete = () => {
    // In a real app, you'd update the state to remove the question
    alert(`Question ${questionToDelete} would be deleted`);
    setShowDeleteConfirm(false);
    setQuestionToDelete(null);
  };

  // Handle assign to course (mock implementation)
  const handleAssignToCourse = () => {
    if (selectedQuestions.length === 0 || !selectedCourse) return;
    
    alert(`Successfully assigned ${selectedQuestions.length} questions to course ${selectedCourse}`);
    setSelectedQuestions([]);
    setSelectedCourse('');
  };

  

  // Get color for type badge
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

  // Get color for difficulty
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
        {/* Search and filter bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
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
            
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  Filters
                  <ChevronDown size={16} />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-64">
                    <div className="p-4">
                      <div className="mb-4">
                        <label className="font-medium mb-1 block">Category</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded"
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="font-medium mb-1 block">Difficulty</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded"
                          value={difficultyFilter}
                          onChange={(e) => setDifficultyFilter(e.target.value)}
                        >
                          {difficulties.map(difficulty => (
                            <option key={difficulty} value={difficulty}>
                              {difficulty}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="font-medium mb-1 block">Type</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded"
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                        >
                          {types.map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                onClick={resetFilters}
              >
                Reset
              </button>
              
              <div className="relative">
                <button 
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <span className="font-bold">⋯</span>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <Download size={16} />
                        Export Questions
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <Upload size={16} />
                        Import Questions
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <BarChart2 size={16} />
                        Question Analytics
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                        <Settings size={16} />
                        Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Course assignment bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Book size={20} className="text-blue-600" />
            <select
              className="border border-gray-300 rounded px-3 py-1.5 bg-white"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select a course</option>
              {mockCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={!selectedCourse || selectedQuestions.length === 0}
            onClick={handleAssignToCourse}
          >
            Assign to Course
          </button>
          
          <div className="ml-auto flex items-center">
            <span className="text-sm mr-2">
              With {selectedQuestions.length} selected:
            </span>
            <div className="flex gap-1">
              <button 
                className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={selectedQuestions.length === 0}
                //onClick={() => alert('Edit functionality would open here')}
                onClick={handleEdit}
                >
                  <Edit size={16} />
                  <span className="sr-only">Edit</span>
                </button>
          

              <button 
                className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={selectedQuestions.length === 0}
                onClick={() => alert('Delete functionality would open here')}
              >
                <Trash size={16} />
                <span className="sr-only">Delete</span>
              </button>
              
              <button 
                className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={selectedQuestions.length === 0}
                onClick={() => alert('Duplicate functionality would open here')}
              >
                <Copy size={16} />
                <span className="sr-only">Duplicate</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Questions table */}
{paginatedQuestions.length === 0 ? (
  <div className="p-12 text-center">
    <p className="text-gray-500">No questions found matching your criteria.</p>
    <button 
      className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
      onClick={resetFilters}
    >
      Reset filters
    </button>
  </div>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="w-12 px-6 py-3 text-left">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Difficulty
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Updated
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {paginatedQuestions.map(question => (
          <tr key={question.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={selectedQuestions.includes(question.id)}
                onChange={() => toggleQuestionSelection(question.id)}
              />
            </td>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">{question.questiontext}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {question.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(question.type)}`}>
                {question.type}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {question.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {question.updated}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center space-x-2">
                <button 
                  className="text-indigo-600 hover:text-indigo-900" 
                  aria-label="Edit question"
                  onClick={() => alert(`Would edit question ${question.id}`)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="text-red-600 hover:text-red-900" 
                  aria-label="Delete question"
                  onClick={() => confirmDelete(question.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
  {filteredQuestions.length === 0 ? (
    <div className="flex items-center justify-between w-full">
      <div className="text-sm text-gray-700">
        No questions found. Try adjusting your filters or search query.
      </div>
      <button 
        className="px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </div>
  ) : (
    <div className="text-sm text-gray-700">
      Showing <span className="font-medium">{(currentPage - 1) * questionsPerPage + 1}</span> 
      to <span className="font-medium">{Math.min(currentPage * questionsPerPage, filteredQuestions.length)}</span> 
      of <span className="font-medium">{filteredQuestions.length}</span> questions
    </div>
  )}

  <div className="flex items-center space-x-2">
    <button
      className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50"
      onClick={handlePrevPage}
      disabled={currentPage === 1}
    >
      &laquo; Prev
    </button>
    <span className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <button
      className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-500 hover:bg-gray-50"
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
    >
      Next &raquo;
    </button>
  </div>
</div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
              <p className="mt-2">Are you sure you want to delete this question? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;