import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Example stats prop structure
// const stats = [
//   {
//     id: 4,
//     created_at: "2024-07-20T09:36:51.473319+00:00",
//     link_id: 7,
//     country: "Nigeria",
//     city: "Abuja",
//     device: "desktop",
//     browser: "Opera"
//   }
// ];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export default function LocationStats({ stats }: { stats: any }) {
  // Aggregate city and country counts from stats
  const cityCount = stats?.reduce((acc: any, item: any) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else {
      acc[item.city] = 1;
    }
    return acc;
  }, {});

  const countryCount = stats?.reduce((acc: any, item: any) => {
    if (acc[item.country]) {
      acc[item.country] += 1;
    } else {
      acc[item.country] = 1;
    }
    return acc;
  }, {});

  const cityData = Object.entries(cityCount || {}).map(([city, count]) => ({
    name: city,
    count,
  }));

  const countryData = Object.entries(countryCount || {}).map(
    ([country, count]) => ({
      name: country,
      count,
    })
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Location Stats</CardTitle>
          <CardDescription>Visitor statistics by city</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={cityData.slice(0, 5)}
              layout="vertical"
              margin={{
                right: 16,
              }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis type="number" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="count" fill="var(--color-desktop)" radius={4}>
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors by city
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Stats</CardTitle>
          <CardDescription>Visitor statistics by country</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={countryData.slice(0, 5)}
              layout="vertical"
              margin={{
                right: 16,
              }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis type="number" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="count" fill="var(--color-mobile)" radius={4}>
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors by country
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
