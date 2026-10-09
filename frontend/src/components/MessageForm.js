import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import "./MessageForm.css";

function MessageForm() {
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        setMessages(roomMessages);
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (!message.trim()) return;
        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const date = `${month}/${day}/${now.getFullYear()}`;
        socket.emit("message-room", currentRoom, message, user, time, date);
        setMessage("");
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                {user && !privateMemberMsg?._id && <span># {currentRoom}</span>}
                {user && privateMemberMsg?._id && (
                    <span className="chat-header-dm">
                        <img src={privateMemberMsg.picture} alt={privateMemberMsg.name} />
                        {privateMemberMsg.name}
                    </span>
                )}
            </div>

            <div className="messages-output">
                {!user && <p className="no-auth">🔒 Please login to view messages</p>}

                {user && messages.map(({ _id: date, messagesByDate }, idx) => (
                    <div key={idx}>
                        <div className="date-divider"><span>{date}</span></div>
                        {messagesByDate?.map(({ content, time, from: sender }, msgIdx) => {
                            const isOwn = sender?.email === user?.email;
                            return (
                                <div className={`msg-wrap ${isOwn ? "own" : "other"}`} key={msgIdx}>
                                    <img src={sender.picture} className="msg-avatar" alt={sender.name} />
                                    <div className="msg-body">
                                        <span className="msg-meta">
                                            {isOwn ? "You" : sender.name}
                                            <span className="msg-time">{time}</span>
                                        </span>
                                        <div className="msg-bubble">{content}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <form className="chat-input-bar" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder={user ? `Message #${currentRoom}…` : "Login to send messages"}
                    disabled={!user}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!user}>
                    <i className="fas fa-paper-plane" />
                </button>
            </form>
        </div>
    );
}

export default MessageForm;