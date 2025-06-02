// components/questions/hooks/useTrueFalseForm.js
import { useState, useCallback } from 'react';
import { DEFAULT_TRUE_FALSE_QUESTION } from '../constants/questionConstants';

export const useTrueFalseForm = (initialQuestion = null) => {
  const [question, setQuestion] = useState({
    ...DEFAULT_TRUE_FALSE_QUESTION,
    ...initialQuestion
  });

  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setQuestion(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleTagToggle = useCallback((tag) => {
    setQuestion(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!question.title.trim()) newErrors.title = "Question name is required";
    if (!question.questionText.trim()) newErrors.questionText = "Question text is required";
    if (question.defaultMark <= 0) newErrors.defaultMark = "Default mark must be greater than 0";
    if (question.tags.length === 0) newErrors.tags = "At least one tag is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [question]);

  const resetForm = useCallback((newQuestion = null) => {
    setQuestion({
      ...DEFAULT_TRUE_FALSE_QUESTION,
      ...newQuestion
    });
    setErrors({});
  }, []);

  return {
    question,
    errors,
    updateField,
    handleTagToggle,
    validate,
    resetForm
  };
};