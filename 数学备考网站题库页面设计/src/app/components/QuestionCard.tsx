interface QuestionCardProps {
  question: string;
  difficulty: number;
  topics: string[];
}

export function QuestionCard({ question, difficulty, topics }: QuestionCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
      <p className="text-gray-800 mb-4 leading-relaxed">{question}</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">难度：</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${star <= difficulty ? 'text-[#007AFF]' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-full text-sm"
            >
              {topic}
            </span>
          ))}
        </div>

        <button className="px-6 py-2 bg-[#007AFF] text-white rounded-full hover:bg-[#0051D5] transition-all duration-200 active:scale-95">
          查看解析
        </button>
      </div>
    </div>
  );
}
