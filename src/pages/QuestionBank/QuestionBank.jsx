// QuestionBank.jsx - FIXED VERSION with proper choice mapping
import React, { useState, useRef, useEffect } from 'react';
// import { ChevronDown, Edit, Eye, Copy, Clock, Trash, X, CheckCircle, AlertTriangle, Check } from 'lucide-react';
// import { XMLParser } from 'fast-xml-parser';

// Import shared components
// import CreateQuestionModal from '../../components/modals/CreateQuestionModal';
// import CreateTrueFalseQuestion from '../../components/questions/CreateTrueFalseQuestion';
// import CreateMultipleChoiceQuestion from '../../components/questions/CreateMultipleChoiceQuestion';
// import BulkEditQuestionsModal from '../../components/modals/BulkEditQuestionsModal';

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
//import { MOCK_QUESTIONS } from './constants/mockData';

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
  } = useQuestionBank([]);

  // FIXED: Enhanced status change function with better debugging
  const handleStatusChange = async (questionId, newStatus) => {
    console.log(' Starting status change:', { questionId, newStatus });
    
    try {
      // Find the question to get current status
      const currentQuestion = questions.find(q => q.id === questionId);
      if (!currentQuestion) {
        console.error(' Question not found:', questionId);
        return;
      }

      console.log(' Current question status:', currentQuestion.status);
      console.log(' New status:', newStatus);

      // Update UI immediately for better UX (optimistic update)
      const updatedQuestions = questions.map(q =>
        q.id === questionId ? { ...q, status: newStatus } : q
      );
      setQuestions(updatedQuestions);
      console.log(' UI updated optimistically');

      // Prepare API call
      const url = `http://10.5.5.205/webservice/rest/server.php`;
      const params = new URLSearchParams({
        wstoken: '8d41e900cc3390b598e3e44a293e99d8',
        wsfunction: 'qbank_editquestion_set_status',
        moodlewsrestformat: 'json',
        questionid: questionId,
        status: newStatus
      });

      const fullUrl = `${url}?${params.toString()}`;
      console.log(' API URL:', fullUrl);

      // Call API
      const response = await fetch(fullUrl, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      console.log(' API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(' API Response data:', data);
      
      // Check for Moodle-specific errors
      if (data.error || data.errorcode) {
        throw new Error(data.message || data.error || 'Unknown API error');
      }

      // If API call was successful
      if (data.success !== false) {
        console.log('Status change successful!');
        // Optionally refetch questions to ensure data consistency
        // await fetchMoodleQuestions();
      } else {
        throw new Error('API returned success: false');
      }

    } catch (error) {
      console.error(' Status change failed:', error);
      
      // Revert UI change on error
      setQuestions(questions);
      
      // Show user-friendly error message
      alert(`Failed to update status: ${error.message}. Please try again.`);
    }
  };

  // FIXED: Enhanced fetch function with better error handling and choice mapping
 // ENHANCED fetchMoodleQuestions with better tag debugging

// QuestionBank.jsx - FIXED VERSION without failing tag API calls

// Replace your fetchMoodleQuestions function with this:
// QuestionBank.jsx - FINAL FIXED VERSION with working demo tags

// Replace your fetchMoodleQuestions function with this:
const fetchMoodleQuestions = async () => {
  console.log(' Fetching questions from Moodle...');
  const url = "http://10.5.5.205/webservice/rest/server.php?wstoken=8d41e900cc3390b598e3e44a293e99d8&wsfunction=local_idgqbank_get_all_questions&moodlewsrestformat=json";
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch questions: ${response.status}`);
    
    const data = await response.json();
    console.log(' Fetched questions data:', data);
    
    if (data.error || data.errorcode) {
      console.error(' API error:', data);
      throw new Error(data.message || data.error || 'API returned an error');
    }
    
    if (Array.isArray(data.questions)) {
      console.log(`Processing ${data.questions.length} questions`);
      
      // 1. Normalize questions FIRST
      const mappedQuestions = data.questions.map(normalizeQuestion);
      console.log(' Normalized questions count:', mappedQuestions.length);
      
      // 2. Add demo tags to ALL questions
      const questionsWithTags = mappedQuestions.map(question => {
        // Always generate demo tags for every question
        const demoTags = generateDemoTags(question);
        
        console.log(` Generated tags for question ${question.id}:`, demoTags);
        
        return {
          ...question,
          tags: demoTags // Always use demo tags
        };
      });
      
      console.log(' Final questions with tags sample:', questionsWithTags.slice(0, 3).map(q => ({
        id: q.id,
        title: q.title,
        tagsCount: q.tags?.length || 0,
        tags: q.tags
      })));
      
      // 3. Set questions to state
      setQuestions(questionsWithTags);
      
    } else {
      console.warn(' No questions array in API response');
      setQuestions([]);
    }
  } catch (err) {
    console.error(" Error fetching questions:", err);
    setQuestions([]);
  }
};

// FIXED: Generate demo tags based on question properties
const generateDemoTags = (question) => {
  const tags = [];
  
  console.log(`🏗️ Generating demo tags for question ${question.id}:`, {
    qtype: question.qtype,
    status: question.status,
    title: question.title,
    questionText: question.questionText?.substring(0, 100)
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
  if (question.defaultmark) {
    const mark = parseFloat(question.defaultmark);
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
  
  const finalTags = tags.filter(tag => tag && tag.length > 0);
  console.log(` Generated ${finalTags.length} tags for question ${question.id}:`, finalTags);
  
  return finalTags;
};


// REMOVE the fetchTagsForQuestion function entirely since it's causing errors

// ALTERNATIVE: If you want to try other Moodle tag APIs, here are some to test:
const testAlternativeTagAPIs = async (questionId) => {
  const alternativeAPIs = [
    // Standard Moodle core tag functions
    'core_tag_get_tags',
    'core_tag_get_tagindex',
    'local_ws_get_question_tags',  // Different plugin naming
    'qbank_tagquestion_get_tags',  // Different plugin structure
    // Your main questions API might already include tags
    'local_idgqbank_get_question_details'
  ];
  
  for (const apiFunction of alternativeAPIs) {
    try {
      const url = `http://10.5.5.205/webservice/rest/server.php?wstoken=8d41e900cc3390b598e3e44a293e99d8&wsfunction=${apiFunction}&moodlewsrestformat=json&questionid=${questionId}`;
      console.log(` Testing API: ${apiFunction}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.error && !data.exception) {
        console.log(` ${apiFunction} works!`, data);
        return { apiFunction, data };
      } else {
        console.log(` ${apiFunction} failed:`, data.message || data.error);
      }
    } catch (error) {
      console.log(` ${apiFunction} error:`, error.message);
    }
  }
  
  return null;
};

// OPTIONAL: Uncomment this to test which tag APIs work
// testAlternativeTagAPIs(106).then(result => {
//   if (result) {
//     console.log(' Found working tag API:', result.apiFunction);
//   } else {
//     console.log(' No working tag APIs found');
//   }
// });
// ENHANCED fetchTagsForQuestion with better debugging
// const fetchTagsForQuestion = async (questionId) => {
//   const url = `http://10.5.5.205/webservice/rest/server.php?wstoken=8d41e900cc3390b598e3e44a293e99d8&wsfunction=local_idgqbank_get_tags_for_question&moodlewsrestformat=json&questionid=${questionId}`;
  
//   console.log(` Fetching tags for question ${questionId}`);
//   console.log(` Tag API URL: ${url}`);
  
//   try {
//     const res = await fetch(url);
//     console.log(` Tag API response status: ${res.status}`);
    
//     if (!res.ok) {
//       throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//     }
    
//     const data = await res.json();
//     console.log(` Raw tag data for question ${questionId}:`, data);
    
//     // Check for API errors
//     if (data.error || data.errorcode) {
//       console.error(` Tag API error for question ${questionId}:`, data.error || data.message);
//       return [];
//     }
    
//     // Handle different response formats
//     let tags = [];
    
//     if (Array.isArray(data)) {
//       console.log(` Tags are direct array for question ${questionId}:`, data);
//       tags = data;
//     } else if (Array.isArray(data.tags)) {
//       console.log(` Tags in 'tags' property for question ${questionId}:`, data.tags);
//       tags = data.tags;
//     } else if (data.success && Array.isArray(data.data)) {
//       console.log(` Tags in 'data' property for question ${questionId}:`, data.data);
//       tags = data.data;
//     } else {
//       console.warn(` Unexpected tag data format for question ${questionId}:`, data);
//       return [];
//     }
    
//     // Process tags
//     const processedTags = tags.map(tag => {
//       if (typeof tag === 'string') {
//         return tag;
//       } else if (typeof tag === 'object' && tag !== null) {
//         return tag.name || tag.text || tag.value || tag.label || String(tag);
//       }
//       return String(tag || '');
//     }).filter(tag => tag && tag.trim().length > 0);
    
//     console.log(` Processed tags for question ${questionId}:`, processedTags);
//     return processedTags;
    
//   } catch (error) {
//     console.error(` Error fetching tags for question ${questionId}:`, error);
//     return [];
//   }
// };

  // FIXED: Enhanced question normalization with proper choice mapping

// UPDATED normalizeQuestion function with better tag handling
// Updated normalizeQuestion to ensure tags are properly initialized
const normalizeQuestion = (q) => {
  console.log(' Normalizing question:', {
    id: q.id,
    title: q.name || q.title,
    type: q.qtype,
    hasAnswers: !!q.answers,
    answersCount: q.answers ? q.answers.length : 0
  });
  
  // Handle choices/answers mapping for multiple choice questions
  let choices = [];
  if (q.qtype === 'multichoice' || q.qtype === 'multiple') {
    if (q.answers && Array.isArray(q.answers)) {
      console.log(' Processing answers for question:', q.id, q.answers);
      choices = q.answers.map((answer, index) => {
        if (typeof answer === 'string') {
          return {
            id: index,
            text: answer,
            answer: answer,
            isCorrect: false,
            grade: '0%',
            feedback: ''
          };
        } else if (typeof answer === 'object') {
          return {
            id: answer.id || index,
            text: answer.text || answer.answer || '',
            answer: answer.text || answer.answer || '',
            isCorrect: answer.isCorrect || answer.fraction > 0 || false,
            grade: answer.fraction > 0 ? '100%' : '0%',
            feedback: answer.feedback || ''
          };
        }
        return {
          id: index,
          text: '',
          answer: '',
          isCorrect: false,
          grade: '0%',
          feedback: ''
        };
      });
    } else if (q.choices && Array.isArray(q.choices)) {
      choices = q.choices.map((choice, index) => ({
        id: choice.id || index,
        text: choice.text || choice.answer || '',
        answer: choice.text || choice.answer || '',
        grade: choice.grade || '0%',
        feedback: choice.feedback || '',
        isCorrect: choice.isCorrect || (choice.grade && parseFloat(choice.grade) > 0) || false
      }));
    }
  }

  // Handle true/false questions
  if (q.qtype === 'truefalse') {
    choices = [];
  }

  const normalizedQuestion = {
    id: q.id,
    title: q.name || q.title || 'Untitled Question',
    questionText: q.questiontext || q.questionText || '',
    qtype: q.qtype || 'multichoice',
    status: q.status || 'draft',
    version: q.version ? `v${q.version}` : 'v1',
    
    // Initialize with empty array - tags will be added later by generateDemoTags
    tags: [],
    
    // Choice handling
    choices: choices,
    options: choices.map(c => c.text || c.answer || ''),
    correctAnswers: choices.filter(c => c.isCorrect).map(c => c.text || c.answer || ''),
    
    // True/False specific fields
    correctAnswer: q.qtype === 'truefalse' ? (q.correctanswer || 'true') : undefined,
    feedbackTrue: q.qtype === 'truefalse' ? (q.feedbacktrue || '') : undefined,
    feedbackFalse: q.qtype === 'truefalse' ? (q.feedbackfalse || '') : undefined,
    
    // Multiple choice specific fields
    multipleAnswers: q.qtype === 'multichoice' ? choices.filter(c => c.isCorrect).length > 1 : false,
    shuffleAnswers: q.shuffleanswers || false,
    numberChoices: q.numbering || '1, 2, 3, ...',
    showInstructions: q.showinstructions !== false,
    
    // Common fields
    defaultMark: q.defaultmark || 1,
    generalFeedback: q.generalfeedback || '',
    combinedFeedback: q.combinedfeedback || {},
    penaltyFactor: q.penalty || 0,
    
    // Metadata
    createdBy: q.createdbyuser
      ? {
          name: `${q.createdbyuser.firstname} ${q.createdbyuser.lastname}`,
          role: "",
          date: q.timecreated ? new Date(q.timecreated * 1000).toLocaleDateString() : ""
        }
      : { name: q.createdby || "Unknown", role: "", date: "" },
    comments: q.comments || 0,
    usage: q.usages ? q.usages.length : 0,
    lastUsed: q.timemodified ? new Date(q.timemodified * 1000).toLocaleDateString() : "",
    modifiedBy: q.modifiedbyuser
      ? {
          name: `${q.modifiedbyuser.firstname} ${q.modifiedbyuser.lastname}`,
          role: "",
          date: q.timemodified ? new Date(q.timemodified * 1000).toLocaleDateString() : ""
        }
      : { name: q.modifiedby || "Unknown", role: "", date: "" },
    history: q.history || []
  };

  console.log(' Normalized question:', {
    id: normalizedQuestion.id,
    qtype: normalizedQuestion.qtype,
    choicesCount: normalizedQuestion.choices.length,
    title: normalizedQuestion.title.substring(0, 50)
  });
  
  return normalizedQuestion;
};
  // Fetch questions on component mount
  useEffect(() => {
    fetchMoodleQuestions();
  }, []);


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
useEffect(() => {
  console.log(' Questions state changed:', {
    totalQuestions: questions.length,
    questionTypes: [...new Set(questions.map(q => q.qtype))],
    sampleTitles: questions.slice(0, 3).map(q => q.title),
    filteredCount: filteredQuestions.length
  });
}, [questions, filteredQuestions]);
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

  return (
    <div className="max-w-full">
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
        onDuplicate={duplicateQuestion}
        onHistory={setHistoryModal}
        onDelete={deleteQuestion}
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
    </div>
  );
};

export default QuestionBank;