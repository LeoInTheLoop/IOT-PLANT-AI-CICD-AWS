import React from "react";
import '../styles/Navigation.css';
import dashboardIcon from '../assets/nav-icon.png'; // 导入图片

const Navigation: React.FC = () => {
    return (
        <nav className="nav">
            <h3 className="nav-title">
                <img
                    src={dashboardIcon}
                    alt="Dashboard Icon"
                    className="nav-icon"
                />
                Dashboard
            </h3>
            {/* <ul className="nav-list">
                <li className="nav-item">test</li>
                <li className="nav-item">test</li>
                <li className="nav-item">test</li>
                <li className="nav-item">test</li>
            </ul> */}
        </nav>
    );
};

export default Navigation;
