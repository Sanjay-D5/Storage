import { Route, Routes } from 'react-router-dom';
import './App.css';
import AuthLayout from './auth/AuthLayout';
import Home from './components/Home';

import Dashboard from './pages/Dashboard';
import Pages from './pages/Pages';



function App() {
  return (
    
    <Routes> 
      <Route path='/' element={<AuthLayout initialFormType="sign-in" />}> 
        <Route path='signin' element={<AuthLayout initialFormType="sign-in" />} /> 
        <Route path='signup' element={<AuthLayout initialFormType="sign-up" />} /> 
      </Route> 
      <Route path="home" element={<Home />}> 
        <Route path='dashboard' element={<Dashboard />} /> 
        <Route path=':type' element={<Pages />} /> {/* Route with media type parameter */} 
      </Route> 
    </Routes>
    
  );
}

export default App;
