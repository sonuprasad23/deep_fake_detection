import React from 'react';
import { ShieldCheck, Eye, Zap, Lock } from 'lucide-react';
export function AboutSection() {
  return <section id="about" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            About Deepfake Detector
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our cutting-edge AI technology helps identify manipulated media with
            industry-leading accuracy.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
            <div className="bg-emerald-900/30 p-3 rounded-full w-fit mb-4">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Detection</h3>
            <p className="text-gray-400">
              Our AI models can identify even the most sophisticated deepfakes
              with high precision.
            </p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
            <div className="bg-blue-900/30 p-3 rounded-full w-fit mb-4">
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Analysis</h3>
            <p className="text-gray-400">
              Detailed visual breakdown of detection results helps you
              understand why an image is flagged.
            </p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
            <div className="bg-purple-900/30 p-3 rounded-full w-fit mb-4">
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-400">
              Get results in seconds with our optimized processing pipeline and
              efficient algorithms.
            </p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition">
            <div className="bg-red-900/30 p-3 rounded-full w-fit mb-4">
              <Lock className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-gray-400">
              Your uploaded images are processed securely and never stored
              without your permission.
            </p>
          </div>
        </div>
        <div className="mt-16 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-2xl p-8 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                The AI Media Challenge
              </h3>
              <p className="text-gray-300 mb-4">
                As AI-generated content becomes increasingly sophisticated,
                distinguishing between real and fake media is more challenging
                than ever.
              </p>
              <p className="text-gray-300">
                Our deepfake detector uses state-of-the-art machine learning
                models trained on diverse datasets to identify subtle patterns
                that indicate manipulation.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2 p-4 w-full">
                    <div className="aspect-square bg-gray-700 rounded-lg relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="Real face" className="object-cover w-full h-full" />
                      <div className="absolute bottom-0 left-0 right-0 bg-green-900/70 text-green-100 text-xs py-1 px-2">
                        Real Image
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-700 rounded-lg relative overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1570158268183-d296b2892211" alt="AI face" className="object-cover w-full h-full" />
                      <div className="absolute bottom-0 left-0 right-0 bg-red-900/70 text-red-100 text-xs py-1 px-2">
                        AI Generated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}