// components/DetectionResults.tsx
import React from 'react';
import { CheckCircle, AlertTriangle, Info, ServerCrash } from 'lucide-react';
import { AnalysisResult } from './Hero'; // Assuming AnalysisResult type is correctly imported

type DetectionResultsProps = {
  results: AnalysisResult | null;
};

export function DetectionResults({ results }: DetectionResultsProps) {
  if (!results) {
    return null; // Don't render if no results yet
  }

  // Display specific error message from backend if present
  if (results.error) {
      return (
          <div className="bg-red-900/30 backdrop-blur-md rounded-xl p-6 border border-red-800 shadow-xl text-center text-red-300">
             <ServerCrash className="h-10 w-10 mx-auto mb-4 text-red-500" />
             <h2 className="text-xl font-bold mb-2">Analysis Error</h2>
             {/* Show the detailed error message from the backend */}
             <p className="text-sm">{results.error}</p>
          </div>
      )
  }

  // Destructure results only if no error
  const { isAi, confidence, source } = results;

  // Determine display elements based on 'isAi' result
  const resultText = isAi ? 'Likely AI-generated or Deepfake' : 'Likely Authentic';
  const resultDescription = isAi
    ? 'Our analysis suggests patterns consistent with AI generation or manipulation.'
    : 'Our analysis did not find significant indicators of AI manipulation.';
  const resultColorClass = isAi ? 'text-red-400' : 'text-green-400'; // Red for AI, Green for Real
  const resultBgClass = isAi ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300';
  const resultIcon = isAi ? (
    <AlertTriangle className="h-8 w-8 text-red-500" />
  ) : (
    <CheckCircle className="h-8 w-8 text-green-500" />
  );

  // --- Map backend source strings to user-friendly labels ---
  let displaySource = 'Unknown';
  if (source === 'basic_model_gradio') {
      displaySource = 'Basic (Gradio)';
  } else if (source === 'advanced_model_sightengine') {
      displaySource = 'Advanced (Sightengine)';
  } else if (source) {
      // Fallback if source exists but isn't recognized (e.g., future backend changes)
      displaySource = source.replace(/_/g, ' ').replace('model', '').trim().replace(/\b\w/g, l => l.toUpperCase());
  }
  // --- End Source Mapping ---

  return (
    <div className="bg-gray-900/60 backdrop-blur-md rounded-xl p-6 border border-gray-800 shadow-xl mt-8"> {/* Added margin-top */}
      {/* Header Row: Title, Source, Confidence */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-y-2"> {/* Added flex-wrap and gap */}
        <h2 className="text-2xl font-bold">Detection Results</h2>
         {/* Display the mapped source */}
         {source && (
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">
            Model: {displaySource}
          </span>
        )}
        {/* Confidence Badge */}
        <div className={`text-xl font-bold px-4 py-2 rounded-lg ${resultBgClass}`}>
          {confidence}% {isAi ? 'AI Likelihood' : 'Authentic Likelihood'}
        </div>
      </div>

      {/* Primary Result Display */}
      <div className="mb-8 text-left"> {/* Align text left */}
        <div className="flex items-center space-x-3 mb-4">
          {resultIcon}
          <h3 className={`text-xl font-semibold ${resultColorClass}`}>{resultText}</h3>
        </div>
        <p className="text-gray-300">{resultDescription}</p>
      </div>

      {/* Detailed Analysis Placeholder (Commented out as backend doesn't provide it) */}
       {/*
       {detailedAnalysis && ( ... detailed breakdown UI ... )}
       */}
       {/* Message indicating no detailed breakdown available */}
       <div className="mt-6 text-center text-gray-500 text-sm italic">
            Detailed analysis breakdown is not provided by the current detection methods.
       </div>
    </div>
  );
}