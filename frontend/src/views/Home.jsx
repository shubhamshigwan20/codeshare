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

  const handleTextChange = (event) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || currentPath === "/") {
      return;
    }

    setTextArea(event.target.value);

    socket.emit("send-data", {
      roomId: currentPath,
      message: event.target.value,
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
    if (currentPath === "/") {
      return;
    }

    const socket = io("http://localhost:80", { transports: ["websocket"] });
    socketRef.current = socket;

    const onConnect = () => {
      console.log("connected:", socket.id);
      socket.emit(
        "join-room",
        { roomId: currentPath, userName: socket.id },
        (ack) => {
          console.log("join ack", ack);
        },
      );
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
  }, [currentPath]);

  return (
    <div>
      <textarea
        rows="3"
        columns="4"
        value={textArea}
        onChange={handleTextChange}
      />
    </div>
  );
};

export default Home;
