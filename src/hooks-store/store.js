// A generic custom hook for global store to replace Redux

import { useState, useEffect } from "react";

// A SINGLE INSTANCE of these variables exist for the app.
// global state to be shared by multiple components
// (through the useStore hook):
let globalState = {};
let listeners = []; // functions to update components using this custom hook
let actions = {}; // set of functions to be dispatched by useStore hook
// (similar to how Redux works)
// Each action takes the global state as argument and returns the updated (new) state.

// Since globalStore is stored OUTSIDE of useStore(),
// the state will NOT be created separately by every component
// using the custom hook, and share globalState instead.
// pass shouldListen=false for components that do not get data from state and do need listeners.
export const useStore = (shouldListen = true) => {
	const setState = useState(globalState)[1];
	// we only want to expose the state updater function,
	// not the state itself.

	const dispatch = (actionIdentifier, payload) => {
		const newState = actions[actionIdentifier](globalState, payload);
		globalState = { ...globalState, ...newState }; // changes in newState are merged into globalState

		for (const listener of listeners) {
			listener(globalState); // update components as needed from the new state
		}
	};

	// For each component using this hook,
	// add a function to update the state to a global array of listeners;
	// Runs only when the component that uses this hook mounts
	// (setState function never changes, and we don't have other dependencies):
	useEffect(() => {
		// only register and unregister a listener for components that get data from state
		// and hould be re-renderd on state change:
		if (shouldListen) {
			listeners.push(setState);

			// the cleanup function:
			// remove the listener when the component unmounts.
			// Beacause this is a closure, the value of setState is captured
			// for the component that uses the hook, and this value (ref / function)
			// is the same when component mounts and when it unmounts:
			return () => {
				listeners = listeners.filter((li) => li !== setState);
			};
		}
	}, [setState, shouldListen]);

	// just like with useReducer(), return the state and dispatch;
	// useReducer cannot be used for managing state across components (only a signle component)
	return [globalState, dispatch];
};

// function to initilaize the store for the concrete component that uses the hook
// by  merging its state and actions into globalState:
export const initStore = (userActions, initialState) => {
	if (initialState) {
		globalState = { ...globalState, ...initialState };
	}
	actions = { ...actions, ...userActions };
};
