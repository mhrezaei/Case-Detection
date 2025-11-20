
import React from 'react';

const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer className={`py-6 text-center text-xs text-gray-400 dark:text-gray-500 ${className}`}>
      <p className="mb-1">کلیه حقوق این محصول محفوظ است</p>
      <p className="flex items-center justify-center gap-1">
        قدرت گرفته از
        <a
          href="https://www.quarkino.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-600 font-bold transition-colors"
        >
          کوارکینو
        </a>
      </p>
    </footer>
  );
};

export default Footer;
