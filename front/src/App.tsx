import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

// Pages Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Pages Dashboard
import Summary from "./pages/dashboard/Dashboard";
import Category from "./pages/dashboard/Categories";
import type { JSX } from "react";
import Navbar from './components/layout/Navbar';

// Route protégée
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { token } = useAuthContext();
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Pages publiques */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Pages protégées */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Navbar />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Summary />} />
                        <Route path="categories" element={<Category />} />
                    </Route>

                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
