import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const [longUrl, setLongUrl] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="h-full">
      <Wrapper className="flex items-center">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 w-full mx-auto max-w-md">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              id="link"
              type="url"
              placeholder="https://ui.shadcn.com/docs/installation"
            />
          </div>
          <Button type="submit" className="">
            <span className="text-sm">Shrt</span>
            <Scissors size={16} className="ml-2" />
          </Button>
        </form>
      </Wrapper>
    </div>
  );
}
