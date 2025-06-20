// ============================================================================
// src/components/FiltersRow.jsx - Enhanced Filters with API Integration
// ============================================================================
import React, { useState, useEffect } from 'react';

const FiltersRow = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  tagFilter,
  setTagFilter,
  allTags,
  availableQuestionTypes = [],
  availableCategories = [],
  loadingQuestionTypes = false
}) => {
  const [apiTags, setApiTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
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
        localStorage.removeItem('token');
        localStorage.removeItem('usernameoremail');
        window.location.href = '/users';
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
    
    const combined = [...processedApiTags, ...processedAllTags];
    const uniqueTags = [...new Set(combined.map(tag => tag.toLowerCase()))];
    
    return uniqueTags;
  }, [allTags, apiTags]);

  // Fetch all tags from Laravel API
  const fetchAllTagsFromAPI = async () => {
    try {
      setLoadingTags(true);
      console.log('🏷️ Fetching all tags from Laravel API...');
      
      const response = await fetch(`${API_BASE_URL}/questions/tags`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      console.log('📋 Raw tags API response:', data);
      
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
      
      const processedTags = tags.map(tag => {
        if (typeof tag === 'string') return tag.trim();
        if (typeof tag === 'object' && tag !== null) {
          return tag.name || tag.tag_name || tag.text || tag.value || tag.label || String(tag);
        }
        return String(tag || '').trim();
      }).filter(Boolean);
      
      const uniqueTags = [...new Set(processedTags.map(tag => tag.toLowerCase()))];
      
      console.log(`✅ Processed ${uniqueTags.length} unique tags:`, uniqueTags.slice(0, 10));
      
      setApiTags(uniqueTags);
      return uniqueTags;
    } catch (error) {
      console.error('❌ Failed to fetch all tags:', error);
      return [];
    } finally {
      setLoadingTags(false);
    }
  };

  // Fetch question statuses from Laravel API
  const fetchQuestionStatusesFromAPI = async () => {
    try {
      setLoadingStatuses(true);
      console.log('📊 Fetching question statuses from Laravel API...');
      
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      
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
      
      const statusSet = new Set();
      
      questions.forEach(question => {
        if (question.status) statusSet.add(question.status);
        if (question.qstatus) statusSet.add(question.qstatus);
        if (question.state) statusSet.add(question.state);
        if (question.question_status) statusSet.add(question.question_status);
      });
      
      const statuses = Array.from(statusSet).filter(Boolean).sort();
      
      console.log(`✅ Extracted ${statuses.length} unique statuses:`, statuses);
      
      setQuestionStatuses(statuses);
      return statuses;
    } catch (error) {
      console.error('❌ Failed to fetch question statuses:', error);
      setQuestionStatuses([]);
      return [];
    } finally {
      setLoadingStatuses(false);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('🚀 Loading initial data from Laravel API...');
        
        await Promise.all([
          fetchAllTagsFromAPI(),
          fetchQuestionStatusesFromAPI()
        ]);
        
        console.log('✅ All initial data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
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
    console.log('🔄 Refreshing all data from Laravel API...');
    await Promise.all([
      fetchAllTagsFromAPI(),
      fetchQuestionStatusesFromAPI()
    ]);
  };

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
      >
        <option value="All">
          All Categories ({availableCategories.length - 1})
        </option>
        {availableCategories.filter(cat => cat.value !== 'All').map((category, idx) => (
          <option key={`category-${category.value || idx}`} value={category.value}>
            {category.label}
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
      
      {/* Question Type Filter with API data */}
      <select 
        className="border rounded py-2 px-3 min-w-[180px]"
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
        disabled={loadingQuestionTypes}
      >
        {loadingQuestionTypes ? (
          <option value="All">Loading question types...</option>
        ) : (
          availableQuestionTypes.map((type, idx) => (
            <option key={`type-${type.value}-${idx}`} value={type.value}>
              {type.label} {type.description ? `- ${type.description.slice(0, 30)}...` : ''}
            </option>
          ))
        )}
      </select>
      
      {/* Enhanced Tag Filter with Laravel API integration */}
                      <select
                  className="border rounded py-2 px-3 min-w-[150px]"
                  value={tagFilter}
                  onChange={e => setTagFilter(e.target.value)}
                >
                  <option value="All">
                    All Tags ({apiTags.length})
                  </option>
                  {apiTags.map((tag, idx) => (
                    <option key={`tag-${tag}-${idx}`} value={tag}>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </option>
                  ))}
                </select>

      {/* Refresh Data Button */}
      <button
        onClick={handleRefreshData}
        disabled={loadingTags || loadingStatuses || loadingQuestionTypes}
        className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh categories, statuses, question types, and tags from Laravel API"
      >
        {(loadingTags || loadingStatuses || loadingQuestionTypes) ? '⟳' : '↻'} Refresh
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
      {(loadingTags || loadingStatuses || loadingQuestionTypes) && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
          <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
          Loading API data...
        </div>
      )}
    </div>
  );
};

export default FiltersRow;