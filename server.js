import bodyParser from "body-parser";
import express from "express";
import {ldata, ndata} from './mongodb.js'; // Use './' for the current directory
import bcrypt from 'bcrypt'; // to encrypt the password into hash

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs"); // Uncomment this line to use EJS

// Optional: Set the views directory if using a custom path
// const templatespath = path.join(__dirname, '../templates');
// app.set("views", templatespath);

app.get("/", (req, res) => {
    res.render("login_page.ejs");
});

app.get("/ngo_login.ejs", (req, res) => {
    res.render("ngo_login.ejs")
});

app.get("/login_page.ejs", (req, res) => {
    res.render("login_page.ejs");
});

app.post("/signup", async (req, res) => {
    //creates a salt to add to 
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const data = {
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        category: req.body.category
    };

    try {
        await ldata.insertMany([data]);
        res.redirect("login_page.ejs");
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/register", async(req, res) => {
    
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const ngoData = {
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        category: req.body.category,
        contact: req.body.contact
    };

    try {
        await ndata.insertMany([ngoData]);
        res.redirect("login_page.ejs");
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Internal Error");
    }
});

app.post("/signin", async (req, res) => {
    
    try {
        // Find the user by email
        const user = await ldata.findOne({ email: req.body.email });
        const user2 = await ndata.findOne({ email: req.body.email });


        // Check if the user exists
        if (!user && !user2) {
            return res.status(404).send("User not found. Please do Signup With us");
        }

        // Compare the provided password with the hashed password
        
        if(user) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                // Passwords match, user can log in
                res.render("home.ejs", {
                    data1: user.name
                });
            } else {
                // Passwords do not match
                res.status(406).send("Wrong Password");
            }

        } else if (user2) {
            const isMatch = await bcrypt.compare(req.body.password, user2.password);
            if (isMatch) {
                // Passwords match, user can log in
                res.render("ngoHome.ejs", {
                    data1: user2.name
                });
            } else {
                // Passwords do not match
                res.status(406).send("Wrong Password");
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
