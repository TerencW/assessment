
import './App.css';
import CafeList from './pages/cafe/cafelist';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EmployeeList from './pages/employee/employeelist';
import CafeForm from './pages/cafe/cafeform';
import EmployeeForm from './pages/employee/employeeform';


function App() {
  return (
      <Router>
        <div className="App">
          <h1>Welcome to the Employee Cafe App</h1>

          {/* Navigation Links */}
          <nav>
            <ul>
              <li>
                <Link to="/">Cafe Info</Link>
              </li>
              <li>
                <Link to="/employees">Employee Info</Link>
              </li>
            </ul>
          </nav>

            <Routes>
            {/* Route for the Employee Information page */}
            <Route path="/" element={<CafeList />} />

            {/* Route for the Product Information page */}
         <Route path="/employees" element={<EmployeeList />} /> 
         <Route path="/employee" element={<EmployeeForm /> } />
         <Route path="/cafe" element={<CafeForm />} />
   
          </Routes>
        </div>
      </Router>
  );
}

export default App;
