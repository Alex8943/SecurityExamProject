if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    dotenv.config();
}
  

import express from 'express'; 
import bcrypt from 'bcrypt';
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
import methodOverride from 'method-override';

const app = express(); 

import initializePassport from './passport-config.js';
initializePassport(
    passport, 
    email => users.find(user => user.email === email), 
    id => users.find(user => user.id === id)

); 

const users = [];


app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))




app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name });
});


app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});

app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
     successRedirect: '/',
     failureRedirect: '/login',
     failureFlash: true
}));

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
            users.push({ 
                id: Date.now().toString(), 
                name: req.body.name, 
                email: req.body.email, 
                password: hashedPassword 
            });
            res.redirect("/login"); 

    } catch (error) {
        res.redirect("/register");
    }
    console.log(users);
});

app.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
    }
      res.redirect('/login');
    });
});



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next() //Everything is ok, continue
    }
        res.redirect('/login')
};

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
        next()
};

app.listen(3000, () => console.log('Server is running on port 3000'));