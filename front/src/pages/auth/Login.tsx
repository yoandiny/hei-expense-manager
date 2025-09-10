import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { login } from "../../services/authService";
import { loginSchema } from "../../utils/validators";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login: setToken } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            loginSchema.parse({ email, password });
            const res = await login(email, password);
            setToken(res.data.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-3xl font-bold text-green-700 text-center">Login</h2>

                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-green-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-green-700 font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-green-700">
                    Don't have an account?{" "}
                    <span
                        className="text-yellow-500 cursor-pointer hover:underline"
                        onClick={() => navigate("/signup")}
                    >
            Sign up
          </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
