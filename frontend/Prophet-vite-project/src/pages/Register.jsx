import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  
    return (
      <div className="fixed inset-0 min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 w-96 border border-purple-500/20">
          <div className="flex flex-col items-center justify-center mb-8">
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Prophet
            </span>
            <span className="mt-1 text-lg text-gray-300">Music Prediction Login</span>
          </div>
  
          <form className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
  
            {/* Password Field with Show/Hide Toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-3/4 px-3 py-2 pr-12 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-white focus:outline-none bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-md"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

          {/* Sign Up Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
            >
              Sign Up
            </button>
          </div>

          {/* Already Have an Account? */}
          <div className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
              Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
