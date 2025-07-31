// import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import React from "react";
import { Plus } from "lucide-react";
import SyncIndicator from "./SyncIndicator";

export default function Header({ children }: { children: React.ReactNode }) {
	// const [isEditMode, setIsEditMode] = React.useState(false);

	// const handleToggleEditMode = () => {
	// 	setIsEditMode(!isEditMode);
	// };

	return (
		<div className="flex gap-2 justify-between px-8 pt-4 pb-2 w-full">
			<div className="flex items-center">
				{/* <SidebarTrigger className="size-8 mr-2" /> */}
				{/* <Separator orientation="vertical" /> */}
				<h3 className="text-base font-semibold">{children}</h3>{" "}
				<div className="ml-4">
					<SyncIndicator />
				</div>
			</div>
			<div className="flex gap-3">
				<Button variant={"outline"} size={"sm"}>
					<Plus />
					Add Widget
				</Button>
				{/* <Button
					onClick={handleToggleEditMode}
					size="sm"
					className={`${isEditMode === true ? "bg-accent" : "hover:bg-transparent"}`}
					variant={"ghost"}
				>
					Layout Mode
					{isEditMode === true ? <LockOpen /> : <Lock />}
				</Button> */}
			</div>
		</div>
	);
}
