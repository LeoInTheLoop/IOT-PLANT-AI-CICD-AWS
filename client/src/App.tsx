
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


// import NewPage from "./pages/MachinePage.tsx";
// import OldPage from "./pages/OldPage.tsx";

// const App: React.FC = () => {
//     return (
//         <Router>
//             <Routes>
                
//                 <Route path="/" element={<NewPage />} />
//                 <Route path="/oldpageForTest" element={<OldPage />} />
                
//             </Routes>
//         </Router>
//     );
// };


// export default App;

// import React from 'react';
import MachinePage from './pages/MachinePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MachinePage />
    </div>
  );
}

export default App;
