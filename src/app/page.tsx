import React from "react";
import Timer from "@/components/Timer";
import Pomodoro from "@/components/Pomodoro";

export default function Home() {
	return (
		<div className="min-h-screen bg-background w-full pt-8 pb-12">
			<section className="px-8 gap-8 flex">
				<Pomodoro />
			</section>
		</div>
	);
}
