import Wrapper from "@/components/shared/wrapper";
import { Separator } from "@/components/ui/separator";

import { TbHandClick } from "react-icons/tb";
import { PiLinkSimpleBold } from "react-icons/pi";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
import { PiTrashSimple } from "react-icons/pi";
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { RiSearch2Line } from "react-icons/ri";
import { RiMenuSearchLine } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { useFetch } from "@/hooks";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import UrlCard from "@/components/shared/url-card";
import { IFetchHook } from "@/interface";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { credentials } = useAuth();
  const {
    fn: fetchUrlsFn,
    isLoading,
    data: urls,
  }: IFetchHook = useFetch(getUrls, credentials?.id);
  const {
    fn: fetchClicksFn,
    isLoading: loadingClicks,
    data: clicks,
  }: IFetchHook = useFetch(
    getClicksForUrls,
    urls?.map((url: any) => url?.id)
  );

  useEffect(() => {
    fetchUrlsFn();
  }, []);

  useEffect(() => {
    if (urls?.length) fetchClicksFn();
  }, [urls?.length]);

  const filterUrls = urls?.filter((url: any) =>
    url?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      <Wrapper className="py-6">
        <div className="mx-auto w-full max-w-screen-lg flex flex-col">
          <div className="flex items-center gap-4 sm:gap-6 w-full pb-4 mb-4 sm:pb-8 sm:mb-8 border-b">
            {isLoading && loadingClicks ? (
              <>
                <Skeleton className="p-4 sm:p-6 w-full border rounded-xl sm:rounded-2xl aspect-[2.3]" />
                <Skeleton className="p-4 sm:p-6 w-full border rounded-xl sm:rounded-2xl aspect-[2.3]" />
              </>
            ) : (
              <>
                <div className="p-4 sm:p-6 w-full border rounded-xl sm:rounded-2xl bg-background/80 backdrop-blur-lg flex items-center aspect-[2.3] sm:aspect-auto">
                  <div className="size-12 sm:size-28 bg-secondary rounded-full flex items-center justify-center mr-4 sm:mr-6">
                    <PiLinkSimpleBold className="size-6 sm:size-14 text-muted-foreground" />
                  </div>

                  <div className="flex flex-col sm:gap-1">
                    <h1 className="text-2xl leading-none sm:text-4xl font-bold">
                      {!urls?.length ? 0 : urls?.length}
                    </h1>
                    <h3 className="hidden sm:flex text-sm sm:text-base font-medium text-muted-foreground">
                      Links Created
                    </h3>
                    <h3 className="flex sm:hidden text-sm sm:text-base font-medium text-muted-foreground">
                      Links
                    </h3>
                  </div>
                </div>
                <div className="p-4 sm:p-6 w-full border rounded-xl sm:rounded-2xl bg-background/80 backdrop-blur-lg flex items-center aspect-[2.3] sm:aspect-auto">
                  <div className="size-12 sm:size-28 bg-secondary rounded-full flex items-center justify-center mr-4 sm:mr-6">
                    <TbHandClick className="size-6 sm:size-14 text-muted-foreground" />
                  </div>

                  <div className="flex flex-col sm:gap-1">
                    <h1 className="text-2xl leading-none sm:text-4xl font-bold">
                      {!clicks?.length ? 0 : clicks?.length}
                    </h1>
                    <h3 className="hidden sm:flex text-sm sm:text-base font-medium text-muted-foreground">
                      Total Clicks
                    </h3>
                    <h3 className="flex sm:hidden text-sm sm:text-base font-medium text-muted-foreground">
                      Clicks
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between h-5">
            <div className="flex items-center gap-3 h-full">
              <RiMenuSearchLine className="cursor-pointer" size={20} />
              <Separator className="w-px h-full" />
              <MdOutlineSignalCellularAlt
                className="cursor-pointer"
                size={20}
              />
            </div>
            <div className="flex items-center gap-3 h-full">
              <PiTrashSimple
                className="cursor-pointer text-red-500"
                size={20}
              />

              <Separator className="w-px h-full" />

              <div className="flex items-center text-sm font-medium cursor-pointer">
                <HiOutlineAdjustmentsVertical
                  className="cursor-pointer mr-2"
                  size={20}
                />
                Filter
              </div>
            </div>
          </div>

          <div className="flex sm:hidden w-full mt-4 relative">
            <RiSearch2Line
              size={20}
              className="absolute top-1/2 -translate-y-1/2 left-4 text-muted-foreground z-10"
            />
            <Input
              className="w-full h-12 rounded-full pl-12 pr-5 bg-background/80 backdrop-blur-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search links by title..."
            />
          </div>
        </div>

        <div className="py-8">
          {isLoading && loadingClicks ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, _key) => (
                <Skeleton
                  className="aspect-[2.2] w-full rounded-xl"
                  key={_key}
                />
              ))}
            </div>
          ) : urls?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterUrls?.map((url: any) => (
                <UrlCard key={url?.id} url={url} fetchUrlsFn={fetchUrlsFn} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-col text-center pt-10">
              <Inbox className="size-16 sm:size-28 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground font-normal text-base sm:text-lg mt-2">
                Oops, You haven&apos;t shrtn a link yet
              </p>
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
