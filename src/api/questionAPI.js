// ============================================================================
//  src/api/questionAPI.js - Enhanced API Service with Fixed User Handling
// ============================================================================
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper: Auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication required');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

// Helper: Handle API responses
const handleAPIResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usernameoremail');
      alert('Your session has expired. Please log in again.');
      window.location.href = '/login';
      throw new Error('Authentication expired - redirecting to login');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Helper: Map API qtype to internal type
const mapQuestionTypeFromAPI = (apiType) => {
  const typeMapping = {
    'multichoice': 'multichoice',
    'truefalse': 'truefalse',
    'essay': 'essay',
    'shortanswer': 'shortanswer',
    'matching': 'matching',
    'match': 'matching',
    'numerical': 'numerical',
    'calculated': 'calculated',
    'calculatedmulti': 'calculatedmulti',
    'calculatedsimple': 'calculatedsimple',
    'ddimageortext': 'ddimageortext',
    'ddmarker': 'ddmarker',
    'ddwtos': 'ddwtos',
    'multianswer': 'multianswer',
    'randomsamatch': 'randomsamatch',
    'gapselect': 'gapselect',
    'default': 'multichoice'
  };
  const normalizedType = String(apiType || '').toLowerCase().trim();
  return typeMapping[normalizedType] || typeMapping.default;
};

// Enhanced user cache to store user information
const userCache = new Map();

// Helper: Get user information by ID with caching
const getUserById = async (userId) => {
  if (!userId) return null;
  
  // Check cache first
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await handleAPIResponse(response);
    
    // Handle different response formats
    let users = [];
    if (Array.isArray(data)) {
      users = data;
    } else if (data.users && Array.isArray(data.users)) {
      users = data.users;
    } else if (data.data && Array.isArray(data.data)) {
      users = data.data;
    }
    
    // Cache all users for future use
    users.forEach(user => {
      const userInfo = {
        id: user.id,
        firstname: user.firstname || user.first_name || '',
        lastname: user.lastname || user.last_name || '',
        fullname: '',
        email: user.email || ''
      };
      
      // Create full name
      userInfo.fullname = `${userInfo.firstname} ${userInfo.lastname}`.trim() || 
                          user.fullname || 
                          user.displayname || 
                          `User ${user.id}`;
      
      userCache.set(user.id, userInfo);
    });
    
    return userCache.get(userId) || null;
  } catch (error) {
    console.error('❌ Failed to fetch user info:', error);
    return null;
  }
};

// Helper: Get user name by ID (simplified version)
const getUserNameById = async (userId) => {
  if (!userId) return 'Unknown';
  
  const user = await getUserById(userId);
  return user ? user.fullname : `User ${userId}`;
};

// Main API object
export const questionAPI = {
  // Get all tags
  async getTags() {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/tags`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await handleAPIResponse(response);
      let tags = [];
      if (Array.isArray(data)) tags = data;
      else if (data.tags && Array.isArray(data.tags)) tags = data.tags;
      else if (data.data && Array.isArray(data.data)) tags = data.data;
      return tags.map(tag => typeof tag === 'string' ? tag : (tag.name || tag.tag_name || tag.text || tag.displayname || String(tag.id))).filter(Boolean);
    } catch (error) {
      console.error('❌ Failed to fetch tags:', error);
      return ['exam', 'quiz', 'general', 'l1', 'l2', 'l3', 'hardware', 'software'];
    }
  },

  // Get all categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/categories`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await handleAPIResponse(response);
      let categories = [];
      if (Array.isArray(data)) categories = data;
      else if (data.categories && Array.isArray(data.categories)) categories = data.categories;
      else if (data.data && Array.isArray(data.data)) categories = data.data;
      return categories.map(cat => ({
        value: cat.id || cat.value,
        label: cat.name || cat.label || cat.category || `Category ${cat.id}`
      }));
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      return [{ value: 1, label: 'Default Category' }];
    }
  },

  // Get question types
  async getQuestionTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/qtypes`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await handleAPIResponse(response);
      let types = [];
      if (Array.isArray(data)) types = data;
      else if (data.qtypes && Array.isArray(data.qtypes)) types = data.qtypes;
      else if (data.data && Array.isArray(data.data)) types = data.data;
      return types.map(type => {
        const qtype = typeof type === 'string' ? type : (type.qtype || type.type || type.name);
        return {
          value: qtype,
          label: qtype.charAt(0).toUpperCase() + qtype.slice(1).replace(/([A-Z])/g, ' $1')
        };
      });
    } catch (error) {
      console.error('❌ Failed to fetch question types:', error);
      return [
        { value: 'multichoice', label: 'Multiple Choice' },
        { value: 'truefalse', label: 'True/False' },
        { value: 'essay', label: 'Essay' },
        { value: 'shortanswer', label: 'Short Answer' }
      ];
    }
  },

  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      return await handleAPIResponse(response);
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
      return [];
    }
  },

  // Create True/False Question
  async createTrueFalseQuestion(questionData) {
    const payload = {
      name: questionData.title,
      questiontext: questionData.questionText,
      qtype: 'truefalse',
      status: questionData.status || 'draft',
      defaultmark: questionData.defaultMark || 1,
      generalfeedback: questionData.generalFeedback || '',
      correctanswer: questionData.correctAnswer,
      feedbacktrue: questionData.feedbackTrue || '',
      feedbackfalse: questionData.feedbackFalse || '',
      penalty: questionData.penalty || 0,
      tags: questionData.tags || []
    };
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await handleAPIResponse(response);
    } catch (error) {
      console.error('❌ Failed to create True/False question:', error);
      throw error;
    }
  },

  // Create Multiple Choice Question
  async createMultipleChoiceQuestion(questionData) {
    const payload = {
      name: questionData.title,
      questiontext: questionData.questionText,
      qtype: 'multichoice',
      status: questionData.questionStatus || 'Ready',
      defaultmark: questionData.defaultMark || 100,
      generalfeedback: questionData.generalFeedback || '',
      multipleAnswers: questionData.multipleAnswers || false,
      shuffleAnswers: questionData.shuffleAnswers || true,
      choices: questionData.choices.map(choice => ({
        text: choice.text,
        grade: choice.grade,
        feedback: choice.feedback || ''
      })),
      tags: questionData.tags || []
    };
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return await handleAPIResponse(response);
    } catch (error) {
      console.error('❌ Failed to create Multiple Choice question:', error);
      throw error;
    }
  },

  // Get questions with filters
  async getQuestions(filters = {}, page = 1, perPage = 10) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('perpage', perPage.toString());
    if (filters.category && filters.category !== 'All') params.append('categoryid', filters.category.toString());
    if (filters.status && filters.status !== 'All') params.append('status', filters.status.toLowerCase());
    if (filters.type && filters.type !== 'All') params.append('qtype', filters.type);
    if (filters.searchQuery) params.append('searchterm', filters.searchQuery.trim());
    
    try {
      const response = await fetch(`${API_BASE_URL}/questions/filters?${params}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      const data = await handleAPIResponse(response);
      
      // Enhanced processing to include user information
      if (data && data.questions && Array.isArray(data.questions)) {
        // Pre-load all users to cache for better performance
        await getUserById(1); // This triggers loading all users into cache
        
        // Process each question to add user information
        for (let question of data.questions) {
          // Fetch creator info if we have creator ID
          if (question.createdby && !question.creator_name) {
            const creator = await getUserById(question.createdby);
            if (creator) {
              question.creator_name = creator.fullname;
              question.creator_firstname = creator.firstname;
              question.creator_lastname = creator.lastname;
            }
          }
          
          // Fetch modifier info if we have modifier ID
          if (question.modifiedby && !question.modifier_name) {
            const modifier = await getUserById(question.modifiedby);
            if (modifier) {
              question.modifier_name = modifier.fullname;
              question.modifier_firstname = modifier.firstname;
              question.modifier_lastname = modifier.lastname;
            }
          }
        }
      }
      
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch questions:', error);
      throw error;
    }
  },

  // Update question status
  async updateQuestionStatus(questionId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/set-question-status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          questionid: questionId,
          newstatus: status
        })
      });
      return handleAPIResponse(response);
    } catch (error) {
      console.error(' Failed to update question status:', error);
      throw error;
    }
},
      ///use for bulk operations
  async bulkUpdateQuestionStatus(questionIds, newStatus) {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        questionids: questionIds,
        newstatus: newStatus
      })
    });
    return await handleAPIResponse(response);
  } catch (error) {
    console.error(' Failed to bulk update question status:', error);
    throw error;
  }

  },
  async bulkDeleteQuestions(questionIds) {
  const response = await fetch(`${API_BASE_URL}/questions/bulk-delete`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ questionids: questionIds })
  });
  return await handleAPIResponse(response);
}
};



// Enhanced normalize question from API format with proper user handling
export function normalizeQuestionFromAPI(apiQuestion) {
  const rawQType = apiQuestion.qtype || apiQuestion.type || 'multichoice';
  const normalizedQType = mapQuestionTypeFromAPI(rawQType);

  // Handle choices/answers for multiple choice questions
  let choices = [];
  if (normalizedQType === 'multichoice' || normalizedQType === 'multiple') {
    if (apiQuestion.answers && Array.isArray(apiQuestion.answers)) {
      choices = apiQuestion.answers.map((answer, index) => ({
        id: answer.id || index,
        text: answer.text || answer.answer_text || answer.content || '',
        answer: answer.text || answer.answer_text || answer.content || '',
        isCorrect: answer.is_correct || answer.correct || (answer.fraction && answer.fraction > 0) || false,
        grade: (answer.is_correct || (answer.fraction && answer.fraction > 0)) ? '100%' : '0%',
        feedback: answer.feedback || ''
      }));
    } else if (apiQuestion.choices && Array.isArray(apiQuestion.choices)) {
      choices = apiQuestion.choices.map((choice, index) => ({
        id: choice.id || index,
        text: choice.text || choice.content || '',
        answer: choice.text || choice.content || '',
        isCorrect: choice.is_correct || choice.correct || false,
        grade: choice.is_correct ? '100%' : '0%',
        feedback: choice.feedback || ''
      }));
    }
  }

  // Handle tags from API - check multiple possible formats and ONLY use real API tags
  const getTagsFromAPI = () => {
    let apiTags = [];
    
    // Check different possible tag formats from Moodle API
    if (apiQuestion.tags && Array.isArray(apiQuestion.tags)) {
      apiTags = apiQuestion.tags;
    } else if (apiQuestion.questiontags && Array.isArray(apiQuestion.questiontags)) {
      apiTags = apiQuestion.questiontags;
    } else if (apiQuestion.tag_names && Array.isArray(apiQuestion.tag_names)) {
      apiTags = apiQuestion.tag_names;
    } else if (apiQuestion.tagnames && Array.isArray(apiQuestion.tagnames)) {
      apiTags = apiQuestion.tagnames;
    } else if (typeof apiQuestion.tags === 'string' && apiQuestion.tags.trim()) {
      // Handle comma-separated tags
      apiTags = apiQuestion.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    
    // Normalize tag format - tags might be objects or strings
    return apiTags.map(tag => {
      if (typeof tag === 'string') {
        return tag.trim();
      } else if (tag && typeof tag === 'object') {
        return tag.name || tag.tag_name || tag.displayname || tag.text || tag.rawname || String(tag.id);
      }
      return String(tag);
    }).filter(Boolean);
  };

  // Enhanced helper functions with proper Moodle field mapping
  const getCreatorInfo = () => {
    // Try multiple possible field names from Moodle API
    let creatorName = 'Unknown';
    let creatorDate = '';

    // Check for pre-fetched name first
    if (apiQuestion.creator_name) {
      creatorName = apiQuestion.creator_name;
    } else if (apiQuestion.creator_firstname && apiQuestion.creator_lastname) {
      creatorName = `${apiQuestion.creator_firstname} ${apiQuestion.creator_lastname}`.trim();
    } else if (apiQuestion.created_by_name) {
      creatorName = apiQuestion.created_by_name;
    } else if (apiQuestion.createdby) {
      creatorName = `User ${apiQuestion.createdby}`;
    }

    // Handle creation date
    if (apiQuestion.timecreated) {
      creatorDate = new Date(apiQuestion.timecreated * 1000).toLocaleDateString();
    } else if (apiQuestion.created_at) {
      creatorDate = new Date(apiQuestion.created_at).toLocaleDateString();
    } else if (apiQuestion.createddate) {
      creatorDate = new Date(apiQuestion.createddate).toLocaleDateString();
    }

    return {
      name: creatorName,
      date: creatorDate
    };
  };

  const getModifierInfo = () => {
    // Try multiple possible field names from Moodle API
    let modifierName = 'Unknown';
    let modifierDate = '';

    // Check for pre-fetched name first
    if (apiQuestion.modifier_name) {
      modifierName = apiQuestion.modifier_name;
    } else if (apiQuestion.modifier_firstname && apiQuestion.modifier_lastname) {
      modifierName = `${apiQuestion.modifier_firstname} ${apiQuestion.modifier_lastname}`.trim();
    } else if (apiQuestion.modified_by_name) {
      modifierName = apiQuestion.modified_by_name;
    } else if (apiQuestion.modifiedby) {
      modifierName = `User ${apiQuestion.modifiedby}`;
    }

    // Handle modification date
    if (apiQuestion.timemodified) {
      modifierDate = new Date(apiQuestion.timemodified * 1000).toLocaleDateString();
    } else if (apiQuestion.updated_at) {
      modifierDate = new Date(apiQuestion.updated_at).toLocaleDateString();
    } else if (apiQuestion.modifieddate) {
      modifierDate = new Date(apiQuestion.modifieddate).toLocaleDateString();
    }

    return {
      name: modifierName,
      date: modifierDate
    };
  };

  const getUsageInfo = () => {
    const usage = apiQuestion.usage || apiQuestion.usage_count || 0;
    let lastUsed = 'Never';
    
    if (apiQuestion.last_used) {
      lastUsed = new Date(apiQuestion.last_used).toLocaleDateString();
    } else if (apiQuestion.timemodified && usage > 0) {
      lastUsed = new Date(apiQuestion.timemodified * 1000).toLocaleDateString();
    } else if (apiQuestion.updated_at && usage > 0) {
      lastUsed = new Date(apiQuestion.updated_at).toLocaleDateString();
    }
    
    return { usage: parseInt(usage) || 0, lastUsed };
  };




  

  // Assign before return!
  const createdBy = getCreatorInfo();
  const modifiedBy = getModifierInfo();
  const usageInfo = getUsageInfo();
  const apiTags = getTagsFromAPI();

  return {
    id: apiQuestion.id,
    title: apiQuestion.name || apiQuestion.title || `Question ${apiQuestion.id}`,
    questionText: apiQuestion.questiontext || apiQuestion.question_text || apiQuestion.text || '',
    qtype: normalizedQType,
    status: apiQuestion.status || 'draft',
    version: `v${apiQuestion.version || 1}`,
    // ONLY use real API tags - no fallback to demo tags
    tags: apiTags,
    choices: choices,
    options: choices.map(c => c.text || c.answer || ''),
    correctAnswers: choices.filter(c => c.isCorrect).map(c => c.text || c.answer || ''),
    correctAnswer: normalizedQType === 'truefalse' ? (apiQuestion.correctanswer || apiQuestion.correct_answer || 'true') : undefined,
    feedbackTrue: normalizedQType === 'truefalse' ? (apiQuestion.feedbacktrue || apiQuestion.feedback_true || '') : undefined,
    feedbackFalse: normalizedQType === 'truefalse' ? (apiQuestion.feedbackfalse || apiQuestion.feedback_false || '') : undefined,
    multipleAnswers: choices.filter(c => c.isCorrect).length > 1,
    shuffleAnswers: apiQuestion.shuffleanswers || apiQuestion.shuffle_answers || false,
    numberChoices: apiQuestion.numbering || '1, 2, 3, ...',
    showInstructions: apiQuestion.showinstructions !== false,
    defaultMark: apiQuestion.defaultmark || apiQuestion.default_mark || 1,
    generalFeedback: apiQuestion.generalfeedback || apiQuestion.general_feedback || '',
    combinedFeedback: apiQuestion.combinedfeedback || apiQuestion.combined_feedback || {},
    penaltyFactor: apiQuestion.penalty || apiQuestion.penalty_factor || 0,
    createdBy,
    modifiedBy,
    comments: apiQuestion.comments || apiQuestion.comment_count || 0,
    usage: usageInfo.usage,
    lastUsed: usageInfo.lastUsed,
    history: apiQuestion.history || []
  };
}

// Generate demo tags for questions without tags (only use when no real tags exist)
export function generateDemoTags(question) {
  const tags = [];
  
  // Don't add qtype as a tag anymore since it's not a real tag
  if (question.status && question.status !== 'draft') tags.push(question.status);
  
  const questionText = (question.questiontext || question.questionText || question.title || '').toLowerCase();
  if (questionText.includes('google')) tags.push('google');
  if (questionText.includes('programming') || questionText.includes('code')) tags.push('programming');
  if (questionText.includes('computer')) tags.push('computer-science');
  if (questionText.includes('math') || questionText.includes('calculate') || questionText.includes('number')) tags.push('mathematics');
  
  if (question.defaultMark) {
    const mark = parseFloat(question.defaultMark);
    if (mark <= 1) tags.push('easy');
    else if (mark <= 3) tags.push('medium');
    else tags.push('hard');
  } else {
    const difficulties = ['easy', 'medium', 'hard'];
    tags.push(difficulties[Math.floor(Math.random() * difficulties.length)]);
  }
  
  const academicTags = ['quiz', 'exam', 'practice', 'homework', 'review', 'assessment'];
  if (Math.random() > 0.5) tags.push(academicTags[Math.floor(Math.random() * academicTags.length)]);
  
  // Add content-based tags instead of qtype
  switch (question.qtype) {
    case 'multichoice': tags.push('multiple-choice'); break;
    case 'truefalse': tags.push('true-false'); break;
    case 'essay': tags.push('written-response'); break;
    case 'shortanswer': tags.push('short-answer'); break;
    case 'ddimageortext': tags.push('drag-drop', 'interactive'); break;
    case 'matching': tags.push('matching'); break;
    case 'gapselect': tags.push('fill-in-blanks'); break;
  }
  
  if (tags.length < 3) tags.push(...['general', 'standard', 'basic'].slice(0, 3 - tags.length));
  return [...new Set(tags.filter(tag => tag && tag.length > 0))];
}