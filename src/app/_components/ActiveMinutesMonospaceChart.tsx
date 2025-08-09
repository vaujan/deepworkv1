"use client";

import { ChevronDown, EllipsisVertical, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
import React, { SVGProps } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { JetBrains_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";

const jetBrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

// Generate mock daily data for the whole year (visual only)
function generateYearDailyData(year: number) {
	const start = new Date(Date.UTC(year, 0, 1));
	const end = new Date(Date.UTC(year + 1, 0, 1));
	const data: { date: string; minutes: number }[] = [];
	let i = 0;
	for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
		const base = 60 + 40 * Math.sin(i / 20);
		const noise = Math.random() * 35;
		const minutes = Math.max(0, Math.round(base + noise));
		data.push({ date: d.toISOString().slice(0, 10), minutes });
		i += 1;
	}
	return data;
}

const year = new Date().getUTCFullYear();
const chartData = generateYearDailyData(year);
const monthTicks = Array.from({ length: 12 }, (_, m) =>
	new Date(Date.UTC(year, m, 1)).toISOString().slice(0, 10)
);

const chartConfig = {
	minutes: {
		label: "Active Minutes",
		color: "var(--secondary-foreground)",
	},
} satisfies ChartConfig;

export default function ActiveMinutesMonospaceChart() {
	const [activeIndex, setActiveIndex] = React.useState<number | undefined>(
		undefined
	);

	const activeData = React.useMemo(() => {
		if (activeIndex === undefined) return null;
		return chartData[activeIndex];
	}, [activeIndex]);

	return (
		<Card className="bg-transparent">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<div className="flex w-full justify-between items-center">
						<div className="flex gap-3">
							<span
								className={cn(
									jetBrainsMono.className,
									"text-2xl tracking-tighter"
								)}
							>
								{activeData ? activeData.minutes : 123} min
							</span>
							<Badge variant="secondary">
								<TrendingUp className="h-4 w-4" />
								<span>5.2%</span>
							</Badge>
						</div>
						<div className="flex gap-3">
							<Button variant={"secondary"} size={"sm"}>
								12 Months
								<ChevronDown />
							</Button>
							<Button size={"sm"} className="size-8" variant={"ghost"}>
								<EllipsisVertical />
							</Button>
						</div>
					</div>
				</CardTitle>
				<CardDescription>Deep work minutes per day</CardDescription>
			</CardHeader>
			<CardContent>
				<AnimatePresence mode="wait">
					<DragScroll>
						{/** Dynamically enlarge min width so days don't cram */}
						{/** Roughly 9px per day incl. gaps; floor at 1200px */}
						{(() => {
							const minWidthPx = Math.max(1200, chartData.length * 9);
							return (
								<ChartContainer
									config={chartConfig}
									className="h-[240px] md:h-[300px] mb-3 aspect-auto"
									style={{ minWidth: minWidthPx, maxWidth: "100%" }}
								>
									<BarChart
										accessibilityLayer
										data={chartData}
										onMouseLeave={() => setActiveIndex(undefined)}
										margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
									>
										<XAxis
											dataKey="date"
											ticks={monthTicks}
											tickLine={false}
											tickMargin={8}
											axisLine={false}
											interval={0}
											tickFormatter={(value) =>
												new Date(value).toLocaleString(undefined, {
													month: "short",
												})
											}
										/>
										<Bar
											dataKey="minutes"
											barSize={7}
											fill="var(--secondary-foreground)"
											shape={
												<CustomBar
													setActiveIndex={setActiveIndex}
													activeIndex={activeIndex}
												/>
											}
										></Bar>
									</BarChart>
								</ChartContainer>
							);
						})()}
					</DragScroll>
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}

interface CustomBarProps extends SVGProps<SVGSVGElement> {
	setActiveIndex: (index?: number) => void;
	index?: number;
	activeIndex?: number;
	value?: string;
}

const CustomBar = (props: CustomBarProps) => {
	const { fill, x, y, width, height, index, activeIndex, value } = props;

	// Custom variables
	const xPos = Number(x || 0);
	const realWidth = Number(width || 0);
	const isActive = index === activeIndex;
	const collapsedWidth = 2;
	// centered bar x-position
	const barX = isActive ? xPos : xPos + (realWidth - collapsedWidth) / 2;
	// centered text x-position
	const textX = xPos + realWidth / 2;
	// Custom bar shape
	return (
		<g onMouseEnter={() => props.setActiveIndex(index)}>
			{/* rendering the bar with custom postion and animated width */}
			<motion.rect
				style={{
					willChange: "transform, width", // helps with performance
				}}
				y={y}
				initial={{ width: collapsedWidth, x: barX }}
				animate={{ width: isActive ? realWidth : collapsedWidth, x: barX }}
				transition={{
					duration: activeIndex === index ? 0.5 : 1,
					type: "spring",
				}}
				height={height}
				fill={fill}
			/>
			{/* Render value text on top of bar */}
			{isActive && (
				<motion.text
					style={{
						willChange: "transform, opacity", // helps with performance
					}}
					className={jetBrainsMono.className}
					key={index}
					initial={{ opacity: 0, y: -10, filter: "blur(3px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
					transition={{ duration: 0.1 }}
					x={textX}
					y={Number(y) - 5}
					textAnchor="middle"
					fill={fill}
				>
					{value}
				</motion.text>
			)}
		</g>
	);
};

/**
 * Minimal drag-to-scroll wrapper around shadcn ScrollArea.
 * Allows horizontal scrolling by dragging without showing a grab cursor.
 */
function DragScroll({ children }: { children: React.ReactNode }) {
	const viewportRef = React.useRef<HTMLDivElement>(null);
	const isDraggingRef = React.useRef(false);
	const startXRef = React.useRef(0);
	const scrollLeftRef = React.useRef(0);

	React.useEffect(() => {
		const el = viewportRef.current;
		if (!el) return;

		const onDown = (e: MouseEvent) => {
			isDraggingRef.current = true;
			startXRef.current = e.pageX - el.offsetLeft;
			scrollLeftRef.current = el.scrollLeft;
		};
		const onMove = (e: MouseEvent) => {
			if (!isDraggingRef.current) return;
			e.preventDefault();
			const x = e.pageX - el.offsetLeft;
			const walk = x - startXRef.current;
			el.scrollLeft = scrollLeftRef.current - walk;
		};
		const onUp = () => {
			isDraggingRef.current = false;
		};

		el.addEventListener("mousedown", onDown);
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			el.removeEventListener("mousedown", onDown);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
	}, []);

	return (
		<ScrollArea viewportRef={viewportRef} className="w-full">
			<div className="w-full select-none">{children}</div>
		</ScrollArea>
	);
}
