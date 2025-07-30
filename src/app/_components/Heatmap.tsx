"use client";

import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Heatmap() {
	const isMobile = useIsMobile();

	const data = [
		// Generate daily data for 2025 with value representing minutes of deep work (randomized between 20 and 120)
		...Array.from({ length: 62 }, (_, i) => {
			// July 1st is month 6 (0-indexed), so July 1 = new Date(2025, 6, 1)
			const date = new Date(2025, 6, 1 + i);
			const day = date.toISOString().slice(0, 10);
			// Only generate values for July and August
			const value = Math.floor(60 + 40 * Math.sin(i / 10) + Math.random() * 20);
			return { day, value };
		}),
	];

	const chartColors = [
		"var(--chart-4)",
		"var(--chart-3)",
		"var(--chart-2)",
		"var(--chart-1)",
	];

	const values = data.map((d) => d.value);
	const minValue = Math.min(...values);
	const maxValue = Math.max(...values);

	const getColorForValue = (value: number) => {
		if (value === null || value === undefined) {
			return "transparent";
		}

		const percentage = (value - minValue) / (maxValue - minValue);
		const colorIndex = Math.min(
			Math.floor(percentage * chartColors.length),
			chartColors.length - 1
		);
		return chartColors[colorIndex];
	};

	return (
		<Card className="w-full bg-transparent border-0 h-fit">
			<CardHeader>
				<CardTitle>Focus Activity</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="md:h-32 min-w-md h-full">
					<ResponsiveCalendar
						direction={isMobile === true ? "vertical" : "horizontal"}
						data={data}
						from="2025-01-01"
						to="2025-12-31"
						emptyColor="var(--card)"
						colors={chartColors}
						margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
						daySpacing={2}
						yearSpacing={40}
						dayBorderWidth={2}
						dayBorderColor="var(--background)"
						monthBorderWidth={0}
						theme={{
							text: {
								fill: "var(--foreground)",
								fontSize: 12,
							},
							tooltip: {
								container: {
									background: "var(--popover)",
									color: "var(--popover-foreground)",
									fontSize: 12,
									borderRadius: "var(--radius)",
									boxShadow: "var(--shadow-md)",
									border: "1px solid var(--border)",
								},
							},
						}}
						tooltip={({ day }) => {
							const dayData = data.find((d) => d.day === day);

							// Don't show a tooltip for days with no activity
							if (!dayData || typeof dayData.value !== "number") {
								return null;
							}

							const { value } = dayData;
							const color = getColorForValue(value);
							return (
								<div className="bg-popover flex items-center	 text-popover-foreground  align-middle  gap-3 min-w-[200px] w-fit p-2 rounded-md border shadow-md">
									<div
										className="w-2 h-10 my-1 rounded-xs"
										style={{ backgroundColor: color }}
									/>
									<div className="flex flex-col">
										<strong className="w-fit">
											{new Date(day).toLocaleDateString(undefined, {
												month: "long",
												day: "numeric",
												timeZone: "UTC",
											})}
										</strong>
										<p className="text-muted-foreground">{value} minutes</p>
									</div>
								</div>
							);
						}}
					/>
				</div>
				<div className="flex text-xs items-center justify-center text-muted-foreground gap-2 mt-4">
					<span>Less</span>
					<div className="flex gap-1 overflow-clip">
						{chartColors.map((color) => (
							<div
								key={color}
								className="w-3 h-3 rounded-xs"
								style={{ backgroundColor: color }}
							/>
						))}
					</div>
					<span>More</span>
				</div>
			</CardContent>
		</Card>
	);
}
