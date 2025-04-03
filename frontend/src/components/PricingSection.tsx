import React from 'react';
import { Check, X, Zap } from 'lucide-react';
import { toast } from 'sonner';
export function PricingSection() {
  const handleProClick = () => {
    toast.info('We are working on this feature. It will be available soon!');
  };
  const handleSalesClick = () => {
    toast.info('Our sales team will be ready to assist you soon!');
  };
  return <section id="pricing" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the right plan for your deepfake detection needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-6">
                Basic detection for casual users
              </p>
              <button className="w-full py-2 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition">
                Get Started
              </button>
            </div>
            <div className="border-t border-gray-800 p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Basic detection model</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>10 scans per day</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Standard results</span>
                </li>
                <li className="flex items-center text-gray-500">
                  <X size={18} className="text-gray-500 mr-2" />
                  <span>Advanced detection</span>
                </li>
                <li className="flex items-center text-gray-500">
                  <X size={18} className="text-gray-500 mr-2" />
                  <span>Detailed analysis</span>
                </li>
                <li className="flex items-center text-gray-500">
                  <X size={18} className="text-gray-500 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-emerald-900/20 to-blue-900/20 rounded-xl border border-emerald-500/50 overflow-hidden shadow-lg relative">
            <div className="absolute top-0 right-0 bg-emerald-500 text-xs font-bold uppercase py-1 px-3 text-emerald-900">
              Popular
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">
                Advanced detection for professionals
              </p>
              <button onClick={handleProClick} className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center">
                <Zap size={18} className="mr-2" />
                Get Pro
              </button>
            </div>
            <div className="border-t border-emerald-800/30 p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Advanced detection model</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>100 scans per day</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Detailed results</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Advanced detection</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Detailed analysis</span>
                </li>
                <li className="flex items-center text-gray-500">
                  <X size={18} className="text-gray-500 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Enterprise Plan */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-400 mb-6">
                Complete solution for organizations
              </p>
              <button onClick={handleSalesClick} className="w-full py-2 px-4 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-900/20 transition">
                Contact Sales
              </button>
            </div>
            <div className="border-t border-gray-800 p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Premium detection model</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Unlimited scans</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Comprehensive results</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Advanced detection</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>Detailed analysis</span>
                </li>
                <li className="flex items-center">
                  <Check size={18} className="text-emerald-500 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Need a Custom Solution?</h3>
            <p className="text-gray-300">
              Contact our sales team to discuss custom plans tailored to your
              organization's needs
            </p>
          </div>
          <div className="flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition">
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </section>;
}