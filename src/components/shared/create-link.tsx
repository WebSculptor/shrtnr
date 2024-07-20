import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema } from "@/lib/validators";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader, Plus } from "lucide-react";
import { PiLinkSimple, PiSubtitles } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { useFetch } from "@/hooks";
import { createShortUrl } from "@/db/apiUrls";
import { toast } from "sonner";
import { IFetchHook } from "@/interface";

export default function CreateLink({ children }: { children: any }) {
  const qrcodeRef = useRef<any>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [closeModal, setCloseModal] = useState(false);

  const { credentials, isAuthenticated, isFetchingUser } = useAuth();

  const paramsLongUrl = searchParams.get("createNew");

  const form = useForm<z.infer<typeof createLinkSchema>>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      longUrl: paramsLongUrl || "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && !isFetchingUser) {
      form.setValue("userId", credentials?.id!);
    }
  }, []);

  const {
    fn: createShortUrlFn,
    isLoading: isCreating,
    isError,
    data,
  }: IFetchHook = useFetch(createShortUrl, {
    ...form.getValues(),
  });

  useEffect(() => {
    if (data && isError === null) {
      navigate(`/link/${data?.[0]?.id}`);
    }
  }, [isError, data]);

  useEffect(() => {}, [form.watch("longUrl")]);

  async function onSubmit(values: z.infer<typeof createLinkSchema>) {
    try {
      toast.loading(`Creating "${values?.title}" url...`);
      const qrcodeCanvas = qrcodeRef.current.canvasRef.current;
      const blob = await new Promise((resolve) => qrcodeCanvas.toBlob(resolve));

      const result = await createShortUrlFn(blob);
      if (result) {
        setCloseModal(true);
        toast.success("Created successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCloseModal(true);
      toast.dismiss();
    }
  }

  return (
    <Dialog
      defaultOpen={(paramsLongUrl as any) && closeModal}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mb-4">
            {form.getValues("longUrl") ? (
              <QRCode
                value={form.getValues("longUrl")}
                size={60}
                ref={qrcodeRef}
              />
            ) : (
              <div className="rounded-full bg-secondary size-20 flex items-center justify-center">
                <Plus className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <DialogTitle>Create new Url</DialogTitle>
          <DialogDescription>
            Fill the form to create your shrt url
          </DialogDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2 w-full">
              <div className="flex flex-col gap-2 my-4 w-full">
                <FormField
                  control={form.control}
                  name="title"
                  disabled={isCreating}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <PiSubtitles
                            size={18}
                            className="absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground"
                          />
                          <Input
                            disabled={isCreating}
                            type="text"
                            placeholder="Short url's title"
                            {...field}
                            className="w-full rounded-full h-12 pl-12 pr-6"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longUrl"
                  disabled={isCreating}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <PiLinkSimple
                            size={18}
                            className="absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground"
                          />
                          <Input
                            type="url"
                            placeholder="Enter your looong url"
                            disabled={isCreating}
                            {...field}
                            className="w-full rounded-full h-12 px-12"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2 w-full">
                  <p className="text-xs rounded-full font-medium dark:font-normal">
                    shrtnr.vercel.app/
                  </p>

                  <FormField
                    control={form.control}
                    name="customUrl"
                    disabled={isCreating}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl className="flex-1">
                          <div className="relative flex-1">
                            <CiEdit
                              size={18}
                              className="absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground"
                            />
                            <Input
                              disabled={isCreating}
                              type="text"
                              placeholder="Custom link (optional)"
                              {...field}
                              className="w-full rounded-full h-12 pl-12 pr-6"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="rounded-full h-12"
                disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader className="mr-2 animate-spin" size={16} /> Shrtng...
                  </>
                ) : (
                  "Shrt Url"
                )}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
