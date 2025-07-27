"use client";

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

	const [focusMinutes, setFocusMinutes] = React.useState(initialFocusTime / 60);
	const [restMinutes, setRestMinutes] = React.useState(initialRestTime / 60);

	// Handle conversions from minutes to seconds and prevent < 0 values
	React.useEffect(() => {
		if (restMinutes < 0) setFocusMinutes(1);
		else if (focusMinutes <= 0) setFocusMinutes(1);

		setInitialFocusTime(focusMinutes * 60);
		setInitialRestTime(restMinutes * 60);
	}, [focusMinutes, restMinutes]);

	const handleFocusTimeChange = (increment: boolean) => {
		const incrementValue = () => {
			if (focusMinutes <= 1) {
				return 4;
			}
			return 5;
		};

		const newMinutes = increment
			? focusMinutes + incrementValue()
			: Math.max(1, focusMinutes - incrementValue()); // Prevent value < 1
		setFocusMinutes(newMinutes);
	};

	const handleRestTimeChange = (increment: boolean) => {
		const incrementValue = () => {
			if (restMinutes <= 1) {
				return 4;
			}
			return 5;
		};

		const newMinutes = increment
			? restMinutes + incrementValue()
			: Math.max(1, restMinutes - incrementValue());
		setRestMinutes(newMinutes);
	};

	const restInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(event.target.value) || 1;
		setRestMinutes(value);
	};

	const focusInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(event.target.value) || 1;
		setFocusMinutes(value);
	};

	return (
		<PopoverContent className="w-56 rounded-xl">
			<div className="grid gap-8">
				<div className="grid gap-3 w-full">
					<span className="text-center text-muted-foreground">
						Focus minutes
					</span>
					<div className="flex overflow-hidden justify-between items-center h-16 rounded-lg transition-all ease-out border-1 border-border">
						<Button
							className="h-full "
							variant={"outline"}
							onClick={() => handleFocusTimeChange(false)}
						>
							<Minus />
						</Button>
						<TimeSettingsInput
							className="flex h-full text-center rounded-lg border-0 w-15"
							type="number"
							id="focus"
							value={Math.floor(focusMinutes)}
							min={1}
							onChange={focusInputOnChange}
						/>
						<Button
							className="h-full "
							variant={"outline"}
							onClick={() => handleFocusTimeChange(true)}
						>
							<Plus />
						</Button>
					</div>
				</div>
				<div className="grid gap-3 w-full">
					<span className="text-center text-muted-foreground">
						Rest minutes
					</span>
					<div className="flex overflow-hidden justify-between items-center h-16 rounded-lg transition-all ease-out border-1 border-border">
						<Button
							className="h-full"
							variant={"outline"}
							onClick={() => handleRestTimeChange(false)}
							disabled={focusMode !== "idle" || restMode !== "idle"}
						>
							<Minus />
						</Button>
						<TimeSettingsInput
							className="flex h-full text-center rounded-lg border-0 w-15"
							type="number"
							id="rest"
							value={Math.floor(restMinutes)}
							min={1}
							onChange={restInputOnChange}
						/>
						<Button
							className="h-full "
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
