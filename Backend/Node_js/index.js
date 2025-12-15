const express = require("express");//framework to build server
const cors = require("cors");//connect frontend and backend
const notesRouter = require("./routes/notes");
const readListRoutes = require("./routes/readList");
const readLaterRoutes = require("./routes/readLaterRoutes");
const reportRoutes = require("./routes/report");

const app = express();//initializes an express application
app.use(express.json()); 
app.use(cors());//Enables Cross-Origin Resource Sharing, so your frontend (e.g., React) can call your API.
app.use(express.json({ limit: "50mb" }));// so that it can have large files like images in the requests
app.use(express.urlencoded({ limit: "50mb", extended: true }));
debugger
// Routes
app.use("/notes", notesRouter);
app.use("/readlist", readListRoutes);
app.use("/readlater", readLaterRoutes);
app.use("/report", reportRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
