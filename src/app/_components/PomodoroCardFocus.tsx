"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Circle } from "lucide-react";
import React from "react";
// import { useTimerStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";

const INITIAL_TIME = 25 * 60;
type TimerMode = "idle" | "running" | "paused" | "finished";

export default function PomodoroCardFocus() {
	// const { time, currentMode, setCurrentMode, setTime } = useTimerStore();

	const [time, setTime] = React.useState<number>(INITIAL_TIME);
	const [currentMode, setCurrentMode] = React.useState<TimerMode>("idle");

	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (currentMode === "running" && time > 0) {
			intervalRef.current = setInterval(() => {
				setTime((prev) => {
					if (prev <= 0) {
						setCurrentMode("finished");
						return 0;
					}
					return prev - 1;
				});
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
	}, [time, currentMode]);

	const handleStart = () => {
		if (currentMode == "idle" && time > 0) {
			setCurrentMode("running");
		}
	};

	return (
		<>
			<CardContent className="flex items-center justify-center">
				<div className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{formatTime(time)}</h3>
					<span className="mt-2 text-xs font-medium text-muted-foreground">
						REMAINING TIME
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-center p-0 shadow-none">
				<Button
					size={"lg"}
					className="w-full rounded-t-none"
					variant={currentMode === "running" ? "secondary" : "default"}
					onClick={handleStart}
				>
					<Circle />
					Button Text
				</Button>
			</CardFooter>
		</>
	);
}
