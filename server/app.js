import {config} from "dotenv"
const express = require('express');

const app = express();

config({ path: "./config/.env"});

app.use()