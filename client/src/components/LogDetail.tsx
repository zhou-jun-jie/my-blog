import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Edit2, Calendar, Tag as TagIcon, History, X } from 'lucide-react';

interface LogHistory {
  id: number;
  content: string;
  updatedAt: string;
}

interface Log {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  tags: { id: number; name: string }[];
  history: LogHistory[];
}

export default function LogDetail() {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<Log | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<LogHistory | null>(null);

  useEffect(() => {
    fetch(`/api/logs/${id}`)
      .then((res) => res.json())
      .then((data) => setLog(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!log) return (
    <div className="flex justify-center items-center h-64 text-gray-400">
      Loading...
    </div>
  );

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="rounded-lg overflow-hidden my-6 shadow-md">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={`${className} bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
          {children}
        </code>
      );
    },
    img({ src, alt }: any) {
      return (
        <div className="my-8">
          <img src={src} alt={alt} className="rounded-xl shadow-lg mx-auto border border-gray-100" />
          {alt && <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>}
        </div>
      );
    },
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-gray-50 py-2 pr-2 rounded-r">
          {children}
        </blockquote>
      );
    }
  };

  return (
    <article className="max-w-3xl mx-auto">
      {/* History Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <History className="w-4 h-4 mr-2 text-gray-500" />
                Snapshot: {new Date(selectedHistory.updatedAt).toLocaleString()}
              </h3>
              <button onClick={() => setSelectedHistory(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                {selectedHistory.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </Link>
        
        <header className="border-b border-gray-100 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            {log.title}
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(log.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            
            <Link
              to={`/logs/${log.id}/edit`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Log
            </Link>
          </div>

          {log.tags && log.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {log.tags.map(tag => (
                <span key={tag.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>
      </div>

      <div className="prose prose-slate prose-lg max-w-none mb-16">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={MarkdownComponents}
        >
          {log.content}
        </ReactMarkdown>
      </div>

      {log.history && log.history.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <History className="w-5 h-5 mr-2" />
            Modification History
          </h3>
          <div className="space-y-3">
            {log.history.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mr-3"></div>
                  <span className="font-medium text-gray-900">Snapshot</span>
                  <span className="mx-2 text-gray-300">•</span>
                  {new Date(h.updatedAt).toLocaleString()}
                </div>
                <button 
                  onClick={() => setSelectedHistory(h)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 shadow-sm transition-all"
                >
                  View Content
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
