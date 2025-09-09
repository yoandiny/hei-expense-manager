import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

// Pages Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Pages Dashboard
import Summary from "./pages/dashboard/Dashboard";
import Category from "./pages/dashboard/Categories";
import type {JSX} from "react";
import Expenses from './pages/dashboard/Expenses';

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
                                <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 gap-12">
                                    <Category />
                                    <Expenses/>
                                    {/* <Summary />
                                     */}
                                </div>
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
