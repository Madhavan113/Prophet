import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);
      setMessage('✅ Login Successful! You can now access your portfolio.');
    } catch (err) {
      setMessage('❌ Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen w-full bg-black flex items-center justify-center">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 w-96 border border-purple-500/20">
        <div className="flex flex-col items-center justify-center mb-8">
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Prophet
          </span>
          <span className="mt-1 text-lg text-gray-300">Login</span>
        </div>

        {message && (
          <p className={`text-center mb-4 ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-white px-2 py-1 rounded-md"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm text-gray-300 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300">
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
