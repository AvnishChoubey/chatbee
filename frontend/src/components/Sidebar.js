import React, { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

const ROOM_ICONS = {
  General: "💬",
  Techtalks: "💻",
  TeamWorks: "🤝",
  Crypto: "₿",
};

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function Sidebar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);

  const getRooms = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/rooms`);

      if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.status}`);
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, [setRooms]);

  const joinRoom = useCallback(
    (room, isPublic = true) => {
      if (!user) {
        alert("Please login");
        return;
      }

      if (!socket) {
        console.error("Socket connection is unavailable.");
        return;
      }

      socket.emit("join-room", room, currentRoom);
      setCurrentRoom(room);

      if (isPublic) {
        setPrivateMemberMsg(null);
      }

      dispatch(resetNotifications(room));
    },
    [user, socket, currentRoom, setCurrentRoom, setPrivateMemberMsg, dispatch],
  );

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  useEffect(() => {
    if (!user || !socket) {
      return undefined;
    }

    setCurrentRoom("general");
    socket.emit("join-room", "general");
    socket.emit("new-user");

    return undefined;
  }, [user, socket, setCurrentRoom]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleNotifications = (room) => {
      if (currentRoom !== room) {
        dispatch(addNotifications(room));
      }
    };

    const handleNewUser = (payload) => {
      setMembers(payload);
    };

    socket.on("notifications", handleNotifications);
    socket.on("new-user", handleNewUser);

    return () => {
      socket.off("notifications", handleNotifications);
      socket.off("new-user", handleNewUser);
    };
  }, [socket, currentRoom, dispatch, setMembers]);

  function orderIds(id1, id2) {
    return id1 > id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  }

  const handlePrivateMemberMsg = useCallback(
    (member) => {
      if (!user) {
        alert("Please login");
        return;
      }

      setPrivateMemberMsg(member);
      joinRoom(orderIds(user._id, member._id), false);
    },
    [user, setPrivateMemberMsg, joinRoom],
  );

  if (!user) {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <p className="sidebar-label">Rooms</p>

        {rooms.map((room) => (
          <button
            key={room}
            type="button"
            className={`sidebar-item ${room === currentRoom ? "active" : ""}`}
            onClick={() => joinRoom(room)}
          >
            <span className="room-icon">{ROOM_ICONS[room] || "💬"}</span>

            <span className="room-name">{room}</span>

            {user.newMessages?.[room] && currentRoom !== room && (
              <span className="notif-badge">{user.newMessages[room]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Members — {members.length}</p>

        {members.map((member) => {
          const privateRoomId = orderIds(member._id, user._id);
          const unreadMessages = user.newMessages?.[privateRoomId];

          return (
            <button
              key={member._id}
              type="button"
              className={`sidebar-item member-item ${
                privateMemberMsg?._id === member._id ? "active" : ""
              }`}
              onClick={() => handlePrivateMemberMsg(member)}
              disabled={member._id === user._id}
            >
              <div className="member-avatar-wrap">
                <img
                  src={member.picture}
                  className="member-avatar"
                  alt={member.name || "Member"}
                />

                <span
                  className={`status-dot ${
                    member.status === "online" ? "online" : "offline"
                  }`}
                />
              </div>

              <span className="member-name">
                {member.name}
                {member._id === user._id && " (You)"}
              </span>

              {unreadMessages && (
                <span className="notif-badge">{unreadMessages}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
