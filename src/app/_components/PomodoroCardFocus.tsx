"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play, TimerReset } from "lucide-react";
import React from "react";
import { formatTime } from "@/lib/utils";
import { useTimerStore } from "@/lib/store";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
	minutes: {
		label: "Minutes",
	},
	focus: {
		label: "Focus",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export default function PomodoroCardFocus() {
	const {
		focusTime,
		focusMode,
		startFocusTimer,
		pauseFocusTimer,
		resumeFocusTimer,
		resetFocusTimer,
		decrementFocusTimer,
		initialFocusTime,
	} = useTimerStore();

	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (focusMode === "running" && focusTime > 0) {
			intervalRef.current = setInterval(() => decrementFocusTimer(), 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [focusTime, focusMode, decrementFocusTimer]);

	const handleClick = () => {
		if (focusMode === "idle" && focusTime) {
			startFocusTimer();
		} else if (focusMode === "running" && focusTime > 0) {
			pauseFocusTimer();
		} else if (focusMode === "paused" && focusTime > 0) {
			resumeFocusTimer();
		}
	};

	const buttonLabel = () => {
		if (focusMode === "idle" && focusTime > 0) {
			return (
				<>
					<Play /> Start session
				</>
			);
		} else if (focusMode === "running" && focusTime > 0) {
			return (
				<>
					<Pause /> Pause
				</>
			);
		} else {
			return (
				<>
					<Play /> Resume session
				</>
			);
		}
	};

	const chartData = [
		{ month: "focus", minutes: focusTime, fill: "var(--color-focus)" },
	];

	return (
		<>
			<CardContent className="flex-1 flex items-center justify-center py-8">
				<div className="relative w-full max-w-[250px] aspect-square mx-auto">
					<ChartContainer
						config={chartConfig}
						className="absolute w-full h-full"
					>
						<RadialBarChart
							data={chartData}
							startAngle={180}
							endAngle={0}
							innerRadius="70%"
							outerRadius="100%"
							barSize={10}
						>
							<PolarGrid
								gridType="circle"
								radialLines={false}
								stroke="none"
								className="first:fill-muted last:fill-background"
							/>
							<RadialBar dataKey="minutes" background cornerRadius={10} />
						</RadialBarChart>
					</ChartContainer>
					<div
						className="absolute inset-0 flex flex-col items-center justify-center"
						aria-hidden="true"
					>
						<div className="text-center">
							<div className="text-5xl font-bold tabular-nums tracking-tighter text-foreground">
								{formatTime(focusTime)}
							</div>
							<div className="text-sm font-medium uppercase text-muted-foreground mt-1">
								{focusMode === "paused" ? "Paused" : "Focus"}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex gap-3 justify-center items-center p-0 shadow-none">
				<Button
					className={`${focusMode === "paused" ? "" : "hidden"} `}
					size={"lg"}
					variant={"outlineDestructive"}
					onClick={resetFocusTimer}
				>
					<TimerReset /> Reset
				</Button>

				<Button
					size={"lg"}
					className={`${focusMode === "paused" ? "text-primary" : ""}`}
					variant={
						focusMode === "idle"
							? "default"
							: focusMode === "running"
								? "secondary"
								: "outline"
					}
					onClick={handleClick}
				>
					{buttonLabel()}
				</Button>
			</CardFooter>
		</>
	);
}
