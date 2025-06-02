// components/FiltersRow.jsx
import React from 'react';

const FiltersRow = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  tagFilter,
  setTagFilter,
  allTags
}) => {
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
      </select>
      
      <select 
        className="border rounded py-2 px-3"
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
      >
        <option value="All">All Question Types</option>
        <option value="multiple">Multiple Choice</option>
        <option value="truefalse">True False</option>
        <option value="essay">Essay</option>
        <option value="matching">Matching</option>
        <option value="shortanswer">Short Answer</option>
      </select>
      
      {/* Enhanced Tag Filter */}
      <select
        className="border rounded py-2 px-3 min-w-[150px]"
        value={tagFilter}
        onChange={e => setTagFilter(e.target.value)}
      >
        <option value="All">All Tags ({allTags.length} total)</option>
        
        {/* Difficulty Tags */}
        <optgroup label="Difficulty">
          {allTags.filter(tag => ['easy', 'medium', 'hard'].includes(tag)).map(tag => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </optgroup>
        
        {/* Subject Tags */}
        <optgroup label="Subjects">
          {allTags.filter(tag => 
            ['programming', 'algorithms', 'databases', 'networking', 'web development', 
             'operating systems', 'security', 'ai', 'machine learning'].includes(tag)
          ).map(tag => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() + tag.slice(1).replace(/([A-Z])/g, ' $1')}
            </option>
          ))}
        </optgroup>
        
        {/* Technology Tags */}
        <optgroup label="Technologies">
          {allTags.filter(tag => 
            ['python', 'java', 'javascript', 'html', 'css', 'sql', 'c++'].includes(tag)
          ).map(tag => (
            <option key={tag} value={tag}>
              {tag.toUpperCase()}
            </option>
          ))}
        </optgroup>
        
        {/* Assessment Type Tags */}
        <optgroup label="Assessment Types">
          {allTags.filter(tag => 
            ['quiz', 'exam', 'assignment', 'practice', 'lab', 'project'].includes(tag)
          ).map(tag => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </optgroup>
        
        {/* Other Tags */}
        <optgroup label="Other">
          {allTags.filter(tag => 
            !['easy', 'medium', 'hard', 'programming', 'algorithms', 'databases', 'networking', 
              'web development', 'operating systems', 'security', 'ai', 'machine learning',
              'python', 'java', 'javascript', 'html', 'css', 'sql', 'c++',
              'quiz', 'exam', 'assignment', 'practice', 'lab', 'project'].includes(tag)
          ).map(tag => (
            <option key={tag} value={tag}>
              {tag.charAt(0).toUpperCase() + tag.slice(1).replace(/([A-Z])/g, ' $1')}
            </option>
          ))}
        </optgroup>
      </select>

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
    </div>
  );
};

export default FiltersRow;