// ============================================================================
// components/questions/constants/questionConstants.js
// ============================================================================

export const DEFAULT_CHOICES = [
  
  { text: '', grade: 'None', feedback: '' },
  { text: '', grade: 'None', feedback: '' },
  { text: '', grade: 'None', feedback: '' },
  { text: '', grade: 'None', feedback: '' },
  { text: '', grade: 'None', feedback: '' }
];

export const GRADE_OPTIONS = [
  { value: 'None', label: 'None' },
  { value: '100%', label: '100%' },
  { value: '90%', label: '90%' },
  { value: '83.33333%', label: '83.33333%' },
  { value: '80%', label: '80%' },
  { value: '75%', label: '75%' },
  { value: '70%', label: '70%' },
  { value: '66.66667%', label: '66.66667%' },
  { value: '60%', label: '60%' },
  { value: '50%', label: '50%' },
  { value: '40%', label: '40%' },
  { value: '33.33333%', label: '33.33333%' },
  { value: '30%', label: '30%' },
  { value: '25%', label: '25%' },
  { value: '20%', label: '20%' },
  { value: '16.66667%', label: '16.66667%' },
  { value: '14.28571%', label: '14.28571%' },
  { value: '12.5%', label: '12.5%' },
  { value: '11.11111%', label: '11.11111%' },
  { value: '10%', label: '10%' },
  { value: '5%', label: '5%' },
  { value: '-5%', label: '-5%' },
  { value: '-10%', label: '-10%' },
  { value: '-11.11111%', label: '-11.11111%' },
  { value: '-12.5%', label: '-12.5%' },
  { value: '-14.28571%', label: '-14.28571%' },
  { value: '-16.66667%', label: '-16.66667%' },
  { value: '-20%', label: '-20%' },
  { value: '-25%', label: '-25%' },
  { value: '-30%', label: '-30%' },
  { value: '-33.33333%', label: '-33.33333%' },
  { value: '-40%', label: '-40%' },
  { value: '-50%', label: '-50%' },
  { value: '-60%', label: '-60%' },
  { value: '-66.66667%', label: '-66.66667%' },
  { value: '-70%', label: '-70%' },
  { value: '-75%', label: '-75%' },
  { value: '-80%', label: '-80%' },
  { value: '-83.33333%', label: '-83.33333%' },
  { value: '-90%', label: '-90%' },
  { value: '-100%', label: '-100%' }
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

// True/False Question Constants
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
