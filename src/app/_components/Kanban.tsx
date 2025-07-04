import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import React from "react";

export default function Kanban() {
	return (
		<div className="flex gap-3 w-full rounded-xl min-h-72">
			<div className="flex gap-3">
				{/* Kanban list */}
				<div className="flex flex-col gap-2 p-3 rounded-lg bg-pink-950/50">
					<span className="font-medium">Hello world</span>
					{/* Kanban card */}
					<div className="flex relative gap-3 p-3 rounded-md bg-card">
						<GripVertical size={16} />
						<div>
							<h3 className="text-sm">Card title</h3>
							<p className="text-sm text-muted-foreground">Card description</p>
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
