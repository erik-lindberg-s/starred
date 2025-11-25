import { useState } from 'react';

const AIMatch = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError(null);
    setMatches([]);
    setDebugInfo(null);
    
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('http://localhost:3001/ai-match', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process CV');
      }
      
      const result = await response.json();
      console.log('AI Match Result:', result);
      setMatches(result.matches || []);
      setDebugInfo(result.debug || null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <a href="/" className="text-sm text-brand-primary-60 hover:text-brand-primary-70">
          ← Back to Jobs
        </a>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-brand-base-90 mb-4">
          AI Job Matching
        </h1>
        <p className="text-brand-base-70">
          Upload your CV and let our AI find the best matching jobs for you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-brand-base-30 rounded-lg p-8 text-center hover:border-brand-primary-50 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="cv-upload"
          />
          <label htmlFor="cv-upload" className="cursor-pointer">
            <div className="text-4xl mb-4">📄</div>
            {file ? (
              <div>
                <p className="text-brand-base-90 font-medium">{file.name}</p>
                <p className="text-sm text-brand-base-60 mt-1">
                  Click to change file
                </p>
              </div>
            ) : (
              <div>
                <p className="text-brand-base-90 font-medium">
                  Click to upload your CV
                </p>
                <p className="text-sm text-brand-base-60 mt-1">
                  PDF files only
                </p>
              </div>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full px-6 py-3 bg-brand-primary-50 text-brand-primary-90 rounded-full font-medium hover:bg-brand-primary-60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Processing...' : 'Find My Best Matches'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {debugInfo && (
        <div className="mt-8 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">🔍 Debug Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-900 mb-2">CV Text (First 500 chars):</h3>
                <pre className="bg-white p-3 rounded border border-blue-200 text-sm overflow-x-auto whitespace-pre-wrap">
                  {debugInfo.cvText}
                </pre>
                <p className="text-sm text-blue-700 mt-1">Total CV length: {debugInfo.cvTextLength} characters</p>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">🤖 OpenAI API Call:</h3>
                <div className="bg-white p-3 rounded border border-blue-200 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Model:</span>{' '}
                    <span className="bg-blue-100 px-2 py-1 rounded text-sm text-blue-900 font-mono">{debugInfo.openAIModel}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Input:</span>{' '}
                    <span className="text-sm text-gray-600">{debugInfo.cvTextLength} characters of CV text</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Output:</span>{' '}
                    <span className="text-sm text-gray-600">Vector with {debugInfo.embeddingDimensions} dimensions</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Token Usage:</span>{' '}
                    <span className="text-sm text-gray-600">{debugInfo.openAIUsage?.prompt_tokens} prompt tokens, {debugInfo.openAIUsage?.total_tokens} total</span>
                  </div>
                  <div>
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium text-blue-700 hover:text-blue-800">
                        ▼ View embedding preview (first 20 dimensions)
                      </summary>
                      <pre className="mt-2 bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto text-xs text-gray-800 font-mono">
                        {JSON.stringify(debugInfo.embeddingPreview, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">Search Stats:</h3>
                <ul className="bg-white p-3 rounded border border-blue-200 space-y-1">
                  <li>✅ Total jobs searched: <strong>{debugInfo.totalJobsSearched}</strong></li>
                  <li>📊 Embedding dimensions: <strong>{debugInfo.embeddingDimensions}</strong></li>
                  <li>🎯 Top matches found: <strong>{matches.length}</strong></li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">Top 5 Similarity Scores:</h3>
                <div className="bg-white p-3 rounded border border-blue-200 space-y-2">
                  {debugInfo.topScores?.map((score, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0">
                      <div>
                        <span className="font-medium">{score.jobTitle}</span>
                        <span className="text-sm text-gray-600"> at {score.company}</span>
                      </div>
                      <span className="font-mono font-bold text-green-700">{score.similarity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-brand-base-30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-brand-base-90 mb-4">🎯 Your Top Matches</h2>
            <div className="space-y-4">
              {matches.map((job, idx) => (
                <div key={job.id} className="border border-brand-base-30 rounded-lg p-4 hover:bg-brand-base-10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-brand-base-90">
                      #{idx + 1} - {job.job_title}
                    </h3>
                  </div>
                  <p className="text-sm text-brand-base-60 mb-2">{job.company}</p>
                  <p className="text-sm text-brand-base-70">{job.description?.substring(0, 200)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMatch;

