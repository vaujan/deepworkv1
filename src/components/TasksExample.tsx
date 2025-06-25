"use client";

import { useTasks } from "@/hooks/use-tasks";

export function TasksExample() {
	const { tasks, loading, error, fetchTasks, toggleTaskCompletion } =
		useTasks();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<h2>Tasks Example</h2>
			<button onClick={fetchTasks}>Refresh Tasks</button>
			<ul>
				{tasks.map((task) => (
					<li key={task.id}>
						<strong
							style={{
								textDecoration: task.is_completed ? "line-through" : "none",
							}}
						>
							{task.title}
						</strong>
						{task.description && <p>{task.description}</p>}
						<span>Status: {task.is_completed ? "Completed" : "Pending"}</span>
						<button onClick={() => toggleTaskCompletion(task.id)}>
							{task.is_completed ? "Mark Incomplete" : "Mark Complete"}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
