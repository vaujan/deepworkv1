import React from "react";
import Header from "./_components/Header";
import Pomodoro from "./_components/Pomodoro";
import Stats from "./_components/Stats";
import Kanban from "./_components/Kanban";

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
