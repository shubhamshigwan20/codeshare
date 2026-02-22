import { useState, useEffect, useRef } from "react";
import api from "../../api/AxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import Header from "./components/header/Header";
import Editor from "./components/editor/Editor";
import Footer from "./components/footer/Footer";

type GenerateRoomResponse = {
  status: boolean;
  url: string;
};

type JoinRoomAck = {
  status: boolean;
  roomId?: string;
  roomData?: string;
  error?: string;
};

type ReceiveDataPayload = {
  message: string;
  from: string;
  at: number;
  roomId: string;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const socketRef = useRef<Socket | null>(null);
  const [textArea, setTextArea] = useState("");
  const roomId = useRef("");

  const getRoomId = async (): Promise<GenerateRoomResponse> => {
    const result = await api.get<GenerateRoomResponse>("/generateRoom");
    return result.data;
  };

  const handleTextChange = (value: string) => {
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
    roomId.current = currentPath.replace(/^\//, "");

    run();
  }, [currentPath, navigate]);

  useEffect(() => {
    if (!roomId || !backendUrl) {
      return;
    }

    const socket = io(backendUrl, { transports: ["websocket"] });
    socketRef.current = socket;

    const onConnect = () => {
      console.log("connected:", socket.id);
      socket.emit(
        "join-room",
        { roomId, userName: socket.id },
        (ack: JoinRoomAck) => {
          if (ack?.status) {
            setTextArea(ack.roomData ?? "");
          }
          console.log("join ack", ack);
        },
      );
    };

    const onReceiveData = (data: ReceiveDataPayload) => {
      setTextArea(data.message);
    };

    const onDisconnect = (reason: string) => {
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
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <Editor
        textArea={textArea}
        setTextArea={setTextArea}
        handleTextChange={handleTextChange}
      />
      <Footer />
    </div>
  );
};

export default Home;
