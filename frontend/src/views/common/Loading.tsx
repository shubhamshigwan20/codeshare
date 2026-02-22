import {
  AlertDialog,
  //   AlertDialogAction,
  //   AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  //   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
// import { Button } from "@/components/ui/button";

type LoadingProps = {
  openDialog: boolean;
};

const Loading = ({ openDialog }: LoadingProps) => {
  return (
    <AlertDialog open={openDialog}>
      {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger> */}

      <AlertDialogContent size="sm" className="bg-(--primary)">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <img src="./icon-two.png" width={24} height={24} />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-2xl text-(--secondary)">
            Codeshare
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center justify-center gap-2">
              <Spinner className="size-5 text-foreground text-(--secondary)" />
              <span className="text-l text-(--secondary)">Loading Backend</span>
            </div>
            <span className="text-[11px] w-full text-(--secondary)">
              First Load Takes 50 seconds
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Loading;
