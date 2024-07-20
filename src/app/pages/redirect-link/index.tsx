import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import { useFetch } from "@/hooks";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IFetchHook } from "@/interface";

export default function RedirectLinkPage() {
  const { id } = useParams<{ id: string }>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    isLoading,
    data,
    fn: getLongUrlFn,
    isError,
  }: IFetchHook = useFetch(getLongUrl, id);

  const {
    isLoading: loadingStats,
    fn: storeClicksFn,
    isError: isErrorRecordingClicks,
  }: IFetchHook = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.long_url,
  });

  useEffect(() => {
    getLongUrlFn();
  }, []);

  useEffect(() => {
    if (!isLoading && data) {
      storeClicksFn().catch((error: Error) => {
        setErrorMessage(error.message);
      });
    }
  }, [isLoading, data]);

  if (isLoading || loadingStats) {
    return (
      <div className="flex items-center justify-center h-full text-sm sm:text-base text-center">
        <Loader size={20} className="mr-2 animate-spin" />
        Redirecting you to{" "}
        <b className="ml-1 text-initial">{`https://${
          import.meta.env.VITE_PROJECT_DOMAIN
        }/${id}`}</b>
        ...
      </div>
    );
  } else if (isErrorRecordingClicks || isError || errorMessage) {
    return (
      <div className="flex items-center justify-center h-full text-sm sm:text-base text-center">
        <span>
          Error:{" "}
          {errorMessage || isErrorRecordingClicks?.message || isError?.message}
        </span>
      </div>
    );
  }

  return null;
}
