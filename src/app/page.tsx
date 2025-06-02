"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export default function Home() {
	const [count, setCount] = React.useState(0);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-3">
			<h1 className="text-5xl font-semibold">Hello world</h1>
			<p className="text-2xl font-medium">
				{count == 0 ? "Count on me" : count}
			</p>
			<div className="flex gap-2">
				<Button onClick={(prev) => setCount(count + 1)}>+</Button>
				<Button onClick={(prev) => setCount(count - 1)}>-</Button>
				<Button variant={"outline"} onClick={(prev) => setCount(0)}>
					reset
				</Button>
			</div>
		</div>
	);
}
