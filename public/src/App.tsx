import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import PermissionRoute from "./components/Auth/PermissionRoute";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthenticatedLayout from "./components/Layouts/AuthenticatedLayout";
import { AuthProvider } from "./contexts/AuthContext";
import GaragePage from "./pages/GaragePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import LeadsPage from "./pages/LeadsPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentDetailsPage from "./pages/PaymentDetailsPage";
import PointsPage from "./pages/PointsPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import ForgotPassword from "./pages/ForgotPassword";
import SidebarPreviewPage from "./pages/SidebarPreviewPage";
import CollaboratorsPage from "./pages/CollaboratorsPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import RelatoryPage from "./pages/RelatoryPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/pontos" element={<PointsPage />} />
          <Route path="/preview" element={<AuthenticatedLayout />}>
            <Route index element={<SidebarPreviewPage />} />
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route element={<PermissionRoute permission="garagem" />}>
                <Route path="/garagem" element={<GaragePage />} />
              </Route>
              <Route element={<PermissionRoute permission="leads" />}>
                <Route path="/leads" element={<LeadsPage />} />
              </Route>
              <Route element={<PermissionRoute permission="notificacoes" />}>
                <Route path="/notificacoes" element={<NotificationsPage />} />
              </Route>
              <Route element={<PermissionRoute permission="colaboradores" />}>
                <Route path="/colaboradores" element={<CollaboratorsPage />} />
              </Route>
              <Route element={<PermissionRoute permission="configuracoes" />}>
                <Route path="/configuracoes" element={<SettingsPage />} />
              </Route>
              <Route element={<PermissionRoute permission="relatorio" />}>
                <Route path="/relatorio-transacoes" element={<RelatoryPage />} />
              </Route>
              <Route element={<PermissionRoute permission="detalhes_pagamento" />}>
                <Route path="/detalhes-pagamento" element={<PaymentDetailsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
