import React from 'react';
import { Home, Activity, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 w-full fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4"> {/* Ensure the container takes full width */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Prophet
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
              <span>Markets</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;