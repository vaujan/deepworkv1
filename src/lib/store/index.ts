import { create } from "zustand";

type TimerMode = "idle" | "running" | "paused" | "finished";
export type TimerType = "focus" | "rest";

// const FOCUS_TIME = 25 * 60;
// const REST_TIME = 5 * 60;

// For testing purpose
const FOCUS_TIME = 3;
const REST_TIME = 3;

interface TimerState {
	// Focus Timer State
	focusTime: number;
	focusMode: TimerMode;

	// Rest Timer State
	restTime: number;
	restMode: TimerMode;

	// Active Timer
	activeTimer: TimerType;

	// Focus Timer Actions
	setFocusTime: (by: number) => void;
	setFocusMode: (mode: TimerMode) => void;
	startFocusTimer: () => void;
	pauseFocusTimer: () => void;
	resumeFocusTimer: () => void;
	resetFocusTimer: () => void;
	decrementFocusTimer: () => void;

	// Rest Timer Actions
	setRestTime: (by: number) => void;
	setRestMode: (mode: TimerMode) => void;
	startRestTimer: () => void;
	pauseRestTimer: () => void;
	resumeRestTimer: () => void;
	resetRestTimer: () => void;
	decrementRestTimer: () => void;

	// Utils
	setActiveTimer: (timer: TimerType) => void;
	switchToFocus: () => void;
	switchToRest: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
	// Initial state
	focusTime: FOCUS_TIME,
	focusMode: "idle",
	restTime: REST_TIME,
	restMode: "idle",
	activeTimer: "focus",

	// Focus Timer Actions
	setFocusTime: (time) => set({ focusTime: time }),
	setFocusMode: (mode) => set({ focusMode: mode }),

	startFocusTimer: () => {
		const { focusMode, focusTime } = get();
		if (focusMode === "idle" && focusTime > 0) {
			set({ focusMode: "running", activeTimer: "focus" });
		}
	},

	pauseFocusTimer: () => {
		const { focusMode, focusTime } = get();
		if (focusMode === "running" && focusTime > 0) {
			set({ focusMode: "paused" });
		}
	},

	resumeFocusTimer: () => {
		const { focusMode, focusTime } = get();
		if (focusMode === "paused" && focusTime > 0) {
			set({ focusMode: "running" });
		}
	},

	resetFocusTimer: () => {
		const { focusMode, focusTime } = get();
		if (focusMode === "paused" && focusTime > 0) {
			set({ focusMode: "idle", focusTime: FOCUS_TIME, activeTimer: "focus" });
		}
	},

	decrementFocusTimer: () => {
		const { focusTime } = get();
		if (focusTime > 0) {
			const newTime = focusTime - 1;
			set({ focusTime: newTime });

			if (newTime === 0) {
				set({ focusMode: "finished" });
				get().switchToRest();
			}
		}
	},

	// Rest Timer Actions
	setRestTime: (time) => set({ restTime: time }),
	setRestMode: (mode) => set({ restMode: mode }),

	// Rest Timer Actions
	startRestTimer: () => {
		const { restMode, restTime } = get();
		if (restMode === "idle" && restTime > 0) {
			set({ restMode: "running", activeTimer: "rest" });
		}
	},

	pauseRestTimer: () => {
		const { restMode, restTime } = get();
		if (restMode === "running" && restTime > 0) {
			set({ restMode: "paused" });
		}
	},

	resumeRestTimer: () => {
		const { restMode, restTime } = get();
		if (restMode === "paused" && restTime > 0) {
			set({ restMode: "running" });
		}
	},

	resetRestTimer: () => {
		const { restMode, restTime } = get();
		if (restMode === "paused" && restTime > 0) {
			set({ restMode: "idle", restTime: REST_TIME, activeTimer: "rest" });
		}
	},

	decrementRestTimer: () => {
		const { restMode, restTime } = get();
		if (restMode === "running" && restTime > 0) {
			const newTime = restTime - 1;
			set({ restTime: newTime });

			if (newTime === 0) {
				set({ restMode: "finished" });
				get().switchToFocus();
			}
		}
	},

	// Utils
	setActiveTimer: (timer) => set({ activeTimer: timer }),

	switchToRest: () => {
		set({
			activeTimer: "rest",
			restMode: "idle",
			restTime: REST_TIME,
			focusMode: "idle",
		});
	},

	switchToFocus: () => {
		set({
			activeTimer: "focus",
			focusMode: "idle",
			focusTime: FOCUS_TIME,
			restMode: "idle",
		});
	},
}));
