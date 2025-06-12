// components/QuestionsTable.jsx - FIXED VERSION with enhanced tag display
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

  // FIXED: Enhanced tag processing function
  const processTag = (tag) => {
    if (typeof tag === 'string') {
      return { name: tag, id: tag };
    } else if (typeof tag === 'object' && tag !== null) {
      return {
        name: tag.name || tag.text || tag.value || tag.label || String(tag),
        id: tag.id || tag.name || tag.text || tag.value || String(tag)
      };
    }
    return { name: String(tag || ''), id: String(tag || '') };
  };

  // FIXED: Enhanced tag rendering with better debugging
  const renderTags = (question) => {
    // console.log(` Rendering tags for question ${question.id}:`, {
    //   tags: question.tags,
    //   tagsType: typeof question.tags,
    //   tagsLength: Array.isArray(question.tags) ? question.tags.length : 'not array'
    // });

    if (!question.tags || !Array.isArray(question.tags) || question.tags.length === 0) {
      // console.log(` No tags to render for question ${question.id}`);
      return null;
    }

    return (
      <div className="tag_list hideoverlimit d-inline flex-shrink-1 text-truncate ml-1">
        <b className="accesshide">Tags:</b>
        <ul className="inline-list" style={{ display: 'inline', listStyle: 'none', padding: 0, margin: 0 }}>
          {question.tags.map((tag, index) => {
            const processedTag = processTag(tag);
            const uniqueKey = `${question.id}-tag-${processedTag.id}-${index}`;
            
            console.log(` Processing tag ${index}:`, { original: tag, processed: processedTag, key: uniqueKey });
            
            return (
              <li key={uniqueKey} style={{ display: 'inline-block', marginRight: '4px' }}>
                <a 
                  href={`#tag=${encodeURIComponent(processedTag.name)}`} 
                  className="badge badge-info"
                  style={{
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    padding: '0.25em 0.4em',
                    fontSize: '75%',
                    fontWeight: '700',
                    lineHeight: '1',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    verticalAlign: 'baseline',
                    borderRadius: '0.25rem',
                    textDecoration: 'none'
                  }}
                  title={`Filter by tag: ${processedTag.name}`}
                >
                  {processedTag.name}
                </a>
              </li>
            );
          })}
        </ul>
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

  // FIXED: Enhanced debugging for questions
  useEffect(() => {
    console.log(' QuestionsTable received questions:', {
      questionsCount: questions?.length || 0,
      sampleQuestion: questions?.[0] ? {
        id: questions[0].id,
        title: questions[0].title,
        tags: questions[0].tags,
        tagsType: typeof questions[0].tags,
        tagsLength: Array.isArray(questions[0].tags) ? questions[0].tags.length : 'not array'
      } : 'no questions'
    });
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
      <style jsx>{`
        .dropdown-menu .dropdown-item {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          white-space: nowrap;
          clear: both;
          font-weight: 400;
          color: #212529;
          text-decoration: none;
          background-color: transparent;
          border: 0;
        }

        .dropdown-item i {
          margin-right: 8px;
          width: 16px;
          text-align: center;
          color: #6c757d;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
          color: #16181b;
          text-decoration: none;
        }

        .dropdown-item:hover i {
          color: #495057;
        }

        .menu-action-text {
          flex: 1;
        }

        .dropdown-toggle {
          background: none;
          border: none;
          color: #007bff;
          text-decoration: none;
          cursor: pointer;
        }

        .dropdown-toggle:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 9999;
          display: block;
          min-width: 200px;
          padding: 5px 0;
          margin: 2px 0 0;
          background-color: #fff;
          border: 1px solid rgba(0,0,0,.15);
          border-radius: 0.375rem;
          box-shadow: 0 6px 12px rgba(0,0,0,.175);
        }

        .action-menu-trigger {
          position: relative;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: transparent;
          z-index: -1;
        }

        /* FIXED: Enhanced tag styling */
        .tag_list {
          max-width: 200px;
          overflow: hidden;
        }

        .tag_list .inline-list {
          display: inline !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .tag_list .inline-list li {
          display: inline-block !important;
          margin-right: 4px !important;
        }

        .badge-info {
          background-color: #17a2b8 !important;
          color: white !important;
        }

        .badge-info:hover {
          background-color: #138496 !important;
          color: white !important;
          text-decoration: none !important;
        }

        /* Debug styling for development */
        .debug-tags {
          border: 1px dashed red;
          background: rgba(255, 0, 0, 0.1);
          padding: 2px;
        }
      `}</style>

      <table id="categoryquestions" className="table-responsive">
        <thead>
          <tr>
            <th className="header checkbox" scope="col">
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
                />
                <label htmlFor="qbheadercheckbox" className="accesshide">Select all</label>
              </span>
            </th>
            <th className="header pr-3 questionstatus" scope="col">Status</th>
            <th className="header pr-3 commentcount" scope="col">Comments</th>
            <th className="header pr-3 questionversionnumber" scope="col">Version</th>
            <th className="header pr-3 questionusage" scope="col">Usage</th>
            <th className="header pr-3 questionlastused" scope="col">Last used</th>
            <th className="header pr-3 creatorname" scope="col">
              <div className="title">Created by</div>
              <div className="sorters">
                <a href="#" title="Sort by First name ascending">First name</a> / 
                <a href="#" title="Sort by Last name ascending">Last name</a> / 
                <a href="#" title="Sort by Date ascending">Date</a>
              </div>
            </th>
            <th className="header pr-3 modifiername" scope="col">
              <div className="title">Modified by</div>
              <div className="sorters">
                <a href="#" title="Sort by First name ascending">First name</a> / 
                <a href="#" title="Sort by Last name ascending">Last name</a> / 
                <a href="#" title="Sort by Date ascending">Date</a>
              </div>
            </th>
            <th className="header pr-3 qnameidnumbertags" scope="col">
              <div className="title">Question</div>
              <div className="sorters">
                <a href="#" title="Sort by Question name ascending">Question name</a> / 
                <a href="#" title="Sort by ID number ascending">ID number</a>
              </div>
            </th>
            <th className="header qtype" scope="col">
              <div className="sorters">
                <a href="#" title="Sort by Question type descending">
                  T<i className="icon fa fa-sort-asc fa-fw iconsort" title="Ascending" role="img" aria-label="Ascending"></i>
                </a>
              </div>
            </th>
            <th className="header pr-3 editmenu" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question.id} className={index % 2 === 0 ? 'r0' : 'r1'}>
              <td className="checkbox">
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
                />
                <label htmlFor={`checkq${question.id}`} className="accesshide">Select</label>
              </td>
              
              {/* Status Column */}
              <td className="pr-3 questionstatus">
                <div className="relative" data-status-dropdown={question.id}>
                  <select 
                    id={`question_status_dropdown-${question.id}`}
                    className="custom-select my-2" 
                    name="question_status_dropdown"
                    value={question.status}
                    onChange={(e) => onStatusChange(question.id, e.target.value)}
                  >
                    <option value="ready">Ready</option>
                    <option value="draft">Draft</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </td>
              
              <td className="pr-3 commentcount">
                <a href="#" data-target={`questioncommentpreview_${question.id}`} data-questionid={question.id} data-courseid="985" data-contextid="1">
                  {question.comments || 0}
                </a>
              </td>
              
              <td className="pr-3 questionversionnumber">{question.version}</td>
              
              <td className="pr-3 questionusage">
                <a href="#" data-target={`questionusagepreview_${question.id}`} data-questionid={question.id} data-courseid="985">
                  {question.usage || 0}
                </a>
              </td>
              
              <td className="pr-3 questionlastused">
                <span className="date">{question.lastUsed}</span>
              </td>
              
              <td className="pr-3 creatorname">
                <span className="qbank-creator-name">{question.createdBy?.name || ''}</span>
                <br />
                <span className="date">{question.createdBy?.date || ''}</span>
              </td>
              
              <td className="pr-3 modifiername">
                <span className="qbank-creator-name">{question.modifiedBy?.name || ''}</span>
                <br />
                <span className="date">{question.modifiedBy?.date || ''}</span>
              </td>
              
              {/* FIXED: Enhanced Question Name and Tags Column */}
              <td className="pr-3 qnameidnumbertags">
                <div className="d-inline-flex flex-nowrap overflow-hidden w-100" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="question-title-container" style={{ width: '100%' }}>
                    <label htmlFor={`checkq${question.id}`}>
                      {editingQuestion === question.id ? (
                        <input
                          type="text"
                          value={newQuestionTitle}
                          onChange={(e) => setNewQuestionTitle(e.target.value)}
                          className="inplaceeditable-text"
                          autoFocus
                          onBlur={() => initiateQuestionSave(question.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') initiateQuestionSave(question.id);
                            if (e.key === 'Escape') setEditingQuestion(null);
                          }}
                        />
                      ) : (
                        <span 
                          className="inplaceeditable inplaceeditable-text" 
                          data-inplaceeditable="1" 
                          data-component="qbank_viewquestionname" 
                          data-itemtype="questionname" 
                          data-itemid={question.id}
                          data-value={question.title} 
                          data-editlabel={`New value for ${question.title}`} 
                          data-type="text" 
                          data-options=""
                        >
                          <a href="#" className="quickeditlink aalink" data-inplaceeditablelink="1" title="Edit question name" onClick={() => startEditingTitle(question)}>
                            {question.title}
                            <span className="quickediticon visibleifjs">
                              <i className="fa fa-pencil" title="Edit question name" aria-hidden="true"></i>
                            </span>
                          </a>
                        </span>
                      )}
                    </label>
                    
                    {question.idNumber && (
                      <span className="ml-1">
                        <span className="accesshide">ID number</span>&nbsp;
                        <span className="badge badge-primary">{question.idNumber}</span>
                      </span>
                    )}
                  </div>
                  
                  {/* FIXED: Enhanced Tags Rendering with Debug Info */}
                  <div className="tags-container" style={{ width: '100%', marginTop: '4px' }}>
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-gray-500" style={{ fontSize: '10px', color: '#666' }}>
                        Tags: {Array.isArray(question.tags) ? question.tags.length : 'not array'} | 
                        Type: {typeof question.tags}
                      </div>
                    )}
                    {renderTags(question)}
                  </div>
                </div>
              </td>
              
              <td className="qtype">
                {getQuestionTypeIcon(question.qtype || question.questionType, question)}
              </td>
              
              <td className="pr-3 editmenu">
                <div className="action-menu moodle-actionmenu" data-enhance="moodle-core-actionmenu">
                  <div className="menubar d-flex">
                    <div className="action-menu-trigger">
                      <div className="dropdown">
                        <a href="#" tabIndex="0" className="dropdown-toggle icon-no-margin" 
                           aria-label="Edit" data-toggle="dropdown" role="button" 
                           aria-haspopup="true" aria-expanded="false"
                           onClick={() => setOpenActionDropdown(openActionDropdown === question.id ? null : question.id)}>
                          Edit
                          <b className="caret"></b>
                        </a>
                        {openActionDropdown === question.id && (
                          <div className="dropdown-menu menu dropdown-menu-right" role="menu">
                             <a
                              href="#"
                              className="dropdown-item menu-action"
                              role="menuitem"
                              tabIndex="-1"
                              onClick={(e) => {
                                e.preventDefault();
                                onEdit(question);
                                setOpenActionDropdown(null);
                              }}
                            >
                              <i className="fa fa-cog"></i>
                              <span className="menu-action-text">Edit question</span>
                            </a>
                            <a href="#" className="dropdown-item menu-action" role="menuitem" tabIndex="-1" 
                              onClick={() => { onDuplicate(question); setOpenActionDropdown(null); }}>
                              <i className="fa fa-copy"></i>
                              <span className="menu-action-text">Duplicate</span>
                            </a>
                            <a href="#" className="dropdown-item menu-action" role="menuitem" tabIndex="-1">
                              <i className="fa fa-tags"></i>
                              <span className="menu-action-text">Manage tags</span>
                            </a>
                            <a href="#" className="dropdown-item menu-action" role="menuitem" tabIndex="-1" 
                              onClick={() => { onPreview(question); setOpenActionDropdown(null); }}>
                              <i className="fa fa-search"></i>
                              <span className="menu-action-text">Preview</span>
                            </a>
                            <a href="#" className="dropdown-item menu-action" role="menuitem" tabIndex="-1" 
                              onClick={() => { onHistory(question); setOpenActionDropdown(null); }}>
                              <i className="fa fa-list"></i>
                              <span className="menu-action-text">History</span>
                            </a>
                            <a href="#" className="dropdown-item menu-action" role="menuitem" tabIndex="-1" 
                              onClick={() => { onDelete(question.id); setOpenActionDropdown(null); }}>
                              <i className="fa fa-trash"></i>
                              <span className="menu-action-text">Delete</span>
                            </a>
                            <a href="#" className="dropdown-item menu-action" role="menuitem" tabIndex="-1">
                              <i className="fa fa-download"></i>
                              <span className="menu-action-text">Export as Moodle XML</span>
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