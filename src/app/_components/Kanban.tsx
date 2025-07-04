"use client";

import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import { title } from "process";
import React from "react";
import { createSwapy, SwapEvent, Swapy } from "swapy";

interface KanbanListState {
	id: number;
	title: string;
}

const KANBAN_LIST: KanbanListState[] = [
	{
		id: 1,
		title: "Todo",
	},
	{
		id: 2,
		title: "In Progress",
	},
	{
		id: 3,
		title: "Done",
	},
	{
		id: 4,
		title: "Archived",
	},
];

interface KanbanCardState {
	id: number;
	statusId: number;
	title: string;
	description?: string;
}

const KANBAN_CARDS: KanbanCardState[] = [
	{
		id: 1,
		statusId: 1,
		title: "Learn swapy dnd",
		description:
			"Understand the underlying workings and core principles of swapy dnd",
	},
	{
		id: 2,
		statusId: 1,
		title: "Create kanban component",
		description: "Implement simple kanban movement in current UI",
	},
	{
		id: 3,
		statusId: 1,
		title: "Integrate DnD with Supabase",
		description:
			"Implement database integration to save and load drag and drop states ",
	},
];

export default function Kanban() {
	const swapy = React.useRef<Swapy>(null);
	const container = React.useRef(null);

	const [layoutState, setLayoutState] = React.useState<Swapy>();

	React.useEffect(() => {
		// If container element is loaded
		if (container.current) {
			swapy.current = createSwapy(container.current, {
				animation: "dynamic",
			});

			// Your event listeners
			swapy.current.onSwap((event: SwapEvent) => {
				console.log("swap", event);
			});
		}

		return () => {
			swapy.current?.destroy();
		};
	}, []);

	return (
		<div className="flex gap-3 w-full rounded-xl min-h-72">
			<div className="flex gap-3" ref={container}>
				{/* Kanban list */}
				<div data-swapy-slot="a">
					<div
						data-swapy-item="a"
						className="flex flex-col gap-2 p-3 h-full rounded-lg bg-pink-950/50"
					>
						<span className="font-medium">Hello world</span>
						{/* Kanban card */}
						<div className="flex relative gap-3 p-3 rounded-md bg-card">
							<GripVertical size={16} />
							<div>
								<h3 className="text-sm">Card title</h3>
								<p className="text-sm text-muted-foreground">
									Card description
								</p>
							</div>
						</div>
					</div>
				</div>

				<div data-swapy-slot="b">
					<div
						data-swapy-item="b"
						className="flex flex-col gap-2 p-3 h-full rounded-lg min-w-3xs bg-cyan-950/50"
					>
						<span className="font-medium">Hai Dunia!</span>
						{/* Kanban card */}
						<div className="flex relative gap-3 p-3 rounded-md bg-card">
							<GripVertical size={16} />
							<div>
								<h3 className="text-sm">Card title</h3>
								<p className="text-sm text-muted-foreground">
									Card description
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Button className="h-full size-8" variant={"secondary"}>
				<Plus />
			</Button>
		</div>
	);
}
