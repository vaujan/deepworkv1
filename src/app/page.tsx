import React from "react";
import Pomodoro from "@/components/Pomodoro";
import Stats from "@/components/Stats";
import Kanban from "@/components/Kanban";

export default function Home() {
	return (
		<div className="flex flex-col w-full gap-8 pt-8 pb-12 bg-background">
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
