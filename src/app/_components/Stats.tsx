"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from "@/components/ui/chart";

const data = [
	{
		month: "January 2025",
		"Boot.dev Course": 145,
		"UTBK Prep": 92,
		"Learn Backend JavaScript": 178,
	},
	{
		month: "February 2025",
		"Boot.dev Course": 167,
		"UTBK Prep": 103,
		"Learn Backend JavaScript": 223,
	},
	{
		month: "March 2025",
		"Boot.dev Course": 134,
		"UTBK Prep": 87,
		"Learn Backend JavaScript": 156,
	},
	{
		month: "April 2025",
		"Boot.dev Course": 189,
		"UTBK Prep": 124,
		"Learn Backend JavaScript": 245,
	},
	{
		month: "May 2025",
		"Boot.dev Course": 156,
		"UTBK Prep": 95,
		"Learn Backend JavaScript": 198,
	},
	{
		month: "June 2025",
		"Boot.dev Course": 178,
		"UTBK Prep": 112,
		"Learn Backend JavaScript": 234,
	},
];

const chartConfig = {
	"Boot.dev Course": {
		label: "Boot.dev Course",
	},
	"UTBK Prep": {
		label: "UTBK Prep",
	},
	"Learn Backend JavaScript": {
		label: "Learn Backend JavaScript",
	},
} satisfies ChartConfig;

export default function Stats() {
	return (
		<ChartContainer config={chartConfig} className="w-full min-h-[96px]">
			<BarChart accessibilityLayer data={data}>
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<Bar dataKey="Boot.dev Course" fill="var(--chart-1)" radius={4} />
				<Bar dataKey="UTBK Prep" fill="var(--chart-2)" radius={4} />
				<Bar
					dataKey="Learn Backend JavaScript"
					fill="var(--chart-3)"
					radius={4}
				/>
			</BarChart>
		</ChartContainer>
	);
}
