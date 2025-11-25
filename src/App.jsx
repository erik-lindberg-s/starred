import { useState, useEffect } from 'react';
import Jobs from './pages/Jobs';
import AIMatch from './pages/AIMatch';

function App() {
  const [currentPage, setCurrentPage] = useState('jobs');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/ai-match') {
      setCurrentPage('ai-match');
    } else {
      setCurrentPage('jobs');
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPage(path === '/ai-match' ? 'ai-match' : 'jobs');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigation = (e) => {
    if (e.target.tagName === 'A' && e.target.origin === window.location.origin) {
      e.preventDefault();
      const path = e.target.pathname;
      window.history.pushState({}, '', path);
      setCurrentPage(path === '/ai-match' ? 'ai-match' : 'jobs');
    }
  };

  return (
    <div className="font-sans" onClick={handleNavigation}>
      <div className="w-full max-w-4xl mx-auto px-4 pt-8">
        {currentPage === 'ai-match' ? <AIMatch /> : <Jobs />}
      </div>
    </div>
  );
}

export default App;

