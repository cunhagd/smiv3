import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Supondo que este seja o componente do dashboard
import Spreadsheet from './Spreadsheet';

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