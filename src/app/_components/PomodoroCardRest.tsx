"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { Pause, Play, TimerReset } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
	progress: {
		label: "Progress",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export default function PomodoroCardRest() {
	const [timerProgress, setTimerProgress] = React.useState(0);

	const {
		restTime,
		initialRestTime,
		restMode,
		startRestTimer,
		pauseRestTimer,
		resumeRestTimer,
		resetRestTimer,
		decrementRestTimer,
	} = useTimerStore();

	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (restMode === "running" && restTime > 0) {
			intervalRef.current = setInterval(() => {
				decrementRestTimer();
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [restTime, restMode, decrementRestTimer]);

	const handleClick = () => {
		if (restMode === "idle" && restTime > 0) {
			startRestTimer();
		} else if (restMode === "running" && restTime > 0) {
			pauseRestTimer();
		} else if (restMode === "paused" && restTime > 0) {
			resumeRestTimer();
		}
	};

	const buttonLabel = () => {
		if (restMode === "idle" && restTime > 0) {
			return (
				<>
					<Play className="size-4" /> Start Rest
				</>
			);
		} else if (restMode === "running" && restTime > 0) {
			return (
				<>
					<Pause className="size-4" /> Pause
				</>
			);
		} else {
			return (
				<>
					<Play className="size-4" /> Resume Rest
				</>
			);
		}
	};

	// Calculate progress percentage (0% to 100%)
	// Progress increases as time passes (starts at 0%, ends at 100%)
	const progress = ((initialRestTime - restTime) / initialRestTime) * 100;

	// Chart data for RadialBar - shows progress from 0 to 100
	const chartData = [
		{
			name: "progress",
			value: progress, // Use actual progress value
			fill: "var(--chart-2)", // Rest color for progress
		},
	];

	// Format time display
	const minutes = Math.floor(restTime / 60);
	const seconds = restTime % 60;
	const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

	React.useEffect(() => {});

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
					{restMode === "paused" && (
						<Button
							variant={"ghostDestructive"}
							onClick={resetRestTimer}
							className="w-fit"
							size={"xl"}
						>
							<TimerReset className="size-4" /> Reset
						</Button>
					)}

					<Button
						size={"xl"}
						className={`flex flex-1 ${restMode === "running" ? "bg-transparent" : ""}`}
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
