import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MachineList from './pages/MachineList';
import MachinePage from './pages/MachinePage';
// import MachinePage from "./pages/MachinePage";
// import MachineList from "./pages/MachineList.tsx";

import LineChartPage from "./pages/LineChartPage.tsx";


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<MachineList />} />
          <Route path="/:id/detail" element={<MachinePage />} />
          <Route path="/:id/linechart" element={<LineChartPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
