import { Button } from "@/components/ui/button";
import React from "react";
import Timer from "@/components/Timer";
import Kanban from "@/components/Kanban";
import KanbanPragmatic from "@/components/KanbanPragmatic";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center w-full min-h-screen gap-3 pt-8 pb-12">
			<section className="flex flex-col w-full gap-4 px-8 ">
				<Timer />
				<div className="flex w-full gap-4 h-fit">
					<Kanban />
					<KanbanPragmatic />
				</div>
			</section>
		</div>
	);
}
