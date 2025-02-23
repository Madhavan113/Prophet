import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const commonStyle = {
    fontFamily: "'Avenir Next LT Pro', sans-serif",
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  };

  return (
    <nav className="bg-black border-b border-gray-700 w-full fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Smaller Lambda PROPHET. Logo (Bold + White) */}
          <Link
            to="/"
            className="flex items-center space-x-1"
            style={commonStyle}
          >
            <span
              className="text-white font-mono"
              style={{
                fontSize: '24px', // Larger size for the lambda
                fontWeight: 'bold',
                marginRight: '4px', // Space between lambda and text
                lineHeight: '1', // Aligns lambda with the text
              }}
            >
              λ
            </span>
            <span
              className="tracking-[0.2em] typewriter"
              style={{
                overflow: 'hidden', // Ensures the text doesn't overflow
                whiteSpace: 'nowrap', // Keeps the text in one line
                borderRight: '2px solid white', // Cursor effect
                animation: 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
              }}
            >
              PROPHET.
            </span>
          </Link>

          {/* Middle - Markets tab (Bold + White) */}
          <Link
            to="/markets"
            className="hover:opacity-80"
            style={commonStyle}
          >
            Markets
          </Link>

          {/* Right side - Profit (Bold + White) */}
          <Link
            to="/about"
            className="hover:opacity-80"
            style={commonStyle}
          >
            Portfolio
          </Link>

          {/* Right side - Login Button (Styled with border and padding) */}
          <Link
            to="/login"
            className="hover:opacity-80"
            style={{
              ...commonStyle,
              padding: '8px 16px', // Added padding
              border: '1px solid white', // Added border
              borderRadius: '4px', // Rounded corners
            }}
          >
            Login
          </Link>
        </div>
      </div>

      {/* Add CSS for the typewriter animation */}
      <style>
        {`
          @keyframes typing {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }

          @keyframes blink-caret {
            from, to {
              border-color: transparent;
            }
            50% {
              border-color: white;
            }
          }

          .typewriter {
            display: inline-block;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
