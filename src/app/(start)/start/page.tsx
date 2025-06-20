"use client";

import Header from "@/app/_components/Header";
import Kanban from "@/app/_components/Kanban";
import PomodoroCard from "@/app/_components/PomodoroCard";
import Stats from "@/app/_components/Stats";
import UseDynamicTitle from "@/hooks/use-dynamic-title";
import React from "react";

export default function Home() {
	// Change title
	UseDynamicTitle();

	return (
		<div className="flex flex-col w-full gap-8 pb-12">
			<Header>Learn Backend JavaScript</Header>
			<section className="flex flex-col gap-8 px-8 md:flex-row ">
				{/* <ResizablePanelGroup direction="horizontal">
					<ResizablePanel className="min-w-xs"> */}
				<PomodoroCard />
				{/* </ResizablePanel>
					<ResizableHandle withHandle className="mx-5 " />
					<ResizablePanel className="min-w-xs"> */}
				<Stats />
				{/* </ResizablePanel>
				</ResizablePanelGroup> */}
			</section>
			<section className="flex gap-8 px-8">
				<Kanban />
			</section>
		</div>
	);
}
