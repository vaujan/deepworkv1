"use client";

import Header from "@/app/_components/Header";
import PomodoroCard from "@/app/_components/PomodoroCard";
import TodoList from "@/app/_components/TodoList";
import React from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspacePage() {
	// if (loading) {
	// 	return (
	// 		<div className="flex flex-col gap-8 pb-12 w-full">
	// 			<div className="flex justify-center items-center py-16">
	// 				<div className="flex items-center gap-2">
	// 					<Loader2 className="h-4 w-4 animate-spin" />
	// 					<span className="text-muted-foreground">Setting up...</span>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	// if (error || !workspace) {
	// 	return (
	// 		<div className="flex flex-col gap-8 pb-12 w-full">
	// 			<div className="flex justify-center items-center py-16">
	// 				<div className="text-center">
	// 					<h3 className="text-lg font-medium text-destructive mb-2">
	// 						{error || "Workspace not found"}
	// 					</h3>
	// 					<p className="text-muted-foreground">
	// 						The workspace you're looking for doesn't exist or you don't have
	// 						access to it.
	// 					</p>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className="flex flex-col gap-8 pb-12 w-full">
			<section className="flex flex-col gap-8 px-8">
				<h1>create you first workspace</h1>
				<Button>
					<Plus />
					Add new workspace
				</Button>
			</section>
		</div>
	);
}
