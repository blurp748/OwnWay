import express from "express";
import { Player } from "~/database/player/player";

const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        await Player.create({
            game: {
                nourriture: 100,
                vie: 100,
                argent: 100,
                neutrality: 0,
                step: 0
            }
        });
        res.send("Hello from /.get");
    })
    .post(async (req, res) => {
        console.log(req.body);
        res.send("Hello from /.post");
    });

router.route("/next")
    .post(async (req, res) => {
        res.send("Hello from /next.post");
    });

export { router };