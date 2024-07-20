import { getCurrentUser } from "@/db/apiAuth";
import { useFetch } from "@/hooks";
import { IAuthProvider, IFetchHook, ILayout } from "@/interface";
import { checkAdBlocker } from "@/lib/utils";
import { createContext, useContext, useEffect } from "react";

const initialState: IAuthProvider = {
  isFetchingUser: false,
  isAuthenticated: false,
  credentials: null,
  fetchUserFn: () => {},
};

const AuthProviderContext = createContext<IAuthProvider>(initialState);

export default function AuthProvider({ children }: ILayout) {
  const {
    data: credentials,
    fn: fetchUserFn,
    isLoading: isFetchingUser,
  }: IFetchHook = useFetch(getCurrentUser);

  const isAuthenticated: boolean = credentials?.role === "authenticated";

  useEffect(() => {
    fetchUserFn();
    checkAdBlocker();
  }, []);

  const props: IAuthProvider = {
    isFetchingUser,
    isAuthenticated,
    credentials,
    fetchUserFn,
  };

  return (
    <AuthProviderContext.Provider value={props}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = (): IAuthProvider => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
