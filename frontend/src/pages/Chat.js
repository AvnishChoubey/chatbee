import React from "react";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";
import "./Chat.css";

function Chat() {
    return (
        <div className="chat-layout">
            <div className="chat-sidebar">
                <Sidebar />
            </div>
            <div className="chat-main">
                <MessageForm />
            </div>
        </div>
    );
}

export default Chat;