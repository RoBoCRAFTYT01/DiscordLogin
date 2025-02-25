const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const path = require("path");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public"))); 

app.use(
    session({
        secret: "dqsdqsDSQJfof546fqDd6846#àdsq@dksqIoùdsq21641531dqs4dQSD4dS#.DSQ5@1",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: "https://glaxy-rp.vercel.app/auth/discord/callback",
            scope: ["identify"],
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, {
                id: profile.id,
                username: profile.username,
                avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
            });
        }
    )
);

app.get("/auth/discord", passport.authenticate("discord"));

app.get(
    "/auth/discord/callback",
    passport.authenticate("discord", {
        failureRedirect: "/",
    }),
    (req, res) => {
        res.redirect("/");
    }
);

app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});

app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

module.exports = app;