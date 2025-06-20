// ============================================================================
// src/pages/QuestionBank/QuestionBank.jsx - Main Question Bank Component (FIXED)
// ============================================================================
import React, { useState, useEffect } from 'react';

// ✅ CORRECTED IMPORTS - Fixed all paths:
import { useQuestionBank } from '../../../shared/hooks/useQuestionBank';
import { useDropdowns } from '../../../shared/hooks/useDropdowns';
import { usePagination } from '../../../shared/hooks/usePagination';
import { questionAPI, normalizeQuestionFromAPI, generateDemoTags } from '../../../api/questionAPI';

// Import components from corrected locations
import QuestionsTable from '../../../shared/components/QuestionsTable';
import TopButtonsRow from '../../../shared/components/TopButtonsRow';
import BulkActionsRow from '../../../shared/components/BulkActionsRow';
import FiltersRow from '../../../shared/components/FiltersRow';
import Modals from '../../../shared/components/Modals';
import { EDIT_COMPONENTS, BULK_EDIT_COMPONENTS } from '../../../shared/constants/questionConstants';

const QuestionBank = () => {
  // State management using custom hooks
  const {
    questions,
    setQuestions,
    selectedQuestions,
    setSelectedQuestions,

    username,
    handleFileUpload,
    duplicateQuestion,
    deleteQuestion
  } = useQuestionBank([]);

  // Filtering state - handle filtering via state instead of useFilters hook
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    type: 'All'
  });
  const [tagFilter, setTagFilter] = useState('All');

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Enhanced state for API integration
  const [availableQuestionTypes, setAvailableQuestionTypes] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(10);

  


  
  // Generate tags from current questions for filter dropdown
  // const allTags = React.useMemo(() => {
  //   const tagSet = new Set();
  //   questions.forEach(question => {
  //     if (question.tags && Array.isArray(question.tags)) {
  //       question.tags.forEach(tag => {
  //         if (tag && tag.trim()) tagSet.add(tag.trim());
  //       });
  //     }
  //   });
  //   return ['All', ...Array.from(tagSet).sort()];
  // }, [questions]);
// Line ~56 - SAFE VERSION:
const allTags = React.useMemo(() => {
  const tagSet = new Set();
  
  if (Array.isArray(questions)) {
    questions.forEach((question, qIndex) => {
      if (Array.isArray(question.tags)) {
        question.tags.forEach((tag, tIndex) => {
          try {
            let tagName = '';
            
            if (typeof tag === 'string') {
              tagName = tag.trim();
            } else if (typeof tag === 'object' && tag !== null) {
              const rawName = tag.name || tag.rawname || tag.text || tag.value || '';
              tagName = String(rawName).trim();
            } else {
              tagName = String(tag || '').trim();
            }
            
            if (tagName && tagName !== '[object Object]') {
              tagSet.add(tagName);
            }
          } catch (error) {
            console.warn(`⚠️ Error processing tag ${tIndex} in question ${qIndex}:`, tag, error);
          }
        });
      }
    });
  }
  
  return ['All', ...Array.from(tagSet).sort()];
}, [questions]);
  // Enhanced fetch function with better filtering handling
const fetchQuestionsFromAPI = async (currentFilters = {}, page = 1, perPage = questionsPerPage) => {
  console.log('🔧 STARTING API FETCH:', { currentFilters, page, perPage });
  
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      setError('Authentication required. Please log in.');
      window.location.href = '/login';
      return;
    }

    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('perpage', perPage.toString());
    
    if (currentFilters.category && currentFilters.category !== 'All') {
      params.append('category', currentFilters.category);
    }
    if (currentFilters.status && currentFilters.status !== 'All') {
      params.append('status', currentFilters.status);
    }
    if (currentFilters.type && currentFilters.type !== 'All') {
      params.append('type', currentFilters.type);
    }
    if (currentFilters.searchQuery && currentFilters.searchQuery.trim() !== '') {
      params.append('searchQuery', currentFilters.searchQuery.trim());
    }
    if (currentFilters.tagFilter && currentFilters.tagFilter !== 'All') {
      params.append('tagFilter', currentFilters.tagFilter);
    }

    console.log(' API URL params:', params.toString());

    const apiUrl = `http://127.0.0.1:8000/api/questions/filters?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(' API Response Structure:', {
      hasQuestions: !!data.questions,
      questionsLength: data.questions?.length,
      currentPage: data.current_page,
      total: data.total,
      lastPage: data.last_page
    });

    //  CRITICAL FIX: Handle your exact API response structure
    if (data && Array.isArray(data.questions)) {
      // Your API returns: { current_page, per_page, total, last_page, questions: [...] }
      const questionsArray = data.questions;
      
      // Update pagination state from API response
      setTotalQuestions(data.total || 0);
      setCurrentPage(data.current_page || page);
      
      console.log(` Processing ${questionsArray.length} questions from page ${data.current_page} of ${data.last_page}`);

      if (questionsArray.length > 0) {
        // Fetch tags for each question and transform
        const transformedQuestions = await Promise.all(
          questionsArray.map(async (apiQuestion) => {
            
            // Fetch tags separately since they're not included in main response
            let questionTags = [];
            try {
              const tagResponse = await fetch(
                `http://127.0.0.1:8000/api/questions/question-tags?questionid=${apiQuestion.id}`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  }
                }
              );
              
              if (tagResponse.ok) {
                const tagData = await tagResponse.json();
                questionTags = Array.isArray(tagData.tags) ? tagData.tags : [];
              }
            } catch (tagError) {
              console.warn(`⚠️ Failed to fetch tags for question ${apiQuestion.id}:`, tagError);
              questionTags = [];
            }

            // Transform to frontend format
            return {
              id: apiQuestion.id,
              title: apiQuestion.name,
              questionText: apiQuestion.questiontext,
              qtype: apiQuestion.qtype,
              questionType: apiQuestion.qtype,
              status: apiQuestion.status || 'ready',
              version: `v${apiQuestion.version || 1}`,
              comments: 0,
              usage: 0,
              lastUsed: '-',
              createdBy: {
                name: apiQuestion.createdbyuser ? 
                  `${apiQuestion.createdbyuser.firstname} ${apiQuestion.createdbyuser.lastname}` : 
                  'Unknown',
                role: '',
                date: apiQuestion.timecreated ? 
                  new Date(apiQuestion.timecreated * 1000).toLocaleDateString() : 
                  ''
              },
              modifiedBy: {
                name: apiQuestion.modifiedbyuser ? 
                  `${apiQuestion.modifiedbyuser.firstname} ${apiQuestion.modifiedbyuser.lastname}` : 
                  'Unknown',
                role: '',
                date: apiQuestion.timemodified ? 
                  new Date(apiQuestion.timemodified * 1000).toLocaleDateString() : 
                  ''
              },
              choices: apiQuestion.answers || [],
              tags: questionTags,
              idNumber: apiQuestion.id
            };
          })
        );

        console.log(' Setting transformed questions:', transformedQuestions.length);
        setQuestions(transformedQuestions);
      } else {
        setQuestions([]);
      }
    } else {
      console.warn(' Unexpected API response format:', data);
      setQuestions([]);
      setTotalQuestions(0);
    }

  } catch (error) {
    console.error(' Error fetching questions:', error);
    setError(error.message);
    setQuestions([]);
    setTotalQuestions(0);
    alert(`Failed to load questions: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // Load question types and categories from API
  const loadStaticData = async () => {
    try {
      const [types, categories] = await Promise.all([
        questionAPI.getQuestionTypes(),
        questionAPI.getCategories()
      ]);
      setAvailableQuestionTypes(types);
      setAvailableCategories(categories);
    } catch (error) {
      console.error('❌ Failed to load static data:', error);
    }
  };

  // Better filter change handling with debouncing
  useEffect(() => {
    console.log('🔄 FILTERS CHANGED - Triggering API call:', {
      category: filters.category,
      status: filters.status,
      type: filters.type,
      searchQuery,
      tagFilter
    });

    // Create filter object for API
    const filterParams = {
      category: filters.category,
      status: filters.status,
      type: filters.type,
      searchQuery,
      tagFilter
    };

    // Reset to first page when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
      fetchQuestionsFromAPI(filterParams, 1, questionsPerPage);
    } else {
      fetchQuestionsFromAPI(filterParams, currentPage, questionsPerPage);
    }
  }, [filters.category, filters.status, filters.type, searchQuery, tagFilter]);

  // Handle pagination changes
useEffect(() => {
  if (currentPage > 1) {
    console.log('📄 PAGE CHANGED to:', currentPage);
    const filterParams = {
      category: filters.category,
      status: filters.status,
      type: filters.type,
      searchQuery,
      tagFilter
    };
    
    fetchQuestionsFromAPI(filterParams, currentPage, questionsPerPage);
  }
}, [currentPage]); // Only depend on currentPage

// Handle per-page changes
useEffect(() => {
  // Only trigger API call, don't reset currentPage here since it's already done in the onChange
  if (questionsPerPage !== 10) {
    console.log('📊 PER PAGE CHANGED to:', questionsPerPage);
    const filterParams = {
      category: filters.category,
      status: filters.status,
      type: filters.type,
      searchQuery,
      tagFilter
    };
    
        //  Refetch questions to ensure UI is in sync with backend
    fetchQuestionsFromAPI({
      category: filters.category,
      status: filters.status,
      type: filters.type,
      searchQuery,
      tagFilter
    }, currentPage, questionsPerPage); // Always use page 1 for per-page changes
  }
}, [questionsPerPage]);


 useEffect(() => {
  console.log('🔄 FILTERS CHANGED - Triggering API call');
  
  const filterParams = {
    category: filters.category,
    status: filters.status,
    type: filters.type,
    searchQuery,
    tagFilter
  };

  // Always reset to page 1 when filters change
  setCurrentPage(1);
  fetchQuestionsFromAPI(filterParams, 1, questionsPerPage);
}, [filters.category, filters.status, filters.type, searchQuery, tagFilter]);

console.log(' Pagination fixes applied for existing API structure');
  // Dropdown hooks
  const {
    openActionDropdown,
    setOpenActionDropdown,
    openStatusDropdown,
    setOpenStatusDropdown,
    showQuestionsDropdown,
    setShowQuestionsDropdown,
    dropdownRefs,
    questionsDropdownRef
  } = useDropdowns();

  // Pagination hooks - use questions directly since API handles pagination
  const {
    paginatedQuestions,
    startIdx,
    endIdx
  } = usePagination(questions, 1, questions.length);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTrueFalseModal, setShowTrueFalseModal] = useState(false);
  const [showMultipleChoiceModal, setShowMultipleChoiceModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [historyModal, setHistoryModal] = useState(null);
  const [editingQuestionData, setEditingQuestionData] = useState(null);

  // UI state
  const [showQuestionText, setShowQuestionText] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // Enhanced delete function
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      // Remove from local state
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      setSelectedQuestions(prev => prev.filter(id => id !== questionId));
      
      console.log(' Question deleted:', questionId);
    } catch (error) {
      console.error(' Delete failed:', error);
      alert('Failed to delete question');
    }
  };

  // Enhanced duplicate function  
  const handleDuplicateQuestion = async (questionId) => {
    try {
      const originalQuestion = questions.find(q => q.id === questionId);
      if (!originalQuestion) return;

      const duplicatedQuestion = {
        ...originalQuestion,
        id: Date.now(),
        title: `${originalQuestion.title} (Copy)`,
        status: 'draft',
        version: 'v1',
        createdBy: {
          name: username || 'Current User',
          role: '',
          date: new Date().toLocaleDateString()
        },
        modifiedBy: {
          name: username || 'Current User',
          role: '',
          date: new Date().toLocaleDateString()
        }
      };

      setQuestions(prev => [duplicatedQuestion, ...prev]);
      
      console.log('📋 Question duplicated:', questionId);
    } catch (error) {
      console.error('❌ Duplicate failed:', error);
      alert('Failed to duplicate question');
    }
  };

  // Handle status change with API integration
  const handleStatusChange = async (questionId, newStatus) => {
    console.log(' Starting status change:', { questionId, newStatus });
    
    try {
      if (!questionId || !newStatus) {
        throw new Error('Question ID and status are required');
      }
      
      const currentQuestion = questions.find(q => q.id === questionId);
      if (!currentQuestion) {
        console.error('Question not found in local state:', questionId);
        throw new Error(`Question with ID ${questionId} not found`);
      }

      if (currentQuestion.status === newStatus) {
        console.log(' Status is already', newStatus, '- no change needed');
        return;
      }

      // Update UI optimistically
      const updatedQuestions = questions.map(q =>
        q.id === questionId ? { ...q, status: newStatus } : q
      );
      setQuestions(updatedQuestions);

      // Call API
      const result = await questionAPI.updateQuestionStatus(questionId, newStatus);
      
      if (result && result.success === false) {
        throw new Error(result.message || result.error || 'Status update failed');
      }
      
      if (result && result.error) {
        throw new Error(result.error);
      }
      
      console.log(' Status change successful!');

    } catch (error) {
      console.error('Status change failed:', error);
      
      // Revert UI change on error
      setQuestions(questions);
      
      let errorMessage = error.message || 'Unknown error occurred';
      
      if (errorMessage.includes('400')) {
        errorMessage += '\n\nThis might be due to:\n• Invalid status value\n• Missing required fields\n• Server validation error\n\nCheck the console for detailed error information.';
      }
      
      alert(`Failed to update status: ${errorMessage}`);
    }
  };

  // Handle bulk status change
  const handleBulkStatusChange = async (questionIds, newStatus) => {
    console.log(' Starting bulk status change:', { questionIds, newStatus });
  
    try {
      // Optimistically update UI
      const updatedQuestions = questions.map(q =>
        questionIds.includes(q.id) ? { ...q, status: newStatus } : q
      );
      setQuestions(updatedQuestions);

      // Call API
      const result = await questionAPI.bulkUpdateQuestionStatus(questionIds, newStatus);

      // Clear selection
      setSelectedQuestions([]);

      // ✅ Refetch questions to ensure UI is in sync with backend
      // fetchQuestionsFromAPI({
      //   category: filters.category,
      //   status: filters.status,
      //   type: filters.type,
      //   searchQuery,
      //   tagFilter
      // }, currentPage, questionsPerPage);

      console.log('✅ Bulk status change successful!');
    } catch (error) {
      console.error('❌ Bulk status change failed:', error);

      // Revert UI change on error
      setQuestions(questions);

      alert(`Failed to update status: ${error.message}`);
    }
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    console.log('📄 Page change requested:', newPage);
    setCurrentPage(newPage);
  };

  // Handle per page changes
  const handlePerPageChange = (newPerPage) => {
    console.log('📊 Per page change requested:', newPerPage);
    setQuestionsPerPage(newPerPage);
  };

  // Calculate total pages based on API response
 const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  const setFiltersWithLogging = (newFilters) => {
    console.log('🔄 Filters updated:', newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="max-w-full">
      {/* Loading indicator */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-200 z-50">
          <div className="h-full bg-blue-600 animate-pulse"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex justify-between items-center">
            <span><strong>Error:</strong> {error}</span>
            <button
              onClick={() => {
                setError(null);
                fetchQuestionsFromAPI({
                  category: filters.category,
                  status: filters.status,
                  type: filters.type,
                  searchQuery,
                  tagFilter
                }, currentPage, questionsPerPage);
              }}
              className="ml-2 px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <TopButtonsRow
        showQuestionsDropdown={showQuestionsDropdown}
        setShowQuestionsDropdown={setShowQuestionsDropdown}
        questionsDropdownRef={questionsDropdownRef}
       handleFileUpload={handleFileUpload}
        setShowCreateModal={setShowCreateModal}
        showQuestionText={showQuestionText}
        setShowQuestionText={setShowQuestionText}
      />

      {selectedQuestions.length > 0 && (
             <BulkActionsRow
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          setShowBulkEditModal={setShowBulkEditModal}
          onBulkDelete={() => {
            if (window.confirm(`Are you sure you want to delete ${selectedQuestions.length} questions?`)) {
              setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
              setSelectedQuestions([]);
            }
          }}
          onBulkStatusChange={handleBulkStatusChange}
          onReloadQuestions={() =>
            fetchQuestionsFromAPI(
              {
                category: filters.category,
                status: filters.status,
                type: filters.type,
                searchQuery,
                tagFilter
              },
              1, // always reload first page
              questionsPerPage
            )
          }
          questions={questions}           
          setQuestions={setQuestions}     
        />
      )}

      <FiltersRow
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFiltersWithLogging}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        allTags={allTags}
        availableQuestionTypes={availableQuestionTypes}
        availableCategories={availableCategories}
        loadingQuestionTypes={loading}
      />

      {/* Show loading state during filtering */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading questions...</p>
        </div>
      )}

      {/* Show empty state when no questions match filters */}
      {!loading && questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No questions found with current filters.</p>
          <button
            onClick={() => {
              console.log('🔄 Clearing all filters...');
              setSearchQuery('');
              setFilters({ category: 'All', status: 'All', type: 'All' });
              setTagFilter('All');
            }}
            className="mt-2 text-blue-600 underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Questions table */}
      {!loading && questions.length > 0 && (
        <>
          <QuestionsTable
            questions={questions}
            allQuestions={questions}
            filteredQuestions={questions}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            showQuestionText={showQuestionText}
            editingQuestion={editingQuestion}
            setEditingQuestion={setEditingQuestion}
            newQuestionTitle={newQuestionTitle}
            setNewQuestionTitle={setNewQuestionTitle}
            setShowSaveConfirm={setShowSaveConfirm}
            openActionDropdown={openActionDropdown}
            setOpenActionDropdown={setOpenActionDropdown}
            openStatusDropdown={openStatusDropdown}
            setOpenStatusDropdown={setOpenStatusDropdown}
            dropdownRefs={dropdownRefs}
            onPreview={setPreviewQuestion}
            onEdit={(question) => {
              console.log('✏️ Editing question:', question.id, 'Choices:', question.choices);
              setEditingQuestionData(question);
            }}
            onDuplicate={handleDuplicateQuestion}
            onHistory={setHistoryModal}
            onDelete={handleDeleteQuestion}
            onStatusChange={handleStatusChange}
            username={username}
            setQuestions={setQuestions}
          />

          
        
{/* Enhanced Pagination Controls - */}
{!loading && questions.length > 0 && (
  <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{((currentPage - 1) * questionsPerPage) + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * questionsPerPage, totalQuestions)}</span> of{' '}
          <span className="font-medium">{totalQuestions}</span> results
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      {/* Items per page selector */}
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-700">Per page:</label>
        <select
          value={questionsPerPage}
          onChange={(e) => {
            const newPerPage = Number(e.target.value);
            setQuestionsPerPage(newPerPage);
            setCurrentPage(1); // Reset to first page
          }}
          className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Pagination buttons */}
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1 || loading}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || loading}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              disabled={loading}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium disabled:cursor-not-allowed ${
                currentPage === pageNum
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || loading}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Last
        </button>
      </nav>
    </div>
  </div>
)}

        </>
      )}

      <Modals
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        showTrueFalseModal={showTrueFalseModal}
        setShowTrueFalseModal={setShowTrueFalseModal}
        showMultipleChoiceModal={showMultipleChoiceModal}
        setShowMultipleChoiceModal={setShowMultipleChoiceModal}
        showBulkEditModal={showBulkEditModal}
        setShowBulkEditModal={setShowBulkEditModal}
        editingQuestionData={editingQuestionData}
        setEditingQuestionData={setEditingQuestionData}
        previewQuestion={previewQuestion}
        setPreviewQuestion={setPreviewQuestion}
        historyModal={historyModal}
        setHistoryModal={setHistoryModal}
        showSaveConfirm={showSaveConfirm}
        setShowSaveConfirm={setShowSaveConfirm}
        editingQuestion={editingQuestion}
        setEditingQuestion={setEditingQuestion}
        newQuestionTitle={newQuestionTitle}
        questions={questions}
        setQuestions={setQuestions}
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
        username={username}
        EDIT_COMPONENTS={EDIT_COMPONENTS}
        BULK_EDIT_COMPONENTS={BULK_EDIT_COMPONENTS}
        availableQuestionTypes={availableQuestionTypes}
      />

      {/* Enhanced Debug info with filtering diagnosis */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">🐛 Debug Info - API INTEGRATION COMPLETE</h4>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log('🔄 Manual refresh triggered');
                  fetchQuestionsFromAPI({
                    category: filters.category,
                    status: filters.status,
                    type: filters.type,
                    searchQuery,
                    tagFilter
                  }, currentPage, questionsPerPage);
                }}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 flex items-center gap-2"
              >
                🔄 API Refresh
              </button>
              <button
                onClick={() => {
                  console.log('🧹 Clear filters test');
                  setSearchQuery('');
                  setFilters({ category: 'All', status: 'All', type: 'All' });
                  setTagFilter('All');
                }}
                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
              >
                Test Clear Filters
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded">
              <h5 className="font-semibold text-green-800 mb-1">📊 Pagination Status</h5>
              <p><strong>Total Questions (API):</strong> {totalQuestions}</p>
              <p><strong>Current Page:</strong> {currentPage}</p>
              <p><strong>Per Page:</strong> {questionsPerPage}</p>
              <p><strong>Total Pages:</strong> {totalPages}</p>
              <p><strong>Local Questions:</strong> {questions.length}</p>
              <p><strong>Expected on Page:</strong> {Math.min(questionsPerPage, totalQuestions - ((currentPage - 1) * questionsPerPage))}</p>
            </div>
            
            <div className="bg-white p-3 rounded">
              <h5 className="font-semibold text-blue-800 mb-1">🔍 Active Filters</h5>
              <p><strong>Category:</strong> <span className={filters.category !== 'All' ? 'text-red-600 font-bold' : ''}>{filters.category}</span></p>
              <p><strong>Status:</strong> <span className={filters.status !== 'All' ? 'text-red-600 font-bold' : ''}>{filters.status}</span></p>
              <p><strong>Type:</strong> <span className={filters.type !== 'All' ? 'text-red-600 font-bold' : ''}>{filters.type}</span></p>
              <p><strong>Search:</strong> <span className={searchQuery ? 'text-red-600 font-bold' : ''}>{searchQuery || 'None'}</span></p>
              <p><strong>Tag:</strong> <span className={tagFilter !== 'All' ? 'text-red-600 font-bold' : ''}>{tagFilter}</span></p>
            </div>
            
            <div className="bg-white p-3 rounded">
              <h5 className="font-semibold text-purple-800 mb-1">⚙️ System Status</h5>
              <p><strong>User:</strong> {username}</p>
              <p><strong>Loading:</strong> <span className={loading ? 'text-red-600' : 'text-green-600'}>{loading ? 'Yes' : 'No'}</span></p>
              <p><strong>Error:</strong> <span className={error ? 'text-red-600' : 'text-green-600'}>{error || 'None'}</span></p>
              <p><strong>API Types:</strong> {availableQuestionTypes.length} loaded</p>
              <p><strong>API Categories:</strong> {availableCategories.length} loaded</p>
            </div>
          </div>
          
          <div className="mt-3 bg-white p-3 rounded">
            <h5 className="font-semibold text-indigo-800 mb-1">🔗 Current API Call Details</h5>
            <p className="text-xs text-gray-600 break-all">
              <strong>Endpoint:</strong> http://127.0.0.1:8000/api/questions/filters
              <br />
              <strong>Parameters:</strong> page={currentPage}, perpage={questionsPerPage}
              {filters.category !== 'All' && `, category=${filters.category}`}
              {filters.status !== 'All' && `, status=${filters.status}`}
              {filters.type !== 'All' && `, type=${filters.type}`}
              {searchQuery && `, search=${searchQuery}`}
              {tagFilter !== 'All' && `, tag=${tagFilter}`}
              <br />
              <strong>Filter Method:</strong> Server-side (API handles filtering)
              <br />
              <strong>Questions Received:</strong> {questions.length}
            </p>
          </div>
          
          <div className="mt-3 bg-green-50 p-3 rounded border-l-4 border-green-400">
            <h5 className="font-semibold text-green-800 mb-1">✅ API INTEGRATION STATUS</h5>
            <p className="text-xs text-green-700">
              <strong>Status:</strong> COMPLETE<br />
              • ✅ Server-side filtering via Laravel API<br />
              • ✅ Proper pagination with API response<br />
              • ✅ Question type mapping from API<br />
              • ✅ Category and tag filtering<br />
              • ✅ Status management with API calls<br />
              • ✅ File import with duplicate detection<br />
              • ✅ Bulk operations support<br />
              • ✅ Error handling and user feedback<br />
              • ✅ All major issues resolved!
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default QuestionBank;