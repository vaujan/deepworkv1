import { create } from "zustand";

const initialTime = 25 * 60;

type TimerMode = "idle" | "running" | "paused" | "finished";

interface TimerState {
	// State
	time: number;
	currentMode: TimerMode;

	// Actions
	setTime: (by: number) => void;
	setCurrentMode: (by: TimerMode) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
	time: initialTime,
	currentMode: "idle",

	setTime: (by) => set(() => ({ time: by })),
	setCurrentMode: (mode) => set(() => ({ currentMode: mode })),
}));
