import Wrapper from "@/components/shared/wrapper";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";

export default function AuthenticationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const longLink = searchParams.get("createNew");

  const { isAuthenticated, isFetchingUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isFetchingUser) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, isFetchingUser]);

  return (
    <div className="flex h-full">
      <Wrapper className="flex items-center justify-center">
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </Wrapper>
    </div>
  );
}
