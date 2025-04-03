// components/DetectionResults.tsx
import React from 'react';
import { CheckCircle, AlertTriangle, Info, ServerCrash } from 'lucide-react';
import { AnalysisResult } from './Hero'; // Import the updated type

type DetectionResultsProps = {
  results: AnalysisResult | null; // Allow null
};

export function DetectionResults({ results }: DetectionResultsProps) {
  // Handle null results or errors
  if (!results) {
    return null; // Don't render anything if no results
  }

  if (results.error) {
      return (
          <div className="bg-red-900/30 backdrop-blur-md rounded-xl p-6 border border-red-800 shadow-xl text-center text-red-300">
             <ServerCrash className="h-10 w-10 mx-auto mb-4 text-red-500" />
             <h2 className="text-xl font-bold mb-2">Analysis Error</h2>
             <p className="text-sm">{results.error}</p>
          </div>
      )
  }

  const { isAi, confidence, detailedAnalysis, source } = results;

  // Determine display text based on isAi
  const resultText = isAi
    ? 'Likely AI-generated or Deepfake'
    : 'Not likely to be AI-generated or Deepfake';
  const resultDescription = isAi
    ? 'Our detection system has identified patterns consistent with AI-generated or manipulated content in this image.'
    : 'Our detection system found no significant indicators of AI manipulation in this image.';
  const resultColorClass = isAi ? 'text-red-400' : 'text-green-400';
  const resultIcon = isAi ? (
    <AlertTriangle className="h-8 w-8 text-red-500" />
  ) : (
    <CheckCircle className="h-8 w-8 text-green-500" />
  );

  return (
    <div className="bg-gray-900/60 backdrop-blur-md rounded-xl p-6 border border-gray-800 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Detection Results</h2>
         {source && (
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">
            Model: {source === 'advanced_model' ? 'Advanced' : 'Basic'}
          </span>
        )}
        <div
          className={`text-xl font-bold px-4 py-2 rounded-lg ${
            isAi ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
          }`}
        >
          {/* Show confidence relative to the detected class */}
          {confidence}% {isAi ? 'AI Likelihood' : 'Real Likelihood'}
        </div>
      </div>

      {/* Primary Result */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          {resultIcon}
          <h3 className={`text-xl font-semibold ${resultColorClass}`}>{resultText}</h3>
        </div>
        <p className="text-gray-300">{resultDescription}</p>
      </div>

      {/* --- Conditionally Render Detailed Analysis --- */}
      {/* Note: The current backend does not provide this detailed data */}
      {detailedAnalysis && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GenAI Score (Example) */}
            {typeof detailedAnalysis.genAI === 'number' && (
              <div>
                <div className="flex items-center mb-2">
                  <h4 className="text-lg font-medium">GenAI</h4>
                  <Info size={16} className="ml-2 text-gray-500" />
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500"
                    style={{ width: `${detailedAnalysis.genAI}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Score</span>
                  <span>{detailedAnalysis.genAI}%</span>
                </div>
              </div>
            )}
             {/* Face Manipulation Score (Example) */}
             {typeof detailedAnalysis.faceManipulation === 'number' && (
              <div>
                 <div className="flex items-center mb-2">
                    <h4 className="text-lg font-medium">Face Manipulation</h4>
                    <Info size={16} className="ml-2 text-gray-500" />
                 </div>
                 <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-500" // Different gradient maybe
                      style={{ width: `${detailedAnalysis.faceManipulation}%` }}
                    ></div>
                 </div>
                 <div className="flex justify-between text-sm mt-1">
                    <span>Score</span>
                    <span>{detailedAnalysis.faceManipulation}%</span>
                 </div>
              </div>
             )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Detailed Breakdown</h3>
             {/* Diffusion Details (Example) */}
            {detailedAnalysis.diffusion && Object.keys(detailedAnalysis.diffusion).length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <h4 className="text-lg font-medium">Diffusion Models</h4>
                  <Info size={16} className="ml-2 text-gray-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(detailedAnalysis.diffusion).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Add similar conditional rendering for GAN and Other if needed */}
          </div>
        </>
      )}
       {!detailedAnalysis && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            Detailed breakdown is not available for this detection method.
          </div>
        )}
    </div>
  );
}