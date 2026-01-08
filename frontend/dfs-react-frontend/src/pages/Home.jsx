import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FishTank from '../components/fish/FishTank';
import LoginForm from '../components/common/LoginForm';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="w-full h-full relative">
            {isAuthenticated ? (
                <FishTank />
            ) : (
                <LoginForm />
            )}
        </div>
    );
};

export default Home;