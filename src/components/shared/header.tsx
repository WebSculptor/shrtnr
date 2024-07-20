import { Link, useNavigate } from "react-router-dom";
import Wrapper from "./wrapper";
import { siteConfig } from "@/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggler } from "./mode-toggler";
import { useTheme } from "@/providers/theme-provider";
import { cn, getInitials } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useFetch } from "@/hooks";
import { signOut } from "@/db/apiAuth";
import { Loader, Plus, X } from "lucide-react";
import { LuLogOut } from "react-icons/lu";
import CreateLink from "./create-link";

export default function Header() {
  const { isAuthenticated, credentials } = useAuth();

  const { setTheme, theme } = useTheme();

  const selectedThemes = ["light", "dark", "system"];

  return (
    <header className="w-full min-h-14 sm:min-h-16 bg-background/80 backdrop-blur-2xl sticky top-0 left-0 z-50 border-b">
      <Wrapper className="flex items-center justify-between gap-6 size-full">
        <Link className="text-lg font-bold" to="/">
          {siteConfig.title}
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    className="object-cover"
                    src={credentials?.avatar}
                    alt={credentials?.name}
                  />
                  <AvatarFallback>
                    {getInitials(credentials?.name!)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-4 mt-1">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <Link to="/dashboard">
                    <DropdownMenuItem>
                      Home
                      <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  <CreateLink>
                    <div className="relative flex cursor-pointer hover:bg-secondary items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                      Create
                      <span className="ml-auto text-muted-foreground">
                        <Plus className="size-4" />
                      </span>
                    </div>
                  </CreateLink>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="transition-none">
                        {selectedThemes.map((thm: any) => (
                          <DropdownMenuItem
                            className={cn("capitalize py-1 cursor-pointer", {
                              "bg-secondary font-medium": thm === theme,
                            })}
                            key={thm}
                            onClick={() => setTheme(thm)}>
                            {thm}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <Logout>
                  <div className="relative flex cursor-pointer hover:bg-red-500/15 items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                    Log out
                    <span className="ml-auto text-xs text-muted-foreground">
                      ⇧⌘Q
                    </span>
                  </div>
                </Logout>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant={"outline"}>
                <Link to="/auth">Sign In</Link>
              </Button>
              <ModeToggler />
            </>
          )}
        </div>
      </Wrapper>
    </header>
  );
}

function Logout({ children }: { children: any }) {
  const navigate = useNavigate();

  const { isLoading, fn: logOutFn } = useFetch(signOut);
  const { fetchUserFn } = useAuth();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="rounded-full bg-secondary size-20 mb-4 flex items-center justify-center">
            <LuLogOut className="size-8 text-muted-foreground" />
          </div>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You are signing out of your account, would you like to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="absolute top-2 right-2 p-0"
            disabled={isLoading}
            asChild>
            <Button
              className="rounded-full bg-transparent hover:bg-transparent border-none"
              variant={"outline"}
              size={"icon"}>
              <X className="size-5" />
            </Button>
          </AlertDialogCancel>
          <Button
            className="flex-1 rounded-full h-12"
            disabled={isLoading}
            onClick={async () => {
              await logOutFn();
              fetchUserFn();
              navigate("/");
            }}>
            {isLoading ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              "Continue"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
