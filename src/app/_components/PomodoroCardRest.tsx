"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { Pause, Play, TimerReset } from "lucide-react";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
	minutes: {
		label: "Minutes",
	},
	rest: {
		label: "Rest",
		color: "hsl(var(--chart-2))",
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
		initialRestTime,
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
			<CardContent className="flex justify-center items-center py-8">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square w-full max-w-[250px]"
				>
					<RadialBarChart
						data={chartData}
						startAngle={90}
						endAngle={-270}
						innerRadius="70%"
						outerRadius="100%"
						barSize={20}
					>
						<PolarGrid
							gridType="circle"
							radialLines={false}
							stroke="none"
							className="first:fill-muted last:fill-background"
						/>
						<RadialBar dataKey="minutes" background cornerRadius={10} />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex justify-center items-center p-0">
				<Button
					className={`${restMode === "paused" ? "" : "hidden"} border-x-0 border-b-0 rounded-none`}
					size={"lg"}
					variant={"outlineDestructive"}
					onClick={resetRestTimer}
				>
					<TimerReset /> Reset
				</Button>
				<Button
					className={`shadow-none flex-1 rounded-none border-r-0 border-b-0 ${restMode === "running" ? "text" : "text-primary"}`}
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
