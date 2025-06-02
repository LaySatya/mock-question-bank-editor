// import React, { useState, useRef, useEffect } from 'react';
// import { ChevronDown, Edit, Eye, Copy, Clock, Trash, MessageCircle, X, CheckCircle, AlertTriangle, Filter, Download, Upload } from 'lucide-react';
// import { XMLParser } from 'fast-xml-parser';
// import { Check } from 'lucide-react';
// import CreateQuestionModal from '../components/modals/CreateQuestionModal';
// import CreateTrueFalseQuestion from '../components/questions/CreateTrueFalseQuestion';
// import CreateMultipleChoiceQuestion from '../components/questions/CreateMultipleChoiceQuestion';


// import BulkEditQuestionsModal from '../components/modals/BulkEditQuestionsModal';




// const QuestionBank = () => {

//   //use for filter tags 
//   const [tagFilter, setTagFilter] = useState('All');

// const dropdownRefs = useRef({});
// const questionsDropdownRef = useRef(null);
//   //user come from clerk 
// // const { isLoaded, user } = useUser();
// const [username, setUsername] = useState(localStorage.getItem('username') || "Unknown User");

// useEffect(() => {
//   // Listen for changes to localStorage (e.g., login/logout in another tab)
//   const handleStorage = () => {
//     setUsername(localStorage.getItem('username') || "Unknown User");
//   };
//   window.addEventListener('storage', handleStorage);
//   return () => window.removeEventListener('storage', handleStorage);
// }, []);
// //use for edit multiple questions
// const [showBulkEditModal, setShowBulkEditModal] = useState(false);

//   ///edit q place only one question  
//   const [editingQuestionData, setEditingQuestionData] = useState(null);
  
// //true false question
//   const [showTrueFalseModal, setShowTrueFalseModal] = useState(false);
//   const [showMultipleChoiceModal, setShowMultipleChoiceModal] = useState(false);
// //const [trueFalsePreview, setTrueFalsePreview] = useState(null);
//   // State management
//   const [showQuestionText, setShowQuestionText] = useState(true);
//   const [selectedQuestions, setSelectedQuestions] = useState([]);
//   const [openActionDropdown, setOpenActionDropdown] = useState(null);
//   const [openStatusDropdown, setOpenStatusDropdown] = useState(null);
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [newQuestionTitle, setNewQuestionTitle] = useState('');
   
//   const [showSaveConfirm, setShowSaveConfirm] = useState(false);
//   const [previewQuestion, setPreviewQuestion] = useState(null);
//   const [historyModal, setHistoryModal] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({
//     category: 'All',
//     status: 'All',
//     type: 'All'
//   });
// const [showCreateModal, setShowCreateModal] = useState(false);
//   const mapQuestionType = (xmlType) => {
//   switch (xmlType) {
//     case "multichoice":
//       return "multiple";
//     case "essay":
//       return "essay";
//     case "matching":
//       return "matching";
//     case "shortanswer":
//       return "shortanswer";
//     case "truefalse":
//       return "truefalse";
//     default:
//       return "multiple";
//   }
// };

// const BULK_EDIT_COMPONENTS = {
//   truefalse: CreateTrueFalseQuestion,
//   multiple: CreateMultipleChoiceQuestion,
//   // Add more types as needed
// };
// const EDIT_COMPONENTS = {
//   truefalse: CreateTrueFalseQuestion,
//   multiple: CreateMultipleChoiceQuestion,
//   // Add more types as needed
// };
// const [currentPage, setCurrentPage] = useState(1);
// const questionsPerPage = 10;
// const startIdx = (currentPage - 1) * questionsPerPage;
// const endIdx = startIdx + questionsPerPage;
// const dropdownRef = useRef(null);
//   //state for tracking the dropdown
// const [showQuestionsDropdown, setShowQuestionsDropdown] = useState(false);
//   //this function to handle the import
// const handleFileUpload = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const xmlContent = e.target.result;
//         importQuestionFromXML(xmlContent);
//         alert("XML import successful!");
//       } catch (error) {
//         alert("Error importing XML: " + error.message);
//       }
//     };
//     reader.readAsText(file);
//   }
// };
// const importQuestionFromXML = (xmlString) => {
//   try {
//     const parser = new XMLParser({
//       ignoreAttributes: false,
//       attributeNamePrefix: '@_'  // Ensures attributes are prefixed with @_
//     });
    
//     const result = parser.parse(xmlString);
    
//     // Check that the required elements exist
//     if (!result || !result.quiz || !result.quiz.question) {
//       throw new Error("Invalid XML structure - missing quiz or question elements");
//     }
//      // Handle both single questions and multiple questions
//     const xmlQuestions = Array.isArray(result.quiz.question)
//       ? result.quiz.question
//       : [result.quiz.question];
//           // Use the current state for ID generation
//       // Use the current state for ID generation
//     setQuestions(prevQuestions => {
//       const maxId = prevQuestions.length > 0 ? Math.max(...prevQuestions.map(q => q.id)) : 0;
//       const newQuestions = xmlQuestions.map((q, index) => {
//       // Safely access properties with fallbacks
//       const questionName = q.name?.text || `Imported Question ${index + 1}`;
//       const questionText = q.questiontext?.text || "No question text provided";
//       const questionType = q['@_type'] || "multiple";
      
//       // Handle answers more safely
//       let options = [];
//       let correctAnswers = [];
      
//       if (q.answer) {
//         // Convert to array if not already
//         const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
        
//         options = answers.map(a => {
//           const text = a.text || "No answer text";
//           const isCorrect = a['@_fraction'] === "100";
          
//           if (isCorrect) {
//             correctAnswers.push(text);
//           }
          
//           return text;
//         });
//       }
//       return {
//         id: maxId + index + 1,
//         title: questionName,
//         status: "draft", // Default to draft for safety
//         version: "v1",
//         createdBy: {
//           name: "Imported",
//           role: "",
//           date: new Date().toLocaleString()
//         },
//         comments: 0,
//         usage: 0,
//         lastUsed: "Never",
//         modifiedBy: {
//           name: "Imported",
//           role: "",
//           date: new Date().toLocaleString()
//         },
//         questionType: mapQuestionType(questionType),
//         questionText: questionText,
//         options: options,
//         correctAnswers: correctAnswers,
//         history: [
//           { 
//             version: "v1",
//                 date: new Date().toLocaleDateString(),
//                 author: "Imported",
//                 changes: "Imported from XML"
//               }
//             ]
//           };
//         })
//         // Filter out duplicates by title and questionText
//         .filter(newQ =>
//           !prevQuestions.some(
//             q =>
//               q.title === newQ.title &&
//               q.questionText === newQ.questionText
//           )
//         );
//       return [ ...newQuestions ,...prevQuestions];
//     });
//   } catch (error) {
//     console.error("XML Import Error:", error);
//     throw new Error(`Error importing XML: ${error.message}`);
//   }
// };
//   // Mock data for questions
//   const [questions, setQuestions] = useState([

   
// {
//   id: 101,
//   title: "What is the time complexity of binary search?",
//   questionText: "Select the correct time complexity for the binary search algorithm.",
//   questionType: "multiple",
//   options: [
//     "O(n)",
//     "O(log n)",
//     "O(n log n)",
//     "O(1)"
//   ],
//   correctAnswers: ["O(log n)"],
//   tags: ["algorithms", "programming", "easy"],
//   status: "ready",
//   version: "v1",
//   createdBy: { name: "Ms Smith", role: "Teacher", date: "2 June 2025, 10:00 AM" },
//   comments: 0,
//   usage: 0,
//   lastUsed: "Never",
//   modifiedBy: { name: "Ms Smith", role: "Teacher", date: "2 June 2025, 10:00 AM" },
//   history: [
//     { version: "v1", date: "2 June 2025", author: "Ms Smith", changes: "Initial creation" }
//   ]
// },
// {
//   id: 102,
//   title: "Which language is used for web development?",
//   questionText: "Choose all languages commonly used for web development.",
//   questionType: "multiple",
//   options: [
//     "Python",
//     "HTML",
//     "CSS",
//     "C++"
//   ],
//   correctAnswers: ["HTML", "CSS"],
//   tags: ["web development", "html", "css", "quiz", "easy"],
//   status: "ready",
//   version: "v1",
//   createdBy: { name: "Mr John", role: "Teacher", date: "2 June 2025, 11:00 AM" },
//   comments: 0,
//   usage: 0,
//   lastUsed: "Never",
//   modifiedBy: { name: "Mr John", role: "Teacher", date: "2 June 2025, 11:00 AM" },
//   history: [
//     { version: "v1", date: "2 June 2025", author: "Mr John", changes: "Initial creation" }
//   ]
// },
// {
//   id: 103,
//   title: "What does SQL stand for?",
//   questionText: "Select the correct full form of SQL.",
//   questionType: "multiple",
//   options: [
//     "Structured Query Language",
//     "Simple Query Language",
//     "Sequential Query Language",
//     "Standard Query Language"
//   ],
//   correctAnswers: ["Structured Query Language"],
//   tags: ["sql", "databases", "medium", "exam"],
//   status: "ready",
//   version: "v1",
//   createdBy: { name: "Ms Lee", role: "Teacher", date: "2 June 2025, 12:00 PM" },
//   comments: 0,
//   usage: 0,
//   lastUsed: "Never",
//   modifiedBy: { name: "Ms Lee", role: "Teacher", date: "2 June 2025, 12:00 PM" },
//   history: [
//     { version: "v1", date: "2 June 2025", author: "Ms Lee", changes: "Initial creation" }
//   ]
// },

// {
//   id: 104,
//   title: "Which protocol is used to securely transfer files over the Internet?",
//   questionText: "Select the protocol that provides secure file transfer.",
//   questionType: "multiple",
//   options: [
//     "FTP",
//     "SFTP",
//     "HTTP",
//     "SMTP"
//   ],
//   correctAnswers: ["SFTP"],
//   tags: ["networking", "security", "medium", "exam"],
//   status: "ready",
//   version: "v1",
//   createdBy: { name: "Ms Kim", role: "Teacher", date: "2 June 2025, 1:00 PM" },
//   comments: 0,
//   usage: 0,
//   lastUsed: "Never",
//   modifiedBy: { name: "Ms Kim", role: "Teacher", date: "2 June 2025, 1:00 PM" },
//   history: [
//     { version: "v1", date: "2 June 2025", author: "Ms Kim", changes: "Initial creation" }
//   ]
// },
// {
//   id: 105,
//   title: "Which of the following is a Python data structure?",
//   questionText: "Choose all correct Python data structures.",
//   questionType: "multiple",
//   options: [
//     "List",
//     "Tuple",
//     "ArrayList",
//     "Dictionary"
//   ],
//   correctAnswers: ["List", "Tuple", "Dictionary"],
//   tags: ["python", "data structures", "quiz", "easy"],
//   status: "ready",
//   version: "v1",
//   createdBy: { name: "Mr John", role: "Teacher", date: "2 June 2025, 1:10 PM" },
//   comments: 0,
//   usage: 0,
//   lastUsed: "Never",
//   modifiedBy: { name: "Mr John", role: "Teacher", date: "2 June 2025, 1:10 PM" },
//   history: [
//     { version: "v1", date: "2 June 2025", author: "Mr John", changes: "Initial creation" }
//   ]
// },
// {
//   id: 106,
//   title: "What is the main purpose of an operating system?",
//   questionText: "Select the primary function of an operating system.",
//   questionType: "multiple",
//   options: [
//     "Manage hardware resources",
//     "Compile source code",
//     "Design web pages",
//     "Send emails"
//   ],
//   correctAnswers: ["Manage hardware resources"],
//   tags: ["operating systems", "core", "medium", "assignment"],
//   status: "ready",
//   version: "v1",
//   createdBy: { name: "Ms Lee", role: "Teacher", date: "2 June 2025, 1:20 PM" },
//   comments: 0,
//   usage: 0,
//   lastUsed: "Never",
//   modifiedBy: { name: "Ms Lee", role: "Teacher", date: "2 June 2025, 1:20 PM" },
//   history: [
//     { version: "v1", date: "2 June 2025", author: "Ms Lee", changes: "Initial creation" }
//   ]
// },

//   ]);
//  const allTags = Array.from(
//     new Set(
//       questions
//         .flatMap(q => Array.isArray(q.tags) ? q.tags : [])
//         .filter(Boolean)
//     )
//   );
//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       // Action dropdown
//       if (
//         openActionDropdown &&
//         dropdownRefs.current[openActionDropdown] &&
//         !dropdownRefs.current[openActionDropdown].contains(event.target)
//       ) {
//         setOpenActionDropdown(null);
//       }
//       // Status dropdown
//       if (
//         openStatusDropdown &&
//         dropdownRefs.current[openStatusDropdown] &&
//         !dropdownRefs.current[openStatusDropdown].contains(event.target)
//       ) {
//         setOpenStatusDropdown(null);
//       }
//       // Top "Questions" dropdown
//       if (
//         showQuestionsDropdown &&
//         questionsDropdownRef.current &&
//         !questionsDropdownRef.current.contains(event.target)
//       ) {
//         setShowQuestionsDropdown(false);
//       }
//     }
  
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [openActionDropdown, openStatusDropdown, showQuestionsDropdown]);
//   // Toggle individual question selection
//   const toggleQuestionSelection = (id) => {
//     setSelectedQuestions(prev => 
//       prev.includes(id) 
//         ? prev.filter(qId => qId !== id) 
//         : [...prev, id]
//     );
//   };

//   // Handle select all questions
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedQuestions(filteredQuestions.map(q => q.id));
//     } else {
//       setSelectedQuestions([]);
//     }
//   };

//   // Get question type icon
//   const getQuestionTypeIcon = (type) => {
//     switch(type) {
//       case 'multiple': return <img src="/src/assets/icon/Multiple-choice.svg" className="w-6 h-6" alt="icon" />;
//       case 'matching': return <img src="/src/assets/icon/Matching.svg" className="w-6 h-6" alt="icon" />;
//       case 'essay': return <img src="/src/assets/icon/Essay.svg" className="w-6 h-6" alt="icon" />;
//       case 'shortanswer':return <img src="/src/assets/icon/Short-answer.svg" className="w-6 h-6" alt="icon" />;
//       case 'truefalse':return <img src="/src/assets/icon/True-False.svg" className="w-6 h-6" alt="icon" />;
  
//       default: return <span className="w-6 h-6 inline-block">•</span>;
//     }
//   };
// ///shandle bulk edit

//   // Handle bulk deletion
//   const handleBulkDelete = () => {
//     if (window.confirm(`Are you sure you want to delete ${selectedQuestions.length} questions?`)) {
//       // In real implementation, this would call an API
//       setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
//       setSelectedQuestions([]);
//     }
//   };

//   // Handle status change
//   const changeStatus = (questionId, newStatus) => {
//     setQuestions(prev => 
//       prev.map(q => 
//         q.id === questionId 
//           ? { 
//               ...q, 
//               status: newStatus,
//               version: `v${parseInt(q.version.substring(1)) + 1}`,
//               modifiedBy: {
//                 ...q.modifiedBy,
//                 date: new Date().toLocaleString('en-US', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric',
//                   hour: 'numeric',
//                   minute: '2-digit',
//                   hour12: true
//                 })
//               },
//               history: [
//                 ...q.history,
//                 {
//                   version: `v${parseInt(q.version.substring(1)) + 1}`,
//                   date: new Date().toLocaleDateString('en-US', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                   }),
//                   author: username || "Unknown User",
//                   changes: `Changed status to ${newStatus}`
//                 }
//               ]
//             }
//           : q
//       )
//     );
//     setOpenStatusDropdown(null);
//   };

//   // Duplicate a question
//   const duplicateQuestion = (question) => {
//     const newQuestion = {
//       ...question,
//       id: Math.max(...questions.map(q => q.id)) + 1,
//       title: `Copy of: ${question.title}`,
//       version: 'v1',
//       status: 'draft',
//       createdBy: {
//         name: username || "Unknown User",
//         role: "",
//         date: new Date().toLocaleString('en-US', {
//           day: 'numeric',
//           month: 'long',
//           year: 'numeric',
//           hour: 'numeric',
//           minute: '2-digit',
//           hour12: true
//         })
//       },
//       modifiedBy: {
//         name: username || "Unknown User",
//         role: "",
//         date: new Date().toLocaleString('en-US', {
//           day: 'numeric',
//           month: 'long',
//           year: 'numeric',
//           hour: 'numeric',
//           minute: '2-digit',
//           hour12: true
//         })
//       },
//       history: [
//         {
//           version: "v1",
//           date: new Date().toLocaleDateString('en-US', {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric'
//           }),
//           author: username || "Unknown User",
//           changes: "Duplicated from original question"
//         }
//       ],
//       comments: 0,
//       usage: 0,
//       lastUsed: "Never"
//     };
    
//         setQuestions(prev => [...prev, newQuestion]);
//     setOpenActionDropdown(null);
//   };

//   // Delete a question
//   const deleteQuestion = (questionId) => {
//     if (window.confirm("Are you sure you want to delete this question?")) {
//       setQuestions(prev => prev.filter(q => q.id !== questionId));
//       setOpenActionDropdown(null);
//     }
//   };
 
//  ///edit for title question 
// const startEditingTitle = (question) => {
//   setEditingQuestion(question.id);
//   setNewQuestionTitle(question.title);
// };
// const initiateQuestionSave = (questionId) => {
//   if (newQuestionTitle.trim() === '') return;
//   setShowSaveConfirm(true);
//   // Do NOT setEditingQuestion(null) here!
// };

// const confirmSave = (questionId) => {
//   setQuestions(prev => 
//     prev.map(q => 
//       q.id === questionId 
//         ? {
//             ...q, 
//             title: newQuestionTitle,
//             version: `v${parseInt(q.version.substring(1)) + 1}`,
//             modifiedBy: {
//               ...q.modifiedBy,
//               date: new Date().toLocaleString('en-US', {
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric',
//                 hour: 'numeric',
//                 minute: '2-digit',
//                 hour12: true
//               })
//             },
//             history: [
//               ...q.history,
//               {
//                 version: `v${parseInt(q.version.substring(1)) + 1}`,
//                 date: new Date().toLocaleDateString('en-US', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric'
//                 }),
//                 author: username || "Unknown User",
//                 changes: "Updated question title"
//               }
//             ]
//           }
//         : q
//     )
//   );
//   setShowSaveConfirm(false);
//   setEditingQuestion(null); // Only close input after confirming
// };

// const cancelSave = () => {
//   setShowSaveConfirm(false);
//   setEditingQuestion(null); // Only close input after cancelling
// };
// // Save Confirmation Modal
// const SaveConfirmationModal = ({ questionId, onConfirm, onCancel }) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md pointer-events-auto">
//         <div className="p-6">
//           <h3 className="text-lg font-medium mb-4">Save Changes?</h3>
//           <p className="mb-6 text-gray-600">
//             Do you want to save your changes to this question?
//           </p>
          
//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={onCancel}
//               className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onConfirm(questionId)}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

//   // History Modal Component
// const HistoryModal = ({ question, onClose }) => {
//   if (!question) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl pointer-events-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-xl font-medium">Version History: {question.title}</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         {/* Content */}
//         <div className="p-6">
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-4 py-2 text-left">Version</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">Author</th>
//                 <th className="border border-gray-300 px-4 py-2 text-left">Changes</th>
//               </tr>
//             </thead>
//             <tbody>
//               {question.history.map((version, index) => (
//                 <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                   <td className="border border-gray-300 px-4 py-2">{version.version}</td>
//                   <td className="border border-gray-300 px-4 py-2">{version.date}</td>
//                   <td className="border border-gray-300 px-4 py-2">{version.author}</td>
//                   <td className="border border-gray-300 px-4 py-2">{version.changes}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* Footer */}
//         <div className="flex justify-end p-4 border-t bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

//   // Preview Modal Component
// const PreviewModal = ({ question, onClose }) => {
//   if (!question) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl pointer-events-auto">
//         {/* Header with close button */}
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-xl font-medium">Question Preview: {question.title}</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         {/* Content area */}
//         <div className="p-6">
//           <div className="border rounded-md p-4 mb-6 bg-gray-50">
//             <div className="mb-4">
//               <h3 className="font-bold mb-2">Question Text</h3>
//               <p>{question.questionText || "No question text"}</p>
//             </div>
//             {/* Show options for multiple choice */}
//             {question.questionType === 'multiple' && question.options && (
//               <div>
//                 <h3 className="font-bold mb-2">Options:</h3>
//                 <div className="space-y-2">
//                   {question.options.map((opt, idx) => (
//                     <div className="flex items-start" key={idx}>
//                       <input
//                         type="radio"
//                         className="mt-1 mr-2"
//                         name="option"
//                         checked={question.correctAnswers && question.correctAnswers.includes(opt)}
//                         readOnly
//                       />
//                       <div>{opt}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {/* Show correct answer for true/false */}
//             {question.questionType === 'truefalse' && (
//               <div>
//                 <h3 className="font-bold mb-2">Correct Answer:</h3>
//                 <div>
//                   {question.correctAnswer === 'true' ? 'True' : 'False'}
//                 </div>
//                 <div className="mt-2">
//                   <strong>Feedback (True):</strong> {question.feedbackTrue}
//                 </div>
//                 <div>
//                   <strong>Feedback (False):</strong> {question.feedbackFalse}
//                 </div>
//               </div>
//             )}
//             {/* Show essay/short answer */}
//             {['essay', 'shortanswer'].includes(question.questionType) && (
//               <div>
//                 <h3 className="font-bold mb-2">Answer:</h3>
//                 <textarea
//                   className="w-full border rounded-md p-2"
//                   rows="5"
//                   placeholder="Student would enter response here"
//                   readOnly
//                 ></textarea>
//               </div>
//             )}
//           </div>
//           <div className="grid grid-cols-2 gap-8">
//             <div>
//               <h3 className="font-bold mb-2">Question Details</h3>
//               <div className="space-y-1">
//                 <p><strong>Type:</strong> {question.questionType}</p>
//                 <p><strong>Status:</strong> {question.status}</p>
//                 <p><strong>Created by:</strong> {question.createdBy.name}</p>
//                 <p><strong>Version:</strong> {question.version}</p>
//               </div>
//             </div>
//             <div>
//               <h3 className="font-bold mb-2">Usage Information</h3>
//               <div className="space-y-1">
//                 <p><strong>Used in:</strong> {question.usage} quizzes</p>
//                 <p><strong>Last used:</strong> {question.lastUsed}</p>
//                 <p><strong>Comments:</strong> {question.comments}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Footer with close button */}
//         <div className="flex justify-end p-4 border-t bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const filteredQuestions = questions.filter(q =>
//   q.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
//   (filters.type === 'All' || q.questionType === filters.type) &&
//   (filters.status === 'All' || q.status === filters.status) &&
//   (tagFilter === 'All' || (Array.isArray(q.tags) && q.tags.includes(tagFilter)))
// );
//   const paginatedQuestions = filteredQuestions.slice(startIdx, endIdx);
//   return (
//     <div className="max-w-full">
//       {/* Top Buttons Row */}
//       <div className="p-4 flex flex-wrap gap-2 items-center">

//           {/* Questions dropdown */}
//   <div className="relative" ref={questionsDropdownRef}>
//     <button 
//       className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded flex items-center"
//       onClick={() => setShowQuestionsDropdown(!showQuestionsDropdown)}
//     >
//       Questions <ChevronDown size={14} className="ml-2" />
//     </button>
    
//     {showQuestionsDropdown && (
//       <div className="absolute left-0 mt-1 w-48 bg-gray-500 rounded shadow-lg z-10 border border-gray-500">
//         <button className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600">
//           <Check size={16} className="mr-2" /> Questions
//         </button>
//         <button className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600">
//           Categories
//         </button>
//         <label className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600 cursor-pointer">
//           <input
//             type="file"
//             accept=".xml"
//             className="hidden"
//             onChange={handleFileUpload}
//           />
//           Import
//         </label>
//         <button 
//           className="flex items-center w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-600"
//           onClick={() => alert("Export functionality would go here")}
//         >
//           Export
//         </button>
//       </div>
//     )}
//   </div>
//               <button
//           className="bg-blue-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
//           onClick={() => setShowCreateModal(true)}
//         >
//           Create a new question ...
//         </button>
        
//         <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded flex items-center">
//           Add columns <ChevronDown size={14} className="ml-1" />
//         </button>
        
//         <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-3 rounded">
//           Reset columns
//         </button>
        
//         <div className="flex items-center ml-4">
//           <span className="mr-2">Show question text in the question list?</span>
//           <select
//           className="border rounded py-1 px-2"
//           value={showQuestionText ? "Yes" : "No"}
//           onChange={e => setShowQuestionText(e.target.value === "Yes")}
//         >
//           <option value="Yes">Yes, text only</option>
//           <option value="No">No</option>
//         </select>
//         </div>
//       </div>
      
//       {/* Search and Filters Row */}
//       {selectedQuestions.length > 0 && (
//         <div className="p-4 bg-blue-50 flex flex-wrap gap-2 items-center">
//           <span>{selectedQuestions.length} questions selected</span>
          
//           {/* <button 
//             className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded flex items-center text-sm"
//             onClick={() => alert('Bulk edit would open a modal')}
//           >
//             <Edit size={14} className="mr-1" /> Edit
//           </button> */}
//         <button 
//           className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded flex items-center text-sm"
//           onClick={() => {
//             if (selectedQuestions.length > 0) {
//               setShowBulkEditModal(true);
//             } else {
//               alert('Please select at least one question to edit.');
//             }
//           }}
//         >
//           <Edit size={14} className="mr-1" /> Edit
//         </button>
          
//           <button 
//             className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded flex items-center text-sm"
//             onClick={handleBulkDelete}
//           >
//             <Trash size={14} className="mr-1" /> Delete
//           </button>
          
//           <button 
//             className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded flex items-center text-sm"
//             onClick={() => alert('Bulk duplicate would be handled here')}
//           >
//             <Copy size={14} className="mr-1" /> Duplicate
//           </button>
          
//           <button 
//             className="bg-green-100 hover:bg-green-200 text-green-800 py-1 px-3 rounded flex items-center text-sm"
//             onClick={() => alert('Export to XML would happen here')}
//           >
//             <Download size={14} className="mr-1" /> Export XML
//           </button>
          
//           <button 
//             className="ml-auto text-blue-600 hover:underline text-sm"
//             onClick={() => setSelectedQuestions([])}
//           >
//             Clear selection
//           </button>
//         </div>
//       )}
      
//       {/* Search and Filter Options */}
//       <div className="p-4 border-t border-b border-gray-200 bg-gray-50 flex flex-wrap gap-3 items-center">
//         <div className="relative flex-grow max-w-md">
//           <input
//             type="text"
//             placeholder="Search questions..."
//             className="w-full pl-10 pr-4 py-2 border rounded"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <div className="absolute left-3 top-2.5 text-gray-400">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//           </div>
//         </div>
        
//         <select 
//           className="border rounded py-2 px-3"
//           value={filters.category}
//           onChange={(e) => setFilters({...filters, category: e.target.value})}
//         >
//           <option value="All">All Categories</option>
//           <option value="Computer Science">Computer Science</option>
//           <option value="Mathematics">Mathematics</option>
//           <option value="Language">Language</option>
//         </select>
        
//         <select 
//           className="border rounded py-2 px-3"
//           value={filters.status}
//           onChange={(e) => setFilters({...filters, status: e.target.value})}
//         >
//           <option value="All">All Statuses</option>
//           <option value="ready">Ready</option>
//           <option value="draft">Draft</option>
//         </select>
        
//         <select 
//           className="border rounded py-2 px-3"
//           value={filters.type}
//           onChange={(e) => setFilters({...filters, type: e.target.value})}
//         >
//           <option value="All">All Question Types</option>
//           <option value="multiple">Multiple Choice</option>
//           <option value="truefalse">True False </option>
//           <option value="essay">Essay</option>
//           <option value="matching">Matching</option>
//           <option value="shortanswer">Short Answer</option>
//         </select>
        
       
//         <select
//   className="border rounded py-2 px-3"
//   value={tagFilter}
//   onChange={e => setTagFilter(e.target.value)}
// >
//   <option value="All">All Tags</option>
//   {allTags.map(tag => (
//     <option key={tag} value={tag}>{tag}</option>
//   ))}
// </select>
//       </div>

//       <div className="overflow-x-auto" ref={dropdownRef}>
//         <table className="min-w-full border-collapse">
//           <thead>
//             <tr>
//               <th className="border-b px-2 py-2 text-center">
//                 <input 
//                   type="checkbox"
//                   className="h-4 w-4"
//                   onChange={handleSelectAll}
//                   checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
//                 />
//               </th>
//               <th className="border-b px-4 py-2 text-left font-medium text-blue-500">
//                 <div className="flex items-center">
//                   <span>T</span>
//                   <span className="text-gray-500">▲</span>
//                   <span className="ml-2">Actions</span>
//                 </div>
//               </th>
//               <th className="border-b px-4 py-2 text-left font-medium ">
//                 <div>
//                   Question
//                   <div className="text-xs font-normal text-gray-600">
//                     Question name / ID number
//                   </div>
//                 </div>
//               </th>
//               <th className="border-b px-4 py-2 text-left font-medium">
//                 Status
//               </th>
//               <th className="border-b px-4 py-2 text-left font-medium">
//                 Version
//               </th>
//               <th className="border-b px-4 py-2 text-left font-medium">
//                 <div>
//                   Created by
//                   <div className="text-xs font-normal text-blue-500">
//                     First name / Surname / Date
//                   </div>
//                 </div>
//               </th>
//               <th className="border-b px-4 py-2 text-center font-medium">
//                 Comments
//               </th>
//               <th className="border-b px-4 py-2 text-center font-medium">
//                 Usage
//               </th>
//               <th className="border-b px-4 py-2 text-left font-medium ">
//                 <div className="flex items-center">
//                   Last used
//                   <span className="ml-2 text-blue-500 bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">?</span>
//                 </div>
//               </th>
//               <th className="border-b px-4 py-2 text-left font-medium ">
//                 <div>
//                   Modified by
//                   <div className="text-xs font-normal text-blue-500">
//                     First name / Surname / Date
//                   </div>
//                 </div>
//               </th>
//             </tr>
//           </thead>
//               <tbody>
//         {paginatedQuestions.map((question, index) => (
//           <tr key={question.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//             <td className="border-b px-2 py-3 text-center">
//               <input 
//                 type="checkbox"
//                 className="h-4 w-4"
//                 checked={selectedQuestions.includes(question.id)}
//                 onChange={() => toggleQuestionSelection(question.id)}
//               />
//             </td>
//                 <td className="border-b px-4 py-3">
//                   <div className="flex items-center gap-2">
//                     <span className="text-center text-2xl">{getQuestionTypeIcon(question.questionType)}</span>
//                     <div className="relative" ref={el => dropdownRefs.current[question.id] = el}>
//                       <button 
//                         className="text-blue-500 hover:underline flex items-center"
//                         onClick={() => setOpenActionDropdown(openActionDropdown === question.id ? null : question.id)}
//                       >
//                         Edit <ChevronDown size={14} className="ml-1" />
//                       </button>
                      
//                       {openActionDropdown === question.id && (
//                         <div className="absolute left-0 mt-1 w-40 bg-white rounded shadow-lg z-10 border border-gray-200">
//                           <button
//                             onClick={() => {
//                               setPreviewQuestion(question);
//                               setOpenActionDropdown(null);
//                             }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
//                           >
//                             <Eye size={14} className="mr-2" />
//                             Preview
//                           </button>
//                           <button
//                             onClick={() => {
//                               //startEditingTitle(question);
//                               setEditingQuestionData(question);
//                               setOpenActionDropdown(null);
//                             }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
//                           >
//                             <Edit size={14} className="mr-2" />
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => duplicateQuestion(question)}
//                             className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
//                           >
//                             <Copy size={14} className="mr-2" />
//                             Duplicate
//                           </button>
//                           <button
//                             onClick={() => {
//                               setHistoryModal(question);
//                               setOpenActionDropdown(null);
//                             }}
//                             className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
//                           >
//                             <Clock size={14} className="mr-2" />
//                             History
//                           </button>
//                           <button
//                             onClick={() => deleteQuestion(question.id)}
//                             className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
//                           >
//                             <Trash size={14} className="mr-2" />
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </td>
//                             <td className="border-b px-4 py-3 ">
//                 {showQuestionText && (
//                                  editingQuestion === question.id ? (
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="text"
//                         value={newQuestionTitle}
//                         onChange={(e) => setNewQuestionTitle(e.target.value)}
//                         className="border rounded px-2 py-1 w-full"
//                         autoFocus
//                         onBlur={() => initiateQuestionSave(question.id)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') initiateQuestionSave(question.id);
//                           if (e.key === 'Escape') setEditingQuestion(null);
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <div>
//                       <button
//                         className="flex items-center gap-1 text-left w-full bg-transparent border-0 p-0 hover:underline focus:outline-none"
//                         onClick={() => startEditingTitle(question)}
//                         style={{ cursor: 'pointer' }}
//                         tabIndex={0}
//                       >
//                         <span>{question.title}</span>
//                         <Edit size={14} className="text-gray-700" />
//                       </button>
//                       {/* Show tags after the title */}
//                       {Array.isArray(question.tags) && question.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           {question.tags.map(tag => (
//                             <span
//                               key={tag}
//                               className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )
//               )}
//             </td>
//                 <td className="border-b px-4 py-3">
//                   <div className="relative">
//                     <button 
//                       className="border rounded px-3 py-1 bg-white flex items-center"
//                       onClick={() => setOpenStatusDropdown(openStatusDropdown === question.id ? null : question.id)}
//                     >
//                       {question.status === 'ready' ? 'Ready' : 'Draft'} <ChevronDown size={14} className="ml-1" />
//                     </button>
                    
//                     {openStatusDropdown === question.id && (
//                       <div className="absolute left-0 mt-1 w-32 bg-white rounded shadow-lg z-10 border border-gray-200">
//                         <button
//                           onClick={() => changeStatus(question.id, 'ready')}
//                           className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
//                         >
//                           <CheckCircle size={14} className="mr-2 text-green-600" />
//                           Ready
//                         </button>
//                         <button
//                           onClick={() => changeStatus(question.id, 'draft')}
//                           className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
//                         >
//                           <AlertTriangle size={14} className="mr-2 text-amber-600" />
//                           Draft
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </td>
//                 <td className="border-b px-4 py-3">
//                   {question.version}
//                 </td>
//                 <td className="border-b px-4 py-3">
//                   <div>
//                     <div>{question.createdBy.name}</div>
//                     <div className="text-gray-600">{question.createdBy.role}</div>
//                     <div className="text-xs text-gray-600">{question.createdBy.date}</div>
//                   </div>
//                 </td>
//                 <td className="border-b px-4 py-3 text-center text-blue-500 font-medium">
//                   <button
//                     onClick={() => alert(`View ${question.comments} comments for this question`)}
//                     className="hover:underline focus:outline-none"
//                   >
//                     {question.comments}
//                   </button>
//                 </td>
//                 <td className="border-b px-4 py-3 text-center text-blue-500 font-medium">
//                   <button
//                     onClick={() => alert(`This question is used in ${question.usage} quizzes`)}
//                     className="hover:underline focus:outline-none"
//                   >
//                     {question.usage}
//                   </button>
//                 </td>
//                 <td className="border-b px-4 py-3 ">
//                   {question.lastUsed}
//                 </td>
//                 <td className="border-b px-4 py-3 ">
//                   <div>
//                     <div>{question.modifiedBy.name}</div>
//                     <div className="text-gray-600">{question.modifiedBy.role}</div>
//                     <div className="text-xs text-gray-600">{question.modifiedBy.date}</div>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="p-4 border-t border-gray-200 flex justify-between items-center">
//           <div className="text-sm text-gray-700">
//       Showing {filteredQuestions.length === 0 ? 0 : startIdx + 1} to {Math.min(endIdx, filteredQuestions.length)} of {filteredQuestions.length} questions
//     </div>
//        <div className="flex gap-2">
//       <button
//         className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//         disabled={currentPage === 1}
//         onClick={() => setCurrentPage(currentPage - 1)}
//       >
//         Previous
//       </button>
//       <button
//         className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//         disabled={endIdx >= filteredQuestions.length}
//         onClick={() => setCurrentPage(currentPage + 1)}
//       >
//         Next
//       </button>
//     </div>
//       </div>

//     {/* edit question multiple questions while select  */}
// {/* edit question multiple questions while select  */}
// {showBulkEditModal && (() => {
//   // Get selected questions
//   const questionsToEdit = questions.filter(q => selectedQuestions.includes(q.id));
//   // Get unique types
//   const types = [...new Set(questionsToEdit.map(q => q.questionType))];

//   // If all selected are the same type and supported, show type-specific bulk edit
//   if (types.length === 1 && BULK_EDIT_COMPONENTS[types[0]]) {
//     const BulkEditComponent = BULK_EDIT_COMPONENTS[types[0]];
//     return (
//       <BulkEditComponent
//         questions={questionsToEdit}
//         onClose={() => setShowBulkEditModal(false)}
//                onSave={updatedQuestions => {
//           setQuestions(prev =>
//             prev.map(q => {
//               const edited = updatedQuestions.find(uq => uq.id === q.id);
//               return edited
//                 ? {
//                     ...q,
//                     ...edited,
//                     version: `v${parseInt(q.version.substring(1)) + 1}`,
//                     modifiedBy: {
//                       ...q.modifiedBy,
//                       date: new Date().toLocaleString()
//                     },
//                     history: [
//                       ...q.history,
//                       {
//                         version: `v${parseInt(q.version.substring(1)) + 1}`,
//                         date: new Date().toLocaleDateString(),
//                         author: username || "Unknown User",
//                         changes: "Bulk edited"
//                       }
//                     ]
//                   }
//                 : q;
//             })
//           );
//           setShowBulkEditModal(false);
//           setSelectedQuestions([]);
//         }}
//         isBulk
//       />
//     );
//   } else if (questionsToEdit.length > 0) {
//     // If mixed types or no specialized editor, show generic bulk edit modal
//     return (
//       <BulkEditQuestionsModal
//         questions={questionsToEdit}
//         onClose={() => setShowBulkEditModal(false)}
//         onSave={updatedQuestions => {
//           setQuestions(prev =>
//             prev.map(q => {
//               const edited = updatedQuestions.find(uq => uq.id === q.id);
//               return edited
//                 ? {
//                     ...q,
//                     ...edited,
//                     version: `v${parseInt(q.version.substring(1)) + 1}`,
//                     modifiedBy: {
//                       ...q.modifiedBy,
//                       date: new Date().toLocaleString()
//                     },
//                     history: [
//                       ...q.history,
//                       {
//                         version: `v${parseInt(q.version.substring(1)) + 1}`,
//                         date: new Date().toLocaleDateString(),
//                         author: username || "Unknown User",
//                         changes: "Bulk edited"
//                       }
//                     ]
//                   }
//                 : q;
//             })
//           );
//           setShowBulkEditModal(false);
//           setSelectedQuestions([]);
//         }}
//       />
//     );
//   } else {
//     return null;
//   }
// })()}
// {/* edit one by one  */}
// {editingQuestionData && EDIT_COMPONENTS[editingQuestionData.questionType] && (
//   React.createElement(EDIT_COMPONENTS[editingQuestionData.questionType], {
//     ...(editingQuestionData.questionType === "truefalse"
//       ? { existingQuestion: editingQuestionData }
//       : { question: editingQuestionData }),
//     onClose: () => setEditingQuestionData(null),
//     onSave: updatedData => {
//       setQuestions(prev =>
//         prev.map(q =>
//           q.id === editingQuestionData.id
//             ? {
//                 ...q,
//                 ...updatedData,
//                 version: `v${parseInt(q.version.substring(1)) + 1}`,
//                 modifiedBy: {
//                   ...q.modifiedBy,
//                   date: new Date().toLocaleString()
//                 },
//                 history: [
//                   ...q.history,
//                   {
//                     version: `v${parseInt(q.version.substring(1)) + 1}`,
//                     date: new Date().toLocaleDateString(),
//                     author: username || "Unknown User",
//                     changes: "Edited question"
//                   }
//                 ]
//               }
//             : q
//         )
//       );
//       setEditingQuestionData(null);
//     }
//   })
// )}
//       {/* Modals */}
       
//       {showSaveConfirm && (
//         <SaveConfirmationModal
//           questionId={editingQuestion}
//           onConfirm={confirmSave}
//           onCancel={cancelSave}
//         />
//       )}
//       {previewQuestion && (
//         <PreviewModal 
//           question={previewQuestion} 
//           onClose={() => setPreviewQuestion(null)} 
//         />
//       )}
      
//       {historyModal && (
//         <HistoryModal 
//           question={historyModal} 
//           onClose={() => setHistoryModal(null)} 
//         />
//       )}
//        {/* Place your CreateQuestionModal here */}
//     {showCreateModal && (
//   <CreateQuestionModal
//     onClose={() => setShowCreateModal(false)}
//     onSelectType={(type) => {
//       setShowCreateModal(false);
//       if (type.name === 'True/False') setShowTrueFalseModal(true);
//       if (type.name === 'Multiple choice') setShowMultipleChoiceModal(true);
//     }}
//     questions={questions}
//   />
// )}

//       {/*  for True/False workflow */}
//   {showTrueFalseModal && (
//   <CreateTrueFalseQuestion
//     onClose={() => setShowTrueFalseModal(false)}
//     onSave={(questionData) => {
//       setShowTrueFalseModal(false);
//       const safeQuestion = {
//         ...questionData,
//         title: questionData.title || 'Untitled',
//         questionText: questionData.questionText || '',
//         defaultMark: questionData.defaultMark ?? 1,
//         generalFeedback: questionData.generalFeedback || '',
//         correctAnswer: questionData.correctAnswer || 'true',
//         penalty: questionData.penalty ?? 0,
//         feedbackTrue: questionData.feedbackTrue || '',
//         feedbackFalse: questionData.feedbackFalse || '',
//         status: 'draft'
//       };
//       setQuestions(prev => [
//         {
//           id: prev.length > 0 ? Math.max(...prev.map(q => q.id)) + 1 : 1,
//           questionType: "truefalse",
//           version: "v1",
//           createdBy: {
//             name: username || "Unknown User",
//             role: "",
//             date: new Date().toLocaleString()
//           },
//           modifiedBy: {
//             name: username || "Unknown User",
//             role: "",
//             date: new Date().toLocaleString()
//           },
//           comments: 0,
//           usage: 0,
//           lastUsed: "Never",
//           history: [
//             {
//               version: "v1",
//               date: new Date().toLocaleDateString(),
//               author: username || "Unknown User",
//               changes: "Created True/False question"
//             }
//           ],
//           status: "draft",
//           ...safeQuestion
//         },
//         ...prev 
//       ]);
//     }}
//   />
// )}
// {showMultipleChoiceModal && (
//   <CreateMultipleChoiceQuestion
//     onClose={() => setShowMultipleChoiceModal(false)}
  
//            onSave={(questionData) => {
//         setShowMultipleChoiceModal(false);
//         const choices = Array.isArray(questionData.choices) ? questionData.choices : [];
//         const options = choices.map(a => a.text);
//         const correctAnswers = choices
//           .filter(a => a.grade === 100)
//           .map(a => a.text);
      
//         const safeQuestion = {
//           ...questionData,
//           title: questionData.title || 'Untitled',
//           questionText: questionData.questionText || '',
//           defaultMark: questionData.defaultMark ?? 1,
//           generalFeedback: questionData.generalFeedback || '',
//           options,
//           correctAnswers,
//           status: 'draft'
//         };
//         setQuestions(prev => [
//           {
//             id: prev.length > 0 ? Math.max(...prev.map(q => q.id)) + 1 : 1,
//             questionType: "multiple",
//             version: "v1",
//             createdBy: {
//               name: username || "Unknown User",
//               role: "",
//               date: new Date().toLocaleString()
//             },
//             modifiedBy: {
//               name: username || "Unknown User",
//               role: "",
//               date: new Date().toLocaleString()
//             },
//             comments: 0,
//             usage: 0,
//             lastUsed: "Never",
//             history: [
//               {
//                 version: "v1",
//                 date: new Date().toLocaleDateString(),
//                 author: username || "Unknown User",
//                 changes: "Created Multiple Choice question"
//               }
//             ],
//             status: "draft",
//             ...safeQuestion
//           },
//           ...prev // Add new question at the top
//         ]);
//       }}
//   />
// )}
//     </div>
//   );
// };

// export default QuestionBank;