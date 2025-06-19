"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play, TimerReset } from "lucide-react";
import React from "react";
import { formatTime } from "@/lib/utils";

const INITIAL_TIME = 25 * 60;
type TimerMode = "idle" | "running" | "paused" | "finished";

export default function PomodoroCardFocus() {
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

	const handleReset = () => {
		if (currentMode === "paused" && time > 0) {
			setCurrentMode("idle");
			setTime(INITIAL_TIME);
		}
	};

	const handleStart = () => {
		if (currentMode == "idle" && time > 0) {
			setCurrentMode("running");
		}
	};

	const handleResume = () => {
		if (currentMode == "paused" && time > 0) {
			setCurrentMode("running");
		}
	};

	const handlePause = () => {
		if (currentMode === "running" && time > 0) {
			setCurrentMode("paused");
		}
	};

	const buttonLabel = () => {
		if (currentMode === "idle" && time > 0) {
			return (
				<>
					<Play /> Start session
				</>
			);
		} else if (currentMode === "running" && time > 0) {
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
					<h3 className="text-5xl font-semibold">{formatTime(time)}</h3>
					<span className="mt-2 text-xs font-medium text-muted-foreground">
						{currentMode === "paused" ? "PAUSED" : "REMAINING TIME"}
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-center p-0 shadow-none">
				<Button
					className={`${currentMode === "paused" ? "" : "hidden"} border-x-0 border-b-0 rounded-none`}
					size={"lg"}
					variant={"outlineDestructive"}
					onClick={handleReset}
				>
					<TimerReset /> Reset
				</Button>

				<Button
					size={"lg"}
					className={`rounded-none flex-1 border-r-0 border-b-0 shadow-none ${currentMode === "paused" ? "text-primary" : ""}`}
					variant={
						currentMode === "idle"
							? "default"
							: currentMode === "running"
								? "secondary"
								: "outline"
					}
					onClick={
						currentMode === "idle"
							? handleStart
							: currentMode === "running"
								? handlePause
								: handleResume
					}
				>
					{buttonLabel()}
				</Button>
			</CardFooter>
		</>
	);
}
