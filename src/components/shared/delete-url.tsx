import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader, Trash, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeleteUrl({
  children,
  fetchUrlsFn,
  deleteUrlFn,
  isDeletingUrl,
}: {
  children: any;
  url: any;
  fetchUrlsFn?: any;
  deleteUrlFn: any;
  isDeletingUrl: any;
}) {
  const navigate = useNavigate();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={isDeletingUrl}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="rounded-full bg-secondary size-20 mb-4 flex items-center justify-center">
            <Trash className="size-8 text-muted-foreground" />
          </div>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your url
            and its data our database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="absolute top-2 right-2 p-0"
            disabled={isDeletingUrl}
            asChild>
            <Button
              className="rounded-full bg-transparent hover:bg-transparent border-none"
              variant={"outline"}
              size={"icon"}>
              <X className="size-5" />
            </Button>
          </AlertDialogCancel>
          <Button
            className="flex-1 h-12 rounded-full"
            disabled={isDeletingUrl}
            onClick={async () =>
              deleteUrlFn().then(() => {
                navigate("/dashboard");
                fetchUrlsFn();
              })
            }>
            {isDeletingUrl ? (
              <>
                <Loader className="animate-spin mr-2" size={16} />
                Please wait...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
