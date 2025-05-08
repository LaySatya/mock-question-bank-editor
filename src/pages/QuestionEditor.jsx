import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const QuestionEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questionIds = [] } = location.state || {};

  const [questions, setQuestions] = useState([]);

  const questionTypes = [
    'Multiple Choice',
    'True/False',
    'Short Answer',
    'Essay',
    'Fill in the Blank',
  ];

  const categories = [
    'Science',
    'Mathematics',
    'Language Arts',
    'Social Studies',
    'Computer Science',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    // Simulate fetching questions by IDs (replace with real API call)
    const mockData = [
      {
        id: 1,
        question: 'What is the capital of France?',
        type: 'Multiple Choice',
        category: 'Social Studies',
        difficulty: 'Easy',
      },
      {
        id: 4,
        question: 'Solve for x: 3x + 7 = 22',
        type: 'Short Answer',
        category: 'Mathematics',
        difficulty: 'Medium',
      },
    ];
    const filtered = mockData.filter(q => questionIds.includes(q.id));
    setQuestions(filtered);
  }, [questionIds]);

  const handleChange = (id, field, value) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = () => {
    console.log('Saving changes for:', questions);
    alert('✅ Changes saved successfully!');
    navigate('/question-bank');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button
        className="btn btn-ghost text-left flex items-center gap-2"
        onClick={() => navigate('/question-bank')}
      >
        <ArrowLeft size={18} /> Back to Question Bank
      </button>

      <h1 className="text-3xl font-bold">📝 Edit Question{questions.length > 1 ? 's' : ''}</h1>

      {questions.length === 0 ? (
        <p>No questions selected for editing.</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-base-100 p-6 rounded-xl shadow space-y-4 border border-base-300"
            >
              <h2 className="font-semibold text-lg">Question {index + 1}</h2>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                value={q.question}
                onChange={(e) => handleChange(q.id, 'question', e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Type</label>
                  <select
                    className="select select-bordered w-full"
                    value={q.type}
                    onChange={(e) => handleChange(q.id, 'type', e.target.value)}
                  >
                    {questionTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    className="select select-bordered w-full"
                    value={q.category}
                    onChange={(e) => handleChange(q.id, 'category', e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Difficulty</label>
                  <select
                    className="select select-bordered w-full"
                    value={q.difficulty}
                    onChange={(e) => handleChange(q.id, 'difficulty', e.target.value)}
                  >
                    {difficulties.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/question-bank')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              onClick={handleSave}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuestionEditor;
