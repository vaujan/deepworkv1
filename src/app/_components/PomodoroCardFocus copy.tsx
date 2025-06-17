"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play } from "lucide-react";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";

export default function PomodoroCardFocus() {
	const {
		focusSeconds,
		isSessionStarted,
		setisSessionStarted,
		isPaused,
		setIsPaused,
		decreaseFocusSeconds,
	} = useTimerStore();

	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
	// const hasCompletedRef = React.useRef(false);

	React.useEffect(() => {
		if (isSessionStarted === true && isPaused === false && focusSeconds > 0) {
			intervalRef.current = setInterval(() => {
				decreaseFocusSeconds(1);
			}, 1000);

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		}
	}, [
		isSessionStarted,
		setisSessionStarted,
		focusSeconds,
		isPaused,
		setIsPaused,
	]);

	/* 	React.useEffect(() => {
		if (isSessionStarted === false && isPaused === true && focusSeconds > 0) {
			setisSessionStarted();
			intervalRef.current = setInterval(() => {
				decreaseFocusSeconds(1);
			}, 1000);
		} else if (
			isSessionStarted === true &&
			isPaused === false &&
			focusSeconds === 0
		) {
			hasCompletedRef.current = true;
			console.log(`Time's Up!`);
			setisSessionStarted();
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [
		isSessionStarted,
		focusSeconds,
		setisSessionStarted,
		decreaseFocusSeconds,
	]);
 */

	const toggleButton = () => {
		if (isSessionStarted === false && isPaused === false) {
			setisSessionStarted();
			// setIsPaused();
		} else if (
			isSessionStarted === true &&
			focusSeconds > 0 &&
			isPaused === false
		) {
			// if session is started, but timer is not paused, then pause timer
			setIsPaused();
		} else if (isSessionStarted === true && isPaused === true) {
			// if session is started, but timer is paused, then unpause timer
			setIsPaused();
		} else if (isSessionStarted === false && isPaused === true) {
			alert("Timer up");
		}
	};

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
					variant={isPaused === true ? "secondary" : "default"}
					onClick={toggleButton}
				>
					{isPaused === true ? (
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
