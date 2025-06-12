import Header from "@/app/_components/Header";
import Kanban from "@/app/_components/Kanban";
import Pomodoro from "@/app/_components/Pomodoro";
import Stats from "@/app/_components/Stats";
import React from "react";

export default function Home() {
	return (
		<div className="flex flex-col w-full gap-8 pb-12 bg-background">
			<Header>Learn Backend JavaScript</Header>
			<section className="flex gap-8 px-8 ">
				<Pomodoro />
				<Stats />
			</section>
			<section className="flex gap-8 px-8">
				<Kanban />
			</section>
		</div>
	);
}
