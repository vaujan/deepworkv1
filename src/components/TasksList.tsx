"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import React from "react";

export function TasksList() {
	const { tasks, loading, error, addTask, toggleTaskCompletion, deleteTask } =
		useTasks();
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskDescription, setNewTaskDescription] = useState("");

	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTaskTitle.trim()) return;

		try {
			await addTask({
				title: newTaskTitle.trim(),
				description: newTaskDescription.trim() || undefined,
				is_completed: false,
			});
			setNewTaskTitle("");
			setNewTaskDescription("");
		} catch (err) {
			console.error("Failed to add task:", err);
		}
	};

	const handleToggleCompletion = async (id: string) => {
		try {
			await toggleTaskCompletion(id);
		} catch (err) {
			console.error("Failed to toggle task completion:", err);
		}
	};

	const handleDeleteTask = async (id: string) => {
		try {
			await deleteTask(id);
		} catch (err) {
			console.error("Failed to delete task:", err);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-lg">Loading tasks...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-red-500">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Add Task Form */}
			<Card>
				<CardHeader>
					<CardTitle>Add New Task</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleAddTask} className="space-y-4">
						<div>
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={newTaskTitle}
								onChange={(e) => setNewTaskTitle(e.target.value)}
								placeholder="Enter task title"
								required
							/>
						</div>
						<div>
							<Label htmlFor="description">Description (optional)</Label>
							<Input
								id="description"
								value={newTaskDescription}
								onChange={(e) => setNewTaskDescription(e.target.value)}
								placeholder="Enter task description"
							/>
						</div>
						<Button type="submit">Add Task</Button>
					</form>
				</CardContent>
			</Card>

			{/* Tasks List */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Tasks ({tasks.length})</h2>
				{tasks.length === 0 ? (
					<Card>
						<CardContent className="p-6 text-center text-muted-foreground">
							No tasks found. Add your first task above!
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{tasks.map((task) => (
							<Card
								key={task.id}
								className={task.is_completed ? "opacity-75" : ""}
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3
												className={`font-semibold text-lg ${task.is_completed ? "line-through text-muted-foreground" : ""}`}
											>
												{task.title}
											</h3>
											{task.description && (
												<p
													className={`text-muted-foreground mt-1 ${task.is_completed ? "line-through" : ""}`}
												>
													{task.description}
												</p>
											)}
											<div className="flex items-center gap-2 mt-2">
												<Badge
													variant={task.is_completed ? "default" : "secondary"}
												>
													{task.is_completed ? "Completed" : "Pending"}
												</Badge>
												<span className="text-sm text-muted-foreground">
													{task.created_at &&
														new Date(task.created_at).toLocaleDateString()}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2 ml-4">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleToggleCompletion(task.id)}
											>
												{task.is_completed
													? "Mark Incomplete"
													: "Mark Complete"}
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDeleteTask(task.id)}
											>
												Delete
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
