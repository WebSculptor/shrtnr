import { useAuth } from "@/providers/auth-provider";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: any }) {
  const navigate = useNavigate();

  const { isAuthenticated, isFetchingUser } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && isFetchingUser === false) navigate("/auth");
  }, [isAuthenticated, isFetchingUser]);

  if (isFetchingUser)
    return (
      <div className="fixed top-0 left-0 backdrop-blur-sm size-full flex items-center justify-center z-50">
        <Loader size={28} className="animate-spin" />
      </div>
    );

  if (isAuthenticated) return children;
}
