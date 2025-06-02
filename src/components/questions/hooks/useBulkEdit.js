// components/questions/hooks/useBulkEdit.js
import { useState, useCallback } from 'react';
import { DEFAULT_CHOICES } from '../constants/questionConstants';

export const useBulkEdit = (questionsToEdit, isBulk) => {
  const [bulkQuestions, setBulkQuestions] = useState(
    isBulk
      ? questionsToEdit.map(q => ({
          ...q,
          title: q.title || '',
          questionText: q.questionText || '',
          defaultMark: q.defaultMark ?? 1,
          penaltyFactor: q.penaltyFactor ?? 0.1,
          generalFeedback: q.generalFeedback || '',
          multipleAnswers: q.multipleAnswers ?? false,
          shuffleAnswers: q.shuffleAnswers ?? true,
          showInstructions: q.showInstructions ?? true,
          choices: q.choices && q.choices.length > 0 ? q.choices : DEFAULT_CHOICES,
          tags: q.tags || []
        }))
      : []
  );

  const [bulkTagDropdowns, setBulkTagDropdowns] = useState({});

  const handleBulkChange = useCallback((idx, field, value) => {
    setBulkQuestions(prev =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  }, []);

  const handleBulkChoiceChange = useCallback((qIdx, cIdx, field, value) => {
    setBulkQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const newChoices = [...q.choices];
        newChoices[cIdx][field] = value;
        return { ...q, choices: newChoices };
      })
    );
  }, []);

  const handleBulkTagToggle = useCallback((idx, tag) => {
    setBulkQuestions(prev =>
      prev.map((q, i) =>
        i === idx
          ? {
              ...q,
              tags: q.tags && q.tags.includes(tag)
                ? q.tags.filter(t => t !== tag)
                : [...(q.tags || []), tag]
            }
          : q
      )
    );
  }, []);

  const toggleBulkTagDropdown = useCallback((idx) => {
    setBulkTagDropdowns(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  }, []);

  const handleBulkAddChoice = useCallback((qIdx) => {
    setBulkQuestions(prev =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, choices: [...q.choices, { text: '', grade: 0, feedback: '' }] }
          : q
      )
    );
  }, []);

  const handleBulkRemoveChoice = useCallback((qIdx, cIdx) => {
    setBulkQuestions(prev =>
      prev.map((q, i) =>
        i === qIdx && q.choices.length > 2
          ? { ...q, choices: q.choices.filter((_, idx) => idx !== cIdx) }
          : q
      )
    );
  }, []);

  return {
    bulkQuestions,
    bulkTagDropdowns,
    handleBulkChange,
    handleBulkChoiceChange,
    handleBulkTagToggle,
    toggleBulkTagDropdown,
    handleBulkAddChoice,
    handleBulkRemoveChoice
  };
};