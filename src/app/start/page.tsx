"use client";

import Header from "@/app/_components/Header";
import PomodoroCard from "@/app/_components/PomodoroCard";
import TodoList from "@/app/_components/TodoList";
import useDynamicTitle from "@/hooks/use-dynamic-title";
import React from "react";
// import KanbanSwapy from "../_components/KanbanSwapy";
import KanbanDnDKit from "../_components/KanbanDnDKit";

export default function Start() {
	// Change title
	useDynamicTitle();

	// const handleTestDatabse = async () => {
	// 	console.log("Running database test...");

	// 	const result = await testDatabaseConnection();

	// 	if (result) {
	// 		console.log("Database test passed!✅");
	// 	} else {
	// 		console.log("Database test failed....❌");
	// 	}
	// };

	return (
		<div className="flex flex-col gap-8 pb-12 w-full">
			<div className="flex justify-between items-center">
				<Header>Learn Backend JavaScript</Header>
			</div>

			<section className="flex flex-col gap-8 px-8">
				<div className="flex flex-col gap-8 w-full md:flex-row">
					<PomodoroCard />
					<TodoList />
				</div>

				<div className="w-full">
					<KanbanDnDKit />
				</div>

				<div className="w-full">{/* <KanbanSwapy /> */}</div>
			</section>

			<section className="flex gap-8 items-end px-8 h-full">
				{/* Footer */}
				{/* Additional content can go here */}
				<div className="flex justify-between p-2 -mb-6 w-full text-xs text-muted-foreground/50">
					<span>Development Version (Beta) • Not for production use</span>
					<span>
						© {new Date().getFullYear()} deepflow.click | Built with ❤️ from
						Indonesia
					</span>
				</div>
			</section>
		</div>
	);
}
