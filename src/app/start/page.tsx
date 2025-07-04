"use client";

import Header from "@/app/_components/Header";
import PomodoroCard from "@/app/_components/PomodoroCard";
import TodoList from "@/app/_components/TodoList";
import { Button } from "@/components/ui/button";
import useDynamicTitle from "@/hooks/use-dynamic-title";
import { testDatabaseConnection } from "@/lib/test-database";
import React from "react";
import HeatGrid from "../_components/HeatGrid";
import Kanban from "../_components/Kanban";
import { createSwapy, SwapEvent, Swapy } from "swapy";

export default function Start() {
	// Change title
	useDynamicTitle();

	const container = React.useRef(null);
	const swapy = React.useRef<Swapy>(null);

	React.useEffect(() => {
		if (container.current) {
			swapy.current = createSwapy(container.current, {
				animation: "dynamic",
			});

			swapy.current.onSwap((event: SwapEvent) => {
				console.log("Swapping widgets!:", event);
			});
		}
	}, []);

	const handleTestDatabse = async () => {
		console.log("Running database test...");

		const result = await testDatabaseConnection();

		if (result) {
			console.log("Database test passed!✅");
		} else {
			console.log("Database test failed....❌");
		}
	};

	return (
		<div className="flex flex-col gap-8 pb-12 w-full">
			<div className="flex justify-between items-center">
				<Header>Learn Backend JavaScript</Header>

				<Button
					variant={"secondary"}
					className="mr-8"
					size={"sm"}
					onClick={handleTestDatabse}
				>
					Test database connection
				</Button>
			</div>
			<section className="flex flex-col gap-8 px-8 md:flex-row">
				<div>
					<PomodoroCard />
				</div>
				<div>
					<HeatGrid />
				</div>
			</section>

			<section className="flex gap-8 px-8">
				<Kanban />
			</section>

			<section className="flex gap-8 px-8">
				<TodoList />
			</section>
		</div>
	);
}
