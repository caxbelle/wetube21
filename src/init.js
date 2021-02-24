import dotenv from "dotenv";
import "./db";
import app from "./app";
import "@babel/polyfill";

dotenv.config();

import "./models/Video";
import "./models/Comment";
import "./models/User";

const PORT = process.env.PORT || 4000; // PORT 못찾으면 4000으로 가라.

const handleListening = () => console.log("listening on : http://localhost")

app.listen(PORT, handleListening)