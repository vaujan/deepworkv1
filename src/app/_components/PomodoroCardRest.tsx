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
	minutes: {
		label: "Minutes",
	},
	rest: {
		label: "Rest",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export default function PomodoroCardRest() {
	const {
		restTime,
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
					<Play /> Start rest
				</>
			);
		} else if (restMode === "running" && restTime > 0) {
			return (
				<>
					<Pause /> Pause
				</>
			);
		} else {
			return (
				<>
					<Play /> Resume rest
				</>
			);
		}
	};

	const chartData = [
		{ month: "rest", minutes: restTime, fill: "var(--color-rest)" },
	];

	return (
		<>
			<CardContent className="flex-1 flex items-center justify-center py-8">
				<div className="relative w-full max-w-[250px] aspect-square mx-auto">
					<ChartContainer config={chartConfig} className="absolute inset-0">
						<RadialBarChart
							data={chartData}
							startAngle={90}
							endAngle={-270}
							innerRadius="70%"
							outerRadius="100%"
							barSize={20}
						>
							<PolarGrid
								gridType="polygon"
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
							<div className="text-2xl font-bold tabular-nums tracking-tighter text-foreground">
								{formatTime(restTime)}
							</div>
							<div className="text-sm font-medium uppercase text-muted-foreground mt-1">
								{restMode === "paused" ? "Paused" : "Rest"}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex gap-3 justify-center items-center p-0">
				<Button
					className={`${restMode === "paused" ? "" : "hidden"} `}
					size={"lg"}
					variant={"ghostDestructive"}
					onClick={resetRestTimer}
				>
					<TimerReset /> Reset
				</Button>
				<Button
					className={` ${restMode === "running" ? "text" : "text-primary"}`}
					size={"lg"}
					variant={
						restMode === "idle"
							? "secondary"
							: restMode === "running"
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
