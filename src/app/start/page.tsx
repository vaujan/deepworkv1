"use client";

import Header from "@/app/_components/Header";
// import Kanban from "@/app/_components/Kanban";
import PomodoroCard from "@/app/_components/PomodoroCard";
// import Stats from "@/app/_components/Stats";
import TodoList from "@/app/_components/TodoList";
import useDynamicTitle from "@/hooks/use-dynamic-title";
import React from "react";

export default function Start() {
	// Change title
	useDynamicTitle();

	return (
		<div className="flex flex-col gap-8 pb-12 w-full">
			<Header>Learn Backend JavaScript</Header>

			<section className="flex flex-col gap-8 px-8 md:flex-row">
				<PomodoroCard />
				{/* <Stats /> */}
			</section>

			<section className="flex gap-8 px-8">
				{/* <Kanban /> */}
				<TodoList />
			</section>
		</div>
	);
}
