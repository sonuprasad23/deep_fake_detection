import React from 'react';
import { Target, Shield, Users, Globe } from 'lucide-react';
export function MissionSection() {
  return <section id="mission" className="py-20 bg-gradient-to-b from-transparent to-gray-900/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're committed to creating a future where digital media can be
            trusted.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6">Fighting Misinformation</h3>
            <p className="text-gray-300 mb-6">
              As AI-generated content becomes increasingly sophisticated, the
              potential for misuse grows. Deepfakes can be used to spread
              misinformation, manipulate public opinion, and even commit fraud.
            </p>
            <p className="text-gray-300">
              Our mission is to develop and provide accessible tools that help
              individuals and organizations verify the authenticity of digital
              media, promoting truth and transparency in the digital age.
            </p>
          </div>
          <div className="bg-gray-900/60 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-emerald-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-10 w-10 text-emerald-400" />
                </div>
                <h4 className="font-semibold mb-2">Accuracy</h4>
                <p className="text-gray-400 text-sm">
                  Continuously improving our detection algorithms
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-blue-400" />
                </div>
                <h4 className="font-semibold mb-2">Protection</h4>
                <p className="text-gray-400 text-sm">
                  Safeguarding truth in digital media
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-purple-400" />
                </div>
                <h4 className="font-semibold mb-2">Education</h4>
                <p className="text-gray-400 text-sm">
                  Teaching people to identify manipulated content
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-10 w-10 text-red-400" />
                </div>
                <h4 className="font-semibold mb-2">Accessibility</h4>
                <p className="text-gray-400 text-sm">
                  Making detection tools available to everyone
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 rounded-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold">Our Commitment</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h4 className="font-semibold mb-2">Research</h4>
              <p className="text-gray-400 text-sm">
                Continuously advancing our detection capabilities through
                cutting-edge research and development.
              </p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h4 className="font-semibold mb-2">Transparency</h4>
              <p className="text-gray-400 text-sm">
                Being open about our methods and limitations while protecting
                our users' privacy.
              </p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <h4 className="font-semibold mb-2">Collaboration</h4>
              <p className="text-gray-400 text-sm">
                Working with researchers, organizations, and governments to
                combat the spread of deepfakes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
}