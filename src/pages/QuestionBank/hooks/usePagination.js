// hooks/usePagination.js
import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { paginatedItems, startIdx, endIdx } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      paginatedItems: items.slice(start, end),
      startIdx: start,
      endIdx: end
    };
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedQuestions: paginatedItems,
    startIdx,
    endIdx,
    questionsPerPage: itemsPerPage
  };
};