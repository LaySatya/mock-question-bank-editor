// constants/questionTypes.js
// FIXED: Correct paths (go up 3 levels from pages/QuestionBank/constants/)
import CreateTrueFalseQuestion from '../../../components/questions/CreateTrueFalseQuestion';
import CreateMultipleChoiceQuestion from '../../../components/questions/CreateMultipleChoiceQuestion';

export const EDIT_COMPONENTS = {
  truefalse: CreateTrueFalseQuestion,
  multichoice: CreateMultipleChoiceQuestion,
  // Add more types as needed
};

export const BULK_EDIT_COMPONENTS = {
  truefalse: CreateTrueFalseQuestion,
  multichoice: CreateMultipleChoiceQuestion, 
  // Add more types as needed
};