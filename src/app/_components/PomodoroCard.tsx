"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PomodoroCardFocus from "./PomodoroCardFocus";
import { EllipsisVertical } from "lucide-react";
import PomodoroCardRest from "./PomodoroCardRest";
import { useTimerStore } from "@/lib/store";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import PomodoroCardPopoverSettings from "./PomodoroCardPopoverSettings";
import { motion, AnimatePresence } from "motion/react";

export default function PomodoroCard() {
	const { currentMode } = useTimerStore();

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
		<Tabs className="w-full" defaultValue="focus">
			<div className="flex justify-between w-full">
				<TabsList className="w-full md:w-fit">
					{tabs.map((tab) => (
						<TabsTrigger
							disabled={currentMode !== "idle"}
							key={tab.id}
							value={tab.value}
						>
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>
				<Popover>
					<PopoverTrigger disabled={currentMode !== "idle"} className="ml-2">
						<Button
							disabled={currentMode !== "idle"}
							variant={"ghost"}
							className="md:size-8"
							size={"icon"}
						>
							<EllipsisVertical />
						</Button>
					</PopoverTrigger>
					<PomodoroCardPopoverSettings />
				</Popover>
			</div>
			<Card className="p-0 overflow-hidden">
				<AnimatePresence mode="wait">
					{tabs.map((tab) => (
						<TabsContent value={tab.value} key={tab.id}>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
							>
								{tab.component}
							</motion.div>
						</TabsContent>
					))}
				</AnimatePresence>
			</Card>
		</Tabs>
	);
}
