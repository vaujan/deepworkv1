"use client";

import { Button } from "../../components/ui/button";
import { EllipsisVertical, Play } from "lucide-react";
import { useState } from "react";

export default function PomodoroCard() {
	const [selectedId, setSelectedId] = useState(1);

	const menu = [
		{
			title: "Focus",
			id: 1,
		},
		{
			title: "Rest",
			id: 2,
		},
	];

	return (
		// Card header
		<div className="flex flex-col items-center justify-center w-full max-w-md h-fit">
			<div className="flex w-full">
				{menu.map((item: any) => (
					<Button
						className={`rounded-t-md rounded-b-none ${selectedId === item.id ? "bg-card text-card-foreground " : "bg-background text-muted-foreground"}`}
						onClick={() => setSelectedId(item.id)}
						variant={"secondary"}
					>
						{item.title}
					</Button>
				))}
			</div>

			{/* Card Content */}
			<div
				className={`flex z-10 flex-col items-center justify-center w-full gap-4 py-10 rounded-b-lg bg-card ${selectedId == 1 ? "rounded-tr-lg" : "rounded-t-lg"}`}
			>
				<div className="relative flex items-center justify-center w-full">
					<div className="flex items-center justify-center text-xs rounded-lg w-30 border-border border-1 h-30 bg-accent"></div>
				</div>
				<div className="flex gap-1.5">
					<Button
						className="text-xs border-0 rounded-full "
						size={"sm"}
						variant={"outline"}
					>
						+0:30
					</Button>
					<Button
						className="text-xs border-0 rounded-full "
						size={"sm"}
						variant={"outline"}
					>
						+1:00
					</Button>
					<Button
						className="text-xs border-0 rounded-full "
						size={"sm"}
						variant={"outline"}
					>
						+5:00
					</Button>
				</div>
				<Button variant={"default"} className="w-fit">
					<Play /> Start Session
				</Button>
			</div>
		</div>
	);
}
