"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

// Mock data for testing - represents daily active minutes across different workspaces
const chartData = [
	{
		month: "Jan",
		backend: 85,
		utbk: 45,
		bootdev: 60,
	},
	{
		month: "Feb",
		backend: 95,
		utbk: 52,
		bootdev: 70,
	},
	{
		month: "Mar",
		backend: 110,
		utbk: 48,
		bootdev: 85,
	},
	{
		month: "Apr",
		backend: 98,
		utbk: 61,
		bootdev: 75,
	},
	{
		month: "May",
		backend: 120,
		utbk: 55,
		bootdev: 90,
	},
	{
		month: "Jun",
		backend: 135,
		utbk: 68,
		bootdev: 95,
	},
	{
		month: "Jul",
		backend: 125,
		utbk: 72,
		bootdev: 88,
	},
	{
		month: "Aug",
		backend: 140,
		utbk: 76,
		bootdev: 102,
	},
	{
		month: "Sep",
		backend: 128,
		utbk: 69,
		bootdev: 96,
	},
	{
		month: "Oct",
		backend: 145,
		utbk: 81,
		bootdev: 110,
	},
	{
		month: "Nov",
		backend: 138,
		utbk: 85,
		bootdev: 108,
	},
	{
		month: "Dec",
		backend: 152,
		utbk: 89,
		bootdev: 115,
	},
];

const chartConfig = {
	backend: {
		label: "Learn Backend JavaScript",
		color: "hsl(var(--chart-1))",
	},
	utbk: {
		label: "UTBK Prep.",
		color: "oklch(0.6231 0.188 259.8145)",
	},
	bootdev: {
		label: "Boot.dev Course",
		color: "rgb(var(--chart-3))",
	},
} satisfies ChartConfig;

export default function AnalyticsWidget() {
	// Calculate trending data
	const totalMinutes = React.useMemo(() => {
		return chartData.reduce(
			(acc, curr) => acc + curr.backend + curr.utbk + curr.bootdev,
			0
		);
	}, []);

	const currentMonth = chartData[chartData.length - 1];
	const previousMonth = chartData[chartData.length - 2];
	const currentTotal =
		currentMonth.backend + currentMonth.utbk + currentMonth.bootdev;
	const previousTotal =
		previousMonth.backend + previousMonth.utbk + previousMonth.bootdev;
	const trendingPercentage = (
		((currentTotal - previousTotal) / previousTotal) *
		100
	).toFixed(1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Total Active Minutes</CardTitle>
				<CardDescription>January - December 2024</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
							top: 12,
							bottom: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => `${value}m`}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Line
							dataKey="backend"
							type="monotone"
							stroke="var(--color-backend)"
							strokeWidth={2}
							dot={{
								fill: "var(--color-backend)",
							}}
							activeDot={{
								r: 6,
							}}
						/>
						<Line
							dataKey="utbk"
							type="monotone"
							stroke="var(--color-utbk)"
							strokeWidth={2}
							dot={{
								fill: "var(--color-utbk)",
							}}
							activeDot={{
								r: 6,
							}}
						/>
						<Line
							dataKey="bootdev"
							type="monotone"
							stroke="var(--color-bootdev)"
							strokeWidth={2}
							dot={{
								fill: "var(--color-bootdev)",
							}}
							activeDot={{
								r: 6,
							}}
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</LineChart>
				</ChartContainer>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by {trendingPercentage}% this month{" "}
							<TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							Showing total minutes for the last 12 months
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
