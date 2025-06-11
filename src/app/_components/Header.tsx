import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function Header({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex gap-2 items-center  pt-4 pb-2 px-8 ">
			<ThemeToggle />
			<SidebarTrigger className="size-8" />
			<Separator orientation="vertical" />
			<h3 className="ml-4 font-semibold text-base">{children}</h3>
		</div>
	);
}
