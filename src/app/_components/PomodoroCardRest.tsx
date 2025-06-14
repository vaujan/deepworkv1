import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { Pause, Play } from "lucide-react";

export default function PomodoroCardRest() {
	const { restSeconds, isRunning, setIsRunning, decreaseRestSeconds } =
		useTimerStore();

	React.useEffect(() => {
		let interval: NodeJS.Timeout | undefined;

		if (isRunning) {
			interval = setInterval(() => decreaseRestSeconds(1), 1000);
		} else if (!isRunning && restSeconds !== 0) {
			clearInterval(interval);
		}
		return () => {
			clearInterval(interval);
		};
	}, [isRunning, restSeconds]);

	return (
		<>
			<CardContent className="flex justify-center items-center">
				<div className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{restSeconds}</h3>
					<span className="font-medium text-xs text-muted-foreground mt-2">
						SECONDS
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex p-0 justify-center items-center">
				<Button
					size={"lg"}
					className="shadow-none w-full rounded-t-none"
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
							Start Rest
						</>
					)}
				</Button>
			</CardFooter>
		</>
	);
}
