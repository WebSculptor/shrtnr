import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Qrcode() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <div className="size-[200px] bg-secondary"></div>
      </CardContent>
    </Card>
  );
}
