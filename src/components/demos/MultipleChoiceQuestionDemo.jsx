// import React, { useState } from 'react';
// import { X, Save, Plus, Trash2 } from 'lucide-react';

// const MultipleChoiceQuestionDemo = ({ question = {}, onClose, onSave }) => {
//   const [title, setTitle] = useState(question.title || '');
//   const [questionText, setQuestionText] = useState(question.questionText || '');
//   const [defaultMark, setDefaultMark] = useState(question.defaultMark ?? 1);
//   const [choices, setChoices] = useState(
//     question.choices || [
//       { text: '', grade: 100, feedback: '' },
//       { text: '', grade: 0, feedback: '' }
//     ]
//   );

//   // Add a new choice after the given index
//   const addChoice = (index) => {
//     const newChoices = [...choices];
//     newChoices.splice(index + 1, 0, { text: '', grade: 0, feedback: '' });
//     setChoices(newChoices);
//   };

//   // Remove a choice
//   const removeChoice = (index) => {
//     if (choices.length > 2) {
//       setChoices(choices.filter((_, i) => i !== index));
//     }
//   };

//   // Update a choice field
//   const updateChoice = (index, field, value) => {
//     const newChoices = [...choices];
//     newChoices[index][field] = value;
//     setChoices(newChoices);
//   };

//   return (
//     <div className="max-w-3xl mx-auto border border-gray-300 rounded-lg shadow-lg w-full bg-white">
//       {/* Header */}
//       <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//         <h2 className="text-xl font-semibold">Multiple Choice Question</h2>
//         <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
//           <X size={24} />
//         </button>
//       </div>
//       {/* Content */}
//       <div className="p-6 max-h-[500px] overflow-y-auto">
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Question name*</label>
//             <input
//               type="text"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Question text*</label>
//             <textarea
//               className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[120px]"
//               value={questionText}
//               onChange={e => setQuestionText(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Default mark</label>
//             <input
//               type="number"
//               value={defaultMark}
//               min="0"
//               step="0.1"
//               onChange={e => setDefaultMark(Number(e.target.value))}
//               className="w-24 px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-700 mb-3">Answer Choices</h3>
//             <div className="space-y-4">
//               {choices.map((choice, index) => (
//                 <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//                   <div className="flex justify-between items-start mb-3">
//                     <h4 className="font-medium text-gray-700">Choice {index + 1}</h4>
//                     <div className="flex gap-2">
//                       {choices.length > 2 && (
//                         <button
//                           onClick={() => removeChoice(index)}
//                           className="text-red-500 hover:text-red-700 p-1"
//                           type="button"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => addChoice(index)}
//                         className="flex items-center px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//                         type="button"
//                       >
//                         <Plus size={14} className="mr-1" />
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Answer text
//                     </label>
//                     <textarea
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[60px]"
//                       value={choice.text}
//                       onChange={e => updateChoice(index, 'text', e.target.value)}
//                       placeholder={`Enter choice ${index + 1} text...`}
//                     />
//                   </div>
//                   <div className="mt-2">
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Grade (%)
//                     </label>
//                     <input
//                       type="number"
//                       value={choice.grade}
//                       onChange={e => updateChoice(index, 'grade', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                       min="-100"
//                       max="100"
//                       step="0.1"
//                     />
//                   </div>
//                   <div className="mt-2">
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Feedback for this choice
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                       value={choice.feedback}
//                       onChange={e => updateChoice(index, 'feedback', e.target.value)}
//                       placeholder="Optional feedback for this choice..."
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Footer */}
//       <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
//         <button
//           className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//           onClick={onClose}
//         >
//           Cancel
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
//           onClick={() => {
//             if (typeof onSave === 'function')
//               onSave({
//                 ...question,
//                 title,
//                 questionText,
//                 defaultMark,
//                 choices
//               });
//             onClose();
//           }}
//         >
//           <Save size={16} className="mr-2" />
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MultipleChoiceQuestionDemo;