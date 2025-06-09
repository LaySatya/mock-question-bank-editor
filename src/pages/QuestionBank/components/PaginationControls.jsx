import React from 'react';

const PaginationControls = ({ 
  currentPage, 
  setCurrentPage, 
  startIdx, 
  endIdx, 
  totalQuestions, 
  questionsPerPage = 10 
}) => {
  const totalPages = Math.ceil(totalQuestions / questionsPerPage) || 1;

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7; // Reduced for better mobile experience
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Near beginning: 1 2 3 4 5 ... last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis-end');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... n-4 n-3 n-2 n-1 n
        pages.push('ellipsis-start');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In middle: 1 ... current-1 current current+1 ... last
        pages.push('ellipsis-start');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e, page) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePageChange(page);
    }
  };

  const PaginationButton = ({ page, isActive, isDisabled, children, ariaLabel, onClick }) => (
    <button
      className={`
        pagination-btn
        ${isActive ? 'active' : ''}
        ${isDisabled ? 'disabled' : ''}
      `}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      onKeyDown={(e) => !isDisabled && handleKeyDown(e, page)}
    >
      {children}
    </button>
  );

  if (totalQuestions === 0) {
    return (
      <div className="pagination-container">
        <style jsx>{`
          .pagination-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-top: 1px solid #dee2e6;
            border-radius: 0 0 8px 8px;
          }

          .question-info {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2rem;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .info-text {
            color: #6c757d;
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
          }
        `}</style>
        <div className="question-info">
          <span className="info-text">No questions found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pagination-container">
      <style jsx>{`
        .pagination-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-top: 1px solid #dee2e6;
          border-radius: 0 0 8px 8px;
        }

        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 2.5rem;
          height: 2.5rem;
          padding: 0.5rem;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          color: #495057;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          user-select: none;
        }

        .pagination-btn:hover:not(.disabled) {
          background: #e9ecef;
          border-color: #adb5bd;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .pagination-btn:active:not(.disabled) {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          border-color: #0056b3;
          color: white;
          box-shadow: 0 2px 4px rgba(0,123,255,0.25);
        }

        .pagination-btn.active:hover {
          background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
          transform: none;
        }

        .pagination-btn.disabled {
          background: #f8f9fa;
          border-color: #e9ecef;
          color: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .ellipsis {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 2.5rem;
          height: 2.5rem;
          color: #6c757d;
          font-weight: bold;
        }

        .question-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .info-text {
          color: #495057;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .page-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .page-badge {
          background: #e9ecef;
          color: #495057;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.75rem;
        }

        .nav-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .nav-btn {
          min-width: 2.5rem;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .pagination-container {
            padding: 1rem;
          }
          
          .pagination-btn {
            min-width: 2.25rem;
            height: 2.25rem;
            font-size: 0.8rem;
          }
          
          .question-info {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .pagination-wrapper {
            gap: 0.25rem;
          }
          
          .pagination-btn {
            min-width: 2rem;
            height: 2rem;
            font-size: 0.75rem;
          }
        }
      `}</style>

      {totalPages > 1 && (
        <div className="pagination-wrapper" role="navigation" aria-label="Pagination Navigation">
          <div className="nav-buttons">
            <PaginationButton
              page={1}
              isDisabled={currentPage === 1}
              ariaLabel="Go to first page"
              onClick={() => handlePageChange(1)}
            >
              ⟪
            </PaginationButton>
            
            <PaginationButton
              page={currentPage - 1}
              isDisabled={currentPage === 1}
              ariaLabel="Go to previous page"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ⟨
            </PaginationButton>
          </div>

          {pageNumbers.map((pageNum, index) => {
            if (pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end') {
              return (
                <div key={`ellipsis-${index}`} className="ellipsis" aria-hidden="true">
                  ⋯
                </div>
              );
            }
            
            return (
              <PaginationButton
                key={pageNum}
                page={pageNum}
                isActive={currentPage === pageNum}
                ariaLabel={`Go to page ${pageNum}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </PaginationButton>
            );
          })}

          <div className="nav-buttons">
            <PaginationButton
              page={currentPage + 1}
              isDisabled={currentPage >= totalPages}
              ariaLabel="Go to next page"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              ⟩
            </PaginationButton>
            
            <PaginationButton
              page={totalPages}
              isDisabled={currentPage >= totalPages}
              ariaLabel="Go to last page"
              onClick={() => handlePageChange(totalPages)}
            >
              ⟫
            </PaginationButton>
          </div>
        </div>
      )}

      <div className="question-info">
        <span className="info-text">
          Showing <strong>{totalQuestions === 0 ? 0 : startIdx + 1}</strong> to{' '}
          <strong>{Math.min(endIdx, totalQuestions)}</strong> of{' '}
          <strong>{totalQuestions}</strong> questions
        </span>
        
        {totalPages > 1 && (
          <div className="page-info">
            <span>Page</span>
            <span className="page-badge">{currentPage}</span>
            <span>of</span>
            <span className="page-badge">{totalPages}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginationControls;