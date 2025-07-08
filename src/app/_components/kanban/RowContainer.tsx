import React from "react";
import { RowProps } from "./types";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RowContainer(rows: RowProps) {
	const { row, onDeleteRow } = rows;

	return (
		<div className="flex gap-3 justify-between p-2 mb-2 rounded-lg border bg-secondary">
			<div className="flex flex-col gap-2">
				<span>{row.title}</span>
				<p>{row.description}</p>
			</div>
			<Button
				onClick={() => onDeleteRow(row.id)}
				size="sm"
				className="size-8"
				variant={"ghost"}
			>
				<Trash />
			</Button>
		</div>
	);
}
