
import React from 'react';

interface LoaderProps {
  message?: string;
  small?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message, small = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${small ? 'py-4' : 'py-12'}`}>
      <div className={`animate-spin rounded-full ${small ? 'h-8 w-8' : 'h-16 w-16'} border-b-2 border-purple-400`}></div>
      {message && <p className={`mt-4 text-gray-400 ${small ? 'text-sm' : 'text-lg'}`}>{message}</p>}
    </div>
  );
};

export default Loader;
