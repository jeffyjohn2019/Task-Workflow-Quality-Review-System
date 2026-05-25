import React, { useState, useEffect } from "react";
import { analyzeSubmission } from "../services/aiReview";

/**
 * AIQualityChecker displays AI-generated quality analysis for a given submission text.
 * It shows a score, summary, list of issues, and suggestions.
 */
function AIQualityChecker({ submissionText }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!submissionText) return;
    const runAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await analyzeSubmission(submissionText);
        setAnalysis(result);
      } catch (e) {
        console.error(e);
        setError("Failed to analyze submission.");
      } finally {
        setLoading(false);
      }
    };
    runAnalysis();
  }, [submissionText]);

  if (!submissionText) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
        <span className="mr-2">🤖 AI Quality Checker</span>
      </h3>
      {loading && <p className="text-gray-600">Analyzing submission...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Score:</span>
            <span className={`px-2 py-1 rounded ${analysis.score >= 80 ? "bg-emerald-100 text-emerald-800" : analysis.score >= 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}
            >{analysis.score}%</span>
          </div>
          <div>
            <span className="font-semibold block mb-1">Summary:</span>
            <p className="text-gray-700">{analysis.summary}</p>
          </div>
          {analysis.issues && analysis.issues.length > 0 && (
            <div>
              <span className="font-semibold block mb-1">Issues:</span>
              <ul className="list-disc list-inside text-red-600">
                {analysis.issues.map((iss, idx) => (
                  <li key={idx}>{iss}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div>
              <span className="font-semibold block mb-1">Suggestions:</span>
              <ul className="list-disc list-inside text-gray-600">
                {analysis.suggestions.map((sug, idx) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIQualityChecker;
