const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const app = express();

require("./auth");

// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.use(
  session({
    secret: "mysecret", // Update this as needed
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated() && req.session){
        return next();
    }
   res.sendStatus(401);
}

// Route handlers
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", (req, res) => {
  res.send("Something went wrong");
});

app.get("/auth/protected", isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send(`Hello ${name}`);
});

app.use("/auth/logout", (req, res) => {
    req.logout(err=>{
        if(err){
            return next(err)
        }
        req.session.destroy(()=>{
            res.clearCookie("connect.sid", { path: "/" });
           // res.redirect('/')
            res.send("see you again");
        })
    })
});


app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// const express = require("express");
// const path = require("path");
// const passport = require("passport");
// const session = require("express-session");
// const app = express();

// require("./auth");

// // Middleware setup
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "client")));

// app.use(
//   session({
//     secret: "mysecret", // Update this as needed
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set to true if using HTTPS
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // Route handlers
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "index.html"));
// });

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/auth/google/success",
//     failureRedirect: "/auth/google/failure",
//   })
// );

// app.get("/auth/google/failure", (req, res) => {
//   res.send("Something went wrong");
// });

// app.get("/auth/protected", isLoggedIn, (req, res) => {
//   let name = req.user.displayName;
//   res.send(`Hello ${name}`);
// });

// app.use('/auth/logout',(req,res)=>{
//     req.session.destroy();
//     res.send("see you again")
// })
// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

// app.listen(3000, () => {
//   console.log("Listening on port 3000");
// });
