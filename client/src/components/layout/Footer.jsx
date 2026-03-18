import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p className="flex items-center justify-center gap-2">
            Made with <FaHeart className="text-red-500" /> for SocialHub
          </p>
          <p className="text-sm mt-2">© 2026 SocialHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;