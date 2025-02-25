// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = '欢迎使用成益管理系统';
  
  useEffect(() => {
    // 淡入效果
    setIsVisible(true);
    
    // 打字效果
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);
    
    return () => clearInterval(typingInterval);
  }, []);
  
  return (
    <div className="h-full bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center">
      <header>
        <title>成益管理系统</title>
        <meta name="description" content="成益企业管理系统 - 高效专业的企业解决方案" />
        <link rel="icon" href="/favicon.ico" />
      </header>
      
      <main className={`w-full max-w-4xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-6 tracking-tight">
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>
          
          <p className="text-lg text-center text-blue-100 mb-8 animate-fade-in">
            高效、专业、智能的企业管理解决方案
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: '数据分析', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { title: '项目管理', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
              { title: '客户关系', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-white border-opacity-10"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center text-white mb-2">{item.title}</h3>
                <p className="text-sm text-center text-blue-200 opacity-80">专业化管理工具，提升企业效率</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* 装饰元素 */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white bg-opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 20}px`,
              height: `${Math.random() * 200 + 20}px`,
              animation: `float ${Math.random() * 10 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}