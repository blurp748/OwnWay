module.exports = (app: any) => {

    const players = require("../controllers/playersController.ts");
    const cards = require("../controllers/cardsController.ts");
    const data = require("../data/data.ts");
    const playerRouter = require("express").Router();
    const adminRouter = require("express").Router();

    // ----------------------------------------------------
    // ---------------------- Admin -----------------------
    // ----------------------------------------------------

    adminRouter.get("/allPlayers", players.getAllPlayer);

    adminRouter.get("/allCards", cards.getAllCards);

    adminRouter.get("/initDB", data.initDB);

    // ----------------------------------------------------
    // --------------------- Players ----------------------
    // ----------------------------------------------------

    // Create a new Player
    playerRouter.get("/", players.createPlayer);

    // Retrieve a Player
    playerRouter.post("/", players.findPlayer);

    // Choose the next card
    playerRouter.post("/next", cards.nextCard);

    // -------------------------------//

    //Set up routes for app
    app.use("/player", playerRouter);
    app.use("/admin", adminRouter);
};