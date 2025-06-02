// components/questions/constants/questionConstants.js

export const DEFAULT_CHOICES = [
  { text: '', grade: 100, feedback: '' },
  { text: '', grade: 0, feedback: '' },
  { text: '', grade: 0, feedback: '' },
  { text: '', grade: 0, feedback: '' }
];

export const AVAILABLE_TAGS = [
  // Difficulty
  'easy', 'medium', 'hard',
  // Core IT Subjects
  'programming', 'algorithms', 'data structures', 'databases', 'networking', 'operating systems',
  'web development', 'software engineering', 'security', 'ai', 'machine learning',
  // Languages/Technologies
  'python', 'java', 'c++', 'javascript', 'html', 'css', 'sql',
  // Assessment context
  'quiz', 'exam', 'assignment', 'practice', 'lab', 'project',
  // Status
  'draft', 'review', 'approved', 'archived'
];

export const DEFAULT_TRUE_FALSE_QUESTION = {
  title: '',
  questionText: '',
  defaultMark: 1,
  generalFeedback: '',
  correctAnswer: 'true',
  penalty: 0,
  showInstructions: false,
  feedbackTrue: '',
  feedbackFalse: '',
  status: 'draft',
  tags: []
};