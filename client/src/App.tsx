
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import NewPage from "./pages/MachinePage.tsx";
import OldPage from "./pages/OldPage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                
                <Route path="/" element={<NewPage />} />
                <Route path="/oldpageForTest" element={<OldPage />} />
                
            </Routes>
        </Router>
    );
};


export default App;
