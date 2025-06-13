"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Pause, Play } from "lucide-react";
import React from "react";

export default function PomodoroCardFocus() {
	const [seconds, setSeconds] = React.useState(3600);
	const [isRunning, setisRunning] = React.useState(false);

	React.useEffect(() => {
		let interval: NodeJS.Timeout | undefined;
		if (isRunning) {
			interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
		} else if (!isRunning && seconds !== 0) {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, [isRunning, seconds]);

	return (
		<>
			<CardContent className="flex justify-center items-center">
				<div className="flex items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{seconds}</h3>
				</div>
			</CardContent>
			<CardFooter className="flex justify-center items-center">
				<Button
					variant={isRunning === true ? "ghost" : "default"}
					onClick={() => setisRunning(isRunning === true ? false : true)}
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
