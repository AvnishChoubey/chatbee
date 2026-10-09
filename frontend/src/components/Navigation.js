import React from "react";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navigation.css";

function Navigation() {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);
        window.location.replace("/");
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src={logo} alt="ChatBee" className="navbar-logo" />
                <span>ChatBee</span>
            </Link>
            <div className="navbar-links">
                {!user && <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-btn">Sign Up</Link>
                </>}
                {user && <>
                    <Link to="/chat" className="nav-link">Chat</Link>
                    <div className="nav-user">
                        <img src={user.picture} alt={user.name} className="nav-avatar" />
                        <span>{user.name}</span>
                        <button className="nav-logout" onClick={handleLogout}>Logout</button>
                    </div>
                </>}
            </div>
        </nav>
    );
}

export default Navigation;