"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PomodoroCardFocus from "./PomodoroCardFocus";
import { EllipsisVertical } from "lucide-react";
import PomodoroCardRest from "./PomodoroCardRest";
import { useTimerStore } from "@/lib/store";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";

export default function PomodoroCard() {
	const { isRunning } = useTimerStore();

	const tabs = [
		{
			title: "Focus",
			value: "focus",
			id: 1,
			component: <PomodoroCardFocus />,
		},
		{
			title: "Rest",
			value: "rest",
			id: 2,
			component: <PomodoroCardRest />,
		},
	];

	return (
		<Tabs className="w-full md:max-w-xs" defaultValue="focus">
			<div className="flex w-full justify-between">
				<TabsList className="w-full md:w-fit">
					{tabs.map((tab) => (
						<TabsTrigger disabled={isRunning} key={tab.id} value={tab.value}>
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>
				<Popover>
					<PopoverTrigger>
						<Button variant={"ghost"} className="ml-2 md:size-8" size={"icon"}>
							<EllipsisVertical />
						</Button>
					</PopoverTrigger>
					<PopoverContent>Hello world!</PopoverContent>
				</Popover>
			</div>
			<Card className="p-0">
				{tabs.map((tab) => (
					<TabsContent value={tab.value} key={tab.id}>
						{tab.component}
					</TabsContent>
				))}
			</Card>
		</Tabs>
	);
}
