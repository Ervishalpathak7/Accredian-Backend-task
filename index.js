import express from "express";
import router from "./controllers/referralControllers.js";



const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/referral", router);

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    }
);