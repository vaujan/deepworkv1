import { Button } from "@/components/ui/button";
import {
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import React from "react";

export default function PomodoroCardRest() {
	return (
		<>
			<CardHeader>
				<CardTitle>Rest</CardTitle>
			</CardHeader>
			<CardContent>
				<div>
					<h1>Hello world, from rest tab</h1>
				</div>
			</CardContent>
			<CardFooter>
				<Button>Hello world</Button>
			</CardFooter>
		</>
	);
}
