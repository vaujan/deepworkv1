import React from "react";
import { PopoverContent } from "@/components/ui/popover";
// import { useTimerStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function PomodoroCardPopoverSettings() {
	// const { focusSeconds, restSeconds } = useTimerStore();
	const [count, setCount] = React.useState(60);

	return (
		<PopoverContent className="w-56 rounded-xl">
			<div className="grid gap-8">
				<div className="grid w-full gap-3">
					{/* Focus time input */}
					<span className="text-center text-muted-foreground">Focus Time</span>
					<div className="flex items-center justify-center h-16 overflow-hidden rounded-lg border-1 border-border">
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => setCount(count - 360)}
						>
							<Minus />
						</Button>
						<Input
							readOnly
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							value={count < 360 ? 360 : Math.floor(count)}
						/>
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => setCount(count + 360)}
						>
							<Plus />
						</Button>
					</div>
				</div>
				<div className="grid w-full gap-3">
					{/* Focus time input */}
					<span className="text-center text-muted-foreground">Rest Time</span>
					<div className="flex items-center justify-center h-16 overflow-hidden rounded-lg border-1 border-border">
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => setCount(count - 360)}
						>
							<Minus />
						</Button>
						<Input
							readOnly
							className="h-full text-center border-0 rounded-none border-r-1 border-l-1"
							value={count < 360 ? 360 : Math.floor(count)}
						/>
						<Button
							className="h-full border-0 rounded-none shadow-none"
							variant={"outline"}
							onClick={() => setCount(count + 360)}
						>
							<Plus />
						</Button>
					</div>
				</div>
			</div>
		</PopoverContent>
	);
}
