import express from "express";
import { db } from "~/database/schemas"

const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        const newPlayer = await db.player.create({
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