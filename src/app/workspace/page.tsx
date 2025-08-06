"use client";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import { Database, FileText } from "lucide-react";
import React from "react";
import { DatabaseService } from "@/lib/database";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentItem {
	name: string;
	lastAccessed: string;
}

export default function WorkspacePage() {
	const [recentItems, setRecentItems] = React.useState<RecentItem[] | null>(
		null
	);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchItems = async () => {
			setLoading(true);
			try {
				const items = await DatabaseService.getTables();
				setRecentItems(items);
			} catch (error) {
				console.error("Error fetching recent items", error);
				toast.error("Failed to load recent items");
			} finally {
				setLoading(false);
			}
		};
		fetchItems();
	}, []);

	return (
		<div className="flex flex-col w-full h-full items-center justify-center p-8 text-foreground">
			<div className="w-full max-w-4xl mx-auto flex flex-col gap-12">
				{/* Create a table section */}
				<div className="flex">
					<Button
						variant="ghost"
						className=" border-border border-1 hover:bg-gray-700/50 text-foreground rounded-lg p-4 h-auto flex items-start gap-4 text-left"
					>
						<div className="bg-gray-600/20 text-gray-400 p-2 rounded-md">
							<Database className="h-6 w-6" />
						</div>
						<div className="flex flex-col">
							<span className="font-semibold">Create a table</span>
							<span className="text-muted-foreground">
								Design and create a new database table
							</span>
						</div>
					</Button>
				</div>

				{/* Recent items section */}
				<div className="flex flex-col gap-4">
					<h3 className="font-medium text-muted-foreground">Recent items</h3>
					<div className="border border-border/50 rounded-lg overflow-hidden">
						<Table>
							<TableBody>
								{loading
									? Array.from({ length: 5 }).map((_, i) => (
											<TableRow key={i} className="hover:bg-gray-800/30">
												<TableCell>
													<Skeleton className="h-5 w-48" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-5 w-24" />
												</TableCell>
											</TableRow>
										))
									: recentItems?.map((item) => (
											<TableRow
												key={item.name}
												className="hover:bg-gray-800/30 cursor-pointer"
											>
												<TableCell className="flex items-center gap-3">
													<FileText className="h-5 w-5 text-muted-foreground" />
													<span>{item.name}</span>
												</TableCell>
												<TableCell className="text-right text-muted-foreground">
													{item.lastAccessed}
												</TableCell>
											</TableRow>
										))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
