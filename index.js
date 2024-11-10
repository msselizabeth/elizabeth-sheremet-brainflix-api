import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const { PORT, BACKEND_URL,CORS_ORIGIN } = process.env;

// cors permission
app.use(cors({ origin: CORS_ORIGIN }));

// requests parcing
app.use(express.json());
app.use(express.static("public"));


import vidoesRoutes from "./routes/videos.js";
app.use("/videos", vidoesRoutes);

app.get("/", async (req, res) => {
   res.status(200).json({message: "Hi from server"})
  });

// processing unsupported routes
app.use((req, res ) => {
    res.status(404).json({
        message: "Route not found",
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server is listening at ${BACKEND_URL}:${PORT}`);
  });
