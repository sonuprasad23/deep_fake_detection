// components/Header.tsx
import React, { useState } from 'react';
// Remove useTheme import if you are not using the theme toggle button
// import { useTheme } from './ThemeProvider';
import { Menu, XIcon } from 'lucide-react'; // Removed Moon, Sun if unused

export function Header() {
  // Remove theme state if theme toggle is not used
  // const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gray-950/80 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Title Section */}
        <a href="#home" className="flex items-center space-x-3 rtl:space-x-reverse"> {/* Make logo clickable */}
          {/* Replace the div with an img tag */}
          <img
            src="https://i.ibb.co/994RpBZ2/Deep-Detector-Logo.png" // Assumes logo.png is in the public folder
            alt="Deepfake Detector Logo"
            className="h-10 w-15" // Adjust size as needed (h-8, h-10, etc.)
            // Optionally add object-contain if your logo isn't square:
            // className="h-10 w-auto object-contain"
          />
          <h1 className="text-xl font-bold text-white self-center whitespace-nowrap">
            Deepfake Detector App
          </h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8"> {/* Slightly adjust spacing maybe */}
          <a href="#home" className="text-gray-300 hover:text-white transition duration-200">
            Home
          </a>
          <a href="#about" className="text-gray-300 hover:text-white transition duration-200">
            About
          </a>
          <a href="#mission" className="text-gray-300 hover:text-white transition duration-200">
            Our Mission
          </a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition duration-200">
            Pricing
          </a>
          <a href="#contact" className="text-gray-300 hover:text-white transition duration-200">
            Contact
          </a>
          {/* Removed theme toggle button for simplicity, add back if needed */}
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
           {/* Optional: Add theme toggle back here if desired for mobile */}
           <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {/* Use transition classes for smoother open/close */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`} id="mobile-menu">
        <nav className="bg-gray-900/95 px-2 pt-2 pb-3 space-y-1 sm:px-3">
           {/* Mobile Links */}
           <a
            href="#home"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)} // Close menu on click
          >
            Home
          </a>
          <a
            href="#about"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </a>
           <a
            href="#mission"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Our Mission
          </a>
           <a
            href="#pricing"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </a>
           <a
            href="#contact"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}