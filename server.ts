import { startServer } from "./backend/app";

startServer().catch((err) => {
  console.error("Server startup error:", err);
});
