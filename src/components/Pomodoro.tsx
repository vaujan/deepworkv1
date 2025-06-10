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
import { EllipsisVertical, Play } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";

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
		<div className="flex flex-col items-center justify-center max-w-md gap-6 rounded-md h-fit w-fit ">
			<NavigationMenu className="p-1 rounded-lg border-1 border-border/50 bg-accent/20">
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
			<div className="relative flex items-center justify-center w-full">
				<Button
					variant={"ghost"}
					className="absolute top-0 right-0 z-50"
					size={"icon"}
				>
					<EllipsisVertical />
				</Button>
				<div className="flex items-center justify-center text-xs rounded-lg w-30 border-border border-1 h-30 bg-accent"></div>
			</div>
			<div className="flex gap-1.5">
				<Button
					className="text-xs border-0 rounded-full "
					size={"sm"}
					variant={"outline"}
				>
					+0:30
				</Button>
				<Button
					className="text-xs border-0 rounded-full "
					size={"sm"}
					variant={"outline"}
				>
					+1:00
				</Button>
				<Button
					className="text-xs border-0 rounded-full "
					size={"sm"}
					variant={"outline"}
				>
					+5:00
				</Button>
			</div>
			<Button className="w-fit">
				<Play /> Start Session
			</Button>
		</div>
	);
}
