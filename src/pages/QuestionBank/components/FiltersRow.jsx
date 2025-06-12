// components/FiltersRow.jsx - Full Laravel API Integration
import React, { useState, useEffect } from 'react';

const FiltersRow = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  tagFilter,
  setTagFilter,
  allTags // Keep this for backward compatibility, but we'll prioritize API data
}) => {
  const [apiTags, setApiTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [questionStatuses, setQuestionStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);

  // Laravel API configuration
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
        // Token expired - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('usernameoremail');
        window.location.href = '/login';
        return;
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  };

  // Safe tag normalization function
  const normalizeTag = (tag) => {
    if (typeof tag === 'string') {
      return tag.trim();
    } else if (typeof tag === 'object' && tag !== null) {
      // Handle tag objects with common properties
      return tag.name || tag.text || tag.value || tag.label || String(tag);
    }
    return String(tag || '').trim();
  };

  // Combine and process all tags safely
  const combinedTags = React.useMemo(() => {
    const processedAllTags = Array.isArray(allTags) 
      ? allTags.map(normalizeTag).filter(tag => tag && tag.length > 0)
      : [];
    
    const processedApiTags = Array.isArray(apiTags) 
      ? apiTags.map(normalizeTag).filter(tag => tag && tag.length > 0)
      : [];
    
    // Prioritize API tags, then add any additional tags from props
    const combined = [...processedApiTags, ...processedAllTags];
    const uniqueTags = [...new Set(combined.map(tag => tag.toLowerCase()))];
    
    return uniqueTags;
  }, [allTags, apiTags]);

  // Fetch all tags from Laravel API
  const fetchAllTagsFromAPI = async () => {
    try {
      setLoadingTags(true);
      console.log(' Fetching all tags from Laravel API...');
      
      const response = await fetch(`${API_BASE_URL}/questions/tags`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      console.log('Raw tags API response:', data);
      
      // Process the response safely
      let tags = [];
      if (Array.isArray(data)) {
        tags = data;
      } else if (Array.isArray(data.tags)) {
        tags = data.tags;
      } else if (data.success && Array.isArray(data.data)) {
        tags = data.data;
      } else if (Array.isArray(data.data)) {
        tags = data.data;
      }
      
      // Normalize tags
      const processedTags = tags.map(tag => {
        if (typeof tag === 'string') return tag.trim();
        if (typeof tag === 'object' && tag !== null) {
          return tag.name || tag.tag_name || tag.text || tag.value || tag.label || String(tag);
        }
        return String(tag || '').trim();
      }).filter(Boolean);
      
      const uniqueTags = [...new Set(processedTags.map(tag => tag.toLowerCase()))];
      
      console.log(`Processed ${uniqueTags.length} unique tags:`, uniqueTags.slice(0, 10));
      
      setApiTags(uniqueTags);
      return uniqueTags;
    } catch (error) {
      console.error(' Failed to fetch all tags:', error);
      return [];
    } finally {
      setLoadingTags(false);
    }
  };

  // Fetch all question categories from Laravel API
  const fetchCategoriesFromAPI = async () => {
    try {
      setLoadingCategories(true);
      console.log(' Fetching categories from Laravel API...');
      
      const response = await fetch(`${API_BASE_URL}/questions/categories`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      console.log(' Raw categories API response:', data);
      
      // Process the response safely
      let categories = [];
      if (Array.isArray(data)) {
        categories = data;
      } else if (Array.isArray(data.categories)) {
        categories = data.categories;
      } else if (data.success && Array.isArray(data.data)) {
        categories = data.data;
      } else if (Array.isArray(data.data)) {
        categories = data.data;
      }
      
      // Normalize categories
      const processedCategories = categories.map(category => {
        if (typeof category === 'string') return { name: category.trim() };
        if (typeof category === 'object' && category !== null) {
          return {
            id: category.id,
            name: category.name || category.category_name || category.title || String(category)
          };
        }
        return { name: String(category || '').trim() };
      }).filter(cat => cat.name && cat.name.length > 0);
      
      console.log(` Processed ${processedCategories.length} categories:`, processedCategories);
      
      setCategories(processedCategories);
      return processedCategories;
    } catch (error) {
      console.error(' Failed to fetch categories:', error);
      // Set empty array on error instead of fallback
      setCategories([]);
      return [];
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch question statuses from Laravel API by getting questions and extracting statuses
  const fetchQuestionStatusesFromAPI = async () => {
    try {
      setLoadingStatuses(true);
      console.log(' Fetching question statuses from Laravel API...');
      
      // Get questions to extract statuses
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      console.log(' Raw questions API response for statuses:', data);
      
      // Process the response safely
      let questions = [];
      if (Array.isArray(data)) {
        questions = data;
      } else if (Array.isArray(data.questions)) {
        questions = data.questions;
      } else if (data.success && Array.isArray(data.data)) {
        questions = data.data;
      } else if (Array.isArray(data.data)) {
        questions = data.data;
      }
      
      // Extract unique statuses from questions
      const statusSet = new Set();
      
      questions.forEach(question => {
        // Check various possible status field names
        if (question.status) {
          statusSet.add(question.status);
        }
        if (question.qstatus) {
          statusSet.add(question.qstatus);
        }
        if (question.state) {
          statusSet.add(question.state);
        }
        if (question.question_status) {
          statusSet.add(question.question_status);
        }
        // Add any other possible status field names based on your API
      });
      
      const statuses = Array.from(statusSet).filter(Boolean).sort();
      
      console.log(`Extracted ${statuses.length} unique statuses:`, statuses);
      
      setQuestionStatuses(statuses);
      return statuses;
    } catch (error) {
      console.error(' Failed to fetch question statuses:', error);
      // Set empty array on error
      setQuestionStatuses([]);
      return [];
    } finally {
      setLoadingStatuses(false);
    }
  };

  // Fetch tags for a specific question using Laravel API
  const fetchTagsForQuestion = async (questionId) => {
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

      // Extract tag names and normalize
      return tags.map(tag => {
        if (typeof tag === 'string') return tag;
        return tag.name || tag.tag_name || tag.text || String(tag);
      }).filter(tag => tag && tag.trim().length > 0).map(normalizeTag);

    } catch (error) {
      console.error(`Failed to fetch tags for question ${questionId}:`, error);
      return [];
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log(' Loading initial data from Laravel API...');
        
        // Fetch all data in parallel
        await Promise.all([
          fetchCategoriesFromAPI(),
          fetchAllTagsFromAPI(),
          fetchQuestionStatusesFromAPI()
        ]);
        
        console.log(' All initial data loaded successfully');
      } catch (error) {
        console.error(' Error loading initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  // Safe categorization with proper error handling
  const categorizedTags = React.useMemo(() => {
    const safeIncludes = (array, tag) => {
      const normalizedTag = normalizeTag(tag).toLowerCase();
      return array.some(item => item === normalizedTag);
    };

    return {
      difficulty: combinedTags.filter(tag => 
        safeIncludes(['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'], tag)
      ),
      subjects: combinedTags.filter(tag => 
        safeIncludes([
          'programming', 'algorithms', 'databases', 'networking', 'web development', 
          'operating systems', 'security', 'ai', 'machine learning', 'data structures',
          'computer science', 'mathematics', 'physics', 'chemistry', 'biology',
          'computer-science', 'science', 'language', 'history', 'google'
        ], tag)
      ),
      technologies: combinedTags.filter(tag => 
        safeIncludes([
          'python', 'java', 'javascript', 'html', 'css', 'sql', 'c++', 
          'react', 'node', 'php', 'angular', 'vue', 'typescript', 'js',
          'database', 'multichoice', 'truefalse', 'essay', 'matching'
        ], tag)
      ),
      assessmentTypes: combinedTags.filter(tag => 
        safeIncludes([
          'quiz', 'exam', 'assignment', 'practice', 'lab', 'project', 
          'homework', 'test', 'midterm', 'final', 'assessment', 'review',
          'multiple-choice', 'true-false', 'written-response', 'short-answer',
          'drag-drop', 'interactive', 'fill-in-blanks'
        ], tag)
      ),
      status: combinedTags.filter(tag => 
        safeIncludes(['draft', 'ready', 'hidden', 'published'], tag)
      ),
      other: combinedTags.filter(tag => {
        const normalizedTag = normalizeTag(tag).toLowerCase();
        const allKnownTags = [
          'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
          'programming', 'algorithms', 'databases', 'networking', 'web development', 
          'operating systems', 'security', 'ai', 'machine learning', 'data structures',
          'computer science', 'mathematics', 'physics', 'chemistry', 'biology',
          'computer-science', 'science', 'language', 'history', 'google',
          'python', 'java', 'javascript', 'html', 'css', 'sql', 'c++', 
          'react', 'node', 'php', 'angular', 'vue', 'typescript', 'js',
          'database', 'multichoice', 'truefalse', 'essay', 'matching',
          'quiz', 'exam', 'assignment', 'practice', 'lab', 'project', 
          'homework', 'test', 'midterm', 'final', 'assessment', 'review',
          'multiple-choice', 'true-false', 'written-response', 'short-answer',
          'drag-drop', 'interactive', 'fill-in-blanks',
          'draft', 'ready', 'hidden', 'published'
        ];
        return !allKnownTags.includes(normalizedTag);
      })
    };
  }, [combinedTags]);

  // Safe tag display function
  const formatTagDisplay = (tag) => {
    const normalized = normalizeTag(tag);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/([A-Z])/g, ' $1');
  };

  // Refresh all data function
  const handleRefreshData = async () => {
    console.log(' Refreshing all data from Laravel API...');
    await Promise.all([
      fetchCategoriesFromAPI(),
      fetchAllTagsFromAPI(),
      fetchQuestionStatusesFromAPI()
    ]);
  };

  // Question types - these should also come from API if available
  const questionTypes = [
    { value: 'All', label: 'All Question Types' },
    { value: 'multichoice', label: 'Multiple Choice' },
    { value: 'truefalse', label: 'True False' },
    { value: 'essay', label: 'Essay' },
    { value: 'matching', label: 'Matching' },
    { value: 'match', label: 'Match' },
    { value: 'shortanswer', label: 'Short Answer' },
    { value: 'ddimageortext', label: 'Drag and Drop' },
    { value: 'gapselect', label: 'Gap Select' },
    { value: 'ddmarker', label: 'Drag and Drop Markers' }
  ];

  return (
    <div className="p-4 border-t border-b border-gray-200 bg-gray-50 flex flex-wrap gap-3 items-center">
      {/* Search Input */}
      <div className="relative flex-grow max-w-md">
        <input
          type="text"
          placeholder="Search questions..."
          className="w-full pl-10 pr-4 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Category Filter */}
      <select 
        className="border rounded py-2 px-3 min-w-[150px]"
        value={filters.category}
        onChange={(e) => setFilters({...filters, category: e.target.value})}
        disabled={loadingCategories}
      >
        <option value="All">
          {loadingCategories ? 'Loading categories...' : `All Categories (${categories.length})`}
        </option>
        {categories.map((category, idx) => (
          <option key={`category-${category.id || idx}`} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      
      {/* Status Filter */}
      <select 
        className="border rounded py-2 px-3 min-w-[120px]"
        value={filters.status}
        onChange={(e) => setFilters({...filters, status: e.target.value})}
        disabled={loadingStatuses}
      >
        <option value="All">
          {loadingStatuses ? 'Loading statuses...' : `All Statuses (${questionStatuses.length})`}
        </option>
        {questionStatuses.map((status, idx) => (
          <option key={`status-${idx}`} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      
      {/* Question Type Filter */}
      <select 
        className="border rounded py-2 px-3 min-w-[160px]"
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
      >
        {questionTypes.map((type, idx) => (
          <option key={`type-${idx}`} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      
      {/* Enhanced Tag Filter with Laravel API integration */}
      <select
        className="border rounded py-2 px-3 min-w-[150px]"
        value={tagFilter}
        onChange={e => setTagFilter(e.target.value)}
        disabled={loadingTags}
      >
        <option value="All">
          {loadingTags ? 'Loading tags...' : `All Tags (${combinedTags.length})`}
        </option>
        
        {/* Difficulty Tags */}
        {categorizedTags.difficulty.length > 0 && (
          <optgroup label="Difficulty">
            {categorizedTags.difficulty.map((tag, idx) => (
              <option key={`difficulty-${tag}-${idx}`} value={tag}>
                {formatTagDisplay(tag)}
              </option>
            ))}
          </optgroup>
        )}
        
        {/* Subject Tags */}
        {categorizedTags.subjects.length > 0 && (
          <optgroup label="Subjects">
            {categorizedTags.subjects.map((tag, idx) => (
              <option key={`subjects-${tag}-${idx}`} value={tag}>
                {formatTagDisplay(tag)}
              </option>
            ))}
          </optgroup>
        )}
        
        {/* Technology Tags */}
        {categorizedTags.technologies.length > 0 && (
          <optgroup label="Technologies">
            {categorizedTags.technologies.map((tag, idx) => (
              <option key={`tech-${tag}-${idx}`} value={tag}>
                {tag.toUpperCase()}
              </option>
            ))}
          </optgroup>
        )}
        
        {/* Assessment Type Tags */}
        {categorizedTags.assessmentTypes.length > 0 && (
          <optgroup label="Assessment Types">
            {categorizedTags.assessmentTypes.map((tag, idx) => (
              <option key={`assessment-${tag}-${idx}`} value={tag}>
                {formatTagDisplay(tag)}
              </option>
            ))}
          </optgroup>
        )}
        
        {/* Status Tags */}
        {categorizedTags.status.length > 0 && (
          <optgroup label="Status">
            {categorizedTags.status.map((tag, idx) => (
              <option key={`status-${tag}-${idx}`} value={tag}>
                {formatTagDisplay(tag)}
              </option>
            ))}
          </optgroup>
        )}
        
        {/* Other Tags */}
        {categorizedTags.other.length > 0 && (
          <optgroup label="Other">
            {categorizedTags.other.map((tag, idx) => (
              <option key={`other-${tag}-${idx}`} value={tag}>
                {formatTagDisplay(tag)}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      {/* Refresh Data Button */}
      <button
        onClick={handleRefreshData}
        disabled={loadingTags || loadingCategories || loadingStatuses}
        className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh categories, statuses, and tags from Laravel API"
      >
        {(loadingTags || loadingCategories || loadingStatuses) ? '⟳' : '↻'} Refresh
      </button>

      {/* Clear All Filters Button */}
      {(searchQuery || filters.category !== 'All' || filters.status !== 'All' || 
        filters.type !== 'All' || tagFilter !== 'All') && (
        <button
          onClick={() => {
            setSearchQuery('');
            setFilters({ category: 'All', status: 'All', type: 'All' });
            setTagFilter('All');
          }}
          className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        >
          Clear All
        </button>
      )}

      {/* Loading Indicator */}
      {(loadingTags || loadingCategories || loadingStatuses) && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          Loading data from API...
        </div>
      )}

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          API Data - Categories: {categories.length} | 
          Statuses: {questionStatuses.length} | 
          Tags: {combinedTags.length} | 
          Categorized: D({categorizedTags.difficulty.length}) 
          S({categorizedTags.subjects.length}) 
          T({categorizedTags.technologies.length}) 
          A({categorizedTags.assessmentTypes.length}) 
          St({categorizedTags.status.length}) 
          O({categorizedTags.other.length})
        </div>
      )}
    </div>
  );
};

// Helper function to fetch tags for multiple questions using Laravel API
export const fetchTagsForQuestions = async (questionIds) => {
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  
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
  
  if (!questionIds || questionIds.length === 0) {
    return [];
  }
  
  try {
    console.log(` Fetching tags for ${questionIds.length} questions from Laravel API...`);
    
    const tagPromises = questionIds.map(async (questionId) => {
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
        console.error(` Network error fetching tags for question ${questionId}:`, error);
        return [];
      }
    });
    
    const allTagsArrays = await Promise.all(tagPromises);
    const flatTags = allTagsArrays.flat();
    
    // Normalize and deduplicate
    const normalizedTags = flatTags.map(tag => {
      if (typeof tag === 'string') return tag.trim();
      if (typeof tag === 'object' && tag !== null) {
        return tag.name || tag.text || tag.value || tag.label || String(tag);
      }
      return String(tag || '').trim();
    }).filter(Boolean);
    
    const uniqueTags = [...new Set(normalizedTags.map(tag => tag.toLowerCase()))];
    
    console.log(` Successfully fetched ${uniqueTags.length} unique tags from questions`);
    return uniqueTags;
  } catch (error) {
    console.error(' Failed to fetch tags for questions:', error);
    return [];
  }
};

export default FiltersRow;