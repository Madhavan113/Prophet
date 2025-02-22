import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";
import userRoutes from "./routes/user.router.js"; // Ensure this file exists

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified
app.use(express.json()); // Allows JSON data to be sent in requests

// Connect to the database before starting the server
connect()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Define API routes
app.use("/api/users", userRoutes); // Handles all user-related API requests

// Default route
app.get("/", (req, res) => {
  res.send("Server is ready");
});

export default app; // Allows testing with Supertest if needed
