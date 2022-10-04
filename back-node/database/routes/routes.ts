module.exports = (app: any) => {

    // ----------------------------------------------------
    // --------------------- Players ---------------------
    // ----------------------------------------------------

    const players = require("../controllers/playersController.ts");
    const playerRouter = require("express").Router();

    // Retrieve a Player
    playerRouter.get("/", players.findPlayer);


    // -------------------------------//

    //Set up routes for app
    app.use("/player", playerRouter);
};