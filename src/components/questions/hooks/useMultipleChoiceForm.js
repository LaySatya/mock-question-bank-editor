// ============================================================================
// components/questions/hooks/useMultipleChoiceForm.js - FIXED
// ============================================================================

import { useState, useCallback } from 'react';
import { DEFAULT_CHOICES } from '../constants/questionConstants';

// Helper function to create deep copy of choices
const createFreshChoices = (choices) => {
  if (!choices || choices.length === 0) {
    return DEFAULT_CHOICES.map((choice, index) => ({
      id: `fresh-choice-${Date.now()}-${index}`,
      text: '',
      grade: 'None',
      feedback: ''
    }));
  }
  
  return choices.map((choice, index) => ({
    id: choice.id || `choice-${Date.now()}-${index}`,
    text: choice.text || '',
    grade: choice.grade || 'None',
    feedback: choice.feedback || ''
  }));
};

export const useMultipleChoiceForm = (initialQuestion = {}) => {
  const [formData, setFormData] = useState(() => ({
    title: initialQuestion.title || '',
    questionText: initialQuestion.questionText || '',
    qtype: initialQuestion.qtype || 'multichoice', 
    questionStatus: initialQuestion.questionStatus || 'Ready',
    defaultMark: initialQuestion.defaultMark ?? 100,
    idNumber: initialQuestion.idNumber || '',
    generalFeedback: initialQuestion.generalFeedback || '',
    multipleAnswers: initialQuestion.multipleAnswers ?? false,
    shuffleAnswers: initialQuestion.shuffleAnswers ?? true,
    numberChoices: initialQuestion.numberChoices || '1, 2, 3, ...',
    showInstructions: initialQuestion.showInstructions ?? false,
    choices: createFreshChoices(initialQuestion.choices),
    tags: initialQuestion.tags ? [...initialQuestion.tags] : [],
    combinedFeedback: initialQuestion.combinedFeedback ? {
      correct: initialQuestion.combinedFeedback.correct || 'Your answer is correct.',
      partiallyCorrect: initialQuestion.combinedFeedback.partiallyCorrect || 'Your answer is partially correct.',
      incorrect: initialQuestion.combinedFeedback.incorrect || 'Your answer is incorrect.',
      showNumberCorrect: initialQuestion.combinedFeedback.showNumberCorrect ?? false
    } : {
      correct: 'Your answer is correct.',
      partiallyCorrect: 'Your answer is partially correct.',
      incorrect: 'Your answer is incorrect.',
      showNumberCorrect: false
    },
    penaltyFactor: initialQuestion.penaltyFactor ?? 0,
    hint1: initialQuestion.hint1 || '',
    hint1ClearIncorrect: initialQuestion.hint1ClearIncorrect ?? false,
    hint1ShowNumCorrect: initialQuestion.hint1ShowNumCorrect ?? false,
    hint2: initialQuestion.hint2 || '',
    hint2ClearIncorrect: initialQuestion.hint2ClearIncorrect ?? false,
    hint2ShowNumCorrect: initialQuestion.hint2ShowNumCorrect ?? false
  }));

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
      const newChoices = prev.choices.map((choice, i) => 
        i === index 
          ? { ...choice, [field]: value }
          : choice
      );
      return { ...prev, choices: newChoices };
    });
  }, []);

  const addChoice = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      choices: [
        ...prev.choices,
        {
          id: Date.now(),
          text: '',
          answer: '', // <-- make sure this is present!
          grade: 'None',
          feedback: ''
        }
      ]
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
    if (formData.defaultMark <= 0) newErrors.defaultMark = 'Default mark must be greater than 0';

    // Per-choice validation
    const choiceErrors = formData.choices.map((choice, idx) => {
      if (!choice.text.trim()) return 'Choice text is required';
      return null;
    });
    if (choiceErrors.some(Boolean)) newErrors.choices = choiceErrors;

    // Check if at least one choice has a positive grade
    const hasPositiveGrade = formData.choices.some(choice => {
      const grade = choice.grade;
      return grade !== 'None' && parseFloat(grade) > 0;
    });
    if (!hasPositiveGrade) {
      newErrors.grade = 'At least one choice must have a positive grade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback((question = {}) => {
    console.log('Resetting form with question:', question);
    
    setFormData({
      title: question.title || '',
      questionText: question.questionText || '',
      questionStatus: question.questionStatus || 'Ready',
      defaultMark: question.defaultMark ?? 100,
      idNumber: question.idNumber || '',
      generalFeedback: question.generalFeedback || '',
      multipleAnswers: question.multipleAnswers ?? false,
      shuffleAnswers: question.shuffleAnswers ?? true,
      numberChoices: question.numberChoices || '1, 2, 3, ...',
      showInstructions: question.showInstructions ?? false,
      choices: createFreshChoices(question.choices),
      tags: question.tags ? [...question.tags] : [],
      combinedFeedback: question.combinedFeedback ? {
        correct: question.combinedFeedback.correct || 'Your answer is correct.',
        partiallyCorrect: question.combinedFeedback.partiallyCorrect || 'Your answer is partially correct.',
        incorrect: question.combinedFeedback.incorrect || 'Your answer is incorrect.',
        showNumberCorrect: question.combinedFeedback.showNumberCorrect ?? false
      } : {
        correct: 'Your answer is correct.',
        partiallyCorrect: 'Your answer is partially correct.',
        incorrect: 'Your answer is incorrect.',
        showNumberCorrect: false
      },
      penaltyFactor: question.penaltyFactor ?? 0,
      hint1: question.hint1 || '',
      hint1ClearIncorrect: question.hint1ClearIncorrect ?? false,
      hint1ShowNumCorrect: question.hint1ShowNumCorrect ?? false,
      hint2: question.hint2 || '',
      hint2ClearIncorrect: question.hint2ClearIncorrected ?? false,
      hint2ShowNumCorrect: question.hint2ShowNumCorrect ?? false
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