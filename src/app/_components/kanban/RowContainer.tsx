import React from "react";
import { RowProps } from "./types";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RowContainer(rows: RowProps) {
	const { row, onDeleteRow } = rows;
	const [mouseIsOver, setMouseIsOver] = React.useState(false);

	return (
		<div
			onMouseEnter={() => setMouseIsOver(true)}
			onMouseLeave={() => setMouseIsOver(false)}
			className="flex gap-3 justify-between p-2 mb-2 rounded-lg border bg-secondary"
		>
			<div className="flex flex-col gap-2">
				<span>{row.title}</span>
				<p>{row.description}</p>
			</div>
			{mouseIsOver && (
				<Button
					onClick={() => onDeleteRow(row.id)}
					size="sm"
					className="size-8 shadow-none opacity-60 hover:opacity-100"
					variant={"ghostDestructive"}
				>
					<Trash />
				</Button>
			)}
		</div>
	);
}
