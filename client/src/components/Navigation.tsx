import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
    return (
        <nav className="flex gap-4 mt-4">
            <Link to="/" className="text-purple-800 underline">
                Main Page
            </Link>
            <Link to="/oldpageForTest" className="text-purple-800 underline">
            oldpageForTest
            </Link>
        </nav>
    );
};

export default Navigation;