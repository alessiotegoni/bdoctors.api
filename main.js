//express base config
const express = require("express");
const doctorRouter = require("./routes/doctorRouter");
const specializationRouter = require("./routes/specializationRouter");
const cors = require("cors");

// dotenv.config()

const app = express();
const PORT = process.env.PORT;

//middlewares
const errorsHandler = require("./middlewares/errorsHandler");
const notFound = require("./middlewares/notFound");

// cors

app.use(cors());

//body parser
app.use(express.json());

//routes
app.use("/doctors", doctorRouter);
app.use("/specializations", specializationRouter);

app.use(notFound);
app.use(errorsHandler);

app.listen(PORT, () => console.log(`✅ Server running on PORT: ${PORT}`));
