
import './App.css';
import CafeList from './pages/cafe/cafelist';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import EmployeeList from './pages/employee/employeelist';
import CafeForm from './pages/cafe/cafeform';
import EmployeeForm from './pages/employee/employeeform';
import { Layout } from "antd";
import React, { useState } from "react";
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Navbar from './component/navbar';



const App = () => {

  const location = useLocation(); // Get current route path
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  return (

    <Layout>
      <Header style={{ background: "#1890ff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Navbar />
      </Header>


      <Content style={{ padding: "50px" }}>
        <Routes>
          <Route path="/" element={<CafeList />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employee" element={<EmployeeForm />} />
          <Route path="/cafe" element={<CafeForm />} />

        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}>Cafe Management React ©2025</Footer>
    </Layout>

  );
}

export default App;
