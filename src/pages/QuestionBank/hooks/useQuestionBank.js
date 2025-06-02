// hooks/useQuestionBank.js
import { useState, useEffect } from 'react';
import { XMLParser } from 'fast-xml-parser';

export const useQuestionBank = (initialQuestions = []) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || "Unknown User");

  useEffect(() => {
    const handleStorage = () => {
      setUsername(localStorage.getItem('username') || "Unknown User");
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const mapQuestionType = (xmlType) => {
    switch (xmlType) {
      case "multichoice": return "multiple";
      case "essay": return "essay";
      case "matching": return "matching";
      case "shortanswer": return "shortanswer";
      case "truefalse": return "truefalse";
      default: return "multiple";
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xmlContent = e.target.result;
          importQuestionFromXML(xmlContent);
          alert("XML import successful!");
        } catch (error) {
          alert("Error importing XML: " + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const importQuestionFromXML = (xmlString) => {
    try {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
      });
      
      const result = parser.parse(xmlString);
      
      if (!result || !result.quiz || !result.quiz.question) {
        throw new Error("Invalid XML structure - missing quiz or question elements");
      }

      const xmlQuestions = Array.isArray(result.quiz.question)
        ? result.quiz.question
        : [result.quiz.question];

      setQuestions(prevQuestions => {
        const maxId = prevQuestions.length > 0 ? Math.max(...prevQuestions.map(q => q.id)) : 0;
        const newQuestions = xmlQuestions.map((q, index) => {
          const questionName = q.name?.text || `Imported Question ${index + 1}`;
          const questionText = q.questiontext?.text || "No question text provided";
          const questionType = q['@_type'] || "multiple";
          
          let options = [];
          let correctAnswers = [];
          
          if (q.answer) {
            const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
            
            options = answers.map(a => {
              const text = a.text || "No answer text";
              const isCorrect = a['@_fraction'] === "100";
              
              if (isCorrect) {
                correctAnswers.push(text);
              }
              
              return text;
            });
          }

          return {
            id: maxId + index + 1,
            title: questionName,
            status: "draft",
            version: "v1",
            createdBy: {
              name: "Imported",
              role: "",
              date: new Date().toLocaleString()
            },
            comments: 0,
            usage: 0,
            lastUsed: "Never",
            modifiedBy: {
              name: "Imported",
              role: "",
              date: new Date().toLocaleString()
            },
            questionType: mapQuestionType(questionType),
            questionText: questionText,
            options: options,
            correctAnswers: correctAnswers,
            history: [{
              version: "v1",
              date: new Date().toLocaleDateString(),
              author: "Imported",
              changes: "Imported from XML"
            }]
          };
        })
        .filter(newQ =>
          !prevQuestions.some(
            q => q.title === newQ.title && q.questionText === newQ.questionText
          )
        );
        
        return [...newQuestions, ...prevQuestions];
      });
    } catch (error) {
      console.error("XML Import Error:", error);
      throw new Error(`Error importing XML: ${error.message}`);
    }
  };

  const duplicateQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: Math.max(...questions.map(q => q.id)) + 1,
      title: `Copy of: ${question.title}`,
      version: 'v1',
      status: 'draft',
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
      history: [{
        version: "v1",
        date: new Date().toLocaleDateString(),
        author: username,
        changes: "Duplicated from original question"
      }],
      comments: 0,
      usage: 0,
      lastUsed: "Never"
    };
    
    setQuestions(prev => [...prev, newQuestion]);
  };

  const deleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const changeStatus = (questionId, newStatus) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              status: newStatus,
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
                  changes: `Changed status to ${newStatus}`
                }
              ]
            }
          : q
      )
    );
  };

  return {
    questions,
    setQuestions,
    selectedQuestions,
    setSelectedQuestions,
    username,
    handleFileUpload,
    duplicateQuestion,
    deleteQuestion,
    changeStatus
  };
};