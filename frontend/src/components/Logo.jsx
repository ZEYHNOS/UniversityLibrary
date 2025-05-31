import React from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityLibraryLogo from '../assets/UniversityLibrary_FontLogo.png';

const Logo = () => {
    const navigate = useNavigate();
    
    return (
        <div className="flex items-center justify-center">
            <img 
                src={UniversityLibraryLogo} 
                alt="University Library Logo" 
                className="h-64 object-contain"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default Logo; 