import { Cloud, CloudOff } from "lucide-react";

const StatusBar = ({ status = false }) => {
  return (
    <div className="w-screen h-[4vh] bg-(--primary) flex items-center justify-start">
      <div className="mx-5 flex items-center">
        {status ? <Cloud size={18} /> : <CloudOff size={18} />}
        <span className="mx-3">{status ? "Connected" : "Disconnected"}</span>
      </div>
    </div>
  );
};

export default StatusBar;
