module.exports = (app: any) => {

    // ----------------------------------------------------
    // --------------------- Players ---------------------
    // ----------------------------------------------------

    const players = require("../controllers/playersController.ts");
    const cards = require("../controllers/cardsController.ts");
    const playerRouter = require("express").Router();

    // Create a new Player
    playerRouter.get("/", players.createPlayer);

    // Retrieve a Player
    playerRouter.post("/", players.findPlayer);

    // Choose the next card
    playerRouter.post("/next", cards.nextCard);

    // -------------------------------//

    //Set up routes for app
    app.use("/player", playerRouter);
};