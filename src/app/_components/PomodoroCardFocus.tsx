"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play, TimerReset } from "lucide-react";
import React from "react";
import { formatTime } from "@/lib/utils";
import { useTimerStore } from "@/lib/store";

export default function PomodoroCardFocus() {
	const {
		focusTime,
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
	}, [focusTime, focusMode]);

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
					<Play /> Resume
				</>
			);
		}
	};

	return (
		<>
			{" "}
			<CardContent className="flex items-center justify-center">
				<div className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{formatTime(focusTime)}</h3>
					<span className="mt-2 text-xs font-medium text-muted-foreground">
						{focusMode === "paused" ? "PAUSED" : "REMAINING TIME"}
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-center p-0 shadow-none">
				<Button
					className={`${focusMode === "paused" ? "" : "hidden"} border-x-0 border-b-0 rounded-none`}
					size={"lg"}
					variant={"outlineDestructive"}
					onClick={resetFocusTimer}
				>
					<TimerReset /> Reset
				</Button>

				<Button
					size={"lg"}
					className={`rounded-none flex-1 border-r-0 border-b-0 shadow-none ${focusMode === "paused" ? "text-primary" : ""}`}
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
