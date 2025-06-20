import React from "react";
import { PopoverContent } from "@/components/ui/popover";
import { useTimerStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function PomodoroCardPopoverSettings() {
	const {
		initialFocusTime,
		initialRestTime,
		setInitialFocusTime,
		setInitialRestTime,
		focusMode,
		restMode,
	} = useTimerStore();

	const handleFocusTimeChange = (increment: boolean) => {
		const currentMinutes = Math.floor(initialFocusTime / 60);
		const newMinutes = increment
			? currentMinutes + 1
			: Math.max(1, currentMinutes - 1);
		setInitialFocusTime(newMinutes * 60);
	};

	const handleRestTimeChange = (increment: boolean) => {
		const currentMinutes = Math.floor(initialRestTime / 60);
		const newMinutes = increment
			? currentMinutes + 1
			: Math.max(1, currentMinutes - 1);
		setInitialRestTime(newMinutes * 60);
	};

	return (
		<PopoverContent className="w-56 rounded-xl">
			<div className="grid gap-8">
				<div className="grid w-full gap-3">
					<span className="text-center text-muted-foreground">Focus Time</span>
					<div className="flex items-center justify-center h-16 overflow-hidden rounded-lg border-1 border-border">
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => handleFocusTimeChange(false)}
						>
							<Minus />
						</Button>
						<Input
							readOnly
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							value={`${Math.floor(initialFocusTime / 60)} min`}
						/>
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => handleFocusTimeChange(true)}
						>
							<Plus />
						</Button>
					</div>
				</div>
				<div className="grid w-full gap-3">
					<span className="text-center text-muted-foreground">Rest Time</span>
					<div className="flex items-center justify-center h-16 overflow-hidden rounded-lg border-1 border-border">
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => handleRestTimeChange(false)}
							disabled={focusMode !== "idle" || restMode !== "idle"}
						>
							<Minus />
						</Button>
						<Input
							readOnly
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							value={`${Math.floor(initialRestTime / 60)} min`}
						/>
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => handleRestTimeChange(true)}
							disabled={focusMode !== "idle" || restMode !== "idle"}
						>
							<Plus />
						</Button>
					</div>
				</div>
			</div>
		</PopoverContent>
	);
}
