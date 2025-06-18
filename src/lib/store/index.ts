import { create } from "zustand";

const initialTime = 25 * 60;

type TimerMode = "idle" | "running" | "paused" | "finished";

interface TimerState {
	// State
	time: number;
	currentMode: TimerMode;

	// Actions
	decrementTime: (by: number) => void;
	incrementTime: (by: number) => void;
	setCurrentMode: (by: TimerMode) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
	time: initialTime,
	currentMode: "idle",

	decrementTime: (by) => set((state) => ({ time: state.time - by })),
	incrementTime: (by) => set((state) => ({ time: state.time + by })),
	setCurrentMode: (mode) => set(() => ({ currentMode: mode })),
}));
