import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoreInfo from "./pages/MoreInfo";
import Overview from "./pages/Overview";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/:machine_id/detail" element={<MoreInfo />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
