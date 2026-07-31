import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";
import PrivateRoute from "./PrivateRoute";
import Layout from "../components/layout/Layout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import DepartmentPage from "../pages/department/DepartmentPage";
import EmployeePage from "../pages/employee/EmployeePage";

export default function index() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 인증 필요 라우트 */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/departments" element={<DepartmentPage />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/inventory" element={<div>재고 관리(준비중)</div>} />
            <Route path="/orders" element={<div>발주 관리(준비중)</div>} />
            <Route path="/production" element={<div>생산 관리(준비중)</div>} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
