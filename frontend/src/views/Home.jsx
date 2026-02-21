import React, { useEffect } from "react";
import api from "../api/AxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getRoomId = async () => {
    const result = await api.get("/generateRoom");
    return result.data;
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
  }, [currentPath]);

  return <div>Home</div>;
};

export default Home;
