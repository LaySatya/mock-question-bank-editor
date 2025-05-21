// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';
// import CreateTrueFalseQuestion from './CreateTrueFalseQuestion';

// // This component handles the question creation workflow
// // It integrates with your existing QuestionBank component
// const TrueFalseQuestionWorkflow = ({ onClose, onSaveQuestion, existingQuestion = null }) => {
//   const [question, setQuestion] = useState(null);
//   const [step, setStep] = useState('create'); // 'create', 'preview', 'confirmation'

//   // Initialize from existing question if editing
//   useEffect(() => {
//     if (existingQuestion) {
//       setQuestion(existingQuestion);
//     }
//   }, [existingQuestion]);

//   // Handle save from the question editor
//   const handleSaveQuestion = (questionData) => {
//     setQuestion(questionData);
//     setStep('preview');
//   };

//   // Handle final save to question bank
//   const handleFinalSave = () => {
//     // Format the question object for the question bank
//     const formattedQuestion = {
//       ...question,
//       id: existingQuestion ? existingQuestion.id : Date.now(), // Use existing ID or generate a new one
//       questionType: 'truefalse',
//       options: ['True', 'False'],
//       correctAnswers: [question.correctAnswer === 'true' ? 'True' : 'False'],
//       lastUsed: existingQuestion?.lastUsed || 'Never',
//       usage: existingQuestion?.usage || 0,
//       comments: existingQuestion?.comments || 0,
//     };
    
//     onSaveQuestion(formattedQuestion);
//     setStep('confirmation');
//   };

//   // Generate XML for this question type (for export functionality)
//   const generateQuestionXML = () => {
//     return `
// <question type="truefalse">
//   <name>
//     <text>${escapeXML(question.title)}</text>
//   </name>
//   <questiontext format="html">
//     <text>${escapeXML(question.questionText)}</text>
//   </questiontext>
//   <generalfeedback format="html">
//     <text>${escapeXML(question.generalFeedback)}</text>
//   </generalfeedback>
//   <defaultgrade>${question.defaultMark}</defaultgrade>
//   <penalty>${question.penalty}</penalty>
//   <hidden>0</hidden>
//   <idnumber></idnumber>
//   <correctanswer>${question.correctAnswer === 'true' ? '1' : '0'}</correctanswer>
//   <feedbacktrue format="html">
//     <text>${escapeXML(question.feedbackTrue)}</text>
//   </feedbacktrue>
//   <feedbackfalse format="html">
//     <text>${escapeXML(question.feedbackFalse)}</text>
//   </feedbackfalse>
// </question>
//     `.trim();
//   };

//   // Helper function to escape XML special characters
//   const escapeXML = (str) => {
//     if (!str) return '';
//     return str
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&apos;');
//   };

//   // Render preview screen
//   const renderPreview = () => {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
//         <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-3xl h-[90vh] flex flex-col">
//           {/* Header */}
//           <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//             <h2 className="text-xl font-semibold">Question Preview</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               <X size={24} />
//             </button>
//           </div>
          
//           {/* Content */}
//           <div className="flex-grow overflow-y-auto p-6">
//             <div className="border rounded-md p-5 bg-gray-50 mb-6">
//               <div className="mb-6">
//                 <h3 className="font-bold mb-2 text-lg">{question.questionText}</h3>
//               </div>
              
//               <div className="mb-6">
//                 <div className="flex flex-col space-y-3">
//                   <label className="inline-flex items-center">
//                     <input 
//                       type="radio" 
//                       name="preview-answer" 
//                       className="h-4 w-4 text-blue-600" 
//                       checked={question.correctAnswer === 'true'} 
//                       readOnly 
//                     />
//                     <span className="ml-2">True</span>
//                     {question.correctAnswer === 'true' && (
//                       <span className="ml-2 text-green-600 text-sm">(Correct)</span>
//                     )}
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input 
//                       type="radio" 
//                       name="preview-answer" 
//                       className="h-4 w-4 text-blue-600" 
//                       checked={question.correctAnswer === 'false'} 
//                       readOnly 
//                     />
//                     <span className="ml-2">False</span>
//                     {question.correctAnswer === 'false' && (
//                       <span className="ml-2 text-green-600 text-sm">(Correct)</span>
//                     )}
//                   </label>
//                 </div>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <h3 className="font-medium mb-2">Question Details</h3>
//                 <div className="space-y-2 text-sm">
//                   <p><strong>Title:</strong> {question.title}</p>
//                   <p><strong>Type:</strong> True/False</p>
//                   <p><strong>Default Mark:</strong> {question.defaultMark}</p>
//                   <p><strong>Status:</strong> {question.status}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="font-medium mb-2">Feedback</h3>
//                 <div className="space-y-2 text-sm">
//                   <div>
//                     <p><strong>General Feedback:</strong></p>
//                     <p className="text-gray-600">{question.generalFeedback || 'None provided'}</p>
//                   </div>
//                   <div>
//                     <p><strong>For "True" response:</strong></p>
//                     <p className="text-gray-600">{question.feedbackTrue || 'None provided'}</p>
//                   </div>
//                   <div>
//                     <p><strong>For "False" response:</strong></p>
//                     <p className="text-gray-600">{question.feedbackFalse || 'None provided'}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* XML Preview (Collapsible) */}
//             <div className="mt-6 border rounded-md overflow-hidden">
//               <button 
//                 className="w-full p-3 bg-gray-100 text-left font-medium border-b"
//                 onClick={() => document.getElementById('xml-preview').classList.toggle('hidden')}
//               >
//                 XML Export Preview
//               </button>
//               <div id="xml-preview" className="hidden">
//                 <pre className="p-4 text-xs bg-gray-50 overflow-x-auto">
//                   {generateQuestionXML()}
//                 </pre>
//               </div>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
//             <button
//               onClick={() => setStep('create')}
//               className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               Back to Edit
//             </button>
//             <button
//               onClick={handleFinalSave}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               Save to Question Bank
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render confirmation screen
//   const renderConfirmation = () => {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
//         <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//               <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
//               Question Saved Successfully
//             </h3>
//             <div className="mt-2">
//               <p className="text-sm text-gray-500">
//                 {existingQuestion ? 
//                   'Your question has been updated and is now available in the question bank.' :
//                   'Your new True/False question has been added to the question bank.'}
//               </p>
//             </div>
//             <div className="mt-5">
//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 onClick={onClose}
//               >
//                 Return to Question Bank
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render the appropriate step
//   switch (step) {
//     case 'create':
//       return (
//         <CreateTrueFalseQuestion
//           onClose={onClose}
//           onSave={handleSaveQuestion}
//           existingQuestion={existingQuestion}
//         />
//       );
//     case 'preview':
//       return renderPreview();
//     case 'confirmation':
//       return renderConfirmation();
//     default:
//       return null;
//   }
// };

// export default TrueFalseQuestionWorkflow;