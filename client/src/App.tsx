import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MachineList from './pages/MachineList';
// import MachinePage from './pages/MachinePage';
import MachineDetail from "./pages/MachineDetail";




function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<MachineList />} />
          <Route path="/:machine_id/detail" element={<MachineDetail />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
