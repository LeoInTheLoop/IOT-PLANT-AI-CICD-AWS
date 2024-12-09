import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
    return (
        <nav className="flex gap-4 mt-4">
            <Link to="/" className="text-purple-800 underline">
                Main Page
            </Link>
            <Link to="/newpage" className="text-purple-800 underline">
                New Page
            </Link>
        </nav>
    );
};

export default Navigation;