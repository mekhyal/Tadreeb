import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";

import StudentHome from "./pages/student/StudentHome";
import StudentProfile from "./pages/student/StudentProfile";
import StudentApplications from "./pages/student/StudentApplications";

import CompanyRequestForm from "./pages/company/CompanyRequestForm";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyPrograms from "./pages/company/CompanyPrograms";
import CompanyParticipants from "./pages/company/CompanyParticipants";
import CompanyProfile from "./pages/company/CompanyProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminParticipants from "./pages/admin/AdminParticipants";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProfile from "./pages/admin/AdminProfile";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/company-request"
          element={
            <PublicOnlyRoute>
              <CompanyRequestForm />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/programs"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyPrograms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/participants"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyParticipants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/profile"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/programs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPrograms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/participants"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminParticipants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCompanies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;