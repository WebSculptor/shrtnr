import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validators";

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
import { Mail, Eye, EyeOff, Lock, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { signIn } from "@/db/apiAuth";
import { toast } from "sonner";
import { useFetch } from "@/hooks";
import { useAuth } from "@/providers/auth-provider";

export default function SignInPage() {
  const navigate = useNavigate();

  let [searchParams] = useSearchParams();
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "user@example.com",
      password: "1234567890",
    },
  });

  const {
    data,
    isLoading,
    isError,
    fn: fnLogin,
  } = useFetch(signIn, form.getValues());
  const { fetchUserFn } = useAuth();

  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isError === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUserFn();
    }
  }, [data, isError]);

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      toast.loading(`Authenticating ${values.email}`);
      const result = await fnLogin();
      if (result) {
        toast.success("Logged in successfully");
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
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            {longLink ? "Please login first" : "Welcome back"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Login with your credentials to continue
          </p>
        </div>

        <div className="flex flex-col gap-4 my-4 w-full">
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
              <Loader className="animate-spin mr-2" size={20} /> Please wait...
            </>
          ) : (
            "Continue"
          )}
        </Button>

        <Link to="/auth/sign-up" className="text-sm mt-4 font-medium">
          Don&apos; have an account? Sign Up
        </Link>
      </form>
    </Form>
  );
}
