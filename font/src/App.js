import React from 'react'
import { Container } from 'react-bootstrap';
import Signup from './components/Signup';
import Edit from './components/Editprofile';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AuthProvider from './contexts/AuthContext';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import PrivateRouteDashboard from './components/PrivateRouteDashboard'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{maxWidth:"500px"}}>
        <Router>
        <AuthProvider>
          <Routes>
            <Route  path="/signup" element={<Signup/>}></Route>
            <Route  path="/signin" element={<Signin/>}></Route>
            <Route  path="/edit" element={<Edit/>}></Route>
            <Route  path="/" element={<PrivateRouteDashboard/>}></Route>
          </Routes>
        </AuthProvider>
        </Router>
      </div>
    </Container>
);
}

export default App;