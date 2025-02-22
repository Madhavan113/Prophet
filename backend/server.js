import express from "express";
import dotenv from "dotenv";
import {connect} from "./config/db.js";
import bigRoutes from "./routes/product.route.js"; // bigRoutes is the router (we can set this to be anything)
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; // if the PORT is not defined, use 5000
app.use(express.json()); // allows for us to use json data in the body of the req.body

app.use("/api/products", bigRoutes); // has bigRoutes handle all requests to /api/products
app.get('/', (req, res) => {
    res.send('Server is ready');
})

console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
connect();// app doesn't have explicit access to the database, this connection is for the product.model file to work
  console.log('Server is running on http://localhost:'+PORT);
});

// aZAS6f8WOqUFh2W3