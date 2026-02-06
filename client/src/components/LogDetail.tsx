import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Edit2, Calendar } from 'lucide-react';

interface Log {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function LogDetail() {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<Log | null>(null);

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

  return (
    <article className="max-w-3xl mx-auto">
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
          <div className="flex items-center justify-between text-sm">
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
        </header>
      </div>

      <div className="prose prose-slate prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
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
            img({ src, alt }) {
              return (
                <div className="my-8">
                  <img src={src} alt={alt} className="rounded-xl shadow-lg mx-auto border border-gray-100" />
                  {alt && <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>}
                </div>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-gray-50 py-2 pr-2 rounded-r">
                  {children}
                </blockquote>
              );
            }
          }}
        >
          {log.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
