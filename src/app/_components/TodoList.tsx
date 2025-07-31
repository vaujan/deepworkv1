import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { EllipsisVertical, Plus } from "lucide-react";
import React from "react";

export default function TodoList() {
	const [isDone, setIsDone] = React.useState(false);

	return (
		<Card className="gap-2 pt-4 w-full shadow-none dark:border-0">
			<CardHeader className="">
				<div className="flex justify-between items-center">
					<CardTitle>Hello</CardTitle>
					<div>
						<Button variant={"ghost"} className="md:size-8" size={"icon"}>
							<Plus />
						</Button>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant={"ghost"} className="md:size-8" size={"icon"}>
									<EllipsisVertical />
								</Button>
							</PopoverTrigger>
						</Popover>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div
					onClick={() => setIsDone(!isDone)}
					className="flex gap-4 px-4 py-3 rounded-xl transition-all ease-out border-1 border-border/50 hover:bg-sidebar"
				>
					<Checkbox className="border-2 border-border" checked={isDone} />
					<div>
						<span
							className={`${isDone && "line-through"} text-card-foreground`}
						>
							Clean my room
						</span>
						<p className={`${isDone && "line-through"} text-muted-foreground`}>
							card description
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
