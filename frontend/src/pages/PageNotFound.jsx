import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
               
                <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
                <p className="text-2xl text-gray-700 mb-6">La page que vous cherchez est introuvable.</p>
                <p className="text-lg text-gray-500 mb-8">Il semble que la page que vous avez demandée n'existe pas ou a été déplacée.</p>

                <div className="flex justify-center gap-6">
                    <button 
                        onClick={handleGoHome} 
                        className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                    >
                        <FaHome className="inline mr-2" /> Retour à l'accueil
                    </button>

                    <button 
                        onClick={() => window.history.back()} 
                        className="px-6 py-3 bg-gray-300 text-black rounded-full shadow-lg hover:bg-gray-400 transition duration-300"
                    >
                        Retour à la page précédente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
