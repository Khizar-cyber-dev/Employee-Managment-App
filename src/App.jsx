import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Provider store={store}>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;