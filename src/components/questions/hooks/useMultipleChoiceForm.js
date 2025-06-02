// components/questions/hooks/useMultipleChoiceForm.js
import { useState, useCallback } from 'react';
import { DEFAULT_CHOICES } from '../constants/questionConstants';

export const useMultipleChoiceForm = (initialQuestion = {}) => {
  const [formData, setFormData] = useState({
    title: initialQuestion.title || '',
    questionText: initialQuestion.questionText || '',
    defaultMark: initialQuestion.defaultMark ?? 1,
    penaltyFactor: initialQuestion.penaltyFactor ?? 0.1,
    generalFeedback: initialQuestion.generalFeedback || '',
    multipleAnswers: initialQuestion.multipleAnswers ?? false,
    shuffleAnswers: initialQuestion.shuffleAnswers ?? true,
    showInstructions: initialQuestion.showInstructions ?? true,
    choices: initialQuestion.choices && initialQuestion.choices.length > 0 ? initialQuestion.choices : DEFAULT_CHOICES,
    tags: initialQuestion.tags || []
  });

  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateChoice = useCallback((index, field, value) => {
    setFormData(prev => {
      const newChoices = [...prev.choices];
      newChoices[index][field] = value;
      return { ...prev, choices: newChoices };
    });
  }, []);

  const addChoice = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      choices: [...prev.choices, { text: '', grade: 0, feedback: '' }]
    }));
  }, []);

  const removeChoice = useCallback((index) => {
    setFormData(prev => {
      if (prev.choices.length <= 2) return prev;
      return {
        ...prev,
        choices: prev.choices.filter((_, i) => i !== index)
      };
    });
  }, []);

  const handleTagToggle = useCallback((tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Question name is required';
    if (!formData.questionText.trim()) newErrors.questionText = 'Question text is required';
    if (!formData.tags || formData.tags.length === 0) newErrors.tags = 'At least one tag is required';

    // Per-choice validation
    const choiceErrors = formData.choices.map((choice, idx) => {
      if (!choice.text.trim()) return 'Choice text is required';
      return null;
    });
    if (choiceErrors.some(Boolean)) newErrors.choices = choiceErrors;

    if (!formData.choices.some(choice => choice.grade > 0)) {
      newErrors.grade = 'At least one choice must have a positive grade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback((question = {}) => {
    setFormData({
      title: question.title || '',
      questionText: question.questionText || '',
      defaultMark: question.defaultMark ?? 1,
      penaltyFactor: question.penaltyFactor ?? 0.1,
      generalFeedback: question.generalFeedback || '',
      multipleAnswers: question.multipleAnswers ?? false,
      shuffleAnswers: question.shuffleAnswers ?? true,
      showInstructions: question.showInstructions ?? true,
      choices: question.choices && question.choices.length > 0 ? question.choices : DEFAULT_CHOICES,
      tags: question.tags || []
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    updateChoice,
    addChoice,
    removeChoice,
    handleTagToggle,
    validate,
    resetForm
  };
};
