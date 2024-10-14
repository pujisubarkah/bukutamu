import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/id';
import IndexGuests from './components/IndexGuests.js';
import Dashboard from './components/Dashboard.js';
import DashboardBukuTamu from './components/DashboardBukuTamu.js';
import Login from './components/Login.js';
import DashboardAttendance from './components/DashboardAttendance.js';

function App() {

  
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/bukutamu' element={<DashboardBukuTamu />} />
        <Route path='/dashboard/bukutamu/:id' element={<IndexGuests />} />  
        <Route path='/dashboard/attendance' element={<DashboardAttendance />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App;
