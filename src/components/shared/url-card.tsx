import { deleteUrl } from "@/db/apiUrls";
import { useFetch } from "@/hooks";
import { formatDateString } from "@/lib/utils";
import { Copy, Download, Loader, QrCode, Trash } from "lucide-react";
import { LuClock3 } from "react-icons/lu";
import { PiLinkSimpleBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DeleteUrl from "./delete-url";

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
          <Link to={`/link/${url?.id}`} className="flex items-center">
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
                    : `http://172.20.10.3:5173/${
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
          <DeleteUrl {...modalProps}>
            {isDeletingUrl ? (
              <Loader className="size-4 sm:size-5 cursor-pointer" />
            ) : (
              <Trash className="size-4 sm:size-5 cursor-pointer" />
            )}
          </DeleteUrl>
        </div>
      </div>
    </div>
  );
}
