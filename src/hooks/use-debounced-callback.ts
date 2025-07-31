import { useRef, useCallback, useEffect } from "react";

/**
 * Custom hook that creates a debounced version of a callback function
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 * @returns Object with debounced function, cancel function, and flush function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(
	callback: T,
	delay: number
) {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const callbackRef = useRef(callback);

	// Update callback ref when callback changes
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// Cancel any pending timeouts on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const debouncedCallback = useCallback(
		(...args: Parameters<T>) => {
			// Clear existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Set new timeout
			timeoutRef.current = setTimeout(() => {
				callbackRef.current(...args);
			}, delay);
		},
		[delay]
	);

	const cancel = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const flush = useCallback(
		(...args: Parameters<T>) => {
			cancel();
			callbackRef.current(...args);
		},
		[cancel]
	);

	return { debouncedCallback, cancel, flush };
}

/**
 * Custom hook for debounced input handling with auto-save functionality
 * @param initialValue Initial value for the input
 * @param onSave Callback function to save the value
 * @param delay Debounce delay in milliseconds (default: 500)
 * @returns Object with value, setValue, and save functions
 */
export function useDebouncedInput(
	initialValue: string,
	onSave: (value: string) => void,
	delay: number = 500
) {
	const { debouncedCallback, cancel, flush } = useDebouncedCallback(
		onSave,
		delay
	);

	const setValue = useCallback(
		(newValue: string) => {
			debouncedCallback(newValue);
		},
		[debouncedCallback]
	);

	const save = useCallback(
		(value: string) => {
			flush(value);
		},
		[flush]
	);

	const cancelSave = useCallback(() => {
		cancel();
	}, [cancel]);

	return { setValue, save, cancelSave };
}
