import { deleteUrl } from "@/db/apiUrls";
import { useFetch } from "@/hooks";
import { formatDateString } from "@/lib/utils";
import { Copy, Download, Loader, QrCode, Trash, X } from "lucide-react";
import { LuClock3 } from "react-icons/lu";
import { PiLinkSimpleBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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

export default function UrlCard({
  url,
  fetchUrlsFn,
}: {
  url: any;
  fetchUrlsFn: () => void;
}) {
  const { fn: deleteUrlFn, isLoading: isDeletingUrl } = useFetch(
    deleteUrl,
    url?.id
  );

  const downloadQrCode = () => {
    const qrUrl = url?.qrcode;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = qrUrl;
    anchor.download = fileName;
    anchor.target = "_blank";

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };

  const modalProps = {
    url,
    fetchUrlsFn,
    deleteUrlFn,
    isDeletingUrl,
  };

  return (
    <div className="w-full rounded-2xl border bg-background/80 backdrop-blur-lg px-5 sm:px-6 flex flex-col">
      <div className="py-4 w-full border-b flex flex-col">
        <h1 className="text-lg sm:text-2xl font-semibold flex items-center justify-between">
          <Link to={`/link/${url?.id}`}>{url?.title}</Link>
          {url?.qrcode && (
            <QrCode className="size-5 sm:size-6 cursor-pointer" />
          )}
        </h1>

        <h3 className="text-base font-normal text-initial my-1">
          <Link
            to={
              import.meta.env.PROD
                ? `https://${import.meta.env.VITE_PROJECT_DOMAIN}/${
                    url?.custom_url ? url?.custom_url : url?.short_url
                  }`
                : `http://localhost:5173/${
                    url?.custom_url ? url?.custom_url : url?.short_url
                  }`
            }
            className="flex items-center">
            <PiLinkSimpleBold className="size-4 mr-2" />
            {import.meta.env.VITE_PROJECT_DOMAIN}/
            <span className="text-primary">
              {url?.custom_url ? url?.custom_url : url?.short_url}
            </span>
          </Link>
        </h3>

        <p className="text-xs flex-1 whitespace-pre-wrap line-clamp-1 text-muted-foreground">
          {url?.long_url}
        </p>
      </div>

      <div className="py-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground flex items-center">
          <LuClock3 className="size-4 mr-2" />
          {formatDateString(url?.created_at)}
        </p>

        <div className="flex items-center gap-4">
          <Copy
            className="size-4 sm:size-5 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                `${
                  import.meta.env.PROD
                    ? `https://${import.meta.env.VITE_PROJECT_DOMAIN}/${
                        url?.custom_url ? url?.custom_url : url?.short_url
                      }`
                    : `http://localhost:5173/${
                        url?.custom_url ? url?.custom_url : url?.short_url
                      }`
                }`
              );
              toast.success(
                `Copied "https://${import.meta.env.VITE_PROJECT_DOMAIN}/${
                  url?.custom_url ? url?.custom_url : url?.short_url
                }"`
              );
            }}
          />
          {url?.qrcode && (
            <Download
              className="size-4 sm:size-5 cursor-pointer"
              onClick={downloadQrCode}
            />
          )}
          <Delete {...modalProps}>
            {isDeletingUrl ? (
              <Loader className="size-4 sm:size-5 cursor-pointer" />
            ) : (
              <Trash className="size-4 sm:size-5 cursor-pointer" />
            )}
          </Delete>
        </div>
      </div>
    </div>
  );
}

function Delete({
  children,
  fetchUrlsFn,
  deleteUrlFn,
  isDeletingUrl,
}: {
  children: any;
  url: any;
  fetchUrlsFn: any;
  deleteUrlFn: any;
  isDeletingUrl: any;
}) {
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
            onClick={async () => deleteUrlFn().then(() => fetchUrlsFn())}>
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
