import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play } from "lucide-react";
import React from "react";
import { useTimerStore } from "@/lib/store";
// import {
// 	Label,
// 	PolarGrid,
// 	PolarRadiusAxis,
// 	RadialBar,
// 	RadialBarChart,
// } from "recharts";
// import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export default function PomodoroCardFocus() {
	const { focusSeconds, isRunning, setIsRunning, decreaseFocusSeconds } =
		useTimerStore();

	React.useEffect(() => {
		let interval: NodeJS.Timeout | undefined;
		if (isRunning) {
			interval = setInterval(() => decreaseFocusSeconds(1), 1000);
		} else if (!isRunning && focusSeconds !== 0) {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, [isRunning, focusSeconds]);

	return (
		<>
			<CardContent className="flex items-center justify-center">
				{/* Chart */}
				<div className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{focusSeconds}</h3>
					<span className="mt-2 text-xs font-medium text-muted-foreground">
						SECONDS
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-center p-0 shadow-none">
				<Button
					size={"lg"}
					className="w-full rounded-t-none"
					variant={isRunning === true ? "secondary" : "default"}
					onClick={() => setIsRunning()}
				>
					{isRunning === true ? (
						<>
							<Pause />
							Pause
						</>
					) : (
						<>
							<Play />
							Start Session
						</>
					)}
				</Button>
			</CardFooter>
		</>
	);
}
