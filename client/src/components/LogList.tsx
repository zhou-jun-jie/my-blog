import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Log {
  id: number;
  title: string;
  createdAt: string;
}

export default function LogList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchLogs = (query = '') => {
    const url = query ? `/api/logs?search=${encodeURIComponent(query)}` : '/api/logs';
    fetch(url)
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(searchTerm);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/logs/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchLogs(searchTerm);
        setDeleteId(null);
      } else {
        alert('Failed to delete log');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting log');
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this log? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Logs</h1>
        <Link
          to="/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Log
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button 
          type="submit"
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700"
        >
          Search
        </button>
      </form>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="border p-4 rounded shadow hover:shadow-md transition bg-white flex justify-between items-start"
          >
            <Link to={`/logs/${log.id}`} className="block flex-1">
              <h2 className="text-xl font-semibold mb-2">{log.title}</h2>
              <p className="text-gray-500 text-sm">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </Link>
            <div className="flex space-x-2 ml-4">
              <Link
                to={`/logs/${log.id}/edit`}
                className="text-gray-600 hover:text-blue-600 px-3 py-1 border rounded text-sm"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setDeleteId(log.id)}
                className="text-red-600 hover:text-red-800 px-3 py-1 border rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-gray-500 text-center">No logs found.</p>
        )}
      </div>
    </div>
  );
}
