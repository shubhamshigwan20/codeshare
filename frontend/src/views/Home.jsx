import React, { useState, useEffect, useRef } from "react";
import api from "../api/AxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const socketRef = useRef(null);
  const [textArea, setTextArea] = useState("");

  const getRoomId = async () => {
    const result = await api.get("/generateRoom");
    return result.data;
  };

  const roomId = currentPath.replace(/^\//, "");

  const handleTextChange = (event) => {
    const value = event.target.value;
    setTextArea(value);

    const socket = socketRef.current;
    if (!socket || !socket.connected || !roomId) {
      return;
    }

    socket.emit("send-data", {
      roomId,
      message: value,
    });
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
    if (!roomId) {
      return;
    }

    const socket = io("http://localhost:80", { transports: ["websocket"] });
    socketRef.current = socket;

    const onConnect = () => {
      console.log("connected:", socket.id);
      socket.emit("join-room", { roomId, userName: socket.id }, (ack) => {
        if (ack?.status) {
          setTextArea(ack.roomData ?? "");
        }
        console.log("join ack", ack);
      });
    };

    const onReceiveData = (data) => {
      setTextArea(data.message);
    };

    const onDisconnect = (reason) => {
      console.log("Disconnected:", reason);
    };

    socket.on("connect", onConnect);
    socket.on("receive-data", onReceiveData);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive-data", onReceiveData);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  return (
    <div>
      <textarea
        rows="3"
        cols="4"
        value={textArea}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default Home;
