import { create } from "zustand";

type TimerMode = "idle" | "running" | "paused" | "finished";
export type TimerType = "focus" | "rest";

// const FOCUS_TIME = 25 * 60;
// const REST_TIME = 5 * 60;

// For testing purpose
const FOCUS_TIME_TEST = 3;
const REST_TIME_TEST = 3;

interface TimerState {
	// Configuration
	initialFocusTime: number;
	initialRestTime: number;

	// Current Timer Values
	focusTime: number;
	restTime: number;

	// Timer Modes
	focusMode: TimerMode;
	restMode: TimerMode;

	// Active Timer
	activeTimer: TimerType;

	// Configuration Actions
	setInitialFocusTime: (time: number) => void;
	setInitialRestTime: (time: number) => void;

	// Focus Timer Actions
	setFocusTime: (time: number) => void;
	setFocusMode: (mode: TimerMode) => void;
	startFocusTimer: () => void;
	pauseFocusTimer: () => void;
	resumeFocusTimer: () => void;
	resetFocusTimer: () => void;
	decrementFocusTimer: () => void;

	// Rest Timer Actions
	setRestTime: (time: number) => void;
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
	// Initial configuration (25 minutes focus, 5 minutes rest)
	initialFocusTime: 25 * 60,
	initialRestTime: 5 * 60,

	// Current timer values (start with configured values)
	focusTime: 25 * 60,
	restTime: 5 * 60,

	// Initial state
	focusMode: "idle",
	restMode: "idle",
	activeTimer: "focus",

	// Configuration Actions
	setInitialFocusTime: (time) => {
		const { focusMode } = get();
		// Only allow changing initial time when timer is idle
		if (focusMode === "idle") {
			set({
				initialFocusTime: time,
				focusTime: time,
			});
		}
	},

	setInitialRestTime: (time) => {
		const { restMode } = get();
		// Only allow changing initial time when timer is idle
		if (restMode === "idle") {
			set({
				initialRestTime: time,
				restTime: time,
			});
		}
	},

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
		const { initialFocusTime } = get();
		set({
			focusMode: "idle",
			focusTime: initialFocusTime,
			activeTimer: "focus",
		});
	},

	decrementFocusTimer: () => {
		const { focusTime, initialFocusTime } = get();
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
		const { initialRestTime } = get();
		set({
			restMode: "idle",
			restTime: initialRestTime,
			activeTimer: "rest",
		});
	},

	decrementRestTimer: () => {
		const { restTime, initialRestTime } = get();
		if (restTime > 0) {
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
		const { initialRestTime } = get();
		set({
			activeTimer: "rest",
			restMode: "idle",
			restTime: initialRestTime, // Use configured rest time
			focusMode: "idle",
		});
	},

	switchToFocus: () => {
		const { initialFocusTime } = get();
		set({
			activeTimer: "focus",
			focusMode: "idle",
			focusTime: initialFocusTime, // Use configured focus time
			restMode: "idle",
		});
	},
}));
