// hooks/useFilters.js
import { useState, useMemo } from 'react';

export const useFilters = (questions) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('All');
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    type: 'All'
  });

  const allTags = useMemo(() => {
    return Array.from(
      new Set(
        questions
          .flatMap(q => Array.isArray(q.tags) ? q.tags : [])
          .filter(Boolean)
      )
    );
  }, [questions]);

   const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const text = String(q.title || q.name || q.questiontext || '');
      return (
        text.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filters.type === 'All' || q.questionType === filters.type) &&
        (filters.status === 'All' || q.status === filters.status) &&
        (tagFilter === 'All' || (Array.isArray(q.tags) && q.tags.includes(tagFilter)))
      );
    });
  }, [questions, searchQuery, filters, tagFilter]);
  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    tagFilter,
    setTagFilter,
    filteredQuestions,
    allTags
  };
};