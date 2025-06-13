import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PomodoroCardFocus from "./PomodoroCardFocus";
import { EllipsisVertical } from "lucide-react";
import PomodoroCardRest from "./PomodoroCardRest";

export default function PomodoroCard() {
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
				<TabsList>
					{tabs.map((tab: any) => (
						<TabsTrigger key={tab.id} value={tab.value}>
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>
				<Button variant={"ghost"} className="size-8" size={"icon"}>
					<EllipsisVertical />
				</Button>
			</div>
			<Card>
				{tabs.map((tab: any) => (
					<TabsContent value={tab.value} key={tab.id}>
						{tab.component}
					</TabsContent>
				))}
			</Card>
		</Tabs>
	);
}
