import Navigation from ".././components/Navigation.tsx";
import { Link } from "react-router-dom";

const MachinePage = () => {
    return (
        <div>
            <Navigation />
            <h1>Welcome to the New Page</h1>
            <p>This is a new page in your application.</p>
            <p> use this page to should overal machine status </p>
            <p> and this link should linechart of one machine prarms  </p><Link to="/" className="text-purple-800 underline"></Link>
        </div>
    );
};

export default MachinePage;