import React from "react";
import { PopoverContent } from "@/components/ui/popover";
import { useTimerStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { TimeSettingsInput } from "@/components/ui/time-settings-input";

export default function PomodoroCardPopoverSettings() {
	const {
		initialFocusTime,
		initialRestTime,
		setInitialFocusTime,
		setInitialRestTime,
		focusMode,
		restMode,
	} = useTimerStore();

	// const [focusMinutes, setFocusMinutes] = React.useState(initialFocusTime);
	// const [restMinutes, setRestMinutes] = React.useState(initialRestTime);

	const handleFocusTimeChange = (increment: boolean) => {
		const currentMinutes = Math.floor(initialFocusTime / 60);
		const incrementValue = () => {
			if (currentMinutes <= 1) {
				return 4;
			}
			return 5;
		};
		const newMinutes = increment
			? currentMinutes + incrementValue()
			: Math.max(1, currentMinutes - incrementValue());
		setInitialFocusTime(newMinutes * 60);
	};

	const handleRestTimeChange = (increment: boolean) => {
		const currentMinutes = Math.floor(initialRestTime / 60);
		const incrementvalue = () => {
			if (currentMinutes <= 1) {
				return 4;
			}
			return 5;
		};
		const newMinutes = increment
			? currentMinutes + incrementvalue()
			: Math.max(1, currentMinutes - incrementvalue());
		setInitialRestTime(newMinutes * 60);
	};

	const restInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInitialRestTime(event.target.value);
	};

	const focusInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInitialFocusTime(event.target.value);
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
						<TimeSettingsInput
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							// value={`${Math.floor(initialFocusTime / 60)} min`}
							type="number"
							value={initialFocusTime}
							onChange={focusInputOnChange}
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
						<TimeSettingsInput
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							type="number"
							value={initialRestTime}
							onChange={restInputOnChange}
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
