import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import UserProfile from "./pages/UserProfile";
import ContactForm from "./pages/ContactForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/studentdash" element={<StudentDashboard />} />
          <Route path="/facultydash" element={<FacultyDashboard />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/contact" element={<ContactForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
