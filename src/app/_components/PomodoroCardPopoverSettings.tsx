import React from "react";
import { PopoverContent } from "@/components/ui/popover";
import { useTimerStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function PomodoroCardPopoverSettings() {
	const { focusTime, restTime, setRestTime, setFocusTime } = useTimerStore();

	return (
		<PopoverContent className="w-56 rounded-xl">
			<div className="grid gap-8">
				<div className="grid w-full gap-3">
					<span className="text-center text-muted-foreground">Focus Time</span>
					<div className="flex items-center justify-center h-16 overflow-hidden rounded-lg border-1 border-border">
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							// onClick={}
						>
							<Minus />
						</Button>
						<Input
							readOnly
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							value={`${Math.floor(focusTime / 60)} min`}
						/>
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
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
						>
							<Minus />
						</Button>
						<Input
							readOnly
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							value={`${Math.floor(restTime / 60)} min`}
						/>
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
						>
							<Plus />
						</Button>
					</div>
				</div>
			</div>
		</PopoverContent>
	);
}
