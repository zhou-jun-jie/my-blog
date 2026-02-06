import { Routes, Route } from 'react-router-dom';
import LogList from './components/LogList';
import LogEditor from './components/LogEditor';
import LogDetail from './components/LogDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LogList />} />
        <Route path="/new" element={<LogEditor />} />
        <Route path="/logs/:id" element={<LogDetail />} />
        <Route path="/logs/:id/edit" element={<LogEditor />} />
      </Routes>
    </div>
  );
}

export default App;
