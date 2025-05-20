import React, { useState } from 'react';
import { X } from 'lucide-react';

const questionTypes = [
 { 
    icon: <img src="/src/assets/icon/Multiple-choice.svg" className="w-6 h-6" alt="icon" />,
    name: 'Multiple choice', 
    description: 'Select one or multiple correct answers from a list of options.'
  },
  { 
    icon: <img src="/src/assets/icon/True-False.svg" className="w-6 h-6" alt="icon" />,
    name: 'True/False', 
    description: 'Choose between true or false as the answer.'
  },
  { 
    icon: <img src="/src/assets/icon/Matching.svg" className="w-6 h-6" alt="icon" />,
    name: 'Matching', 
    description: 'Match items from one column to another.'
  },
  { 
    icon: <img src="/src/assets/icon/Short-answer.svg" className="w-6 h-6" alt="icon" />,
    name: 'Short answer', 
    description: 'Provide a brief written response.'
  },
  { 
    icon: <img src="/src/assets/icon/Numerical.svg" className="w-6 h-6" alt="icon" />,
    name: 'Numerical', 
    description: 'Answer with a numeric value.'
  },
  { 
   icon: <img src="/src/assets/icon/Essay.svg" className="w-6 h-6" alt="icon" />, 
    name: 'Essay', 
    description: 'Write a comprehensive written response.'
  },
  { 
    icon: <img src="/src/assets/icon/Calculated.svg" className="w-6 h-6" alt="icon" />,
    name: 'Calculated', 
    description: 'Solve mathematical problems with generated values.'
  },
  { 
    icon: <img src="/src/assets/icon/Calculated-multichoice.svg" className="w-6 h-6" alt="icon" />, 
    name: 'Calculated multichoice', 
    description: 'Multiple choice with calculated values.'
  },
  { 
   icon: <img src="/src/assets/icon/Calculated simple.svg" className="w-6 h-6" alt="icon" />,
    name: 'Calculated simple', 
    description: 'Simple calculated questions.'
  },
  { 
    icon: <img src="/src/assets/icon/Drag and drop into text.svg" className="w-6 h-6" alt="icon" />,
    name: 'Drag and drop into text', 
    description: 'Place items into specific locations in text.'
  },
  { 
    icon: <img src="/src/assets/icon/Drag and drop markers.svg" className="w-6 h-6" alt="icon" />,
    name: 'Drag and drop markers', 
    description: 'Position markers on an image or diagram.'
  },
  { 
    icon: <img src="/src/assets/icon/Drag and drop onto image.svg" className="w-6 h-6" alt="icon" />,
    name: 'Drag and drop onto image', 
    description: 'Place items on a specific image.'
  },
  { 
   icon: <img src="/src/assets/icon/Embedded answers (Cloze).svg" className="w-6 h-6" alt="icon" />,
    name: 'Embedded answers (Cloze)', 
    description: 'Insert answers directly into text.'
  },
  { 
    icon: <img src="/src/assets/icon/Random short-answer matching.svg" className="w-6 h-6" alt="icon" />,
    name: 'Random short-answer matching', 
    description: 'Randomly match short answers.'
  },
  { 
    icon: <img src="/src/assets/icon/Select-missing words.svg" className="w-6 h-6" alt="icon" />,
    name: 'Select missing words', 
    description: 'Choose the correct words to complete a text.'
  },

];

const CreateQuestionModal = ({ onClose, onSelectType, questions }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter question types based on search
  const filteredQuestionTypes = questionTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-25">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-5xl h-[90vh] flex">
        {/* Left Panel - Question Types */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">QUESTIONS</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="p-2 border-b">
            <input 
              type="text" 
              placeholder="Search question types" 
              className="w-full px-2 py-1 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Question Types List */}
          <div className="flex-grow overflow-y-auto">
            <div className="p-2">
              {filteredQuestionTypes.map((type, index) => (
                <label 
                  key={index} 
                  className={`w-full flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer
                    ${selectedType === type ? 'bg-blue-100' : ''}`}
                >
                  <input 
                    type="radio" 
                    name="questionType" 
                    className="mr-3"
                    checked={selectedType === type}
                    onChange={() => setSelectedType(type)}
                  />
                  <span className="mr-3 text-xl">{type.icon}</span>
                  <span>{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Existing Questions Section */}
          <div className="p-2 border-t">
            <h3 className="text-md font-semibold mb-2">OTHER</h3>
            <div className="max-h-40 overflow-y-auto text-sm">
              <div className="py-1 px-2 hover:bg-gray-200 rounded">
                Description
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Description */}
        <div className="w-2/3 p-6 flex flex-col">
          <h2 className="text-xl mb-4">Select a question type to see its description.</h2>
          
          {selectedType ? (
            <div className="flex-grow flex flex-col">
              <div className="text-6xl mb-4 text-center">{selectedType.icon}</div>
              <h3 className="text-xl font-semibold text-center mb-4">{selectedType.name}</h3>
              <p className="text-gray-600 mb-6 text-center flex-grow">{selectedType.description}</p>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => onSelectType(selectedType)}
                  disabled={!selectedType}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 flex-grow flex items-center justify-center">
              Select a question type to see its description.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuestionModal;