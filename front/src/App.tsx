import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Summary from "./pages/dashboard/Dashboard";
import Category from "./pages/dashboard/Categories";
import type { JSX } from "react";
import Navbar from './components/layout/Navbar';
import Expenses from './pages/dashboard/Expenses';
import NotFound from './pages/NotFound';
import Incomes from './pages/dashboard/Incomes';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const {token} = useAuthContext();
    return token ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route
                        path='/'
                        element={
                            <ProtectedRoute>
                                <Navbar />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Summary />} />
                        <Route path="dashboard" element={<Summary />} />
                        <Route path="categories" element={<Category />} />
                        <Route path="expenses" element={<Expenses />} />
                        <Route path="incomes" element={<Incomes/>}/>
                       
                    </Route>

                   
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}


export default App;
