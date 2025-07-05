// import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Plus } from "lucide-react";

export default function Header({ children }: { children: React.ReactNode }) {
	const [editMode, setEditMode] = React.useState(false);

	const handleToggleEditMode = () => {
		setEditMode(!editMode);
	};

	return (
		<div className="flex gap-2 justify-between px-8 pt-4 pb-2 w-full">
			{/* <ThemeToggle /> */}
			<div className="flex items-center">
				<SidebarTrigger className="size-8" />
				<Separator orientation="vertical" />
				<h3 className="ml-4 text-base font-semibold">{children}</h3>
			</div>
			<div className="flex">
				<div className="flex justify-center items-center p-1 rounded-lg">
					<Button
						className={`${editMode === true ? "" : "hidden"} rounded-r-none border-r-0 `}
						size={"sm"}
						variant={"outline"}
					>
						<Plus />
						Add Widget
					</Button>
					<Button
						size={"sm"}
						onClick={handleToggleEditMode}
						variant={editMode === true ? "outline" : "secondary"}
						className={`${editMode === true ? "rounded-l-none" : ""}`}
					>
						Edit
					</Button>
				</div>
			</div>
		</div>
	);
}
