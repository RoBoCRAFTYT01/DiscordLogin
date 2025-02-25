const express = require("express");
const session = require("express-session");
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
    ]
});
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
            ttl: 14 * 24 * 60 * 60,
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: "https://galaxy-rp.vercel.app/auth/discord/callback",
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

client.login(DISCORD_TOKEN).then(() => {
    console.log("Bot Connected");
});

module.exports = app;