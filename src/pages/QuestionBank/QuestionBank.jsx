// QuestionBank.jsx - FIXED VERSION with proper filter integration
import React, { useState, useRef, useEffect } from 'react';

// Import shared components (assuming these exist)
import { useQuestionBank } from './hooks/useQuestionBank';
import { useDropdowns } from './hooks/useDropdowns';
import { useFilters } from './hooks/useFilters';
import { usePagination } from './hooks/usePagination';

// Import components
import QuestionsTable from './components/QuestionsTable';
import TopButtonsRow from './components/TopButtonsRow';
import BulkActionsRow from './components/BulkActionsRow';
import FiltersRow from './components/FiltersRow';
import PaginationControls from './components/PaginationControls';
import Modals from './components/Modals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faChartBar, faClipboardList, faSearch, faCogs } from '@fortawesome/free-solid-svg-icons';
// Constants
import { EDIT_COMPONENTS, BULK_EDIT_COMPONENTS } from './constants/questionTypes';

//  API SERVICE FUNCTIONS
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// User cache to store fetched user data
const userCache = new Map();

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

// Helper function to handle API responses
const handleAPIResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - clear storage and redirect to login
      console.warn(' Authentication token expired, redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('usernameoremail');
      
      // Show user-friendly message before redirect
      alert('Your session has expired. Please log in again.');
      
      // Redirect to login page
      window.location.href = '/login';
      
      // Throw error to stop further processing
      throw new Error('Authentication expired - redirecting to login');
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Helper function to get user name by ID - adapted for your API structure
const getUserNameById = async (userId) => {
  if (!userId) return 'Unknown';
  
  // Check cache first
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }
  
  // Since your API doesn't have /users/{id}, we'll rely on the pre-populated cache
  // or return a fallback name
  const fallbackName = `User ${userId}`;
  userCache.set(userId, fallbackName);
  return fallbackName;
};

//  API SERVICE FUNCTIONS
const questionAPI = {
  // Get all questions with filters
  async getQuestions(filters = {}) {
    console.log(' Fetching questions with filters:', filters);
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'All') {
      params.append('category', filters.category);
    }
    
    if (filters.status && filters.status !== 'All') {
      params.append('status', filters.status);
    }
    
    if (filters.type && filters.type !== 'All') {
      params.append('type', filters.type);
    }
    
    if (filters.searchQuery && filters.searchQuery.trim()) {
      params.append('search', filters.searchQuery.trim());
    }
    
    if (filters.tagFilter && filters.tagFilter !== 'All') {
      params.append('tag', filters.tagFilter);
    }

    // Choose endpoint based on filters
    let endpoint = `${API_BASE_URL}/questions`;
    if (filters.category && filters.category !== 'All') {
      endpoint = `${API_BASE_URL}/questions/category`;
    }
    
    const queryString = params.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    console.log(' API URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleAPIResponse(response);
  },

  // Update single question status
  async updateQuestionStatus(questionId, status) {
    console.log(` Updating question ${questionId} status to ${status}...`);
    
    // Validate inputs
    if (!questionId) {
      throw new Error('Question ID is required');
    }
    if (!status) {
      throw new Error('Status is required');
    }
    
    console.log(' Request payload:', { questionid: questionId, status: status });
    
    try {
      const response = await fetch(`${API_BASE_URL}/questions/set-question-status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          questionid: questionId,
          status: status
        })
      });
      
      console.log(' Status update response status:', response.status);
      console.log(' Status update response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get response text first to see what the server actually returned
      const responseText = await response.text();
      console.log(' Raw response text:', responseText);
      
      if (!response.ok) {
        // Try to parse as JSON, fallback to text
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('Status update failed:', errorData);
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Try to parse successful response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        // If response is not JSON, assume success
        data = { success: true, message: 'Status updated successfully' };
      }
      
      return data;
      
    } catch (networkError) {
      console.error(' Network error during status update:', networkError);
      
      // Re-throw with more context
      if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      
      throw networkError;
    }
  },

  // Bulk update question status
  async bulkUpdateQuestionStatus(questionIds, status) {
    console.log(` Bulk updating ${questionIds.length} questions to ${status}...`);
    const response = await fetch(`${API_BASE_URL}/questions/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        question_ids: questionIds,
        status: status
      })
    });
    return handleAPIResponse(response);
  },

  // Get tags for a question
  async getQuestionTags(questionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/question-tags?questionid=${questionId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        console.warn(` Tags API failed for question ${questionId}: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      // Handle different possible response formats
      let tags = [];
      if (Array.isArray(data)) {
        tags = data;
      } else if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else if (Array.isArray(data.data)) {
        tags = data.data;
      }

      // Extract tag names
      return tags.map(tag => {
        if (typeof tag === 'string') return tag;
        return tag.name || tag.tag_name || tag.text || String(tag);
      }).filter(tag => tag && tag.trim().length > 0);

    } catch (error) {
      console.warn(` Error fetching tags for question ${questionId}:`, error);
      return [];
    }
  },

  // Get all users (for bulk user lookup) - updated for your API
  async getAllUsers() {
    console.log(' Fetching all users...');
    try {
      // Try to fetch users with common roles
      const roles = ['student', 'teacher', 'editingteacher', 'coursecreator', 'manager'];
      const allUsers = [];
      
      for (const role of roles) {
        try {
          const response = await fetch(`${API_BASE_URL}/users?rolename=${role}`, {
            method: 'GET',
            headers: getAuthHeaders()
          });
          
          if (response.ok) {
            const roleUsers = await response.json();
            console.log(` Fetched ${role} users:`, roleUsers);
            
            // Handle different response formats
            let users = [];
            if (Array.isArray(roleUsers)) {
              users = roleUsers;
            } else if (roleUsers.users && Array.isArray(roleUsers.users)) {
              users = roleUsers.users;
            } else if (roleUsers.data && Array.isArray(roleUsers.data)) {
              users = roleUsers.data;
            }
            
            allUsers.push(...users);
          }
        } catch (error) {
          console.warn(` Failed to fetch ${role} users:`, error);
        }
      }
      
      // Remove duplicates based on user ID
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );
      
      console.log(` Total unique users fetched: ${uniqueUsers.length}`);
      return uniqueUsers;
      
    } catch (error) {
      console.warn(' Error fetching all users:', error);
      return [];
    }
  }
};

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

  // Filter hooks
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    tagFilter,
    setTagFilter,
    filteredQuestions,
    allTags
  } = useFilters(questions);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔧 FIXED: Fetch questions from API with filters and better error handling
  const fetchQuestionsFromAPI = async (currentFilters = {}) => {
    console.log(' Starting to fetch questions from Laravel API with filters:', currentFilters);
    
    try {
      setLoading(true);
      setError(null);

      // Check authentication first
      const token = localStorage.getItem('token');
      if (!token) {
        console.error(' No authentication token found');
        const errorMsg = 'Authentication required. Please log in.';
        setError(errorMsg);
        alert(errorMsg);
        window.location.href = '/login';
        return;
      }

      console.log(' Using token:', token.substring(0, 20) + '...');

      // Fetch questions and users in parallel for better performance
      const [questionsData, usersData] = await Promise.all([
        questionAPI.getQuestions(currentFilters).catch((error) => {
          console.error(' Questions API failed:', error);
          
          // If it's an auth error, don't continue
          if (error.message.includes('Authentication') || error.message.includes('401')) {
            throw error;
          }
          
          // For other errors, return empty array and continue
          console.warn(' Continuing without questions data due to error:', error.message);
          return [];
        }),
        questionAPI.getAllUsers().catch((error) => {
          console.warn(' Users API failed, continuing without user data:', error);
          return []; // Don't fail if users API is not available
        })
      ]);
      
      console.log(' Raw API response:', questionsData);
      console.log(' Users data:', usersData);

      // Pre-populate user cache if we got user data
      if (Array.isArray(usersData) && usersData.length > 0) {
        console.log(' Processing users data:', usersData.length, 'users found');
        
        usersData.forEach(user => {
          const userId = user.id;
          let userName = 'Unknown';
          
          // Prioritize username over full names
          if (user.username) {
            userName = user.username;
          } else if (user.fullname) {
            userName = user.fullname;
          } else if (user.firstname && user.lastname) {
            userName = `${user.firstname} ${user.lastname}`;
          } else if (user.name) {
            userName = user.name;
          } else if (user.first_name && user.last_name) {
            userName = `${user.first_name} ${user.last_name}`;
          } else if (user.firstname) {
            userName = user.firstname;
          } else if (user.email) {
            userName = user.email.split('@')[0];
          }
          
          userCache.set(userId, userName);
          console.log(` Cached user ${userId}: ${userName}`);
        });
        console.log(' Pre-populated user cache with', userCache.size, 'users');
      } else {
        console.warn(' No users data received - will show fallback user names');
      }

      // Handle different possible response formats from your Laravel API
      let questionsArray = [];
      
      if (Array.isArray(questionsData)) {
        questionsArray = questionsData;
      } else if (questionsData.questions && Array.isArray(questionsData.questions)) {
        questionsArray = questionsData.questions;
      } else if (questionsData.data && Array.isArray(questionsData.data)) {
        questionsArray = questionsData.data;
      } else if (questionsData.success && questionsData.data && Array.isArray(questionsData.data)) {
        questionsArray = questionsData.data;
      } else {
        console.warn(' Unexpected API response format:', questionsData);
        questionsArray = [];
      }

      console.log(` Processing ${questionsArray.length} questions from API`);

      if (questionsArray.length > 0) {
        // Normalize questions for frontend use
        const normalizedQuestions = await Promise.all(
          questionsArray.map(async (apiQuestion) => {
            const normalizedQuestion = await normalizeQuestionFromAPI(apiQuestion);
            return normalizedQuestion;
          })
        );
        
        console.log(' Normalized questions sample:', normalizedQuestions.slice(0, 3));

        // Try to fetch real tags for each question, fallback to demo tags
        const questionsWithTags = await Promise.all(
          normalizedQuestions.map(async (question) => {
            try {
              const realTags = await questionAPI.getQuestionTags(question.id);
              const finalTags = realTags.length > 0 ? realTags : generateDemoTags(question);
              
              return {
                ...question,
                tags: finalTags
              };
            } catch (error) {
              console.warn(` Error fetching tags for question ${question.id}, using demo tags`);
              return {
                ...question,
                tags: generateDemoTags(question)
              };
            }
          })
        );

        console.log(' Final questions with tags:', questionsWithTags.length);
        setQuestions(questionsWithTags);
      } else {
        console.log(' No questions found with current filters');
        setQuestions([]);
      }

    } catch (error) {
      console.error(' Error fetching questions:', error);
      setError(error.message);
      setQuestions([]);
      
      // Handle different types of errors
      if (error.message.includes('Authentication') || error.message.includes('401')) {
        // Auth errors are already handled by handleAPIResponse
        console.log(' Authentication error handled, user will be redirected');
      } else if (error.message.includes('Network')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert(`Failed to load questions: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔧 CRITICAL FIX: Watch for filter changes and refetch questions
  useEffect(() => {
    console.log(' Filters changed, fetching questions...', {
      category: filters.category,
      status: filters.status,
      type: filters.type,
      searchQuery,
      tagFilter
    });

    const filterParams = {
      category: filters.category,
      status: filters.status,
      type: filters.type,
      searchQuery,
      tagFilter
    };

    fetchQuestionsFromAPI(filterParams);
  }, [filters.category, filters.status, filters.type, searchQuery, tagFilter]);

  // Initial load on mount
  useEffect(() => {
    console.log(' QuestionBank component mounted, initial load...');
    fetchQuestionsFromAPI({
      category: 'All',
      status: 'All',
      type: 'All',
      searchQuery: '',
      tagFilter: 'All'
    });
  }, []);

  //  NORMALIZE QUESTION FROM API FORMAT WITH ASYNC USER LOOKUP
  const normalizeQuestionFromAPI = async (apiQuestion) => {
    console.log(' Normalizing question:', apiQuestion.id, apiQuestion.name || apiQuestion.title);
    
    // Handle choices/answers for multiple choice questions
    let choices = [];
    if (apiQuestion.qtype === 'multichoice' || apiQuestion.qtype === 'multiple') {
      if (apiQuestion.answers && Array.isArray(apiQuestion.answers)) {
        choices = apiQuestion.answers.map((answer, index) => ({
          id: answer.id || index,
          text: answer.text || answer.answer_text || answer.content || '',
          answer: answer.text || answer.answer_text || answer.content || '',
          isCorrect: answer.is_correct || answer.correct || (answer.fraction && answer.fraction > 0) || false,
          grade: (answer.is_correct || (answer.fraction && answer.fraction > 0)) ? '100%' : '0%',
          feedback: answer.feedback || ''
        }));
      } else if (apiQuestion.choices && Array.isArray(apiQuestion.choices)) {
        choices = apiQuestion.choices.map((choice, index) => ({
          id: choice.id || index,
          text: choice.text || choice.content || '',
          answer: choice.text || choice.content || '',
          isCorrect: choice.is_correct || choice.correct || false,
          grade: choice.is_correct ? '100%' : '0%',
          feedback: choice.feedback || ''
        }));
      }
    }

    // Handle creator and modifier information safely
    const createdById = apiQuestion.created_by || apiQuestion.author || apiQuestion.createdby;
    const modifiedById = apiQuestion.modified_by || apiQuestion.modifier || apiQuestion.modifiedby || apiQuestion.created_by;
    
    // Fetch user names asynchronously
    const [createdByName, modifiedByName] = await Promise.all([
      getUserNameById(createdById),
      getUserNameById(modifiedById)
    ]);
    
    const normalizedQuestion = {
      id: apiQuestion.id,
      title: apiQuestion.name || apiQuestion.title || `Question ${apiQuestion.id}`,
      questionText: apiQuestion.questiontext || apiQuestion.question_text || apiQuestion.text || '',
      qtype: apiQuestion.qtype || apiQuestion.type || 'multichoice',
      status: apiQuestion.status || 'draft',
      version: `v${apiQuestion.version || 1}`,
      
      // Tags will be added later
      tags: [],
      
      // Choices handling
      choices: choices,
      options: choices.map(c => c.text || c.answer || ''),
      correctAnswers: choices.filter(c => c.isCorrect).map(c => c.text || c.answer || ''),
      
      // True/False specific fields
      correctAnswer: apiQuestion.qtype === 'truefalse' ? (apiQuestion.correctanswer || apiQuestion.correct_answer || 'true') : undefined,
      feedbackTrue: apiQuestion.qtype === 'truefalse' ? (apiQuestion.feedbacktrue || apiQuestion.feedback_true || '') : undefined,
      feedbackFalse: apiQuestion.qtype === 'truefalse' ? (apiQuestion.feedbackfalse || apiQuestion.feedback_false || '') : undefined,
      
      // Multiple choice specific fields
      multipleAnswers: choices.filter(c => c.isCorrect).length > 1,
      shuffleAnswers: apiQuestion.shuffleanswers || apiQuestion.shuffle_answers || false,
      numberChoices: apiQuestion.numbering || '1, 2, 3, ...',
      showInstructions: apiQuestion.showinstructions !== false,
      
      // Common fields
      defaultMark: apiQuestion.defaultmark || apiQuestion.default_mark || 1,
      generalFeedback: apiQuestion.generalfeedback || apiQuestion.general_feedback || '',
      combinedFeedback: apiQuestion.combinedfeedback || apiQuestion.combined_feedback || {},
      penaltyFactor: apiQuestion.penalty || apiQuestion.penalty_factor || 0,
      
      // Metadata - now using the real user names
      createdBy: {
        name: createdByName,
        role: apiQuestion.creator_role || '',
        date: apiQuestion.created_at ? new Date(apiQuestion.created_at).toLocaleDateString() : 
              apiQuestion.timecreated ? new Date(apiQuestion.timecreated * 1000).toLocaleDateString() : ''
      },
      modifiedBy: {
        name: modifiedByName,
        role: apiQuestion.modifier_role || '',
        date: apiQuestion.updated_at ? new Date(apiQuestion.updated_at).toLocaleDateString() : 
              apiQuestion.timemodified ? new Date(apiQuestion.timemodified * 1000).toLocaleDateString() : ''
      },
      
      comments: apiQuestion.comments || 0,
      usage: apiQuestion.usage || apiQuestion.usages || 0,
      lastUsed: apiQuestion.last_used || apiQuestion.updated_at ? new Date(apiQuestion.updated_at).toLocaleDateString() : '',
      history: apiQuestion.history || []
    };

    console.log(' Normalized question:', {
      id: normalizedQuestion.id,
      title: normalizedQuestion.title.substring(0, 50),
      qtype: normalizedQuestion.qtype,
      choicesCount: normalizedQuestion.choices.length,
      createdBy: normalizedQuestion.createdBy.name,
      modifiedBy: normalizedQuestion.modifiedBy.name
    });

    return normalizedQuestion;
  };

  // GENERATE DEMO TAGS
  const generateDemoTags = (question) => {
    const tags = [];
    
    console.log(` Generating demo tags for question ${question.id}:`, {
      qtype: question.qtype,
      status: question.status,
      title: question.title.substring(0, 50)
    });
    
    // Always add question type tag
    if (question.qtype) {
      tags.push(question.qtype);
    }
    
    // Always add status tag  
    if (question.status) {
      tags.push(question.status);
    }
    
    // Analyze question text for contextual tags
    const questionText = (question.questiontext || question.questionText || question.title || '').toLowerCase();
    
    // Technology and subject detection
    if (questionText.includes('google')) tags.push('google');
    if (questionText.includes('programming') || questionText.includes('code')) tags.push('programming');
    if (questionText.includes('computer')) tags.push('computer-science');
    if (questionText.includes('math') || questionText.includes('calculate') || questionText.includes('number')) tags.push('mathematics');
    if (questionText.includes('english') || questionText.includes('language')) tags.push('language');
    if (questionText.includes('science')) tags.push('science');
    if (questionText.includes('history')) tags.push('history');
    if (questionText.includes('javascript') || questionText.includes('js')) tags.push('javascript');
    if (questionText.includes('html')) tags.push('html');
    if (questionText.includes('css')) tags.push('css');
    if (questionText.includes('python')) tags.push('python');
    if (questionText.includes('java')) tags.push('java');
    if (questionText.includes('database') || questionText.includes('sql')) tags.push('database');
    
    // Add difficulty based on question properties
    if (question.defaultMark) {
      const mark = parseFloat(question.defaultMark);
      if (mark <= 1) tags.push('easy');
      else if (mark <= 3) tags.push('medium');
      else tags.push('hard');
    } else {
      // Random difficulty if no marks available
      const difficulties = ['easy', 'medium', 'hard'];
      tags.push(difficulties[Math.floor(Math.random() * difficulties.length)]);
    }
    
    // Add academic context tags
    const academicTags = ['quiz', 'exam', 'practice', 'homework', 'review', 'assessment'];
    if (Math.random() > 0.5) { // 50% chance
      tags.push(academicTags[Math.floor(Math.random() * academicTags.length)]);
    }
    
    // Add question-specific tags based on type
    switch (question.qtype) {
      case 'multichoice':
        tags.push('multiple-choice');
        break;
      case 'truefalse':
        tags.push('true-false');
        break;
      case 'essay':
        tags.push('written-response');
        break;
      case 'shortanswer':
        tags.push('short-answer');
        break;
      case 'ddimageortext':
        tags.push('drag-drop', 'interactive');
        break;
      case 'matching':
        tags.push('matching');
        break;
      case 'gapselect':
        tags.push('fill-in-blanks');
        break;
    }
    
    // Ensure we always have at least a few tags
    if (tags.length < 3) {
      const extraTags = ['general', 'standard', 'basic'];
      tags.push(...extraTags.slice(0, 3 - tags.length));
    }
    
    const finalTags = [...new Set(tags.filter(tag => tag && tag.length > 0))]; // Remove duplicates
    console.log(` Generated ${finalTags.length} tags for question ${question.id}:`, finalTags);
    
    return finalTags;
  };

  //  HANDLE STATUS CHANGE with better error handling and validation
  const handleStatusChange = async (questionId, newStatus) => {
    console.log(' Starting status change:', { questionId, newStatus });
    
    try {
      // Validate inputs
      if (!questionId) {
        throw new Error('Question ID is missing');
      }
      
      if (!newStatus) {
        throw new Error('New status is missing');
      }
      
      // Validate status value
      const validStatuses = ['draft', 'ready', 'published', 'hidden', 'archived'];
      if (!validStatuses.includes(newStatus.toLowerCase())) {
        console.warn(' Unusual status value:', newStatus);
      }
      
      // Find the question to get current status
      const currentQuestion = questions.find(q => q.id === questionId);
      if (!currentQuestion) {
        console.error(' Question not found in local state:', questionId);
        throw new Error(`Question with ID ${questionId} not found`);
      }

      console.log(' Current question status:', currentQuestion.status);
      console.log(' New status:', newStatus);
      
      // Check if status is actually changing
      if (currentQuestion.status === newStatus) {
        console.log(' Status is already', newStatus, '- no change needed');
        return;
      }

      // Update UI immediately for better UX (optimistic update)
      const updatedQuestions = questions.map(q =>
        q.id === questionId ? { ...q, status: newStatus } : q
      );
      setQuestions(updatedQuestions);
      console.log(' UI updated optimistically');

      // Call your Laravel API with detailed logging
      console.log(' Calling API to update status...');
      const result = await questionAPI.updateQuestionStatus(questionId, newStatus);
      console.log(' API response:', result);
      
      // Check if API call was successful based on different response formats
      if (result && result.success === false) {
        throw new Error(result.message || result.error || 'Status update failed');
      }
      
      if (result && result.error) {
        throw new Error(result.error);
      }
      
      // If we get here, assume success
      console.log(' Status change successful!');
      
      // Optionally refresh the question data to ensure consistency
      // await fetchQuestionsFromAPI({ ...filters, searchQuery, tagFilter });

    } catch (error) {
      console.error(' Status change failed:', error);
      
      // Revert UI change on error
      setQuestions(questions);
      
      // Show user-friendly error message with more details
      let errorMessage = error.message || 'Unknown error occurred';
      
      if (errorMessage.includes('400')) {
        errorMessage += '\n\nThis might be due to:\n• Invalid status value\n• Missing required fields\n• Server validation error\n\nCheck the console for detailed error information.';
      }
      
      alert(`Failed to update status: ${errorMessage}`);
    }
  };

  //  HANDLE BULK STATUS CHANGE
  const handleBulkStatusChange = async (questionIds, newStatus) => {
    console.log(' Starting bulk status change:', { questionIds, newStatus });
    
    try {
      // Update UI optimistically
      const updatedQuestions = questions.map(q =>
        questionIds.includes(q.id) ? { ...q, status: newStatus } : q
      );
      setQuestions(updatedQuestions);

      // Call API
      const result = await questionAPI.bulkUpdateQuestionStatus(questionIds, newStatus);
      console.log(' Bulk status update result:', result);

      // Clear selection
      setSelectedQuestions([]);
      
      console.log(' Bulk status change successful!');

    } catch (error) {
      console.error(' Bulk status change failed:', error);
      
      // Revert UI change on error
      setQuestions(questions);
      
      alert(`Failed to update status: ${error.message}`);
    }
  };

  // Log state changes for debugging
  useEffect(() => {
    console.log(' Questions state updated:', {
      totalQuestions: questions.length,
      questionTypes: [...new Set(questions.map(q => q.qtype))],
      statuses: [...new Set(questions.map(q => q.status))],
      sampleTitles: questions.slice(0, 3).map(q => q.title)
    });
  }, [questions]);

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

  // Pagination hooks
  const {
    currentPage,
    setCurrentPage,
    paginatedQuestions,
    startIdx,
    endIdx,
    questionsPerPage
  } = usePagination(filteredQuestions);

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

  //  ENHANCED DELETE FUNCTION
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      // If you have a delete API endpoint, call it here
      // await questionAPI.deleteQuestion(questionId);
      
      // For now, just remove from local state
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      setSelectedQuestions(prev => prev.filter(id => id !== questionId));
      
      console.log(' Question deleted:', questionId);
    } catch (error) {
      console.error(' Delete failed:', error);
      alert('Failed to delete question');
    }
  };

  //  ENHANCED DUPLICATE FUNCTION  
  const handleDuplicateQuestion = async (questionId) => {
    try {
      const originalQuestion = questions.find(q => q.id === questionId);
      if (!originalQuestion) return;

      // Create a duplicate with a new ID
      const duplicatedQuestion = {
        ...originalQuestion,
        id: Date.now(), // Temporary ID
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

      // Add to local state (you might want to save to API here)
      setQuestions(prev => [duplicatedQuestion, ...prev]);
      
      console.log(' Question duplicated:', questionId);
    } catch (error) {
      console.error(' Duplicate failed:', error);
      alert('Failed to duplicate question');
    }
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
                });
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
        handleFileUpload={async (file, parsedQuestions) => {
          console.log(' QuestionBank received import request:', {
            file: file.name,
            parsedQuestions: parsedQuestions.length
          });
          
          const result = await handleFileUpload(file, parsedQuestions);
          
          if (result) {
            console.log(' Import completed:', result);
            // Reset to first page to show new questions
            setCurrentPage(1);
            return result;
          }
          
          return null;
        }}
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
        />
      )}

      {/* 🔧 FIXED: Pass proper filter state to FiltersRow */}
      <FiltersRow
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        allTags={allTags}
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
            questions={paginatedQuestions}
            allQuestions={questions}
            filteredQuestions={filteredQuestions}
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
              console.log(' Editing question:', question.id, 'Choices:', question.choices);
              setEditingQuestionData(question);
            }}
            onDuplicate={handleDuplicateQuestion}
            onHistory={setHistoryModal}
            onDelete={handleDeleteQuestion}
            onStatusChange={handleStatusChange}
            username={username}
            setQuestions={setQuestions}
          />

          <PaginationControls
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startIdx={startIdx}
            endIdx={endIdx}
            totalQuestions={filteredQuestions.length}
            questionsPerPage={questionsPerPage}
          />
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
      />

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">🐛 Debug Info</h4>
                      <button
              onClick={() => {
                console.log(' Manual refresh triggered');
                fetchQuestionsFromAPI({
                  category: filters.category,
                  status: filters.status,
                  type: filters.type,
                  searchQuery,
                  tagFilter
                });
              }}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSyncAlt} spin className="mr-1" />
              Debug Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded">
                            <h5 className="font-semibold text-green-800 mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} className="text-green-700" />
                Data Stats
              </h5>
              <p><strong>Total Questions:</strong> {questions.length}</p>
              <p><strong>Filtered Questions:</strong> {filteredQuestions.length}</p>
              <p><strong>Selected Questions:</strong> {selectedQuestions.length}</p>
              <p><strong>Current Page:</strong> {currentPage}</p>
              <p><strong>Showing:</strong> {startIdx + 1}-{Math.min(endIdx, filteredQuestions.length)} of {filteredQuestions.length}</p>
            </div>
            
            <div className="bg-white p-3 rounded">
                           <h5 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} className="text-blue-700" />
                Active Filters
              </h5>
              <p><strong>Category:</strong> <span className={filters.category !== 'All' ? 'text-red-600 font-bold' : ''}>{filters.category}</span></p>
              <p><strong>Status:</strong> <span className={filters.status !== 'All' ? 'text-red-600 font-bold' : ''}>{filters.status}</span></p>
              <p><strong>Type:</strong> <span className={filters.type !== 'All' ? 'text-red-600 font-bold' : ''}>{filters.type}</span></p>
              <p><strong>Search:</strong> <span className={searchQuery ? 'text-red-600 font-bold' : ''}>{searchQuery || 'None'}</span></p>
              <p><strong>Tag:</strong> <span className={tagFilter !== 'All' ? 'text-red-600 font-bold' : ''}>{tagFilter}</span></p>
            </div>
            
            <div className="bg-white p-3 rounded">
                           <h5 className="font-semibold text-purple-800 mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faCogs} className="text-purple-700" />
                System Status
              </h5>
              <p><strong>User:</strong> {username}</p>
              <p><strong>Loading:</strong> <span className={loading ? 'text-red-600' : 'text-green-600'}>{loading ? 'Yes' : 'No'}</span></p>
              <p><strong>Error:</strong> <span className={error ? 'text-red-600' : 'text-green-600'}>{error || 'None'}</span></p>
              <p><strong>Cache:</strong> {userCache.size} users</p>
              <p><strong>Tags:</strong> {allTags.length} total</p>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded">
               <h5 className="font-semibold text-orange-800 mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faClipboardList} className="text-orange-700" />
                Question Types Available
              </h5>
              <div className="flex flex-wrap gap-1">
                {[...new Set(questions.map(q => q.qtype))].map(type => (
                  <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded">
              <h5    className="font-semibold text-teal-800 mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartBar} className="text-teal-700" />
                Question Statuses Available
              </h5>
              <div className="flex flex-wrap gap-1">
                {[...new Set(questions.map(q => q.status))].map(status => (
                  <span key={status} className={`px-2 py-1 rounded text-xs ${
                    status === 'ready' ? 'bg-green-100 text-green-800' :
                    status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {status}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Filter Test Buttons */}
          <div className="mt-3 bg-white p-3 rounded">
            <h5 className="font-semibold text-red-800 mb-2"> Filter Test Buttons</h5>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  console.log(' Testing category filter: Computer Science');
                  setFilters({...filters, category: 'Computer Science'});
                }}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200"
              >
                Test: Computer Science
              </button>
              <button
                onClick={() => {
                  console.log(' Testing status filter: draft');
                  setFilters({...filters, status: 'draft'});
                }}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
              >
                Test: Draft Status
              </button>
              <button
                onClick={() => {
                  console.log(' Testing type filter: multichoice');
                  setFilters({...filters, type: 'multichoice'});
                }}
                className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
              >
                Test: Multiple Choice
              </button>
              <button
                onClick={() => {
                  console.log(' Clearing all filters');
                  setSearchQuery('');
                  setFilters({ category: 'All', status: 'All', type: 'All' });
                  setTagFilter('All');
                }}
                className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
          
          {/* Last API Call Info */}
          <div className="mt-3 bg-white p-3 rounded">
            <h5 className="font-semibold text-indigo-800 mb-1">🌐 Last API Call</h5>
            <p className="text-xs text-gray-600 break-all">
              Expected URL: {API_BASE_URL}/questions{filters.category !== 'All' ? '/category' : ''}
              {(filters.category !== 'All' || filters.status !== 'All' || filters.type !== 'All' || searchQuery || tagFilter !== 'All') ? '?' : ''}
              {filters.category !== 'All' ? `category=${encodeURIComponent(filters.category)}` : ''}
              {filters.status !== 'All' ? `${filters.category !== 'All' ? '&' : ''}status=${encodeURIComponent(filters.status)}` : ''}
              {filters.type !== 'All' ? `${(filters.category !== 'All' || filters.status !== 'All') ? '&' : ''}type=${encodeURIComponent(filters.type)}` : ''}
              {searchQuery ? `${(filters.category !== 'All' || filters.status !== 'All' || filters.type !== 'All') ? '&' : ''}search=${encodeURIComponent(searchQuery)}` : ''}
              {tagFilter !== 'All' ? `${(filters.category !== 'All' || filters.status !== 'All' || filters.type !== 'All' || searchQuery) ? '&' : ''}tag=${encodeURIComponent(tagFilter)}` : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;