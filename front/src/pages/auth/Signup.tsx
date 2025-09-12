import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { signup } from "../../services/authService";
import { signupSchema } from "../../utils/validators";
import {ToastContainer, toast} from "react-toastify";

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { login: setToken } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            signupSchema.parse({ email, password });
            const res = await signup(email, password);
            setToken(res.data.token);
             toast.success("Signup successful!");
            navigate("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center">Sign Up</h2>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            placeholder="Your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-700">
                    Already have an account?{" "}
                    <span
                        className="text-amber-500 cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
          Login
        </span>
                </p>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default Signup;
