import express from 'express'; 
const app = express(); 
import bcrypt from 'bcrypt';

app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }));
//app.use ... urlencoded mehod lets us use the values from the forms in our app.js file (req.body.name)

const users = [];
//This array lets us store the users in an array, insted of a database


app.get("/", (req, res) => {
    res.render("index.ejs", { name: "Alex" });
});


app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", (req, res) => {
    
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
            users.push({ //user.push is used to add a new user to the array
                id: Date.now().toString(), //Unique id for each user
                name: req.body.name, //req.body.name is used to get the name from the form
                email: req.body.email, //the same goes for the email
                password: hashedPassword //the password is hashed with bcrypt
            });
            res.redirect("/login"); //IF the user is sucessfully registered, we redirect him to the login page

    } catch (error) {
        res.redirect("/register");
        console.log("Somnething went wrong: " + error);
    }
    console.log(users);
    
});

//this tryy catch block is used to make sure we registere the user with the correct hashed password (bcrypt)




app.listen(3000, () => console.log('Server is running on port 3000'));