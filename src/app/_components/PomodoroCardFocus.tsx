"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play, TimerReset } from "lucide-react";
import React from "react";

import { useTimerStore } from "@/lib/store";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
	progress: {
		label: "Progress",
		color: "hsl(var(--primary))",
	},
} satisfies ChartConfig;

export default function PomodoroCardFocus() {
	const {
		focusTime,
		initialFocusTime,
		focusMode,
		startFocusTimer,
		pauseFocusTimer,
		resumeFocusTimer,
		resetFocusTimer,
		decrementFocusTimer,
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
					<Play className="size-4" /> Start Session
				</>
			);
		} else if (focusMode === "running" && focusTime > 0) {
			return (
				<>
					<Pause className="size-4" /> Pause
				</>
			);
		} else {
			return (
				<>
					<Play className="size-4" /> Resume Session
				</>
			);
		}
	};

	// Calculate progress percentage (0% to 100%)
	// Progress increases as time passes (starts at 0%, ends at 100%)
	const progress = ((initialFocusTime - focusTime) / initialFocusTime) * 100;

	// Chart data for RadialBar - shows progress from 0 to 100
	const chartData = [
		{
			name: "progress",
			value: progress, // Use actual progress value
			fill: "var(--chart-1)", // Blue color for progress
		},
	];

	// Format time display
	const minutes = Math.floor(focusTime / 60);
	const seconds = focusTime % 60;
	const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

	return (
		<>
			<CardContent className="flex-1 py-4 flex items-center justify-center min-h-[300px]">
				<div className="relative w-full min-w-[250px] flex flex-col items-center justify-center aspect-square">
					{/* Shadcn RadialBar Chart */}
					<ChartContainer
						config={chartConfig}
						className="absolute w-full h-full"
					>
						<RadialBarChart
							data={chartData}
							innerRadius="80%"
							outerRadius="100%"
							startAngle={90}
							endAngle={-270}
							barSize={6}
						>
							<PolarGrid stroke="hsl(var(--border))" strokeWidth={1} />
							<RadialBar
								dataKey="value"
								cornerRadius={6}
								background
								fill="hsl(var(--primary))"
							/>
						</RadialBarChart>
					</ChartContainer>

					{/* Center content overlay */}
					<div className="flex flex-col  items-center justify-center pointer-events-none">
						<div className="text-center">
							<div className="text-4xl font-semibold tabular-nums tracking-tighter text-white mb-2">
								{timeDisplay}
							</div>
							<div className="text-sm font-semibold uppercase text-gray-400 tracking-wide">
								MINUTES
							</div>
						</div>
					</div>
				</div>
			</CardContent>

			{/* Mobile Action Button */}
			<CardFooter className="flex p-0 gap-3 justify-center items-center">
				<div className="flex w-full gap-3">
					{focusMode === "paused" && (
						<Button
							variant={"ghostDestructive"}
							onClick={resetFocusTimer}
							className="w-fit"
							size={"xl"}
						>
							<TimerReset className="size-4" /> Reset
						</Button>
					)}

					<Button
						size={"xl"}
						className={`flex flex-1 ${focusMode === "running" ? "bg-transparent" : ""}`}
						variant="secondary"
						onClick={handleClick}
					>
						{buttonLabel()}
					</Button>
				</div>
			</CardFooter>
		</>
	);
}
