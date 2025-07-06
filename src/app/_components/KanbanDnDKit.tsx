import React from "react";

export default function KanbanDnDKit() {
	return (
		<div className="p-3 flex flex-col w-full h-16 rounded-lg bg-card">
			<span className="p-1 text-sm font-medium text-cyan-900 bg-cyan-200 rounded-lg dark:bg-cyan-950 dark:text-cyan-200">
				Kanban @dnd-kit
			</span>

			<div>Columns</div>
		</div>
	);
}
