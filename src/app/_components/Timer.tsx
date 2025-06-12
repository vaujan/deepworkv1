"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { loadTotalMinutes, saveTotalMinutes } from "@/lib/storage";

export default function Timer() {
	const [seconds, setSeconds] = useState(25 * 60); // Default 25 minutes
	const [isActive, setIsActive] = useState(false);
	const [totalMinutes, setTotalMinutes] = useState(loadTotalMinutes());

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (isActive && seconds > 0) {
			interval = setInterval(() => {
				setSeconds((prev) => prev - 1);
			}, 1000);
		} else if (seconds === 0) {
			setIsActive(false);
			const minutesSpent = 25 - Math.floor(seconds / 60);
			const newTotal = totalMinutes + minutesSpent;
			setTotalMinutes(newTotal);
			saveTotalMinutes(newTotal);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, seconds, totalMinutes]);

	const startTimer = () => setIsActive(true);
	const pauseTimer = () => setIsActive(false);
	const resetTimer = () => {
		setIsActive(false);
		setSeconds(25 * 60);
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	return (
		<div className="p-4 rounded-sm shadow w-fit bg-card">
			<h2 className="mb-2 text-xl font-semibold">Deep Work Timer</h2>
			<div className="mb-4 font-mono text-4xl">{formatTime(seconds)}</div>
			<div className="flex gap-2 mb-4">
				<Button onClick={startTimer} disabled={isActive}>
					Start
				</Button>
				<Button onClick={pauseTimer} disabled={!isActive}>
					Pause
				</Button>
				<Button onClick={resetTimer}>Reset</Button>
			</div>
			<p>
				Total Active Minutes: <span className="font-bold">{totalMinutes}</span>
			</p>
		</div>
	);
}
