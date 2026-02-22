import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="flex bg-(--secondary) w-screen h-[8vh] shrink-0">
      <div className="w-9/10 flex justify-start items-center">
        <p className="text-2xl text-(--primary) mx-5 font-semibold">
          Codeshare
        </p>
      </div>
      <div className="w-1/10 flex justify-center items-center">
        <Button variant="outline" className="bg-(--primary) border-0">
          LogIn
        </Button>
      </div>
    </div>
  );
};

export default Header;
