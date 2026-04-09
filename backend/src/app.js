const express = require("express");
const cors = require("cors");
require ('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});



