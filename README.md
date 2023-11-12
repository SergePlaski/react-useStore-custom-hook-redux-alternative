# Custom Hook for Redux-Like Global Store Implementation

## NOTES:

1) We CAN use standard React hooks in custom hook component. 

2) Remember: 
- If we use state (with useState) in our custom hook component, this component re-render whenever its state changes (just like any other component). 
- Moreover, if another component uses our custom hook, that component will re-render if the state in the custom hook changes (!)


3) The (generalized) useStore custom hook (hooks-store/store.js)
We create a store file that contains:
  
   a) let globalState = {}; // global state to be shared across components in the app
      let listeners = []; // functions to update components using this custom hook
      let actions = {}; // set of functions to be dispatched by useStore hook
   
   b) an (exported) function component useStore(); it returns [globalState, dispatch] - like useReducer(), with the difference that this can be accessed from multiple components.
- The dispatch() function takes action name + payload as parameters and executes the selected action (payload used, if necessary); 
- This yields the new state that os merged into the global state; 
- All listeners from the global listeners array are called to update all registered components. NOTE: each listener is the setState function for a component registered with global state. 
- We also have a cleanup function (inside useEffect) to remove the listener when the component unmounts.

   c) an (exported) function initStore() that takes actions and initial state for a particular store (like a store slice in Redux, here - products store) and merges them into the global store that contains all the stores used by the app.


4) Products store - functionally, like a slice of a Redux global store. (hooks-store/products-store.js)
Here we define an (exported) function configureProductsStore that:
   
   a) define actions (object) specific to this particular store (here - TOGGLE_FAV)
Each action takes current state (global) and payload as parameters and RETURNS NEW STATE

   b) run initState() with the actions (above) and initial state (this store-specific) - initializes this (products) store. 


5) We use the custom useStore() hook in Products and Favorites containers. 
The basic idea: 

import { useStore } from '../hooks-store/store'; 
const productsList = useStore()[0]?.products; // useStore() returns [globalState, dispatch] 
// (dispatch for the particular component)


6) PERFORMANCE OPTIMIZATION
- Every component using useStore() hook registers a listener (setState) function FOR THAT PARTICULAR COMPONENT (in the useEffect() part); 
At this time (when a listener is registered), the global state changes, and all components are re-rendered.
- ProductItem component DOES NOT actually use the state to receive the data (all data is passed through props), and the only reason we use useStore() hook is to be able to use the dispatch function (in toggleFavHandler). 
INSTANCES of ProductItem component DO NOT NEED TO REGISTER LISTENERS. 
- Solution: we add a parameter shouldListen (default = true) for useStore() to control registering a listener. 
In ProductItem component, we pass false to useStore(): 
  const dispatch = useStore(false)[1];
AND wrap the ProductItem component in React.memo() to ensure the component is re-rendered ONLY ON PROPS CHANGES.

This way, only ProductItem(s) that change their isFavorite property value are re-rendered (because their props change)