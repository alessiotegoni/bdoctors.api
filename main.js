const express = require("express");

const app = express();

app.use(express.json());

const PORT = 5000;

app.use("/doctors");

app.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`));
