"use client";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { useState } from "react";

export default function Pomodoro() {
	const [selectedId, setSelectedId] = useState(1);

	const menu = [
		{
			title: "Focus",
			id: 1,
		},
		{
			title: "Short Break",
			id: 2,
		},
		{
			title: "Long Break",
			id: 3,
		},
	];

	return (
		<div className="flex flex-col items-center justify-center max-w-md gap-6 rounded-md w-fit bg-card ">
			<NavigationMenu className="p-1 rounded-lg border-1 border-border">
				<NavigationMenuList>
					{menu.map((item: any) => (
						<NavigationMenuItem key={item.id}>
							<Button
								variant={"ghost"}
								className={`${selectedId === item.id ? "bg-accent/50" : ""}`}
								onClick={() => setSelectedId(item.id)}
							>
								{item.title}
							</Button>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
			<div className="rounded-lg w-30 border-border border-1 h-30 bg-accent"></div>
			<Button className="w-fit">
				<Play /> Start Session
			</Button>
		</div>
	);
}
