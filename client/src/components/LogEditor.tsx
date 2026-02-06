import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Save, Upload, Eye, Edit3, ArrowLeft } from 'lucide-react';

export default function LogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/logs/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = id ? `/api/logs/${id}` : '/api/logs';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        navigate(id ? `/logs/${id}` : '/');
      } else {
        alert('Failed to save log');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving log');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
        // Set title from filename (remove extension) if title is empty
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        if (!title) {
          setTitle(fileName);
        }
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {id ? 'Edit Log' : 'Create New Log'}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-gray-500 hover:text-slate-900 flex items-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title..."
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg font-medium placeholder-gray-400"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-gray-700">
              Content (Markdown)
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                Import .md
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".md,.txt"
                onChange={handleFileUpload}
              />
              
              <div className="h-4 w-px bg-gray-300 mx-2" />
              
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isPreview 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isPreview ? (
                  <>
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    Preview
                  </>
                )}
              </button>
            </div>
          </div>

          {isPreview ? (
            <div className="w-full min-h-[400px] p-6 rounded-lg border border-gray-200 bg-gray-50 prose prose-slate max-w-none overflow-y-auto">
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
                      <code className={`${className} bg-gray-200 px-1 py-0.5 rounded text-sm`} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {content || '*Nothing to preview*'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your log content here using Markdown..."
              className="block w-full min-h-[400px] px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm leading-relaxed"
              required
            />
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isSubmitting ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Log
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
