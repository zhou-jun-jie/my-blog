import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  if (!log) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to List
        </Link>
      </div>
      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{log.title}</h1>
          <Link
            to={`/logs/${log.id}/edit`}
            className="text-gray-500 hover:text-blue-500"
          >
            Edit
          </Link>
        </div>
        <div className="text-gray-500 text-sm mb-6 border-b pb-4">
          {new Date(log.createdAt).toLocaleString()}
        </div>
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {log.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
