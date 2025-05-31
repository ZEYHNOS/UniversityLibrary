import React from 'react';

const Select = ({ label, value, onChange, options, required = false }) => {
    return (
        <div className="w-full">
            <label className="block text-gray-700 text-sm font-medium mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#40A0BC] text-gray-700 bg-white"
            >
                <option value="">선택해주세요</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select; 