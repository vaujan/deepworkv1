import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { Pause, Play, TimerReset } from "lucide-react";
import { formatTime } from "@/lib/utils";

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
	}, [restTime, restMode]);

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
					<Play /> Resume
				</>
			);
		}
	};

	return (
		<>
			<CardContent className="flex items-center justify-center">
				<div className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{formatTime(restTime)}</h3>
					<span className="mt-2 text-xs font-medium text-muted-foreground">
						{restMode === "paused" ? "PAUSED" : "REMAINING TIME"}
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-center p-0">
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
