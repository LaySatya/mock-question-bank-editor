// constants/mockData.js
export const MOCK_QUESTIONS = [
  {
    id: 101,
    title: "What is the time complexity of binary search?",
    questionText: "Select the correct time complexity for the binary search algorithm.",
    questionType: "multiple",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswers: ["O(log n)"],
    // tags: ["algorithms", "programming", "medium", "exam"], // Added tags
    tags: ["html"], 
    status: "ready",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 10:00 AM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 10:00 AM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  },
  {
    id: 102,
    title: "Which language is used for web development?",
    questionText: "Choose all languages commonly used for web development.",
    questionType: "multiple",
    options: ["Python", "HTML", "CSS", "C++"],
    correctAnswers: ["HTML", "CSS"],
    // tags: ["web development", "html", "css", "easy", "quiz"], // Added tags
    tags: ["html"], 
    status: "ready",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 11:00 AM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 11:00 AM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  },
  {
    id: 103,
    title: "What does SQL stand for?",
    questionText: "Select the correct full form of SQL.",
    questionType: "multiple",
    options: [
      "Structured Query Language",
      "Simple Query Language", 
      "Sequential Query Language",
      "Standard Query Language"
    ],
    correctAnswers: ["Structured Query Language"],
    // tags: ["sql", "databases", "medium", "exam"], // Added tags
    tags: ["html"], 
    status: "ready",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 12:00 PM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 12:00 PM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  },
  {
    id: 104,
    title: "Which protocol is used to securely transfer files over the Internet?",
    questionText: "Select the protocol that provides secure file transfer.",
    questionType: "multiple",
    options: ["FTP", "SFTP", "HTTP", "SMTP"],
    correctAnswers: ["SFTP"],
    // tags: ["networking", "security", "medium", "exam"], // Added tags
    tags: ["html"], 
    status: "ready",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 1:00 PM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 1:00 PM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  },
  {
    id: 105,
    title: "Which of the following is a Python data structure?",
    questionText: "Choose all correct Python data structures.",
    questionType: "multiple",
    options: ["List", "Tuple", "ArrayList", "Dictionary"],
    correctAnswers: ["List", "Tuple", "Dictionary"],
    // tags: ["python", "data structures", "easy", "quiz"], // Added tags
    tags: ["html"], 
    status: "ready",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 1:10 PM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 1:10 PM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  },
  {
    id: 106,
    title: "What is the main purpose of an operating system?",
    questionText: "Select the primary function of an operating system.",
    questionType: "multiple",
    options: [
      "Manage hardware resources",
      "Compile source code",
      "Design web pages",
      "Send emails"
    ],
    correctAnswers: ["Manage hardware resources"],
    // tags: ["operating systems", "hard", "assignment"], // Added tags
    tags: ["html"], 
    status: "ready",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 1:20 PM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 1:20 PM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  },
  {
    id: 107,
    title: "Is JavaScript a compiled language?",
    questionText: "Determine whether JavaScript is a compiled programming language.",
    questionType: "truefalse",
    correctAnswer: "false",
    feedbackTrue: "Incorrect. JavaScript is an interpreted language, not compiled.",
    feedbackFalse: "Correct! JavaScript is an interpreted language that runs in browsers and Node.js.",
    // tags: ["javascript", "programming", "easy", "quiz"], // Added tags
    tags: ["html"], 
    status: "ready",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 2:00 PM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 2:00 PM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  },
  {
    id: 108,
    title: "Can HTML create dynamic web pages by itself?",
    questionText: "Determine if HTML alone can create dynamic, interactive web pages.",
    questionType: "truefalse",
    correctAnswer: "false",
    feedbackTrue: "Incorrect. HTML is a markup language for structure, not dynamic behavior.",
    feedbackFalse: "Correct! HTML provides structure but needs JavaScript for dynamic behavior.",
    // tags: ["html", "web development", "medium", "exam"], // Added tags
    tags: ["html"], 
    status: "draft",
    version: "v1",
    createdBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 2:30 PM" },
    comments: 0,
    usage: 0,
    lastUsed: "Never",
    modifiedBy: { name: "Unknow User", role: "Teacher", date: "2 June 2025, 2:30 PM" },
    history: [{ version: "v1", date: "2 June 2025", author: "Unknow User", changes: "Initial creation" }]
  }
];