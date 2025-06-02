// QuestionBank.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Edit, Eye, Copy, Clock, Trash, X, CheckCircle, AlertTriangle, Check } from 'lucide-react';
import { XMLParser } from 'fast-xml-parser';

// Import shared components (correct paths from pages/QuestionBank/)
import CreateQuestionModal from '../../components/modals/CreateQuestionModal';
import CreateTrueFalseQuestion from '../../components/questions/CreateTrueFalseQuestion';
import CreateMultipleChoiceQuestion from '../../components/questions/CreateMultipleChoiceQuestion';
import BulkEditQuestionsModal from '../../components/modals/BulkEditQuestionsModal';

// Import hooks and utilities
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

// Constants
import { EDIT_COMPONENTS, BULK_EDIT_COMPONENTS } from './constants/questionTypes';
import { MOCK_QUESTIONS } from './constants/mockData';

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
    deleteQuestion,
    changeStatus
  } = useQuestionBank(MOCK_QUESTIONS);

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

  return (
    <div className="max-w-full">
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
        />
      )}

      <FiltersRow
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        allTags={allTags}
      />

      <QuestionsTable
        questions={paginatedQuestions}
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
        onEdit={setEditingQuestionData}
        onDuplicate={duplicateQuestion}
        onHistory={setHistoryModal}
        onDelete={deleteQuestion}
        onStatusChange={changeStatus}
        username={username}
      />

      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        startIdx={startIdx}
        endIdx={endIdx}
        totalQuestions={filteredQuestions.length}
      />

      <Modals
        // Create modals
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        showTrueFalseModal={showTrueFalseModal}
        setShowTrueFalseModal={setShowTrueFalseModal}
        showMultipleChoiceModal={showMultipleChoiceModal}
        setShowMultipleChoiceModal={setShowMultipleChoiceModal}
        
        // Edit modals
        showBulkEditModal={showBulkEditModal}
        setShowBulkEditModal={setShowBulkEditModal}
        editingQuestionData={editingQuestionData}
        setEditingQuestionData={setEditingQuestionData}
        
        // Preview/History modals
        previewQuestion={previewQuestion}
        setPreviewQuestion={setPreviewQuestion}
        historyModal={historyModal}
        setHistoryModal={setHistoryModal}
        
        // Save confirmation
        showSaveConfirm={showSaveConfirm}
        setShowSaveConfirm={setShowSaveConfirm}
        editingQuestion={editingQuestion}
        setEditingQuestion={setEditingQuestion}
        newQuestionTitle={newQuestionTitle} // Add this missing prop
        
        // Data
        questions={questions}
        setQuestions={setQuestions}
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
        username={username}
        
        // Components
        EDIT_COMPONENTS={EDIT_COMPONENTS}
        BULK_EDIT_COMPONENTS={BULK_EDIT_COMPONENTS}
      />
    </div>
  );
};

export default QuestionBank;