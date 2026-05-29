import { useState } from 'react';
import { QuestionCard } from './components/QuestionCard';

const categories = ['全部', '函数', '几何', '概率', '代数', '三角函数'];

const mockQuestions = [
  {
    id: 1,
    question: '已知函数 f(x) = 2x³ - 3x² + 1，求函数在区间 [-1, 2] 上的最大值和最小值。',
    difficulty: 3,
    topics: ['函数', '导数'],
  },
  {
    id: 2,
    question: '在△ABC中，已知 a = 5，b = 7，∠C = 60°，求边 c 的长度及△ABC的面积。',
    difficulty: 2,
    topics: ['几何', '三角函数'],
  },
  {
    id: 3,
    question: '从一副扑克牌（52张）中随机抽取5张牌，求恰好抽到3张红心的概率。',
    difficulty: 4,
    topics: ['概率', '组合'],
  },
  {
    id: 4,
    question: '解方程组：3x + 2y = 12 和 5x - y = 7，求 x 和 y 的值。',
    difficulty: 1,
    topics: ['代数', '方程组'],
  },
  {
    id: 5,
    question: '已知 sin(α) = 3/5，且 α 在第二象限，求 cos(2α) 的值。',
    difficulty: 3,
    topics: ['三角函数'],
  },
  {
    id: 6,
    question: '设数列 {aₙ} 是首项为 2，公差为 3 的等差数列，求前 20 项和 S₂₀。',
    difficulty: 2,
    topics: ['数列', '代数'],
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = mockQuestions.filter((q) => {
    const matchesCategory = selectedCategory === '全部' || q.topics.includes(selectedCategory);
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.topics.some(topic => topic.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white/40 backdrop-blur-xl rounded-full px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索题目或考点..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-800"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full backdrop-blur-xl transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#007AFF] text-white shadow-lg'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question.question}
              difficulty={question.difficulty}
              topics={question.topics}
            />
          ))}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>未找到相关题目</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}