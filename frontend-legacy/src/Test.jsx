import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Test = () => {
  const socket = io("http://localhost:80");

  useEffect(() => {
    // server-side
    socket.on("connection", (socket) => {
      console.log(socket.id);
    });

    // client-side
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit(
        "join-room",
        {
          params: { roomId: "room-1" },
          body: { userName: "Shubham" },
        },
        (ack) => {
          console.log("ack", ack);
        },
      );
    });

    socket.on("disconnect", (reason) => {
      console.log("disconnect reasone", reason);
      console.log(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Test</div>;
};

export default Test;
