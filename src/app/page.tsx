import React from "react";
import Pomodoro from "@/components/Pomodoro";
import Stats from "@/components/Stats";

export default function Home() {
	return (
		<div className="flex flex-col w-full min-h-screen gap-8 pt-8 pb-12 bg-background">
			<section className="flex gap-8 px-8 ">
				<Pomodoro />
				<Stats />
			</section>
			<section className="flex gap-8 px-8">
				<div className="flex items-center justify-center w-full rounded-lg h-96 border-1 ">
					<span>Placholder for Kanban</span>
				</div>
			</section>
		</div>
	);
}
