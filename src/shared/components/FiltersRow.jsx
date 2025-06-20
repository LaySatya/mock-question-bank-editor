// ============================================================================
// src/components/FiltersRow.jsx - Complete File with Enhanced Tag Integration
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
  loadingQuestionTypes: propLoadingQuestionTypes = false
}) => {
  const [apiTags, setApiTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [questionStatuses, setQuestionStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [tagStats, setTagStats] = useState({ total: 0, loaded: 0 });
  
  // API state for categories and question types
  const [apiCategories, setApiCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [apiQuestionTypes, setApiQuestionTypes] = useState([]);
  const [loadingApiQuestionTypes, setLoadingApiQuestionTypes] = useState(false);

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

  // 🔧 FIXED: Enhanced tag collection with case-insensitive deduplication
  const fetchAllTagsFromAPI = async () => {
    try {
      setLoadingTags(true);
      setTagStats({ total: 0, loaded: 0 });
      console.log(' Starting comprehensive tag collection from existing API...');
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      // Step 1: Get all questions to collect their IDs
      console.log(' Step 1: Fetching all questions...');
      const questionsResponse = await fetch(`${API_BASE_URL}/questions/filters?page=1&perpage=1000`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!questionsResponse.ok) throw new Error('Failed to fetch questions');
      
      const questionsData = await questionsResponse.json();
      const questions = Array.isArray(questionsData.questions) ? questionsData.questions : [];
      
      console.log(` Found ${questions.length} questions to process for tags`);
      setTagStats(prev => ({ ...prev, total: questions.length }));

      // Step 2: Collect all unique tags with case-insensitive deduplication
      const allTagsMap = new Map(); // Use lowercase key for deduplication
      
      // Process questions in batches to avoid overwhelming the API
      const batchSize = 15;
      let processedCount = 0;
      
      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        console.log(` Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(questions.length/batchSize)} (${batch.length} questions)`);
        
        await Promise.all(
          batch.map(async (question) => {
            try {
              const tagResponse = await fetch(
                `${API_BASE_URL}/questions/question-tags?questionid=${question.id}`,
                {
                  method: 'GET',
                  headers: getAuthHeaders()
                }
              );
              
              if (tagResponse.ok) {
                const tagData = await tagResponse.json();
                const tags = Array.isArray(tagData.tags) ? tagData.tags : [];
                
                tags.forEach(tag => {
                  // Handle your API format: { id, name, rawname, isstandard, description, descriptionformat, flag }
                  const tagName = (tag.rawname || tag.name || '').trim();
                  if (tagName) {
                    const lowerKey = tagName.toLowerCase(); // Use lowercase for deduplication
                    
                    if (allTagsMap.has(lowerKey)) {
                      allTagsMap.get(lowerKey).count += 1;
                    } else {
                      allTagsMap.set(lowerKey, {
                        name: tagName, // Keep original case for display
                        displayName: tagName.charAt(0).toUpperCase() + tagName.slice(1).toLowerCase(), // Proper case
                        id: tag.id,
                        count: 1,
                        isStandard: tag.isstandard || false
                      });
                    }
                  }
                });
              }
              
              processedCount++;
              setTagStats(prev => ({ ...prev, loaded: processedCount }));
              
            } catch (error) {
              console.warn(`Failed to fetch tags for question ${question.id}:`, error);
              processedCount++;
              setTagStats(prev => ({ ...prev, loaded: processedCount }));
            }
          })
        );
        
        // Small delay between batches to be nice to the API
        if (i + batchSize < questions.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      console.log(` Raw tag collection complete. Found ${allTagsMap.size} unique tags (case-insensitive)`);

      // Step 3: Filter out system tags (keep 'exam' as it's content)
      const systemTags = [
        'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
     'published',
        'true-false', 'truefalse', 'multichoice', 'matching',
        'essay', 'shortanswer', 'ddmarker', 'ddimageortext', 'gapselect',
        'quiz', 'test' // Note: 'exam' is NOT excluded - it's a valid content tag
      ];
      
      const contentTags = Array.from(allTagsMap.values())
        .filter(tagInfo => !systemTags.includes(tagInfo.name.toLowerCase()))
        .sort((a, b) => {
          // Sort by usage count (descending), then alphabetically
          if (b.count !== a.count) {
            return b.count - a.count;
          }
          return a.displayName.localeCompare(b.displayName);
        });

      console.log(` Final result: ${contentTags.length} content tags after filtering and deduplication`);
      console.log(' Top 10 tags by usage:', contentTags.slice(0, 10).map(t => `${t.displayName} (${t.count})`));
      
      // Extract just the tag names for the dropdown (using proper case)
      const tagNames = contentTags.map(tagInfo => tagInfo.displayName);
      
      setApiTags(tagNames);
      return tagNames;
    } catch (error) {
      console.error(' Failed to fetch all tags:', error);
      setApiTags([]);
      return [];
    } finally {
      setLoadingTags(false);
      setTagStats(prev => ({ ...prev, loaded: prev.total }));
    }
  };

  // Fetch categories from API
  const fetchCategoriesFromAPI = async () => {
    try {
      setLoadingCategories(true);
      console.log(' Fetching categories from API...');
      
      const response = await fetch(`${API_BASE_URL}/questions/categories`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      console.log('Categories API response:', data);
      
      // Handle different response formats
      let categories = [];
      if (Array.isArray(data)) {
        categories = data;
      } else if (Array.isArray(data.categories)) {
        categories = data.categories;
      } else if (data.success && Array.isArray(data.data)) {
        categories = data.data;
      }
      
      // Transform to expected format
      const transformedCategories = [
        { value: 'All', label: 'All Categories' },
        ...categories.map(cat => ({
          value: cat.id || cat.value || cat.categoryid,
          label: cat.name || cat.label || cat.categoryname || `Category ${cat.id}`
        }))
      ];
      
      console.log(`Loaded ${transformedCategories.length - 1} categories from API`);
      setApiCategories(transformedCategories);
      return transformedCategories;
    } catch (error) {
      console.error(' Failed to fetch categories:', error);
      setApiCategories([{ value: 'All', label: 'All Categories' }]);
      return [{ value: 'All', label: 'All Categories' }];
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch question types from API
  const fetchQuestionTypesFromAPI = async () => {
    try {
      setLoadingApiQuestionTypes(true);
      console.log('🔧 Fetching question types from API...');
      
      const response = await fetch(`${API_BASE_URL}/questions/qtypes`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      console.log('🔧 Question types API response:', data);
      
      // Handle different response formats
      let types = [];
      if (Array.isArray(data)) {
        types = data;
      } else if (Array.isArray(data.types)) {
        types = data.types;
      } else if (data.success && Array.isArray(data.data)) {
        types = data.data;
      }
      
      // Transform to expected format
      const transformedTypes = [
        { value: 'All', label: 'All Question Types' },
        ...types.map(type => ({
          value: type.qtype || type.value || type.type,
          label: type.name || type.label || type.qtype || 'Unknown Type',
          description: type.description || ''
        }))
      ];
      
      console.log(` Loaded ${transformedTypes.length - 1} question types from API`);
      setApiQuestionTypes(transformedTypes);
      return transformedTypes;
    } catch (error) {
      console.error(' Failed to fetch question types:', error);
      setApiQuestionTypes([{ value: 'All', label: 'All Question Types' }]);
      return [{ value: 'All', label: 'All Question Types' }];
    } finally {
      setLoadingApiQuestionTypes(false);
    }
  };

  // Fetch question statuses from existing questions
  const fetchQuestionStatusesFromAPI = async () => {
    try {
      setLoadingStatuses(true);
      console.log('Extracting question statuses from API...');
      
      const response = await fetch(`${API_BASE_URL}/questions/filters?page=1&perpage=100`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      const data = await handleAPIResponse(response);
      
      let questions = [];
      if (Array.isArray(data.questions)) {
        questions = data.questions;
      } else if (Array.isArray(data)) {
        questions = data;
      }
      
      const statusSet = new Set();
      
      questions.forEach(question => {
        if (question.status) statusSet.add(question.status);
        // Add any other status field variations your API might use
      });
      
      // Add standard statuses that should always be available
      statusSet.add('ready');
      statusSet.add('draft');
      // statusSet.add('hidden');
      
      const statuses = Array.from(statusSet).filter(Boolean).sort();
      
      console.log(` Extracted ${statuses.length} unique statuses:`, statuses);
      
      setQuestionStatuses(statuses);
      return statuses;
    } catch (error) {
      console.error(' Failed to fetch question statuses:', error);
      setQuestionStatuses(['ready', 'draft', ]); // Fallback
      return ['ready', 'draft', ];
    } finally {
      setLoadingStatuses(false);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log(' Loading ALL filter data from API...');
        
        // Load all data in parallel for better performance
        const [tagsResult, statusesResult, categoriesResult, typesResult] = await Promise.all([
          fetchAllTagsFromAPI(),
          fetchQuestionStatusesFromAPI(),
          fetchCategoriesFromAPI(),
          fetchQuestionTypesFromAPI()
        ]);
        
        console.log(' All filter data loaded successfully', {
          tags: tagsResult.length,
          statuses: statusesResult.length,
          categories: categoriesResult.length - 1, // Subtract 'All' option
          questionTypes: typesResult.length - 1    // Subtract 'All' option
        });
      } catch (error) {
        console.error(' Error loading initial filter data:', error);
      }
    };
    
    loadInitialData();
  }, []); // Only run on mount

  // Combine frontend tags with API tags and handle case-insensitive deduplication
  const combinedTags = React.useMemo(() => {
    const frontendTags = Array.isArray(allTags) ? allTags.filter(tag => tag !== 'All') : [];
    const allCombined = [...apiTags, ...frontendTags];
    
    // System tags to exclude
    const systemTags = [
      'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
      'ready', 'draft', 'hidden', 'published',
      'true-false', 'truefalse', 'multichoice', 'matching',
      'essay', 'shortanswer', 'ddmarker', 'ddimageortext', 'gapselect',
      'quiz', 'test' // 'exam' is kept as content tag
    ];
    
    // Case-insensitive deduplication using Map
    const uniqueTagsMap = new Map();
    
    allCombined.forEach(tag => {
      if (tag && typeof tag === 'string') {
        const lowerKey = tag.toLowerCase().trim();
        
        // Skip system tags
        if (!systemTags.includes(lowerKey) && lowerKey !== '') {
          if (!uniqueTagsMap.has(lowerKey)) {
            // Use proper case: capitalize first letter, rest lowercase
            const properCase = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
            uniqueTagsMap.set(lowerKey, properCase);
          }
        }
      }
    });
    
    // Convert back to array and sort
    const result = Array.from(uniqueTagsMap.values()).sort();
    
    console.log(' FiltersRow tag deduplication:', {
      original_count: allCombined.length,
      after_dedup: result.length,
      original_tags: allCombined,
      deduplicated_tags: result
    });
    
    return result;
  }, [allTags, apiTags]);

  // Manual refresh function
  const handleRefreshData = async () => {
    console.log(' Manual refresh triggered for all filter data...');
    await Promise.all([
      fetchAllTagsFromAPI(),
      fetchQuestionStatusesFromAPI(),
      fetchCategoriesFromAPI(),
      fetchQuestionTypesFromAPI()
    ]);
  };

  // Use API data if available, fallback to props
  const finalCategories = apiCategories.length > 0 ? apiCategories : availableCategories;
  const finalQuestionTypes = apiQuestionTypes.length > 0 ? apiQuestionTypes : availableQuestionTypes;
  const isLoadingAnyData = loadingTags || loadingStatuses || loadingCategories || loadingApiQuestionTypes;

  return (
    <div className="p-4 border-t border-b border-gray-200 bg-gray-50 flex flex-wrap gap-3 items-center">
      {/* Search Input */}
      <div className="relative flex-grow max-w-md">
        <input
          type="text"
          placeholder="Search questions..."
          className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <div className="relative">
        <select 
          className="border rounded py-2 px-3 pr-8 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          disabled={loadingCategories}
        >
          {loadingCategories ? (
            <option value="All">Loading categories...</option>
          ) : (
            finalCategories.map((category, idx) => (
              <option key={`category-${category.value || idx}`} value={category.value}>
                {category.label}
              </option>
            ))
          )}
        </select>
      </div>
      
      {/* Status Filter */}
      <div className="relative">
        <select 
          className="border rounded py-2 px-3 pr-8 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          disabled={loadingStatuses}
        >
          <option value="All">
            {loadingStatuses ? 'Loading...' : `All Statuses (${questionStatuses.length})`}
          </option>
          {questionStatuses.map((status, idx) => (
            <option key={`status-${idx}`} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Question Type Filter */}
      <div className="relative">
        <select 
          className="border rounded py-2 px-3 pr-8 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          disabled={loadingApiQuestionTypes}
        >
          {loadingApiQuestionTypes ? (
            <option value="All">Loading question types...</option>
          ) : (
            finalQuestionTypes.map((type, idx) => (
              <option key={`type-${type.value}-${idx}`} value={type.value}>
                {type.label} {type.description && `- ${type.description.slice(0, 30)}...`}
              </option>
            ))
          )}
        </select>
      </div>
      
      {/* Tag Filter */}
      <div className="relative">
        <select
          className="border rounded py-2 px-3 pr-8 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={tagFilter}
          onChange={e => setTagFilter(e.target.value)}
          disabled={loadingTags}
        >
          <option value="All">
            {loadingTags 
              ? `Loading tags... (${tagStats.loaded}/${tagStats.total})`
              : `All Tags (${combinedTags.length})`
            }
          </option>
          {combinedTags.map((tag, idx) => (
            <option key={`tag-${tag}-${idx}`} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* Refresh Tags Button */}
        {/* <button
          onClick={fetchAllTagsFromAPI}
          disabled={loadingTags}
          className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Refresh tags from all questions"
        >
          {loadingTags ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
              Tags
            </>
          ) : (
            <>
               Tags
            </>
          )}
        </button> */}

        {/* Refresh All Data Button */}
        <button
          onClick={handleRefreshData}
          disabled={isLoadingAnyData}
          className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh all filter data from API"
        >
          {isLoadingAnyData ? '⟳' : '↻'} Refresh
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
      </div>

      {/* Loading Indicators */}
      {isLoadingAnyData && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
          <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent"></div>
          <span>
            {loadingTags && `Loading tags (${tagStats.loaded}/${tagStats.total})`}
            {loadingStatuses && 'Loading statuses'}
            {loadingCategories && 'Loading categories'}
            {loadingApiQuestionTypes && 'Loading types'}
          </span>
        </div>
      )}

      {/* Development Status Panel */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="w-full mt-2 p-2 bg-white rounded border text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <strong className="text-blue-600">Categories:</strong>
              <div>{finalCategories.length - 1} loaded</div>
              {finalCategories.length <= 1 && (
                <div className="text-orange-500">⚠️ API: /questions/categories</div>
              )}
            </div>
            <div>
              <strong className="text-green-600">Statuses:</strong>
              <div>{questionStatuses.length} available</div>
              <div className="text-gray-500">{questionStatuses.join(', ')}</div>
            </div>
            <div>
              <strong className="text-purple-600">Question Types:</strong>
              <div>{finalQuestionTypes.length - 1} loaded</div>
              {finalQuestionTypes.length <= 1 && (
                <div className="text-orange-500">⚠️ API: /questions/qtypes</div>
              )}
            </div>
            <div>
              <strong className="text-orange-600">Content Tags:</strong>
              <div>{combinedTags.length} available</div>
              {loadingTags && (
                <div className="text-blue-500">
                  Progress: {tagStats.loaded}/{tagStats.total}
                </div>
              )}
            </div>
          </div>
          {combinedTags.length > 0 && (
            <div className="mt-2">
              <strong>Available Tags (deduplicated):</strong>
              <div className="text-gray-600 max-h-20 overflow-y-auto">
                {combinedTags.slice(0, 20).join(', ')}
                {combinedTags.length > 20 && ` ... and ${combinedTags.length - 20} more`}
              </div>
            </div>
          )}
          {(finalCategories.length <= 1 || finalQuestionTypes.length <= 1) && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <strong className="text-yellow-700">Missing Data:</strong>
              <div className="text-yellow-600 text-xs">
                {finalCategories.length <= 1 && "• Categories not loading - check API: /questions/categories"}
                {finalQuestionTypes.length <= 1 && "• Question types not loading - check API: /questions/qtypes"}
              </div>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};

export default FiltersRow;