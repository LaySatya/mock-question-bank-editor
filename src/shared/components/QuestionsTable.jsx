// components/QuestionsTable.jsx - Debug Version for Tag Display
import React, { useEffect } from 'react';

const QuestionsTable = ({
  questions,
  allQuestions,
  filteredQuestions,
  selectedQuestions,
  setSelectedQuestions,
  showQuestionText,
  editingQuestion,
  setEditingQuestion,
  newQuestionTitle,
  setNewQuestionTitle,
  setShowSaveConfirm,
  openActionDropdown,
  setOpenActionDropdown,
  openStatusDropdown,
  setOpenStatusDropdown,
  dropdownRefs,
  onPreview,
  onEdit,
  onDuplicate,
  onHistory,
  onDelete,
  onStatusChange,
  setQType,
  username,
  setQuestions,
}) => {

  // Enhanced tag processing function - handle both string and object formats
  const processTag = (tag) => {
    if (typeof tag === 'string') {
      return { name: tag, id: tag };
    } else if (typeof tag === 'object' && tag !== null) {
      return {
        name: tag.name || tag.rawname || tag.text || tag.value || tag.label || String(tag),
        id: tag.id || tag.name || tag.rawname || tag.text || tag.value || String(tag)
      };
    }
    return { name: String(tag || ''), id: String(tag || '') };
  };

  // Fetch tags for each question if not present
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    
    console.log('🔍 INITIAL CHECK: Questions for tags:', questions.map(q => ({
      id: q.id,
      title: q.title.substring(0, 30) + '...',
      hasTags: Array.isArray(q.tags),
      tagCount: Array.isArray(q.tags) ? q.tags.length : 0,
      tagFormat: Array.isArray(q.tags) && q.tags.length > 0 ? typeof q.tags[0] : 'none',
      tags: q.tags
    })));

    // Only fetch if at least one question is missing tags OR has string-format tags
    const questionsNeedingTags = questions.filter(q => {
      if (!Array.isArray(q.tags) || q.tags.length === 0) {
        console.log(`❌ Question ${q.id} has no tags, needs fetching`);
        return true;
      }
      
      // Check if tags are in old string format instead of object format
      if (typeof q.tags[0] === 'string') {
        console.log(`🔄 Question ${q.id} has string tags, needs API refresh:`, q.tags);
        return true;
      }
      
      console.log(`✅ Question ${q.id} has proper object tags:`, q.tags);
      return false;
    });
    
    if (questionsNeedingTags.length === 0) {
      console.log('✅ All questions already have proper object-format tags');
      return;
    }

    console.log(`🔄 Fetching/refreshing tags for ${questionsNeedingTags.length} questions:`, 
      questionsNeedingTags.map(q => q.id));

    // Add a flag to prevent multiple simultaneous fetches
    let isFetching = false;

    async function fetchTagsForQuestions() {
      if (isFetching) {
        console.log('🚫 Already fetching tags, skipping...');
        return;
      }
      
      isFetching = true;
      console.log('🚀 Starting tag fetch process...');
      
      try {
        const updatedQuestions = await Promise.all(
          questions.map(async (q) => {
            // Skip if already has proper object-format tags
            if (Array.isArray(q.tags) && q.tags.length > 0 && typeof q.tags[0] === 'object') {
              console.log(`✅ Question ${q.id} already has proper object tags`);
              return q;
            }
            
            try {
              console.log(`🌐 Fetching fresh tags for question ${q.id}`);
              const res = await fetch(`http://localhost:8000/api/questions/question-tags?questionid=${q.id}`);
              const data = await res.json();
              console.log(`📥 Received fresh tags for question ${q.id}:`, data);
              
              // Extract tags array from the response
              const tags = Array.isArray(data.tags) ? data.tags : [];
              console.log(`💾 Updating question ${q.id} with ${tags.length} fresh tags:`, tags);
              
              return { ...q, tags };
            } catch (error) {
              console.error(`❌ Error fetching tags for question ${q.id}:`, error);
              return q; // Keep original question if fetch fails
            }
          })
        );
        
        console.log('🔄 Setting updated questions with fresh tags');
        console.log('📊 Updated questions preview:', updatedQuestions.map(q => ({
          id: q.id,
          tagCount: Array.isArray(q.tags) ? q.tags.length : 0,
          tagFormat: Array.isArray(q.tags) && q.tags.length > 0 ? typeof q.tags[0] : 'none',
          tags: q.tags
        })));
        
        setQuestions(updatedQuestions);
      } finally {
        isFetching = false;
        console.log('✅ Tag fetch process completed');
      }
    }

    fetchTagsForQuestions();
    // eslint-disable-next-line
  }, [questions?.length, questions?.map(q => q.id).join(',')]); // More specific dependencies

  // Enhanced tag rendering with debug info
 const renderTags = (question) => {
  console.log(`🏷️ Rendering tags for question ${question.id}:`, {
    tags: question.tags,
    isArray: Array.isArray(question.tags),
    length: Array.isArray(question.tags) ? question.tags.length : 'not array',
    firstTagType: question.tags?.[0] ? typeof question.tags[0] : 'none',
    firstTagStructure: question.tags?.[0] || 'none'
  });

  // Fallback: if tags is missing, use an empty array
  const tags = Array.isArray(question.tags) ? question.tags : [];

  // Updated exclude list - DO NOT exclude "exam" since it's a valid content tag
  const exclude = [
    'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
    'ready', 'draft', 'true-false', 'truefalse', 'multichoice', 'matching',
    'essay', 'shortanswer', 'ddmarker', 'ddimageortext', 'gapselect',
    'quiz', 'test' // Removed 'exam' from exclude list
  ];

  // 🔧 FIXED: Enhanced filter tags - handle both string format and object format
  const filteredTags = tags.filter(tag => {
    let tagName = '';
    
    try {
      if (typeof tag === 'string') {
        tagName = tag.toLowerCase().trim();
      } else if (typeof tag === 'object' && tag !== null) {
        // 🎯 CRITICAL: Handle object format from API
        const rawName = tag.name || tag.rawname || tag.text || tag.value || tag.display || '';
        tagName = String(rawName).toLowerCase().trim();
      } else {
        // Handle any other data types safely
        tagName = String(tag || '').toLowerCase().trim();
      }
    } catch (error) {
      console.warn(`⚠️ Error processing tag:`, tag, error);
      return false; // Skip problematic tags
    }
    
    const shouldExclude = exclude.includes(tagName);
    console.log(`🔍 Tag "${tagName}" (${typeof tag}): ${shouldExclude ? 'EXCLUDED' : 'INCLUDED'}`);
    
    return !shouldExclude && tagName !== ''; // Also exclude empty tags
  });

  console.log(`🔍 Filtered tags for question ${question.id}:`, {
    originalCount: tags.length,
    filteredCount: filteredTags.length,
    original: tags.map(t => {
      if (typeof t === 'string') return t;
      return t.name || t.rawname || t.display || 'unnamed';
    }),
    filtered: filteredTags.map(t => {
      if (typeof t === 'string') return t;
      return t.name || t.rawname || t.display || 'unnamed';
    })
  });

  if (filteredTags.length === 0) {
    console.log(`❌ No tags to render for question ${question.id}`);
    return (
      <div className="text-xs text-gray-400 italic mt-1">
        No content tags available
      </div>
    );
  }

  console.log(`✅ Rendering ${filteredTags.length} tags for question ${question.id}`);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      <span className="text-xs font-medium text-gray-600 mr-1">Tags:</span>
      {filteredTags.map((tag, index) => {
        // 🔧 FIXED: Enhanced tag processing for object format
        let tagDisplay = '';
        let tagKey = '';
        
        if (typeof tag === 'string') {
          tagDisplay = tag;
          tagKey = tag;
        } else if (typeof tag === 'object' && tag !== null) {
          tagDisplay = tag.rawname || tag.display || tag.name || tag.text || tag.value || String(tag);
          tagKey = tag.id || tag.name || tagDisplay;
        } else {
          tagDisplay = String(tag || '');
          tagKey = tagDisplay;
        }
        
        const uniqueKey = `${question.id}-tag-${tagKey}-${index}`;
        
        console.log(`🏷️ Processing tag ${index} for question ${question.id}:`, {
          original: tag,
          display: tagDisplay,
          key: uniqueKey
        });
        
        return (
          <span
            key={uniqueKey}
            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-cyan-600 text-white rounded hover:bg-cyan-700 cursor-pointer transition-colors"
            title={`Filter by tag: ${tagDisplay}`}
            onClick={() => {
              console.log(`🏷️ Clicked tag: ${tagDisplay}`);
              // You can add tag filter functionality here
              // setTagFilter(tagDisplay);
            }}
          >
            {tagDisplay}
          </span>
        );
      })}
    </div>
  );
};

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionDropdown && dropdownRefs.current[openActionDropdown]) {
        if (!dropdownRefs.current[openActionDropdown].contains(event.target)) {
          setOpenActionDropdown(null);
        }
      }
      
      if (openStatusDropdown) {
        const statusDropdown = document.querySelector(`[data-status-dropdown="${openStatusDropdown}"]`);
        if (statusDropdown && !statusDropdown.contains(event.target)) {
          setOpenStatusDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionDropdown, openStatusDropdown, setOpenActionDropdown, setOpenStatusDropdown, dropdownRefs]);

  // Enhanced debugging for questions AND tag collection
  useEffect(() => {
    console.log('📊 QuestionsTable received questions:', {
      questionsCount: questions?.length || 0,
      sampleQuestion: questions?.[0] ? {
        id: questions[0].id,
        title: questions[0].title,
        tags: questions[0].tags,
        tagsType: typeof questions[0].tags,
        tagsLength: Array.isArray(questions[0].tags) ? questions[0].tags.length : 'not array'
      } : 'no questions'
    });

    // 🔍 COLLECT ALL UNIQUE TAGS FOR DEBUGGING
    if (questions && questions.length > 0) {
      const allTagsFromQuestions = new Set();
      const allContentTags = new Set();
      
      questions.forEach(question => {
        if (Array.isArray(question.tags)) {
          question.tags.forEach(tag => {
            const tagName = typeof tag === 'string' ? tag : (tag.name || tag.rawname || '');
            allTagsFromQuestions.add(tagName);
            
            // Check if it's a content tag (not filtered out)
            const exclude = [
              'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
              'ready', 'draft', 'true-false', 'truefalse', 'multichoice', 'matching',
              'essay', 'shortanswer', 'ddmarker', 'ddimageortext', 'gapselect',
              'quiz', 'test', 'exam'
            ];
            
            if (!exclude.includes(tagName.toLowerCase().trim())) {
              allContentTags.add(tagName);
            }
          });
        }
      });
      
      console.log(' ALL TAGS FOUND IN QUESTIONS:', Array.from(allTagsFromQuestions).sort());
      console.log('CONTENT TAGS (after filtering):', Array.from(allContentTags).sort());
      console.log(' FILTERED OUT TAGS:', 
        Array.from(allTagsFromQuestions).filter(tag => !allContentTags.has(tag)).sort()
      );
    }
  }, [questions]);

  const getQuestionTypeIcon = (qtype, question) => {
    if (!question) {
      return <span className="w-6 h-6 inline-block">•</span>;
    }
    
    const normalizedType = qtype || question.questionType || question.qtype;
    
    switch (normalizedType) {
      case 'multichoice':
      case 'multiple':
        return <img src="/src/assets/icon/Multiple-choice.svg" className="w-6 h-6" alt="icon" />;
      case 'matching':
      case 'match':
        return <img src="/src/assets/icon/Matching.svg" className="w-6 h-6" alt="icon" />;
      case 'essay':
        return <img src="/src/assets/icon/Essay.svg" className="w-6 h-6" alt="icon" />;
      case 'shortanswer':
        return <img src="/src/assets/icon/Short-answer.svg" className="w-6 h-6" alt="icon" />;
      case 'truefalse':
        return <img src="/src/assets/icon/True-False.svg" className="w-6 h-6" alt="icon" />;
      case 'ddimageortext':
        return <img src="/src/assets/icon/Drag and drop into text.svg" className="w-6 h-6" alt="icon" />;
      case 'gapselect':
        return <img src="/src/assets/icon/Gapfill.svg" className="w-6 h-6" alt="icon" />;
      case 'ddmarker':
        return <img src="/src/assets/icon/Drag and drop markers.svg" className="w-6 h-6" alt="icon" />;
      default:
        return <span className="icon">?</span>;
    }
  };

  const toggleQuestionSelection = (id) => {
    setSelectedQuestions(prev => 
      prev.includes(id) 
        ? prev.filter(qId => qId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const startEditingTitle = (question) => {
    setEditingQuestion(question.id);
    setNewQuestionTitle(question.title);
  };

  const initiateQuestionSave = (questionId) => {
    if (newQuestionTitle.trim() === '') return;
    setShowSaveConfirm(true);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No questions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table id="categoryquestions" className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
              <span title="Select questions for bulk actions">
                <input 
                  id="qbheadercheckbox" 
                  name="qbheadercheckbox" 
                  type="checkbox"  
                  value="1"
                  data-action="toggle"
                  data-toggle="master"
                  data-togglegroup="qbank"
                  data-toggle-selectall="Select all"
                  data-toggle-deselectall="Deselect all"
                  onChange={handleSelectAll}
                  checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="qbheadercheckbox" className="sr-only">Select all</label>
              </span>
            </th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Status</th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Comments</th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Version</th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Usage</th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Last used</th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
              <div className="font-semibold">Created by</div>
              <div className="mt-1 space-x-1">
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by First name ascending">First name</a>
                <span className="text-gray-400">/</span>
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by Last name ascending">Last name</a>
                <span className="text-gray-400">/</span>
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by Date ascending">Date</a>
              </div>
            </th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
              <div className="font-semibold">Modified by</div>
              <div className="mt-1 space-x-1">
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by First name ascending">First name</a>
                <span className="text-gray-400">/</span>
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by Last name ascending">Last name</a>
                <span className="text-gray-400">/</span>
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by Date ascending">Date</a>
              </div>
            </th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
              <div className="font-semibold">Question</div>
              <div className="mt-1 space-x-1">
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by Question name ascending">Question name</a>
                <span className="text-gray-400">/</span>
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by ID number ascending">ID number</a>
              </div>
            </th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
              <div>
                <a href="#" className="text-gray-700 hover:text-gray-900 no-underline focus:outline-none focus:text-gray-900" title="Sort by Question type descending">
                  T<i className="fa fa-sort-asc fa-fw ml-1 text-gray-500" title="Ascending" role="img" aria-label="Ascending"></i>
                </a>
              </div>
            </th>
            <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {questions.map((question, index) => (
            <tr key={question.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
              <td className="px-3 py-4 whitespace-nowrap">
                <input 
                  id={`checkq${question.id}`}
                  name={`q${question.id}`}
                  type="checkbox"  
                  value="1"
                  data-action="toggle"
                  data-toggle="slave"
                  data-togglegroup="qbank"
                  checked={selectedQuestions.includes(question.id)}
                  onChange={() => toggleQuestionSelection(question.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`checkq${question.id}`} className="sr-only">Select</label>
              </td>
              
              {/* Status Column */}
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="relative" data-status-dropdown={question.id}>
                  <select
                    id={`question_status_dropdown-${question.id}`}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none pr-8"
                    name="question_status_dropdown"
                    value={question.status}
                    onChange={(e) => onStatusChange(question.id, e.target.value)}
                  >
                    <option value="ready">Ready</option>
                    <option value="draft">Draft</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <i className="fa fa-sort text-gray-400" aria-hidden="true"></i>
                  </span>
                </div>
              </td>
              
              <td className="px-3 py-4 whitespace-nowrap">
                <a href="#" className="text-blue-600 hover:text-blue-900" data-target={`questioncommentpreview_${question.id}`} data-questionid={question.id} data-courseid="985" data-contextid="1">
                  {question.comments || 0}
                </a>
              </td>
              
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{question.version}</td>
              
              <td className="px-3 py-4 whitespace-nowrap">
                <a href="#" className="text-blue-600 hover:text-blue-900" data-target={`questionusagepreview_${question.id}`} data-questionid={question.id} data-courseid="985">
                  {question.usage || 0}
                </a>
              </td>
              
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{question.lastUsed}</span>
              </td>
              
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{question.createdBy?.name || ''}</span>
                <br />
                <span className="text-xs text-gray-500">{question.createdBy?.date || ''}</span>
              </td>
              
              <td className="px-3 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{question.modifiedBy?.name || ''}</span>
                <br />
                <span className="text-xs text-gray-500">{question.modifiedBy?.date || ''}</span>
              </td>
              
              {/* Question Name and Tags Column */}
              <td className="px-3 py-4">
                <div className="flex flex-col items-start w-full">
                  <div className="w-full mb-2">
                    <label htmlFor={`checkq${question.id}`} className="block">
                      {editingQuestion === question.id ? (
                        <input
                          type="text"
                          value={newQuestionTitle}
                          onChange={(e) => setNewQuestionTitle(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          autoFocus
                          onBlur={() => initiateQuestionSave(question.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') initiateQuestionSave(question.id);
                            if (e.key === 'Escape') setEditingQuestion(null);
                          }}
                        />
                      ) : (
                        // Added 'group' class to parent span
                                     <span className="inline-flex items-center group">
                      <a href="#" className="ml-2">
                        {question.title}
                        <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <i className="fa-regular fa-pen-to-square text-gray-400"></i>
                        </span>
                      </a>
                    </span>
                      )}
                    </label>
                    
                    {question.idNumber && (
                      <span className="ml-1">
                        <span className="sr-only">ID number</span>&nbsp;
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{question.idNumber}</span>
                      </span>
                    )}
                  </div>
                  
                  {/* Tags Rendering with Enhanced Debug */}
                  <div className="w-full">
                    {/* Debug info for troubleshooting */}
                    {/* <div className="text-xs text-gray-500 mb-1 p-1 bg-gray-100 rounded">
                      Debug: Tags: {Array.isArray(question.tags) ? question.tags.length : 'not array'} | 
                      Type: {question.qtype || question.questionType || "Unknown"} | 
                      Format: {Array.isArray(question.tags) && question.tags.length > 0 ? typeof question.tags[0] : 'none'} |
                      Raw: {JSON.stringify(question.tags)} |
                      Content Tags: {Array.isArray(question.tags) ? 
                        question.tags
                          .filter(tag => {
                            let tagName = '';
                            try {
                              if (typeof tag === 'string') {
                                tagName = tag.toLowerCase().trim();
                              } else if (typeof tag === 'object' && tag !== null) {
                                const rawName = tag.name || tag.rawname || tag.text || tag.value || '';
                                tagName = String(rawName).toLowerCase().trim();
                              } else {
                                tagName = String(tag || '').toLowerCase().trim();
                              }
                            } catch (error) {
                              console.warn('Error processing tag:', tag, error);
                              return false;
                            }
                            
                            const exclude = [
                              'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
                              'ready', 'draft', 'true-false', 'truefalse', 'multichoice', 'matching',
                              'essay', 'shortanswer', 'ddmarker', 'ddimageortext', 'gapselect',
                              'quiz', 'test'
                            ];
                            return !exclude.includes(tagName) && tagName !== '';
                          })
                          .map(tag => {
                            try {
                              if (typeof tag === 'string') return tag;
                              return tag.name || tag.rawname || tag.text || tag.value || 'unnamed';
                            } catch (error) {
                              console.warn('Error mapping tag:', tag, error);
                              return 'error';
                            }
                          })
                          .join(', ') : 'none'
                      }
                    </div> */}
                    
                    {/* 🔍 DATA FORMAT ANALYSIS */}
                    {/* {Array.isArray(question.tags) && question.tags.length > 0 && (
                      <div className="text-xs bg-blue-100 border border-blue-300 rounded p-1 mb-1">
                        <strong>🔍 Data Format:</strong> 
                        {typeof question.tags[0] === 'string' 
                          ? '📝 String format: ' + JSON.stringify(question.tags)
                          : '🏷️ Object format: ' + question.tags.map(t => `{name:"${t.name||t.rawname}", id:${t.id}}`).join(', ')
                        }
                      </div>
                    )} */}
                    
                    {/* 🔍 FILTER SYNC CHECK */}
                    {/* {Array.isArray(question.tags) && question.tags.length > 0 && (
                      <div className="text-xs bg-yellow-100 border border-yellow-300 rounded p-1 mb-1">
                        <strong>⚠️ Should be in filter:</strong> 
                        <span className="font-mono text-blue-600">
                          {question.tags
                            .filter(tag => {
                              let tagName = '';
                              try {
                                if (typeof tag === 'string') {
                                  tagName = tag.toLowerCase().trim();
                                } else if (typeof tag === 'object' && tag !== null) {
                                  const rawName = tag.name || tag.rawname || tag.text || tag.value || '';
                                  tagName = String(rawName).toLowerCase().trim();
                                } else {
                                  tagName = String(tag || '').toLowerCase().trim();
                                }
                              } catch (error) {
                                console.warn('Error processing filter tag:', tag, error);
                                return false;
                              }
                              
                              const exclude = [
                                'easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced',
                                'ready', 'draft', 'true-false', 'truefalse', 'multichoice', 'matching',
                                'essay', 'shortanswer', 'ddmarker', 'ddimageortext', 'gapselect',
                                'quiz', 'test'
                              ];
                              return !exclude.includes(tagName) && tagName !== '';
                            })
                            .map(tag => {
                              try {
                                if (typeof tag === 'string') return tag;
                                return tag.name || tag.rawname || tag.text || tag.value || 'unnamed';
                              } catch (error) {
                                console.warn('Error mapping filter tag:', tag, error);
                                return 'error';
                              }
                            })
                            .join(', ')
                          }
                        </span>
                      </div>
                    )} */}
                    
                    {renderTags(question)}
                  </div>
                </div>
              </td>
              
              <td className="px-3 py-4 whitespace-nowrap">
                {getQuestionTypeIcon(question.qtype || question.questionType, question)}
              </td>
              
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="relative" data-enhance="moodle-core-actionmenu">
                  <div className="flex">
                    <div className="relative">
                      <div>
                          <a href="#" className="text-blue-600 hover:text-blue-900 focus:outline-none" 
                           aria-label="Edit" role="button" 
                           aria-haspopup="true" aria-expanded="false"
                           onClick={() => setOpenActionDropdown(openActionDropdown === question.id ? null : question.id)}>
                          Edit
                          <i className="fa fa-chevron-down ml-1"></i>
                        </a>
                        {openActionDropdown === question.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                             <a
                              href="#"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                              role="menuitem"
                              tabIndex="-1"
                              onClick={(e) => {
                                e.preventDefault();
                                onEdit(question);
                                setOpenActionDropdown(null);
                              }}
                            >
                              <i className="fa fa-cog w-4 text-center mr-2 text-gray-500"></i>
                              <span>Edit question</span>
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors" role="menuitem" tabIndex="-1" 
                              onClick={() => { onDuplicate(question); setOpenActionDropdown(null); }}>
                              <i className="fa fa-copy w-4 text-center mr-2 text-gray-500"></i>
                              <span>Duplicate</span>
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors" role="menuitem" tabIndex="-1">
                              <i className="fa fa-tags w-4 text-center mr-2 text-gray-500"></i>
                              <span>Manage tags</span>
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors" role="menuitem" tabIndex="-1" 
                              onClick={() => { onPreview(question); setOpenActionDropdown(null); }}>
                              <i className="fa fa-search w-4 text-center mr-2 text-gray-500"></i>
                              <span>Preview</span>
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors" role="menuitem" tabIndex="-1" 
                              onClick={() => { onHistory(question); setOpenActionDropdown(null); }}>
                              <i className="fa fa-list w-4 text-center mr-2 text-gray-500"></i>
                              <span>History</span>
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" role="menuitem" tabIndex="-1" 
                              onClick={() => { onDelete(question.id); setOpenActionDropdown(null); }}>
                              <i className="fa fa-trash w-4 text-center mr-2 text-red-500"></i>
                              <span>Delete</span>
                            </a>
                            <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors" role="menuitem" tabIndex="-1">
                              <i className="fa fa-download w-4 text-center mr-2 text-gray-500"></i>
                              <span>Export as Moodle XML</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsTable;