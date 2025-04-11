// components/ContactSection.tsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Import the developer data structure if needed, or define it here
interface Developer {
    name: string;
    role: string;
    image: string;
    linkedin: string;
    github: string;
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Get Base API URL from Environment Variable ---
  // Fallback to the Hugging Face default port 7860 for local dev if not set
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7860';
  // ---

  const developers: Developer[] = [
    { name: 'Sonu Prasad', role: 'Lead Developer', image: 'https://i.ibb.co/h1dhH1Vz/sonuji.jpg', linkedin: 'https://www.linkedin.com/in/sonu-prasad23/', github: 'https://github.com/sonuprasad23/' },
    { name: 'Srushti Patwa', role: 'ML Engineer', image: 'https://i.ibb.co/v6TwNhb8/Srusht-img.jpg', linkedin: 'https://www.linkedin.com/in/srushti-patwa14/', github: 'https://github.com/srushti-21/' },
    { name: 'Gauri Pansare', role: 'AI Engineer', image: 'https://i.ibb.co/84XPdRcH/1733760879514.jpg', linkedin: 'https://www.linkedin.com/in/gauri-pansare-833a9a277/', github: 'https://github.com/' } // Placeholder Github
  ];

  const whatsappChannelUrl = "https://whatsapp.com/channel/0029Vb5jFRdG8l5CMM08Nj3M";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value, }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    const submissionToastId = toast.loading('Sending message...');

    // --- Construct the full API URL ---
    const contactApiUrl = `${API_BASE_URL}/contact-message`;
    console.log(`Submitting contact form to: ${contactApiUrl}`); // Debug log
    // ---

    try {
      const response = await fetch(contactApiUrl, { // Use constructed URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData),
      });

      const result = await response.json(); // Attempt to parse JSON always

      if (!response.ok) {
        // Use backend's error detail if available
        const errorMessage = result.detail || `Failed: ${response.statusText} (${response.status})`;
        console.error("API Error Response:", result);
        toast.error(`Failed to send message: ${errorMessage}`, { id: submissionToastId });
      } else {
        // Success
        toast.success(result.detail || 'Message sent successfully!', { id: submissionToastId });
        // Clear the form on success
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      // Network errors or failure to parse JSON
      console.error('Network or fetch error:', error);
      const message = error instanceof Error ? error.message : 'Network error or server unreachable';
      toast.error(`Failed to send message: ${message}`, { id: submissionToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Rest of the component JSX remains the same ---
  // Ensure input/textarea elements have 'disabled={isSubmitting}'
  // Ensure submit button shows Loader2 and is disabled when 'isSubmitting' is true

  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Connect With Us
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help.
          </p>
        </div>

        {/* Meet Our Team Section */}
        <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Meet Our Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {developers.map(dev => (
                <div key={dev.name} className="text-center bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-emerald-500/30 transition duration-300">
                    <div className="mb-4">
                    <img src={dev.image} alt={dev.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-emerald-500"/>
                    </div>
                    <h4 className="text-xl font-semibold mb-1">{dev.name}</h4>
                    <p className="text-gray-400 mb-3">{dev.role}</p>
                    <div className="flex justify-center space-x-4">
                    <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition duration-200" aria-label={`${dev.name}'s LinkedIn profile`}>LinkedIn</a>
                    {/* Conditionally render GitHub only if it's not the placeholder */}
                    {dev.github !== 'https://github.com/' && (
                        <a href={dev.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200" aria-label={`${dev.name}'s GitHub profile`}>GitHub</a>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* Contact Form and Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Contact Form */}
          <div>
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
              {/* Use the onSubmit handler */}
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input required type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:opacity-50" placeholder="Your name" disabled={isSubmitting}/>
                </div>
                {/* Email Field */}
                <div className="mb-4">
                   <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                   <input required type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:opacity-50" placeholder="your.email@example.com" disabled={isSubmitting}/>
                </div>
                {/* Subject Field */}
                <div className="mb-4">
                   <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject <span className="text-gray-500 text-xs">(Optional)</span></label>
                   <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:opacity-50" placeholder="How can we help?" disabled={isSubmitting}/>
                </div>
                {/* Message Field */}
                <div className="mb-6">
                   <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                   <textarea required id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:opacity-50" placeholder="Your message..." disabled={isSubmitting}/>
                </div>
                 {/* Submit Button */}
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <> <Loader2 size={20} className="animate-spin mr-2" /> <span>Sending...</span> </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Contact Info & Community */}
          <div>
            {/* Contact Info Box */}
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start">
                        <div className="bg-emerald-900/30 p-3 rounded-full mr-4 flex-shrink-0"><Mail className="h-6 w-6 text-emerald-400" /></div>
                        <div><h4 className="font-medium mb-1 text-white">Email</h4><a href="mailto:sonubab2222@gmail.com" className="text-gray-300 hover:text-emerald-400 break-all transition duration-200">sonubab2222@gmail.com</a></div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-start">
                        <div className="bg-blue-900/30 p-3 rounded-full mr-4 flex-shrink-0"><Phone className="h-6 w-6 text-blue-400" /></div>
                        <div><h4 className="font-medium mb-1 text-white">Phone</h4><a href="tel:+919879862820" className="text-gray-300 hover:text-blue-400 transition duration-200">+91-9879862820</a></div>
                    </div>
                    {/* Address */}
                    <div className="flex items-start">
                        <div className="bg-purple-900/30 p-3 rounded-full mr-4 flex-shrink-0"><MapPin className="h-6 w-6 text-purple-400" /></div>
                        <div><h4 className="font-medium mb-1 text-white">Address</h4><p className="text-gray-300">Vidya Pratishthan's College of Engineering<br />Baramati, Pune 413133<br />Maharashtra, India</p></div>
                    </div>
                </div>
            </div>
            {/* Community Section */}
            <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-xl border border-gray-800 p-8">
                <h3 className="text-xl font-bold mb-4">Join Our Community</h3>
                <p className="text-gray-300 mb-6">Stay updated and connect with others on our WhatsApp Channel.</p>
                <a href={whatsappChannelUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600/80 hover:bg-green-700 text-white p-3 rounded-lg flex items-center justify-center transition duration-200" aria-label="Join our WhatsApp Channel">
                    <Users size={20} className="mr-2" />
                    <span>Join WhatsApp Channel</span>
                </a>
            </div>
          </div>
        </div>

        {/* Follow Project Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 p-8 mt-16">
            <h3 className="text-xl font-bold mb-4 flex items-center"><Github className="mr-2" /> Follow Our Project</h3>
            <p className="text-gray-300 mb-6">Stay up to date with our latest developments and contribute to our open-source project on GitHub.</p>
            <a href="https://github.com/sonuprasad23" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition duration-200" aria-label="Follow Deepfake Detector project on GitHub">
                <Github className="mr-2" /> Follow on GitHub
            </a>
        </div>
      </div>
    </section>
  );
}