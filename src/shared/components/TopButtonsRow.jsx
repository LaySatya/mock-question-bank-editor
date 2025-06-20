
// ============================================================================
// src/components/TopButtonsRow.jsx - Enhanced Top Buttons with Import
// ============================================================================
import React, { useState, useRef } from 'react';
import { ChevronDown, Check, Upload, Plus, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const TopButtonsRow = ({
  showQuestionsDropdown,
  setShowQuestionsDropdown,
  questionsDropdownRef,
  handleFileUpload,
  setShowCreateModal,
  showQuestionText,
  setShowQuestionText,
  questions,
  setCurrentPage
}) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleNavigation = (value) => {
    console.log(`Navigating to: ${value}`);
    
    // Handle import option - trigger file upload
    if (value.includes('import')) {
      handleImportClick();
      return;
    }
    
    // Handle other navigation options
    const pageName = value.split('/').pop().replace('.php', '');
    setImportStatus({ 
      type: 'info', 
      message: `Navigating to ${pageName}...` 
    });
    setTimeout(() => setImportStatus(null), 2000);
  };

  const handleCreateQuestion = () => {
    setShowCreateModal(true);
    console.log('Opening create question modal');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const parseXMLQuestions = (xmlContent) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML format');
      }

      const questions = [];
      const questionElements = xmlDoc.querySelectorAll('question');

      questionElements.forEach((questionEl, index) => {
        const type = questionEl.getAttribute('type');
        if (!type || type === 'category') return; // Skip category questions

        const nameEl = questionEl.querySelector('name text');
        const questionTextEl = questionEl.querySelector('questiontext text');
        
        const question = {
          id: `imported_${Date.now()}_${index}`,
          title: nameEl ? nameEl.textContent.trim() : `Imported Question ${index + 1}`,
          questionText: questionTextEl ? questionTextEl.textContent.trim() : '',
          qtype: type === 'multichoice' ? 'multichoice' : type === 'truefalse' ? 'truefalse' : 'multichoice',
          status: 'draft',
          version: 'v1',
          tags: [],
          choices: [],
          createdBy: { name: 'Imported', role: '', date: new Date().toLocaleDateString() },
          comments: 0,
          usage: 0,
          lastUsed: '',
          modifiedBy: { name: 'System', role: '', date: new Date().toLocaleDateString() },
          history: []
        };

        // Handle multiple choice questions
        if (type === 'multichoice') {
          const answerElements = questionEl.querySelectorAll('answer');
          question.choices = Array.from(answerElements).map((answerEl, answerIndex) => {
            const fraction = parseFloat(answerEl.getAttribute('fraction') || '0');
            const textEl = answerEl.querySelector('text');
            const feedbackEl = answerEl.querySelector('feedback text');
            
            return {
              id: answerIndex,
              text: textEl ? textEl.textContent.trim() : '',
              answer: textEl ? textEl.textContent.trim() : '',
              isCorrect: fraction > 0,
              grade: fraction > 0 ? '100%' : '0%',
              feedback: feedbackEl ? feedbackEl.textContent.trim() : ''
            };
          });
          
          question.multipleAnswers = question.choices.filter(c => c.isCorrect).length > 1;
          question.shuffleAnswers = questionEl.querySelector('shuffleanswers')?.textContent === '1';
          question.numberChoices = '1, 2, 3, ...';
          question.showInstructions = true;
        }

        // Handle true/false questions
        if (type === 'truefalse') {
          const trueAnswerEl = questionEl.querySelector('answer[fraction="100"] text');
          const falseAnswerEl = questionEl.querySelector('answer[fraction="0"] text');
          
          question.correctAnswer = trueAnswerEl ? 'true' : 'false';
          question.feedbackTrue = questionEl.querySelector('answer[fraction="100"] feedback text')?.textContent || '';
          question.feedbackFalse = questionEl.querySelector('answer[fraction="0"] feedback text')?.textContent || '';
        }

        // Common fields
        question.defaultMark = parseFloat(questionEl.querySelector('defaultgrade')?.textContent || '1');
        question.generalFeedback = questionEl.querySelector('generalfeedback text')?.textContent || '';
        question.penaltyFactor = parseFloat(questionEl.querySelector('penalty')?.textContent || '0');

        questions.push(question);
      });

      return questions;
    } catch (error) {
      console.error('XML parsing error:', error);
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  };

  const parseJSONQuestions = (jsonContent) => {
    try {
      const data = JSON.parse(jsonContent);
      
      // Handle different JSON structures
      let questionsArray = [];
      if (Array.isArray(data)) {
        questionsArray = data;
      } else if (data.questions && Array.isArray(data.questions)) {
        questionsArray = data.questions;
      } else {
        throw new Error('Invalid JSON structure - expected questions array');
      }

      return questionsArray.map((q, index) => ({
        id: q.id || `imported_${Date.now()}_${index}`,
        title: q.title || q.name || `Imported Question ${index + 1}`,
        questionText: q.questionText || q.question || '',
        qtype: q.qtype || q.type || 'multichoice',
        status: q.status || 'draft',
        version: q.version || 'v1',
        tags: q.tags || [],
        choices: q.choices || q.options?.map((opt, i) => ({
          id: i,
          text: opt,
          answer: opt,
          isCorrect: q.correctAnswers?.includes(opt) || false,
          grade: q.correctAnswers?.includes(opt) ? '100%' : '0%',
          feedback: ''
        })) || [],
        correctAnswer: q.correctAnswer,
        feedbackTrue: q.feedbackTrue || '',
        feedbackFalse: q.feedbackFalse || '',
        multipleAnswers: q.multipleAnswers || false,
        shuffleAnswers: q.shuffleAnswers || false,
        numberChoices: q.numberChoices || '1, 2, 3, ...',
        showInstructions: q.showInstructions !== false,
        defaultMark: q.defaultMark || 1,
        generalFeedback: q.generalFeedback || '',
        penaltyFactor: q.penaltyFactor || 0,
        createdBy: q.createdBy || { name: 'Imported', role: '', date: new Date().toLocaleDateString() },
        comments: q.comments || 0,
        usage: q.usage || 0,
        lastUsed: q.lastUsed || '',
        modifiedBy: q.modifiedBy || { name: 'System', role: '', date: new Date().toLocaleDateString() },
        history: q.history || []
      }));
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  };

  const detectDuplicates = (newQuestions, existingQuestions) => {
    const duplicates = [];
    const unique = [];

    newQuestions.forEach(newQ => {
      const isDuplicate = existingQuestions.some(existingQ => 
        existingQ.title.toLowerCase().trim() === newQ.title.toLowerCase().trim() ||
        existingQ.questionText.toLowerCase().trim() === newQ.questionText.toLowerCase().trim()
      );

      if (isDuplicate) {
        duplicates.push(newQ);
      } else {
        unique.push(newQ);
      }
    });

    return { duplicates, unique };
  };

  const handleFileChange = async (event) => {
    console.log('handleFileChange called with:', event);
    if (!event || !event.target || !event.target.files) {
      setImportStatus({
        type: 'error',
        message: 'No file selected or event is invalid.'
      });
      return;
    }
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ type: 'info', message: `Processing ${file.name}...` });

    try {
      const fileContent = await file.text();
      let parsedQuestions = [];

      // Parse based on file type
      if (file.name.endsWith('.xml')) {
        parsedQuestions = parseXMLQuestions(fileContent);
      } else if (file.name.endsWith('.json')) {
        parsedQuestions = parseJSONQuestions(fileContent);
      } else {
        throw new Error('Unsupported file format. Please use XML or JSON files.');
      }

      if (parsedQuestions.length === 0) {
        throw new Error('No valid questions found in the file.');
      }
      const { unique, duplicates } = detectDuplicates(parsedQuestions, questions || []);

      // Pass to parent component for duplicate detection and import
      if (handleFileUpload) {
        await handleFileUpload(file, unique);
        if (setCurrentPage) setCurrentPage(1); 
        setImportStatus({
          type: 'success',
          message: `Import complete! Added ${unique.length} question(s). ${duplicates.length} duplicate(s) skipped.`
        });
      } else {
        setImportStatus({
          type: 'success',
          message: `File processed successfully! Found ${parsedQuestions.length} questions.`
        });
      }

      console.log('Import results:', {
        file: file.name,
        questionsFound: parsedQuestions.length,
        sampleQuestion: parsedQuestions[0]
      });

    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({
        type: 'error',
        message: `Import failed: ${error.message}`
      });
    } finally {
      setIsImporting(false);
      // Clear status after 5 seconds
      setTimeout(() => setImportStatus(null), 5000);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleQuestionTextChange = (value) => {
    setShowQuestionText(value === "1" || value === "2");
    console.log('Question text display changed to:', value);
  };

  return (
    <div className="top-buttons-container">
      <style>{`
        .top-buttons-container {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-bottom: 2px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .tertiary-navigation {
          margin: 0;
          padding: 0;
        }

        .row {
          margin: 0;
        }

        .navitem {
          background: white;
          border-bottom: 1px solid #e9ecef;
          padding: 1.25rem 1.5rem;
        }

        .urlselect {
          margin: 0;
        }

        .form-inline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .accesshide {
          position: absolute;
          left: -10000px;
          font-weight: normal;
          font-size: 1em;
        }

        .custom-select.urlselect {
          background: white;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 220px;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1rem;
          appearance: none;
        }

        .custom-select.urlselect:hover {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
          transform: translateY(-1px);
        }

        .custom-select.urlselect:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 4px rgba(0,123,255,0.25);
        }

        .questionbank-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .actions-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .createnewquestion {
          margin: 0;
        }

        .singlebutton {
          margin: 0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
          position: relative;
          overflow: hidden;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .btn:not(:disabled):active {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
          border-color: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a6268 0%, #343a40 100%);
          border-color: #545b62;
          color: white;
        }

        .question-text-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
        }

        .question-text-label {
          color: #495057;
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
        }

        .custom-select.searchoptions {
          background: white;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #495057;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 220px;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1rem;
          appearance: none;
        }

        .custom-select.searchoptions:hover {
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
          transform: translateY(-1px);
        }

        .custom-select.searchoptions:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 4px rgba(0,123,255,0.25);
        }

        .file-input {
          display: none;
        }

        .status-message {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          z-index: 1000;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-info {
          background: linear-gradient(135deg, #17a2b8 0%, #117a8b 100%);
        }

        .status-success {
          background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
        }

        .status-error {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .navitem {
            padding: 1rem;
          }

          .questionbank-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
            padding: 1rem;
          }

          .actions-group {
            width: 100%;
            justify-content: space-between;
          }

          .question-text-controls {
            margin-left: 0;
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .question-text-label {
            white-space: normal;
            text-align: center;
          }

          .custom-select.searchoptions,
          .custom-select.urlselect {
            width: 100%;
            min-width: auto;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .status-message {
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .actions-group {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="container-fluid tertiary-navigation">
        <div className="row">
          <div className="navitem">
            {/* Question bank navigation dropdown */}
            <div className="urlselect">
              <div className="form-inline" id="questionbankaction">
                <label htmlFor="url_select" className="accesshide">
                  Question bank tertiary navigation
                </label>
                <select 
                  id="url_select" 
                  className="custom-select urlselect" 
                  name="jump"
                  onChange={(e) => handleNavigation(e.target.value)}
                  defaultValue="/question/edit.php"
                >
                  <option value="/question/edit.php">Questions</option>
                  <option value="/question/bank/managecategories/category.php">Categories</option>
                  <option value="/question/bank/importquestions/import.php">Import</option>
                  <option value="/question/bank/exportquestions/export.php">Export</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Main action buttons row */}
          <div className="questionbank-controls">
            <div className="actions-group">
              {/* Create new question button */}
              <div className="createnewquestion">
                <div className="singlebutton">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCreateQuestion}
                  >
                    <Plus size={18} />
                    Create a new question ...
                  </button>
                </div>
              </div>
            </div>
            
            {/* Show question text selector */}
            <div className="question-text-controls">
              <label htmlFor="qbshowtext" className="question-text-label">
                Show question text in the question list?
              </label>
              <select 
                id="qbshowtext" 
                name="qbshowtext" 
                className="custom-select searchoptions"
                value={showQuestionText ? "1" : "0"}
                onChange={(e) => handleQuestionTextChange(e.target.value)}
              >
                <option value="0">No</option>
                <option value="1">Yes, text only</option>
                <option value="2">Yes, with images, media, etc.</option>
              </select>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="file-input"
              accept=".xml,.json"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Status Message */}
      {importStatus && (
        <div className={`status-message status-${importStatus.type}`}>
          {importStatus.type === 'info' && <AlertCircle size={20} />}
          {importStatus.type === 'success' && <CheckCircle size={20} />}
          {importStatus.type === 'error' && <AlertCircle size={20} />}
          {importStatus.message}
        </div>
      )}
    </div>
  );
};

export default TopButtonsRow;