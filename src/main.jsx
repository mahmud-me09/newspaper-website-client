import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routers/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import AuthProvider from "./providers/AuthProvider";
import Swal from "sweetalert2";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Router></Router>
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
