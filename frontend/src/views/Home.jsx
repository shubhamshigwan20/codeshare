import React, { useEffect, useRef } from "react";
import api from "../api/AxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const socketRef = useRef(null);

  const getRoomId = async () => {
    const result = await api.get("/generateRoom");
    return result.data;
  };

  const handleSendMsg = () => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || currentPath === "/") {
      return;
    }

    socket.emit("send_ping", { roomId: currentPath, message: "ping" });
  };

  useEffect(() => {
    const run = async () => {
      if (currentPath !== "/") {
        return;
      }

      try {
        const data = await getRoomId();
        navigate(data.url);
      } catch (error) {
        console.error("Failed to fetch room id:", error);
      }
    };

    run();
  }, [currentPath, navigate]);

  useEffect(() => {
    if (currentPath === "/") {
      return;
    }

    const socket = io("http://localhost:80", { transports: ["websocket"] });
    socketRef.current = socket;

    const onConnect = () => {
      console.log("Connected:", socket.id);
      socket.emit(
        "join-room",
        { roomId: currentPath, userName: "Shubham" },
        (ack) => {
          console.log("join ack", ack);
        }
      );
    };

    const onReceivePing = (data) => {
      console.log("Ping received", data);
    };

    const onDisconnect = (reason) => {
      console.log("Disconnected:", reason);
    };

    socket.on("connect", onConnect);
    socket.on("receive_ping", onReceivePing);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_ping", onReceivePing);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentPath]);

  return (
    <div>
      <button onClick={handleSendMsg}>PING</button>
    </div>
  );
};

export default Home;
