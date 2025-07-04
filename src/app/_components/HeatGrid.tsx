import React, { StyleHTMLAttributes } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HeatGrid() {
	const dummyData = [
		{ date: "2024-01-01", timeSpent: 120 }, // 2 hours
		{ date: "2024-01-02", timeSpent: 180 }, // 3 hours
		{ date: "2024-01-03", timeSpent: 60 }, // 1 hour
		{ date: "2024-01-04", timeSpent: 240 }, // 4 hours
		{ date: "2024-01-05", timeSpent: 90 }, // 1.5 hours
		{ date: "2024-01-06", timeSpent: 150 }, // 2.5 hours
		{ date: "2024-01-07", timeSpent: 0 }, // no deep work
		{ date: "2024-01-08", timeSpent: 180 }, // 3 hours
		{ date: "2024-01-09", timeSpent: 120 }, // 2 hours
		{ date: "2024-01-10", timeSpent: 210 }, // 3.5 hours
		{ date: "2024-01-11", timeSpent: 150 }, // 2.5 hours
		{ date: "2024-01-12", timeSpent: 90 }, // 1.5 hours
		{ date: "2024-01-13", timeSpent: 0 }, // no deep work
		{ date: "2024-01-14", timeSpent: 180 }, // 3 hours
		{ date: "2024-01-15", timeSpent: 240 }, // 4 hours
		{ date: "2024-01-16", timeSpent: 120 }, // 2 hours
		{ date: "2024-01-17", timeSpent: 150 }, // 2.5 hours
		{ date: "2024-01-18", timeSpent: 180 }, // 3 hours
		{ date: "2024-01-19", timeSpent: 60 }, // 1 hour
		{ date: "2024-01-20", timeSpent: 0 }, // no deep work
		{ date: "2024-01-21", timeSpent: 90 }, // 1.5 hours
		{ date: "2024-01-22", timeSpent: 210 }, // 3.5 hours
		{ date: "2024-01-23", timeSpent: 150 }, // 2.5 hours
		{ date: "2024-01-24", timeSpent: 180 }, // 3 hours
		{ date: "2024-01-25", timeSpent: 120 }, // 2 hours
		{ date: "2024-01-26", timeSpent: 240 }, // 4 hours
		{ date: "2024-01-27", timeSpent: 0 }, // no deep work
		{ date: "2024-01-28", timeSpent: 150 }, // 2.5 hours
		{ date: "2024-01-29", timeSpent: 180 }, // 3 hours
		{ date: "2024-01-30", timeSpent: 120 }, // 2 hours
	];

	return (
		<div className="flex flex-col flex-wrap gap-1 p-2 w-full rounded-xl border border-border">
			{/* Import deep work session dots here */}
		</div>
	);
}

function DotComponent({
	date,
	timeSpent,
}: {
	date: string;
	timeSpent: number;
}) {
	return (
		<Tooltip>
			<TooltipTrigger
				className={`w-4 h-4 rounded-sm bg-foreground`}
			></TooltipTrigger>
			<TooltipContent>
				<p>{date}</p>
				<span>Time spent deep:{timeSpent} minutes</span>
			</TooltipContent>
		</Tooltip>
	);
}
