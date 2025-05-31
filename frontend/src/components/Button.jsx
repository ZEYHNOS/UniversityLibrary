import React from 'react';

const Button = ({ children, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="w-full px-6 py-3 bg-white text-lg font-medium text-[#40A0BC] border-2 border-[#40A0BC] rounded-full hover:bg-[#40A0BC] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-0"
        >
            {children}
        </button>
    );
};

export default Button; 