import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ReciverDataProvider } from "./contextAPI/reciverDataContext.tsx";

createRoot(document.getElementById("root")!).render(
	<ReciverDataProvider>
		<App />
	</ReciverDataProvider>
);
