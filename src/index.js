import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import configureProductsStore from "./hooks-store/products-store";

// configure each store separately to make them available to the app
configureProductsStore();

// no longer need and Providers
ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root")
);
