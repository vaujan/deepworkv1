import { create } from "zustand";

interface TimerState {
	focusSeconds: number;
	restSeconds: number;
	isSessionStarted: boolean;
	isPaused: boolean;
	setisSessionStarted: () => void;
	setIsPaused: () => void;
	decreaseFocusSeconds: (by: number) => void;
	decreaseRestSeconds: (by: number) => void;
	setFocusTime: (seconds: number) => void;
	setRestTime: (seconds: number) => void;
	resetTimer: () => void;
}

export const useTimerStore = create<TimerState>()((set) => ({
	/* 	focusSeconds: 25 * 60, // 25 minutes default
	restSeconds: 5 * 60, // 5 minutes default */

	//  For testing purpose
	focusSeconds: 1 * 3,
	restSeconds: 1 * 3,

	isSessionStarted: false,
	isPaused: false,

	setisSessionStarted: () =>
		set((state) => ({ isSessionStarted: !state.isSessionStarted })),

	setIsPaused: () => set((state) => ({ isPaused: !state.isPaused })),

	decreaseFocusSeconds: (by) =>
		set((state) => ({ focusSeconds: state.focusSeconds - by })),
	decreaseRestSeconds: (by) =>
		set((state) => ({ restSeconds: state.restSeconds - by })),

	setFocusTime: (seconds) => set({ focusSeconds: seconds }),
	setRestTime: (seconds) => set({ restSeconds: seconds }),

	resetTimer: () =>
		set(() => ({
			focusSeconds: 25 * 60,
			restSeconds: 5 * 60,
			isSessionStarted: false,
		})),
}));
