export interface Task {
	id: string;
	content: string;
	status: "to-do" | "in-progress" | "done";
}

export const loadTasks = (): Task[] => {
	if (typeof window !== "undefined") {
		const tasks = localStorage.getItem("tasks");
		return tasks ? JSON.parse(tasks) : [];
	}
	return [];
};

export const saveTasks = (tasks: Task[]) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}
};

export const loadTotalMinutes = (): number => {
	if (typeof window !== "undefined") {
		const minutes = localStorage.getItem("totalMinutes");
		return minutes ? parseInt(minutes, 10) : 0;
	}
	return 0;
};

export const saveTotalMinutes = (minutes: number) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("totalMinutes", minutes.toString());
	}
};

export const loadScratchPad = (): string => {
	if (typeof window !== "undefined") {
		const content = localStorage.getItem("scratchPad");
		return content || "";
	}
	return "";
};

export const saveScratchPad = (content: string) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("scratchPad", content);
	}
};
