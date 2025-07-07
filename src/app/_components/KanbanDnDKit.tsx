import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface Column {
	id: string;
	title: string;
}

export default function KanbanDnDKit() {
	const [columns, setColumns] = React.useState<Column[]>([]);

	const logColumns = () => {
		console.log("columns:", columns);
	};

	const handleAddColumn = () => {
		setColumns([
			...columns,
			{
				id: uuidv4(),
				title: "New Column",
			},
		]);

		logColumns();
	};

	return (
		<div className="flex flex-col w-full h-fit gap-3 rounded-lg">
			<div className="flex justify-between">
				<span className="p-1 w-fit text-sm font-medium text-cyan-900 bg-cyan-200 rounded-lg dark:bg-cyan-950 dark:text-cyan-200">
					Kanban @dnd-kit
				</span>

				<Button
					onClick={() => setColumns([])}
					variant={"outline"}
					size={"icon"}
					className="size-8"
				>
					<Trash />
				</Button>
			</div>

			<div className="flex gap-3">
				{columns?.map((column) => (
					<div
						className="min-h-64 flex flex-col w-full min-w-64 gap-3 p-2 border rounded-lg group hover:border-border/50 "
						key={column.id}
					>
						<span className="text-sm font-medium text-muted-foreground">
							{column.title}
						</span>

						{/* Task list for each column */}
						<div className="flex h-full flex-col overflow-x-auto ">
							<div className="p-2 bg-cyan-500/20 h-fit rounded-lg text-sm flex flex-col">
								<span>Task title</span>
								<p>Task description</p>
							</div>
						</div>
						<Button
							size={"sm"}
							className="text-xs bg-transparent hover:border-1 border-0 opacity-0 group-hover:opacity-100 "
							variant={"outline"}
						>
							<Plus />
						</Button>
					</div>
				))}
			</div>
			<Button className="w-fit" variant={"outline"} onClick={handleAddColumn}>
				<Plus />
				Add Column
			</Button>
		</div>
	);
}
