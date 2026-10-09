import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

const ROOM_ICONS = { General: "💬", Techtalks: "💻", TeamWorks: "🤝", Crypto: "₿" };

function Sidebar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);

    function joinRoom(room, isPublic = true) {
        if (!user) return alert("Please login");
        socket.emit("join-room", room, currentRoom);
        setCurrentRoom(room);
        if (isPublic) setPrivateMemberMsg(null);
        dispatch(resetNotifications(room));
    }

    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom !== room) dispatch(addNotifications(room));
    });

    useEffect(() => {
        if (user) {
            setCurrentRoom("general");
            getRooms();
            socket.emit("join-room", "general");
            socket.emit("new-user");
        }
    }, [getRooms, setCurrentRoom, socket, user]);

    socket.off("new-user").on("new-user", (payload) => setMembers(payload));

    const getRooms = useCallback(() => {
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3000"}/rooms`)
            .then((res) => res.json())
            .then((data) => setRooms(data));
    });

    useEffect(() => {
        getRooms();
    }, [getRooms]);

    function orderIds(id1, id2) {
        return id1 > id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
    }

    function handlePrivateMemberMsg(member) {
        setPrivateMemberMsg(member);
        joinRoom(orderIds(user._id, member._id), false);
    }

    if (!user) return null;

    return (
        <div className="sidebar">
            <div className="sidebar-section">
                <p className="sidebar-label">Rooms</p>
                {rooms.map((room, idx) => (
                    <button
                        key={idx}
                        className={`sidebar-item ${room === currentRoom ? "active" : ""}`}
                        onClick={() => joinRoom(room)}
                    >
                        <span className="room-icon">{ROOM_ICONS[room] || "💬"}</span>
                        <span className="room-name">{room}</span>
                        {user.newMessages[room] && currentRoom !== room && (
                            <span className="notif-badge">{user.newMessages[room]}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="sidebar-section">
                <p className="sidebar-label">Members — {members.length}</p>
                {members.map((member) => (
                    <button
                        key={member._id}
                        className={`sidebar-item member-item ${privateMemberMsg?._id === member?._id ? "active" : ""}`}
                        onClick={() => handlePrivateMemberMsg(member)}
                        disabled={member._id === user._id}
                    >
                        <div className="member-avatar-wrap">
                            <img src={member.picture} className="member-avatar" alt={member.name} />
                            <span className={`status-dot ${member.status === "online" ? "online" : "offline"}`} />
                        </div>
                        <span className="member-name">
                            {member.name}{member._id === user._id && " (You)"}
                        </span>
                        {user.newMessages[orderIds(member._id, user._id)] && (
                            <span className="notif-badge">{user.newMessages[orderIds(member._id, user._id)]}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;