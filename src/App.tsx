
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Spreadsheet from './pages/Spreadsheet';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spreadsheet" element={<Spreadsheet />} />
      </Routes>
    </Router>
  );
}

export default App;
