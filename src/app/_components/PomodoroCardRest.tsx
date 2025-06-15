import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { useTimerStore } from "@/lib/store";
import { Pause, Play } from "lucide-react";
import { motion } from "motion/react";

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
				<motion.div
					className="flex flex-col items-center justify-center h-32 transition-all rounded-lg w-54"
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					<motion.h3
						className="text-5xl font-semibold"
						key={restSeconds}
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.2 }}
					>
						{restSeconds}
					</motion.h3>
					<motion.span
						className="font-medium text-xs text-muted-foreground mt-2"
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						SECONDS
					</motion.span>
				</motion.div>
			</CardContent>
			<CardFooter className="flex p-0 justify-center items-center">
				<motion.div
					className="w-full"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<Button
						size={"lg"}
						className="shadow-none w-full rounded-t-none"
						variant={isRunning === true ? "secondary" : "default"}
						onClick={() => setIsRunning()}
					>
						<motion.div
							className="flex items-center gap-2"
							initial={false}
							animate={{ scale: isRunning ? 0.95 : 1 }}
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
						</motion.div>
					</Button>
				</motion.div>
			</CardFooter>
		</>
	);
}
