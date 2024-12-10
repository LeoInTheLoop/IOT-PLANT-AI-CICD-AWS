import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// const App: React.FC = () => {
//     return (
//         <Router>
//             <Routes>

//             </Routes>
//         </Router>
//     );
// };

// export default App;

// import React from 'react';
import MachinePage from "./pages/MachinePage";

import OldPage from "./pages/OldPage.tsx";
import LineChartPage from "./pages/LineChartPage.tsx";
import MachineList from "./pages/MachineList.tsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<MachinePage />} />
          <Route path="/machinelist" element={<MachineList />} />
          <Route path="/oldpageForTest" element={<OldPage />} />
          <Route path="/:id/linechart" element={<LineChartPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
