import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Calendar, ChevronRight, X } from 'lucide-react';

interface Log {
  id: number;
  title: string;
  createdAt: string;
}

export default function LogList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = (query = '') => {
    setLoading(true);
    const url = query ? `/api/logs?search=${encodeURIComponent(query)}` : '/api/logs';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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
    <div className="space-y-8">
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden transform transition-all scale-100">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Log</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this log? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Latest Logs</h1>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                fetchLogs('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </form>
      </div>

      {/* Log List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No logs found.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex justify-between items-center"
            >
              <Link to={`/logs/${log.id}`} className="flex-1 min-w-0 pr-4 block">
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {log.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                    Read more <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </Link>
              <div className="flex items-center pl-4 border-l border-gray-100">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteId(log.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete log"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
