import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found in index.html");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
