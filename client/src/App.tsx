import { Routes, Route, Link } from 'react-router-dom';
import LogList from './components/LogList';
import LogEditor from './components/LogEditor';
import LogDetail from './components/LogDetail';
import { BookOpen } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:text-blue-600 transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">My Blog</span>
          </Link>
          <nav>
            <Link 
              to="/new" 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Write Log
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<LogList />} />
          <Route path="/new" element={<LogEditor />} />
          <Route path="/logs/:id" element={<LogDetail />} />
          <Route path="/logs/:id/edit" element={<LogEditor />} />
        </Routes>
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} My Blog. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
