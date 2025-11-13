import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import helmet from 'helmet';
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();
app.use(cors());  
app.use(helmet());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


const swaggerOptions = require('./swagger.json');
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

import { connectionDb } from "./app/config/dbConfig";
import { connectRedis } from "./app/config/redisConfig";
import "./app/config/googleOAuth";

// Connect to databases
connectionDb();
connectRedis();

import { Authrouter } from "./app/router/auth";
import {Analyticsrouter} from "./app/router/analytics";

app.use("/api/auth", Authrouter);
app.use("/api/analytics", Analyticsrouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Unified Event Analytics Engine is running",
    timestamp: new Date().toISOString()
  });
});


app.get("/", (req, res) => {
  res.json({ 
    message: "Unified Event Analytics Engine API", 
    version: "1.0.0",
    documentation: "/api-docs"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(" Server running on port 5000");
    console.log(" Swagger docs at http://localhost:5000/api-docs");
    console.log("  Health check at http://localhost:5000/health");
});