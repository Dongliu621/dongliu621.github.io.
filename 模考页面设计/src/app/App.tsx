import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const HelpIcon = () => (
  <div className="w-[15px] h-[15px] rounded-full border border-gray-400 flex items-center justify-center text-[10px] text-gray-500 ml-1.5 cursor-help opacity-80 hover:opacity-100">
    ?
  </div>
);

const NumberInput = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => {
  return (
    <div className="flex items-center min-w-[200px]">
      <span className="w-[96px] text-right pr-4 text-[14px] text-gray-800 font-medium whitespace-nowrap">{label}</span>
      <div className="flex items-center border border-gray-200 rounded-[3px] overflow-hidden h-[32px] w-[72px] hover:border-gray-300 transition-colors">
        <input 
          type="text" 
          value={value} 
          readOnly
          className="w-full text-center outline-none text-[14px] text-gray-800 bg-white cursor-default"
        />
        <div className="flex flex-col border-l border-gray-200 h-full w-[24px] bg-white shrink-0">
          <button 
            onClick={() => onChange(value + 1)}
            className="flex-1 border-b border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 cursor-pointer transition-colors"
          >
             <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 1L9 5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </button>
          <button 
             onClick={() => onChange(Math.max(0, value - 1))}
             className="flex-1 flex items-center justify-center hover:bg-gray-50 text-gray-400 cursor-pointer transition-colors"
          >
             <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ number, title, hasHelp = false }: { number: string, title: string, hasHelp?: boolean }) => (
  <div className="flex items-center mb-6">
    <div className="bg-[#4169FF] text-white text-[13px] font-medium px-1.5 py-0.5 rounded-[4px] mr-2.5">
      {number}
    </div>
    <div className="font-bold text-gray-800 text-[16px]">{title}</div>
    {hasHelp && <HelpIcon />}
  </div>
);

const FormRow = ({ label, children, className = "" }: { label: string, children: React.ReactNode, className?: string }) => (
  <div className={`flex items-center mb-6 ${className}`}>
    <div className="w-[84px] text-gray-500 text-[14px] shrink-0 text-right pr-4">{label}：</div>
    <div className="flex items-center gap-6 flex-1">
      {children}
    </div>
  </div>
);

export default function App() {
  const [scenario, setScenario] = useState('课时练习');
  const [year, setYear] = useState('全部');

  const questionConfig = [
    { label: "单选题", key: "single" },
    { label: "多选题", key: "multi" },
    { label: "填空题", key: "fill" },
    { label: "实验题", key: "exp" },
    { label: "解答题", key: "ans" },
    { label: "综合题", key: "comp" },
    { label: "判断题", key: "tf" },
    { label: "作图题", key: "draw" },
    { label: "知识点填空题", key: "knowledge_fill" },
  ];

  const [counts, setCounts] = useState<{ [key: string]: number }>(
    questionConfig.reduce((acc, curr) => ({ ...acc, [curr.key]: 0 }), {})
  );

  const handleCountChange = (key: string, val: number) => {
    setCounts(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] pt-8 pb-20 font-sans flex justify-center items-start">
      <div className="w-full max-w-[1024px] bg-white rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-10 pb-0">
        
        {/* Section 02: 组卷设置 */}
        <div className="mb-12">
          <SectionTitle number="02" title="组卷设置" />
          
          <div className="pl-2">
            <FormRow label="出题场景">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${scenario === '课时练习' ? 'border-[#4169FF]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {scenario === '课时练习' && <div className="w-2 h-2 rounded-full bg-[#4169FF]"></div>}
                </div>
                <span className="text-[14px] text-gray-800">课时练习</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${scenario === '阶段测试' ? 'border-[#4169FF]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {scenario === '阶段测试' && <div className="w-2 h-2 rounded-full bg-[#4169FF]"></div>}
                </div>
                <span className="text-[14px] text-gray-800">阶段测试</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${scenario === '高考备考' ? 'border-[#4169FF]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {scenario === '高考备考' && <div className="w-2 h-2 rounded-full bg-[#4169FF]"></div>}
                </div>
                <span className="text-[14px] text-gray-800">高考备考</span>
              </label>
            </FormRow>

            <FormRow label="题目难度" className="mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#F2F6FF] text-[#4169FF] text-[13px] cursor-pointer hover:bg-[#e6eeff] transition-colors">
                  整卷综合难度
                  <ChevronDown size={14} className="opacity-80" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#F7F8FA] text-gray-700 text-[13px] cursor-pointer hover:bg-gray-100 transition-colors">
                  不限
                  <ChevronDown size={14} className="opacity-80" />
                </div>
                <HelpIcon />
              </div>
            </FormRow>

            <FormRow label="优先地区">
              <div className="flex items-center gap-1.5 text-[14px] text-[#4169FF] cursor-pointer hover:underline underline-offset-2 decoration-1">
                全部
                <ChevronDown size={14} className="opacity-80" />
              </div>
            </FormRow>

            <FormRow label="优先年份">
              <div className="flex gap-6 text-[14px]">
                <span 
                  onClick={() => setYear('全部')} 
                  className={`cursor-pointer ${year === '全部' ? 'text-[#4169FF]' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  全部
                </span>
                <span 
                  onClick={() => setYear('近3年')} 
                  className={`cursor-pointer ${year === '近3年' ? 'text-[#4169FF]' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  近3年
                </span>
                <span 
                  onClick={() => setYear('近5年')} 
                  className={`cursor-pointer ${year === '近5年' ? 'text-[#4169FF]' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  近5年
                </span>
              </div>
            </FormRow>
          </div>
        </div>

        {/* Section 03: 试题设置 */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <SectionTitle number="03" title="试题设置" hasHelp={true} />
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#F2F6FF] text-[#4169FF] text-[13px] cursor-pointer hover:bg-[#e6eeff] transition-colors mb-6">
              模板选题
              <ChevronDown size={14} className="opacity-80" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-y-7 gap-x-6 pl-2 pb-16">
            {questionConfig.map((q) => (
              <NumberInput 
                key={q.key} 
                label={q.label} 
                value={counts[q.key]} 
                onChange={(val) => handleCountChange(q.key, val)} 
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 py-5 mt-4 border-t border-gray-100">
          <button className="px-6 py-2 border border-gray-300 rounded-[4px] text-[14px] text-gray-700 hover:bg-gray-50 bg-white transition-colors cursor-pointer outline-none">
            存为模版
          </button>
          <button className="px-6 py-2 bg-[#4169FF] rounded-[4px] text-[14px] text-white hover:bg-[#3455db] transition-colors cursor-pointer outline-none">
            生成试卷
          </button>
        </div>

      </div>
    </div>
  );
}