import { create } from "zustand";

type TimerMode = "idle" | "running" | "paused" | "finished";

const INITIAL_TIME = 25 * 60;

interface TimerState {
	time: number;
	currentMode: TimerMode;

	setTime: (by: number) => void;
	setCurrentMode: (mode: TimerMode) => void;
	startTimer: () => void;
	pauseTimer: () => void;
	resumeTimer: () => void;
	resetTimer: () => void;
	decrementTimer: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
	time: INITIAL_TIME,
	currentMode: "idle",

	setTime: (time) => set({ time }),
	setCurrentMode: (mode) => set({ currentMode: mode }),

	startTimer: () => {
		const { currentMode, time } = get();
		if (currentMode === "idle" && time > 0) {
			set({ currentMode: "running" });
		}
	},

	pauseTimer: () => {
		const { currentMode, time } = get();
		if (currentMode === "running" && time > 0) {
			set({ currentMode: "paused" });
		}
	},

	resumeTimer: () => {
		const { currentMode, time } = get();
		if (currentMode === "paused" && time > 0) {
			set({ currentMode: "running" });
		}
	},

	resetTimer: () => {
		const { currentMode, time } = get();
		if (currentMode === "paused" && time > 0) {
			set({ currentMode: "idle", time: INITIAL_TIME });
		}
	},

	decrementTimer: () => {
		const { time } = get();
		if (time > 0) {
			const newTime = time - 1;
			set({ time: newTime });

			if (newTime === 0) {
				set({ currentMode: "finished" });
			}
		}
	},
}));
