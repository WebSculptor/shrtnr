import Wrapper from "@/components/shared/wrapper";
import { getClicksForUrls } from "@/db/apiClicks";
import { deleteUrl, getUrlById, getUrls } from "@/db/apiUrls";
import { useFetch } from "@/hooks";
import { IFetchHook } from "@/interface";
import { useAuth } from "@/providers/auth-provider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Copy, Ellipsis, Loader, Share2 } from "lucide-react";
import { PiLinkSimpleBold } from "react-icons/pi";
import { LuClock3 } from "react-icons/lu";
import { formatDateString } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import DeleteUrl from "@/components/shared/delete-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiStats } from "react-icons/bi";
import LocationStats from "@/components/shared/location-stats";
import DeviceStats from "@/components/shared/device-stats";
import Qrcode from "@/components/shared/qrcode";

export default function LinkPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { credentials } = useAuth();
  const { fn: fetchUrlsFn }: IFetchHook = useFetch(getUrls, credentials?.id);
  const {
    isLoading: loadingUrl,
    fn: getUrlByIdFn,
    isError: isErrorFetchingUrlData,
    data: url,
  }: IFetchHook = useFetch(getUrlById, { id, userId: credentials?.id });
  const {
    isLoading: loadingStats,
    fn: getUrlStatsFn,
    data: stats,
  }: IFetchHook = useFetch(getClicksForUrls, id);
  const { isLoading: isDeletingUrl, fn: deleteUrlFn }: IFetchHook = useFetch(
    deleteUrl,
    id
  );

  useEffect(() => {
    getUrlByIdFn();
    getUrlStatsFn();
  }, []);

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

  if (isErrorFetchingUrlData) {
    return navigate("/dashboard");
  }

  const modalProps = {
    url,
    deleteUrlFn,
    isDeletingUrl,
    fetchUrlsFn,
  };

  return (
    <div className="h-full">
      <Wrapper className="py-4 sm:py-8">
        <div className="mx-auto w-full max-w-[1288px] flex flex-col gap-4">
          {loadingUrl && loadingStats ? (
            <p className="flex items-center text-sm ml-2 sm:ml-4">
              <Loader size={16} className="mr-2 animate-spin" />
              Please wait...
            </p>
          ) : (
            <Link
              to="/dashboard"
              className="flex items-center text-sm ml-2 sm:ml-4">
              <MdChevronLeft size={16} className="mr-2" />
              Back to list
            </Link>
          )}

          {!loadingUrl && !loadingStats && (
            <>
              <div className="px-4 sm:px-6 w-full border rounded-2xl bg-background/80 backdrop-blur-lg flex flex-col shadow-lg">
                <div className="flex flex-col py-4 sm:py-6 w-full">
                  <div className="flex items-center justify-between gap-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-medium">
                      {url?.title}
                    </h1>
                    <div className="hidden md:flex">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${
                                import.meta.env.PROD
                                  ? `https://${
                                      import.meta.env.VITE_PROJECT_DOMAIN
                                    }/${
                                      url?.custom_url
                                        ? url?.custom_url
                                        : url?.short_url
                                    }`
                                  : `http://172.20.10.3:5173/${
                                      url?.custom_url
                                        ? url?.custom_url
                                        : url?.short_url
                                    }`
                              }`
                            );
                            toast.success(
                              `Copied "${
                                import.meta.env.PROD
                                  ? `https://${
                                      import.meta.env.VITE_PROJECT_DOMAIN
                                    }/${
                                      url?.custom_url
                                        ? url?.custom_url
                                        : url?.short_url
                                    }`
                                  : `http://172.20.10.3:5173/${
                                      url?.custom_url
                                        ? url?.custom_url
                                        : url?.short_url
                                    }`
                              }"`
                            );
                          }}>
                          <Copy className="size-3.5 mr-1.5" />
                          Copy
                        </Button>
                        <Button variant={"outline"} size={"sm"}>
                          <Share2 className="size-3.5 mr-1.5" />
                          Share
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size={"sm"}
                              variant={"outline"}
                              className="p-2">
                              <Ellipsis className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="mr-8">
                            <DeleteUrl {...modalProps}>
                              <p className="cursor-pointer text-sm py-1 px-2">
                                Delete
                              </p>
                            </DeleteUrl>
                            <p
                              onClick={downloadQrCode}
                              className="cursor-pointer text-sm py-1 px-2">
                              Download
                            </p>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-sm sm:text-base font-normal text-initial my-1 w-max">
                      <Link
                        target="_blank"
                        to={
                          import.meta.env.PROD
                            ? `https://${import.meta.env.VITE_PROJECT_DOMAIN}/${
                                url?.custom_url
                                  ? url?.custom_url
                                  : url?.short_url
                              }`
                            : `http://172.20.10.3:5173/${
                                url?.custom_url
                                  ? url?.custom_url
                                  : url?.short_url
                              }`
                        }
                        className="flex items-center">
                        <PiLinkSimpleBold className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                        {import.meta.env.VITE_PROJECT_DOMAIN}/
                        <span className="text-primary">
                          {url?.custom_url ? url?.custom_url : url?.short_url}
                        </span>
                      </Link>
                    </h3>

                    <Link
                      target="_blank"
                      to={`${url?.long_url}`}
                      className="text-xs sm:text-sm flex-1 whitespace-pre-wrap line-clamp-1 text-muted-foreground w-max">
                      {url?.long_url}
                    </Link>
                  </div>

                  <div className="sm:pt-4 mt-4 sm:border-t w-full flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center">
                      <LuClock3 className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                      {formatDateString(url?.created_at)}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center">
                      <BiStats className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
                      {stats?.length ? stats?.length : 0}
                    </p>
                  </div>
                </div>

                <div className="flex md:hidden items-center gap-2 py-4 border-t">
                  <Button
                    variant={"outline"}
                    className="flex-1"
                    size={"sm"}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${
                          import.meta.env.PROD
                            ? `https://${import.meta.env.VITE_PROJECT_DOMAIN}/${
                                url?.custom_url
                                  ? url?.custom_url
                                  : url?.short_url
                              }`
                            : `http://172.20.10.3:5173/${
                                url?.custom_url
                                  ? url?.custom_url
                                  : url?.short_url
                              }`
                        }`
                      );
                      toast.success(
                        `Copied "https://${
                          import.meta.env.VITE_PROJECT_DOMAIN
                        }/${
                          url?.custom_url ? url?.custom_url : url?.short_url
                        }"`
                      );
                    }}>
                    <Copy className="size-3.5 mr-1.5" />
                    Copy
                  </Button>
                  <Button variant={"outline"} size={"sm"}>
                    <Share2 className="size-3.5 mr-1.5" />
                    Share
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"sm"} variant={"outline"} className="p-2">
                        <Ellipsis className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-8">
                      <DeleteUrl {...modalProps}>
                        <p className="cursor-pointer text-sm py-1 px-2">
                          Delete
                        </p>
                      </DeleteUrl>
                      <p
                        onClick={downloadQrCode}
                        className="cursor-pointer text-sm py-1 px-2">
                        Download
                      </p>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Qrcode />
              {stats?.length !== 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <DeviceStats stats={stats} />
                  <LocationStats stats={stats} />
                </div>
              )}
            </>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
