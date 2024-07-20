import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validators";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  Eye,
  EyeOff,
  Lock,
  Loader,
  CircleUserRound,
  Camera,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { signUp } from "@/db/apiAuth";
import { toast } from "sonner";
import { useFetch } from "@/hooks";
import { useAuth } from "@/providers/auth-provider";
import { siteConfig } from "@/config";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "user@example.com",
      password: "1234567890",
    },
  });

  const refinedValues = {
    ...form.getValues(),
    avatar: selectedAvatar,
  };

  const {
    data,
    isLoading,
    isError,
    fn: fnRegister,
  } = useFetch(signUp, refinedValues);
  const { fetchUserFn } = useAuth();

  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isError === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUserFn();
    }
  }, [data, isError]);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    if (!selectedAvatar) return toast.info("Please select an avatar");

    try {
      toast.loading(`Authenticating ${values.email}`);
      const result = await fnRegister();
      if (result) {
        toast.success("Account created successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-full">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Create an account to continue using{" "}
            <b className="text-primary">{siteConfig.title}</b>.
          </p>
        </div>

        <div className="flex flex-col gap-4 my-4 w-full">
          <div className="size-28 rounded-full mx-auto bg-secondary overflow-hidden relative group md:border">
            {!isLoading && (
              <div className="size-full rounded-full absolute top-0 left-0 bg-background/30 backdrop-blur-[2px] transition-opacity md:opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3">
                <Input
                  type="file"
                  hidden
                  id="avatar"
                  accept="image/*"
                  disabled={isLoading}
                  className="hidden opacity-0"
                  onChange={(e) => setSelectedAvatar(e.target.files?.[0])}
                />
                <Label htmlFor="avatar">
                  <Camera size={26} className="cursor-pointer" />
                </Label>
                {selectedAvatar && (
                  <X
                    onClick={() => setSelectedAvatar(null)}
                    size={26}
                    className="cursor-pointer"
                  />
                )}
              </div>
            )}
            <img
              src={
                selectedAvatar
                  ? URL.createObjectURL(selectedAvatar)
                  : "/default-avatar.png"
              }
              width={122}
              height={122}
              loading="lazy"
              className={cn(
                "size-full rounded-full object-cover",
                isLoading && "opacity-50 pointer-events-none"
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <CircleUserRound
                      size={20}
                      className="absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground"
                    />
                    <Input
                      disabled={isLoading}
                      type="text"
                      placeholder="Web Sculptor"
                      {...field}
                      className="w-full rounded-full h-14 md:h-12 pl-[53px] pr-6 text-base"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground"
                    />
                    <Input
                      disabled={isLoading}
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                      className="w-full rounded-full h-14 md:h-12 pl-[53px] pr-6 text-base"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute top-1/2 -translate-y-1/2 left-5 text-muted-foreground"
                    />
                    <Input
                      disabled={isLoading}
                      type={shouldShowPassword ? "text" : "password"}
                      placeholder="xxx xxx xxx xxx"
                      {...field}
                      className="w-full rounded-full h-14 md:h-12 px-[53px] text-base"
                    />
                    {shouldShowPassword ? (
                      <Eye
                        onClick={() => setShouldShowPassword(false)}
                        size={20}
                        className="absolute top-1/2 -translate-y-1/2 right-5 text-muted-foreground cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShouldShowPassword(true)}
                        size={20}
                        className="absolute top-1/2 -translate-y-1/2 right-5 text-muted-foreground cursor-pointer"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          className="rounded-full h-14 md:h-12 text-base font-semibold">
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2" size={20} /> Creating...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <Link to="/auth" className="text-sm mt-4 font-medium">
          Already have an account? Sign In
        </Link>
      </form>
    </Form>
  );
}
