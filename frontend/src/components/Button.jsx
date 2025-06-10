import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
    return (
        <button 
            onClick={onClick}
            type={type}
            className={`px-6 py-3 border-2 border-[#40A0BC] rounded-full hover:bg-[#40A0BC] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-0 text-lg font-medium ${className}`}
        >
            {children}
        </button>
    );
};

export default Button; 