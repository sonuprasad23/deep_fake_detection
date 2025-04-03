// components/Hero.tsx
import React, { useState, useRef } from 'react';
import { Upload, Zap, AlertTriangle, CheckCircle, X, Loader2, ServerCrash } from 'lucide-react'; // Added ServerCrash
import { DetectionResults } from './DetectionResults';
import { toast } from 'sonner';

// Define the structure expected by DetectionResults
export type AnalysisResult = {
  isAi: boolean;
  confidence: number;
  source?: string;
  error?: string; // To pass potential errors
};

// Helper function (keep as is)
function dataURLtoFile(dataurl: string, filename: string): File | null {
  // ... (function implementation remains the same)
  try {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error("Error converting data URL to File:", error);
    return null;
  }
}

export function Hero() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('uploaded_image');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [detectionMethod, setDetectionMethod] = useState<'basic' | 'advanced'>('advanced');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Get Base API URL from Environment Variable ---
  // Fallback to localhost for local development if the env var isn't set
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  // ---

  const handleFileSelect = (file: File | null) => {
    // ... (implementation remains the same)
     if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
         toast.error('Invalid file type. Please upload JPG, PNG, or WEBP.');
         return;
      }
      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
         toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
         return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setUploadedFileName(file.name);
        setResults(null);
      };
      reader.onerror = () => {
        toast.error('Error reading file.');
      }
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (implementation remains the same)
    handleFileSelect(e.target.files?.[0] || null);
     if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // ... (implementation remains the same)
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files[0] || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // ... (implementation remains the same)
    e.preventDefault();
    e.stopPropagation();
  };

   const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
     // ... (implementation remains the same)
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerFileInput = () => {
     // ... (implementation remains the same)
    if (!isAnalyzing) {
        fileInputRef.current?.click();
    }
  };

  const clearUpload = (e?: React.MouseEvent) => {
     // ... (implementation remains the same)
    e?.stopPropagation();
    setUploadedImage(null);
    setUploadedFileName('uploaded_image');
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first.');
      return;
    }
    setIsAnalyzing(true);
    setResults(null);
    const analyzeToastId = toast.loading('Analyzing image...');

    const imageFile = dataURLtoFile(uploadedImage, uploadedFileName);
    if (!imageFile) {
      toast.error('Error preparing image for analysis.', { id: analyzeToastId });
      setIsAnalyzing(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('method', detectionMethod);

    // --- Construct the full API URL using the base URL ---
    const analyzeApiUrl = `${API_BASE_URL}/analyze`;
    console.log(`Sending analysis request to: ${analyzeApiUrl}`); // Log for debugging
    // ---

    try {
      const response = await fetch(analyzeApiUrl, { // Use the constructed URL
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || `API Error: ${response.statusText} (${response.status})`;
        console.error("API Error:", data);
        toast.error(`Analysis failed: ${errorMessage}`, { id: analyzeToastId });
        setResults({ error: errorMessage, isAi: false, confidence: 0 });
      } else {
        const analysisResult: AnalysisResult = {
          isAi: data.isAi,
          confidence: data.confidence,
          source: data.source,
        };
        setResults(analysisResult);
        toast.success('Analysis complete!', { id: analyzeToastId });
      }
    } catch (error) {
       console.error('Network or fetch error:', error);
       const message = error instanceof Error ? error.message : 'Network error or server unreachable';
       toast.error(`Analysis failed: ${message}`, { id: analyzeToastId });
       setResults({ error: message, isAi: false, confidence: 0 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="home" className="py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title and Description */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Detect Deepfakes with AI Precision
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Our advanced AI technology can identify manipulated media with high
          accuracy. Upload an image to see if it's authentic or AI-generated.
        </p>

        {/* Model Selection & Upload Area */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className={`px-6 py-2 rounded-full transition ${detectionMethod === 'basic' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setDetectionMethod('basic')}
              // disabled={true} // Consider enabling/disabling based on backend health check?
            >
              Basic Model (Local)
            </button>
            <button
              className={`px-6 py-2 rounded-full transition ${detectionMethod === 'advanced' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setDetectionMethod('advanced')}
            >
              Advanced Model (API)
            </button>
          </div>
          <div
            className={`border-2 border-dashed border-gray-700 rounded-lg p-8 mb-6 transition ${!isAnalyzing ? 'cursor-pointer hover:border-emerald-500' : 'cursor-default opacity-70'}`}
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleUpload}
              disabled={isAnalyzing}
            />
            {!uploadedImage ? (
              <div className="text-center pointer-events-none">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg text-gray-300 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            ) : (
              <div className="relative">
                <img src={uploadedImage} alt="Uploaded preview" className="max-h-96 mx-auto rounded-lg"/>
                {!isAnalyzing && (
                   <button className="absolute top-2 right-2 bg-gray-900/80 p-1 rounded-full hover:bg-red-600/80 transition-colors" onClick={clearUpload} aria-label="Remove uploaded image">
                    <X size={20} className="text-white" />
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Analyze Button */}
          {uploadedImage && !results && (
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-fuKOll font-medium flex items-center justify-center space-x-2 mx-auto transition disabled:opacity-60 disabled:cursor-not-allowed" onClick={analyzeImage} disabled={isAnalyzing}>
              {isAnalyzing ? ( <> <Loader2 size={20} className="animate-spin mr-2"/> <span>Analyzing...</span> </> ) : ( <> <Zap size={20} /> <span>Detect Deepfake</span> </> )}
            </button>
          )}
        </div>
        {/* Results Display */}
        {results && <DetectionResults results={results} />}
      </div>
    </section>
  );
}

// Keep DetectionResults component as is, it already handles the expected props