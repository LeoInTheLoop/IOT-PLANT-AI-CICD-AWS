import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import MachineList from "./pages/MachineList";
// import MachinePage from './pages/MachinePage';
// import MachineDetail from "./pages/MachineDetail";
import MoreInfo from "./pages/MoreInfo";
import Overview from "./pages/Overview";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/:machine_id/detail" element={<MoreInfo />} />
          {/* change this to /:machine_id/detail */}

          {/* /* <Route path="/" element={<MachineList />} /> */}
          {/* <Route path="/:machine_id/detail" element={<MachineDetail />} />  */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
