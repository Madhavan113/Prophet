import React from 'react';
import { Home, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 w-full fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Prophet with white-to-pink gradient */}
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-white to-pink-500 bg-clip-text text-transparent"
            style={{
              WebkitTextFillColor: 'transparent', // Ensures the gradient is visible
              textDecoration: 'none', // Removes default link styling
            }}
          >
            Prophet
          </Link>

          {/* Middle - Markets tab */}
          <Link
            to="/markets"
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
            style={{
              WebkitTextFillColor: 'transparent', // Forces the text to be transparent
              textDecoration: 'none', // Removes default link styling
            }}
          >
            Markets
          </Link>

          {/* Right side - Profit with green-to-teal gradient */}
          <Link
            to="/about"
            className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-600 bg-clip-text text-transparent"
            style={{
              WebkitTextFillColor: 'transparent', // Forces the text to be transparent
              textDecoration: 'none', // Removes default link styling
            }}
          >
            Profit
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
