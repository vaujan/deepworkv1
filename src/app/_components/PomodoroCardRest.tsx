import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { Pause, Play } from "lucide-react";
import { formatTime } from "@/lib/utils";

export default function PomodoroCardRest() {
	const { restSeconds, isRunning, setIsRunning, decreaseRestSeconds } =
		useTimerStore();

	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const hasCompletedRef = React.useRef(false);

	React.useEffect(() => {
		if (isRunning && restSeconds > 0) {
			hasCompletedRef.current = false;
			intervalRef.current = setInterval(() => {
				decreaseRestSeconds(1);
			}, 1000);
		} else if (restSeconds === 0 && !hasCompletedRef.current) {
			hasCompletedRef.current = true;
			console.log(`Rest time's up!`);
			setIsRunning();
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning, restSeconds, setIsRunning, decreaseRestSeconds]);

	return (
		<>
			<CardContent className="flex justify-center items-center">
				<div className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54">
					<h3 className="text-5xl font-semibold">{formatTime(restSeconds)}</h3>
					<span className="font-medium text-xs text-muted-foreground mt-2">
						REMAINING TIME
					</span>
				</div>
			</CardContent>
			<CardFooter className="flex p-0 justify-center items-center">
				<div className="w-full">
					<Button
						className={`shadow-none w-full rounded-t-none border-x-0 border-b-0 ${isRunning ? "text" : "text-primary"}`}
						variant={isRunning ? "secondary" : "outline"}
						onClick={() => setIsRunning()}
					>
						<div className="flex items-center gap-2">
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
						</div>
					</Button>
				</div>
			</CardFooter>
		</>
	);
}
