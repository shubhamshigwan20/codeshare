import React from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="flex border border-border">
      <div className="w-4/5 flex justify-start items-center border border-border">
        Codeshare
      </div>
      <div className="w-1/5 flex justify-center items-center border border-border">
        <Button variant="outline">Logout</Button>
      </div>
    </div>
  );
};

export default Header;
