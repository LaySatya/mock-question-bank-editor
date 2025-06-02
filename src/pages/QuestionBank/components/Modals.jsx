// components/Modals.jsx
import React from 'react';
import { X } from 'lucide-react';

// FIXED: Correct paths (go up 3 levels from pages/QuestionBank/components/)
import CreateQuestionModal from '../../../components/modals/CreateQuestionModal';
import CreateTrueFalseQuestion from '../../../components/questions/CreateTrueFalseQuestion';
import CreateMultipleChoiceQuestion from '../../../components/questions/CreateMultipleChoiceQuestion';
import BulkEditQuestionsModal from '../../../components/modals/BulkEditQuestionsModal';

// Save Confirmation Modal
const SaveConfirmationModal = ({ questionId, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md pointer-events-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Save Changes?</h3>
          <p className="mb-6 text-gray-600">
            Do you want to save your changes to this question?
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(questionId)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// History Modal Component
const HistoryModal = ({ question, onClose }) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl pointer-events-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">Version History: {question.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Version</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Author</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Changes</th>
              </tr>
            </thead>
            <tbody>
              {question.history.map((version, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-4 py-2">{version.version}</td>
                  <td className="border border-gray-300 px-4 py-2">{version.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{version.author}</td>
                  <td className="border border-gray-300 px-4 py-2">{version.changes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Preview Modal Component
const PreviewModal = ({ question, onClose }) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl pointer-events-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">Question Preview: {question.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="border rounded-md p-4 mb-6 bg-gray-50">
            <div className="mb-4">
              <h3 className="font-bold mb-2">Question Text</h3>
              <p>{question.questionText || "No question text"}</p>
            </div>
            
            {question.questionType === 'multiple' && question.options && (
              <div>
                <h3 className="font-bold mb-2">Options:</h3>
                <div className="space-y-2">
                  {question.options.map((opt, idx) => (
                    <div className="flex items-start" key={idx}>
                      <input
                        type="radio"
                        className="mt-1 mr-2"
                        name="option"
                        checked={question.correctAnswers && question.correctAnswers.includes(opt)}
                        readOnly
                      />
                      <div>{opt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {question.questionType === 'truefalse' && (
              <div>
                <h3 className="font-bold mb-2">Correct Answer:</h3>
                <div>{question.correctAnswer === 'true' ? 'True' : 'False'}</div>
                <div className="mt-2">
                  <strong>Feedback (True):</strong> {question.feedbackTrue}
                </div>
                <div>
                  <strong>Feedback (False):</strong> {question.feedbackFalse}
                </div>
              </div>
            )}
            
            {['essay', 'shortanswer'].includes(question.questionType) && (
              <div>
                <h3 className="font-bold mb-2">Answer:</h3>
                <textarea
                  className="w-full border rounded-md p-2"
                  rows="5"
                  placeholder="Student would enter response here"
                  readOnly
                ></textarea>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">Question Details</h3>
              <div className="space-y-1">
                <p><strong>Type:</strong> {question.questionType}</p>
                <p><strong>Status:</strong> {question.status}</p>
                <p><strong>Created by:</strong> {question.createdBy.name}</p>
                <p><strong>Version:</strong> {question.version}</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">Usage Information</h3>
              <div className="space-y-1">
                <p><strong>Used in:</strong> {question.usage} quizzes</p>
                <p><strong>Last used:</strong> {question.lastUsed}</p>
                <p><strong>Comments:</strong> {question.comments}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Modals = ({
  // Create modals
  showCreateModal,
  setShowCreateModal,
  showTrueFalseModal,
  setShowTrueFalseModal,
  showMultipleChoiceModal,
  setShowMultipleChoiceModal,
  
  // Edit modals
  showBulkEditModal,
  setShowBulkEditModal,
  editingQuestionData,
  setEditingQuestionData,
  
  // Preview/History modals
  previewQuestion,
  setPreviewQuestion,
  historyModal,
  setHistoryModal,
  
  // Save confirmation
  showSaveConfirm,
  setShowSaveConfirm,
  editingQuestion,
  setEditingQuestion,
  newQuestionTitle, // Add this missing prop
  
  // Data
  questions,
  setQuestions,
  selectedQuestions,
  setSelectedQuestions,
  username,
  
  // Components
  EDIT_COMPONENTS,
  BULK_EDIT_COMPONENTS
}) => {
  const confirmSave = (questionId, newQuestionTitle) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? {
              ...q, 
              title: newQuestionTitle,
              version: `v${parseInt(q.version.substring(1)) + 1}`,
              modifiedBy: {
                ...q.modifiedBy,
                date: new Date().toLocaleString()
              },
              history: [
                ...q.history,
                {
                  version: `v${parseInt(q.version.substring(1)) + 1}`,
                  date: new Date().toLocaleDateString(),
                  author: username,
                  changes: "Updated question title"
                }
              ]
            }
          : q
      )
    );
    setShowSaveConfirm(false);
    setEditingQuestion(null);
  };

  const cancelSave = () => {
    setShowSaveConfirm(false);
    setEditingQuestion(null);
  };

  const handleQuestionSave = (questionData, isNew = true) => {
    if (isNew) {
      const safeQuestion = {
        ...questionData,
        title: questionData.title || 'Untitled',
        questionText: questionData.questionText || '',
        defaultMark: questionData.defaultMark ?? 1,
        generalFeedback: questionData.generalFeedback || '',
        status: 'draft'
      };
      
      setQuestions(prev => [
        {
          id: prev.length > 0 ? Math.max(...prev.map(q => q.id)) + 1 : 1,
          version: "v1",
          createdBy: {
            name: username,
            role: "",
            date: new Date().toLocaleString()
          },
          modifiedBy: {
            name: username,
            role: "",
            date: new Date().toLocaleString()
          },
          comments: 0,
          usage: 0,
          lastUsed: "Never",
          history: [
            {
              version: "v1",
              date: new Date().toLocaleDateString(),
              author: username,
              changes: `Created ${questionData.questionType} question`
            }
          ],
          ...safeQuestion
        },
        ...prev
      ]);
    } else {
      // Update existing question
      setQuestions(prev =>
        prev.map(q =>
          q.id === editingQuestionData.id
            ? {
                ...q,
                ...questionData,
                version: `v${parseInt(q.version.substring(1)) + 1}`,
                modifiedBy: {
                  ...q.modifiedBy,
                  date: new Date().toLocaleString()
                },
                history: [
                  ...q.history,
                  {
                    version: `v${parseInt(q.version.substring(1)) + 1}`,
                    date: new Date().toLocaleDateString(),
                    author: username,
                    changes: "Edited question"
                  }
                ]
              }
            : q
        )
      );
    }
  };

  return (
    <>
      {/* Create Question Modal */}
      {showCreateModal && (
        <CreateQuestionModal
          onClose={() => setShowCreateModal(false)}
          onSelectType={(type) => {
            setShowCreateModal(false);
            if (type.name === 'True/False') setShowTrueFalseModal(true);
            if (type.name === 'Multiple choice') setShowMultipleChoiceModal(true);
          }}
          questions={questions}
        />
      )}

      {/* True/False Question Modal */}
      {showTrueFalseModal && (
        <CreateTrueFalseQuestion
          onClose={() => setShowTrueFalseModal(false)}
          onSave={(questionData) => {
            setShowTrueFalseModal(false);
            const processedData = {
              ...questionData,
              questionType: "truefalse",
              correctAnswer: questionData.correctAnswer || 'true',
              penalty: questionData.penalty ?? 0,
              feedbackTrue: questionData.feedbackTrue || '',
              feedbackFalse: questionData.feedbackFalse || ''
            };
            handleQuestionSave(processedData);
          }}
        />
      )}

      {/* Multiple Choice Question Modal */}
      {showMultipleChoiceModal && (
        <CreateMultipleChoiceQuestion
          onClose={() => setShowMultipleChoiceModal(false)}
          onSave={(questionData) => {
            setShowMultipleChoiceModal(false);
            const choices = Array.isArray(questionData.choices) ? questionData.choices : [];
            const options = choices.map(a => a.text);
            const correctAnswers = choices
              .filter(a => a.grade === 100)
              .map(a => a.text);
            
            const processedData = {
              ...questionData,
              questionType: "multiple",
              options,
              correctAnswers
            };
            handleQuestionSave(processedData);
          }}
        />
      )}

      {/* Bulk Edit Modal */}
      {showBulkEditModal && (() => {
        const questionsToEdit = questions.filter(q => selectedQuestions.includes(q.id));
        const types = [...new Set(questionsToEdit.map(q => q.questionType))];

        if (types.length === 1 && BULK_EDIT_COMPONENTS[types[0]]) {
          const BulkEditComponent = BULK_EDIT_COMPONENTS[types[0]];
          return (
            <BulkEditComponent
              questions={questionsToEdit}
              onClose={() => setShowBulkEditModal(false)}
              onSave={updatedQuestions => {
                setQuestions(prev =>
                  prev.map(q => {
                    const edited = updatedQuestions.find(uq => uq.id === q.id);
                    return edited
                      ? {
                          ...q,
                          ...edited,
                          version: `v${parseInt(q.version.substring(1)) + 1}`,
                          modifiedBy: {
                            ...q.modifiedBy,
                            date: new Date().toLocaleString()
                          },
                          history: [
                            ...q.history,
                            {
                              version: `v${parseInt(q.version.substring(1)) + 1}`,
                              date: new Date().toLocaleDateString(),
                              author: username,
                              changes: "Bulk edited"
                            }
                          ]
                        }
                      : q;
                  })
                );
                setShowBulkEditModal(false);
                setSelectedQuestions([]);
              }}
              isBulk
            />
          );
        } else if (questionsToEdit.length > 0) {
          return (
            <BulkEditQuestionsModal
              questions={questionsToEdit}
              onClose={() => setShowBulkEditModal(false)}
              onSave={updatedQuestions => {
                setQuestions(prev =>
                  prev.map(q => {
                    const edited = updatedQuestions.find(uq => uq.id === q.id);
                    return edited
                      ? {
                          ...q,
                          ...edited,
                          version: `v${parseInt(q.version.substring(1)) + 1}`,
                          modifiedBy: {
                            ...q.modifiedBy,
                            date: new Date().toLocaleString()
                          },
                          history: [
                            ...q.history,
                            {
                              version: `v${parseInt(q.version.substring(1)) + 1}`,
                              date: new Date().toLocaleDateString(),
                              author: username,
                              changes: "Bulk edited"
                            }
                          ]
                        }
                      : q;
                  })
                );
                setShowBulkEditModal(false);
                setSelectedQuestions([]);
              }}
            />
          );
        }
        return null;
      })()}

      {/* Individual Edit Modal */}
      {editingQuestionData && EDIT_COMPONENTS[editingQuestionData.questionType] && (
        React.createElement(EDIT_COMPONENTS[editingQuestionData.questionType], {
          ...(editingQuestionData.questionType === "truefalse"
            ? { existingQuestion: editingQuestionData }
            : { question: editingQuestionData }),
          onClose: () => setEditingQuestionData(null),
          onSave: updatedData => {
            handleQuestionSave(updatedData, false);
            setEditingQuestionData(null);
          }
        })
      )}

      {/* Save Confirmation Modal */}
      {showSaveConfirm && (
        <SaveConfirmationModal
          questionId={editingQuestion}
          onConfirm={(questionId) => confirmSave(questionId, newQuestionTitle)}
          onCancel={cancelSave}
        />
      )}

      {/* Preview Modal */}
      {previewQuestion && (
        <PreviewModal 
          question={previewQuestion} 
          onClose={() => setPreviewQuestion(null)} 
        />
      )}

      {/* History Modal */}
      {historyModal && (
        <HistoryModal 
          question={historyModal} 
          onClose={() => setHistoryModal(null)} 
        />
      )}
    </>
  );
};

export default Modals;