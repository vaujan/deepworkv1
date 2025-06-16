"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play } from "lucide-react";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";

export default function PomodoroCardFocus() {
	const { focusSeconds, isRunning, setIsRunning, decreaseFocusSeconds } =
		useTimerStore();

	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const hasCompletedRef = React.useRef(false);

	React.useEffect(() => {
		if (isRunning && focusSeconds > 0) {
			hasCompletedRef.current = false;
			intervalRef.current = setInterval(() => {
				decreaseFocusSeconds(1);
			}, 1000);
		} else if (focusSeconds === 0 && !hasCompletedRef.current) {
			hasCompletedRef.current = true;
			console.log(`Time's Up!`);
			setIsRunning();
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning, focusSeconds, setIsRunning, decreaseFocusSeconds]);

	return (
		<>
			<CardContent className="flex items-center justify-center">
				<div className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{formatTime(focusSeconds)}</h3>
					<span className="mt-2 text-xs font-medium text-muted-foreground">
						REMAINING TIME
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
