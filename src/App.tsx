import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/spreadsheet" element={<Spreadsheet />} />
      </Routes>
    </Router>
  );
}

export default App;