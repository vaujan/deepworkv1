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
			fill: "hsl(var(--primary))",
		},
	];

	// Debug logging
	console.log("Timer Debug:", {
		initialFocusTime,
		focusTime,
		progress,
		chartValue: chartData[0].value,
		focusMode,
	});

	// Format time display
	const minutes = Math.floor(focusTime / 60);
	const seconds = focusTime % 60;
	const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

	return (
		<>
			<CardContent className="flex-1 flex items-center justify-center py-12 px-4">
				<div className="relative w-full max-w-[280px] aspect-square mx-auto">
					{/* Shadcn RadialBar Chart */}
					<ChartContainer config={chartConfig} className="w-full h-full">
						<RadialBarChart
							data={chartData}
							innerRadius="60%"
							outerRadius="90%"
							startAngle={180}
							endAngle={-180}
							barSize={16}
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
					<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
						<div className="text-center">
							<div className="text-4xl font-semibold tabular-nums tracking-tighter text-white mb-2">
								{timeDisplay}
							</div>
							<div className="text-sm font-medium uppercase text-gray-400 tracking-wide">
								{Math.round(progress)}% Complete
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
						className="flex rounded- flex-1"
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
