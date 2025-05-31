import React from 'react';

const Input = ({ label, type = 'text', value, onChange, required = false }) => {
    return (
        <div className="w-full">
            <label className="block text-gray-700 text-sm font-medium mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#40A0BC] text-gray-700"
            />
        </div>
    );
};

export default Input; 