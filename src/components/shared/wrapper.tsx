import { IWrapper } from "@/interface";
import { cn } from "@/lib/utils";

export default function Wrapper({ children, className }: IWrapper) {
  return (
    <div className={cn("mx-auto max-w-screen-xl w-full px-4", className)}>
      {children}
    </div>
  );
}
