import { useState, useEffect } from "react";
import { supabaseAdmin, Task } from "@/lib/supabase";

export function useTasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTasks = async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabaseAdmin
				.from("tasks")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				throw error;
			}

			setTasks(data || []);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while fetching tasks"
			);
			console.error("Error fetching tasks:", err);
		} finally {
			setLoading(false);
		}
	};

	const addTask = async (
		// Omit means you don't have to provide the selected props: "id", "created_at", and "updated_at"
		// as they are auto-generated in the database
		task: Omit<Task, "id" | "created_at" | "updated_at">
	) => {
		try {
			const { data, error } = await supabaseAdmin
				.from("tasks")
				.insert([task])
				.select()
				.single();

			if (error) {
				throw error;
			}

			setTasks((prev) => [data, ...prev]);
			return data;
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while adding task"
			);
			console.error("Error adding task:", err);
			throw err;
		}
	};

	const updateTask = async (id: string, updates: Partial<Task>) => {
		try {
			const { data, error } = await supabaseAdmin
				.from("tasks")
				.update(updates)
				.eq("id", id)
				.select()
				.single();

			if (error) {
				throw error;
			}

			setTasks((prev) => prev.map((task) => (task.id === id ? data : task)));
			return data;
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while updating task"
			);
			console.error("Error updating task:", err);
			throw err;
		}
	};

	const toggleTaskCompletion = async (id: string) => {
		try {
			const currentTask = tasks.find((task) => task.id === id);
			if (!currentTask) return;

			const { data, error } = await supabaseAdmin
				.from("tasks")
				.update({ is_completed: !currentTask.is_completed })
				.eq("id", id)
				.select()
				.single();

			if (error) {
				throw error;
			}

			setTasks((prev) => prev.map((task) => (task.id === id ? data : task)));
			return data;
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while updating task"
			);
			console.error("Error updating task:", err);
			throw err;
		}
	};

	const deleteTask = async (id: string) => {
		try {
			const { error } = await supabaseAdmin.from("tasks").delete().eq("id", id);

			if (error) {
				throw error;
			}

			setTasks((prev) => prev.filter((task) => task.id !== id));
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while deleting task"
			);
			console.error("Error deleting task:", err);
			throw err;
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	return {
		tasks,
		loading,
		error,
		fetchTasks,
		addTask,
		updateTask,
		toggleTaskCompletion,
		deleteTask,
	};
}
