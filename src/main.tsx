import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";

import "./index.css";
import { ChatBotProvider } from "./ChatBotContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <ChatBotProvider>
        <App />
      </ChatBotProvider>
    </NextUIProvider>
  </React.StrictMode>
);
