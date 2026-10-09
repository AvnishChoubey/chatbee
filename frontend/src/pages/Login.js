import React, { useContext, useState } from "react";
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);
    const [loginUser, { isLoading, error }] = useLoginUserMutation();

    function handleLogin(e) {
        e.preventDefault();
        loginUser({ email, password }).then(({ data }) => {
            if (data) {
                socket.emit("new-user");
                navigate("/chat");
            }
        });
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-sub">Sign in to continue to ChatBee</p>
                {error && <div className="auth-error">{error.data}</div>}
                <form onSubmit={handleLogin} className="auth-form">
                    <label>Email</label>
                    <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Password</label>
                    <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="auth-btn" disabled={isLoading}>
                        {isLoading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
                <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    );
}

export default Login;