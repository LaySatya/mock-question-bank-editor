// components/FiltersRow.jsx - CORRECTED VERSION
import React, { useState, useEffect } from 'react';

const FiltersRow = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  tagFilter,
  setTagFilter,
  allTags
}) => {
  const [apiTags, setApiTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);

  // API configuration
  const API_CONFIG = {
    baseUrl: 'http://10.5.5.205/webservice/rest/server.php',
    token: '8d41e900cc3390b598e3e44a293e99d8',
    format: 'json'
  };

  // FIXED: Safe tag normalization function
  const normalizeTag = (tag) => {
    if (typeof tag === 'string') {
      return tag.trim();
    } else if (typeof tag === 'object' && tag !== null) {
      // Handle tag objects with common properties
      return tag.name || tag.text || tag.value || tag.label || String(tag);
    }
    return String(tag || '').trim();
  };

  // FIXED: Combine and process all tags safely
  const combinedTags = React.useMemo(() => {
    const processedAllTags = Array.isArray(allTags) 
      ? allTags.map(normalizeTag).filter(tag => tag && tag.length > 0)
      : [];
    
    const processedApiTags = Array.isArray(apiTags) 
      ? apiTags.map(normalizeTag).filter(tag => tag && tag.length > 0)
      : [];
    
    // Combine and deduplicate
    const combined = [...processedAllTags, ...processedApiTags];
    const uniqueTags = [...new Set(combined.map(tag => tag.toLowerCase()))];
    
    return uniqueTags;
  }, [allTags, apiTags]);

  // Fetch tags for a specific question
  const fetchTagsForQuestion = async (questionId) => {
    try {
      const url = `${API_CONFIG.baseUrl}?wstoken=${API_CONFIG.token}&wsfunction=local_idgqbank_get_tags_for_question&moodlewsrestformat=${API_CONFIG.format}&questionid=${questionId}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error || data.errorcode) {
        console.error('API Error:', data.error || data.message);
        return [];
      }
      
      // Handle different API response formats
      if (Array.isArray(data)) {
        return data.map(normalizeTag);
      } else if (Array.isArray(data.tags)) {
        return data.tags.map(normalizeTag);
      } else if (data.success && Array.isArray(data.data)) {
        return data.data.map(normalizeTag);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      return [];
    }
  };

  // Fetch all available tags from multiple questions
  const fetchAllAvailableTags = async (questionIds = []) => {
    if (questionIds.length === 0) return [];
    
    try {
      setLoadingTags(true);
      const tagPromises = questionIds.map(id => fetchTagsForQuestion(id));
      const allTagsArrays = await Promise.all(tagPromises);
      
      // Flatten and deduplicate tags
      const flatTags = allTagsArrays.flat().map(normalizeTag).filter(Boolean);
      const uniqueTags = [...new Set(flatTags.map(tag => tag.toLowerCase()))];
      
      setApiTags(uniqueTags);
      return uniqueTags;
    } catch (error) {
      console.error('Failed to fetch all tags:', error);
      return [];
    } finally {
      setLoadingTags(false);
    }
  };

  // Alternative: Fetch tags from a custom endpoint that returns all tags
  const fetchAllTagsFromAPI = async () => {
    try {
      setLoadingTags(true);
      // You might need a different API function that returns all available tags
      const url = `${API_CONFIG.baseUrl}?wstoken=${API_CONFIG.token}&wsfunction=local_idgqbank_get_all_tags&moodlewsrestformat=${API_CONFIG.format}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error || data.errorcode) {
        console.error('API Error:', data.error || data.message);
        return [];
      }
      
      // Process the response safely
      let tags = [];
      if (Array.isArray(data)) {
        tags = data.map(normalizeTag);
      } else if (Array.isArray(data.tags)) {
        tags = data.tags.map(normalizeTag);
      } else if (data.success && Array.isArray(data.data)) {
        tags = data.data.map(normalizeTag);
      }
      
      const processedTags = tags.filter(Boolean).map(tag => tag.toLowerCase());
      const uniqueTags = [...new Set(processedTags)];
      
      setApiTags(uniqueTags);
      return uniqueTags;
    } catch (error) {
      console.error('Failed to fetch all tags:', error);
      return [];
    } finally {
      setLoadingTags(false);
    }
  };

  // Load tags on component mount
  useEffect(() => {
    // For now, we'll use the existing allTags prop
    // Uncomment one of these options when ready:
    
    // Option 1: If you have a list of question IDs
    // const questionIds = [188, 189, 190]; // Replace with actual question IDs
    // fetchAllAvailableTags(questionIds);
    
    // Option 2: If you have an API endpoint for all tags
    // fetchAllTagsFromAPI();
  }, []);

  // FIXED: Safe categorization with proper error handling
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
          'computer science', 'mathematics', 'physics', 'chemistry', 'biology'
        ], tag)
      ),
      technologies: combinedTags.filter(tag => 
        safeIncludes([
          'python', 'java', 'javascript', 'html', 'css', 'sql', 'c++', 
          'react', 'node', 'php', 'angular', 'vue', 'typescript'
        ], tag)
      ),
      assessmentTypes: combinedTags.filter(tag => 
        safeIncludes([
          'quiz', 'exam', 'assignment', 'practice', 'lab', 'project', 
          'homework', 'test', 'midterm', 'final'
        ], tag)
      ),
      other: combinedTags.filter(tag => {
        const normalizedTag = normalizeTag(tag).toLowerCase();
        const allKnownTags = [
          'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
          'programming', 'algorithms', 'databases', 'networking', 'web development', 
          'operating systems', 'security', 'ai', 'machine learning', 'data structures',
          'computer science', 'mathematics', 'physics', 'chemistry', 'biology',
          'python', 'java', 'javascript', 'html', 'css', 'sql', 'c++', 
          'react', 'node', 'php', 'angular', 'vue', 'typescript',
          'quiz', 'exam', 'assignment', 'practice', 'lab', 'project', 
          'homework', 'test', 'midterm', 'final'
        ];
        return !allKnownTags.includes(normalizedTag);
      })
    };
  }, [combinedTags]);

  // FIXED: Safe tag display function
  const formatTagDisplay = (tag) => {
    const normalized = normalizeTag(tag);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/([A-Z])/g, ' $1');
  };

  // Refresh tags function
  const handleRefreshTags = async () => {
    console.log('Refreshing tags...');
    // You can uncomment one of these based on your setup:
    // await fetchAllTagsFromAPI();
    // Or if you have question IDs:
    // const questionIds = [188, 189, 190]; // Replace with actual IDs
    // await fetchAllAvailableTags(questionIds);
  };

  return (
    <div className="p-4 border-t border-b border-gray-200 bg-gray-50 flex flex-wrap gap-3 items-center">
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
      
      <select 
        className="border rounded py-2 px-3"
        value={filters.category}
        onChange={(e) => setFilters({...filters, category: e.target.value})}
      >
        <option value="All">All Categories</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Language">Language</option>
      </select>
      
      <select 
        className="border rounded py-2 px-3"
        value={filters.status}
        onChange={(e) => setFilters({...filters, status: e.target.value})}
      >
        <option value="All">All Statuses</option>
        <option value="ready">Ready</option>
        <option value="draft">Draft</option>
        <option value="hidden">Hidden</option>
      </select>
      
      <select 
        className="border rounded py-2 px-3"
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
      >
        <option value="All">All Question Types</option>
        <option value="multichoice">Multiple Choice</option>
        <option value="truefalse">True False</option>
        <option value="essay">Essay</option>
        <option value="matching">Matching</option>
        <option value="match">Match</option>
        <option value="shortanswer">Short Answer</option>
        <option value="ddimageortext">Drag and Drop</option>
        <option value="gapselect">Gap Select</option>
        <option value="ddmarker">Drag and Drop Markers</option>
      </select>
      
      {/* FIXED: Enhanced Tag Filter with proper error handling */}
      <select
        className="border rounded py-2 px-3 min-w-[150px]"
        value={tagFilter}
        onChange={e => setTagFilter(e.target.value)}
        disabled={loadingTags}
      >
        <option value="All">
          {loadingTags ? 'Loading tags...' : `All Tags (${combinedTags.length} total)`}
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

      {/* Refresh Tags Button */}
      <button
        onClick={handleRefreshTags}
        disabled={loadingTags}
        className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title="Refresh tags from API"
      >
        {loadingTags ? '⟳' : '↻'} Refresh Tags
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
          Clear All Filters
        </button>
      )}

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Tags: {combinedTags.length} | 
          D: {categorizedTags.difficulty.length} | 
          S: {categorizedTags.subjects.length} | 
          T: {categorizedTags.technologies.length} | 
          A: {categorizedTags.assessmentTypes.length} | 
          O: {categorizedTags.other.length}
        </div>
      )}
    </div>
  );
};

// Helper function to fetch tags for multiple questions (use this in your parent component)
export const fetchTagsForQuestions = async (questionIds, apiConfig) => {
  const { baseUrl, token, format } = apiConfig;
  
  if (!questionIds || questionIds.length === 0) {
    return [];
  }
  
  try {
    const tagPromises = questionIds.map(async (questionId) => {
      try {
        const url = `${baseUrl}?wstoken=${token}&wsfunction=local_idgqbank_get_tags_for_question&moodlewsrestformat=${format}&questionid=${questionId}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error || data.errorcode) {
          console.error(`Error fetching tags for question ${questionId}:`, data.error || data.message);
          return [];
        }
        
        // Handle different response formats
        if (Array.isArray(data)) {
          return data;
        } else if (Array.isArray(data.tags)) {
          return data.tags;
        } else if (data.success && Array.isArray(data.data)) {
          return data.data;
        }
        
        return [];
      } catch (error) {
        console.error(`Network error fetching tags for question ${questionId}:`, error);
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
    
    return uniqueTags;
  } catch (error) {
    console.error('Failed to fetch tags for questions:', error);
    return [];
  }
};

export default FiltersRow;