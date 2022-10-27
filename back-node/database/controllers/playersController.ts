import db from "../model";
const cards = require("./cardsController.ts");
const Player = db.player;

exports.findPlayer = (req: any, res: any) => {
  const id = req.body.player_id;

  Player.findById(id)
    .then((playerDB: any) => {
      if (!playerDB)
        res.status(500).send({ message: "Not found Player with id " + id });
      else {
        //console.log("DEBUG => findPlayer => data send : " + playerDB);
        //console.log("DEBUG => findPlayer => data.card  : " + playerDB.card);

        cards.findCardWithId(playerDB.card).then((cardFind: any) => {
          console.log("DEBUG => findPlayer => cardFound : "); console.log(cardFind);
          let dataToSend = {
            player: formatPlayer(playerDB),
            card: cards.formatCard(cardFind)
          }
          console.log("DEBUG => findPlayer => dataToSend : "); console.log(dataToSend);
          res.send(dataToSend);
        }).catch((err: any) => {
          console.log("Error while find card with id => " + err);
          res.status(500).send({ message: "Error while find card with id => " + err });
        });
      }
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: "Error retrieving Player with id=" + id });
    });
};

exports.createPlayer = (req: any, res: any) => {
  cards.findFirstCard().then((cardFind: any) => {
    var player = new Player({
      nourriture: 100,
      vie: 100,
      argent: 100,
      neutrality: 50,
      step: 0,
      card: cardFind.id,
      playedCards: []
    });
    //console.log("DEBUG => createPlayer => cardFind : "); console.log(cardFind);
    player.save()
      .then((playerCreated: any) => {
        //console.log("DEBUG => createPlayer => playerCreated : " + playerCreated);
        var dataToSend = {
          player: formatPlayer(playerCreated),
          card: cards.formatCard(cardFind)
        };
        res.send(dataToSend);
      }).catch((err: any) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Player."
        });
      });
  }).catch((err: any) => {
    console.log("Create Player error => " + err);
    res
      .setStatus(500)
      .send({ message: "Erreur lors de la création du player : " + err });
  })
};

exports.savePlayer = (player: any, newCard: any) => {
  Player.findByIdAndUpdate(player._id, {
    nourriture: player.nourriture,
    vie: player.vie,
    argent: player.argent,
    neutrality: player.neutrality,
    step: player.step,
    card: newCard,
    playedCards: player.playedCards
  }, { new: true })
    .then((data: any) => {
      if (!data) {
        console.log("Not found Player with id " + player._id);
      } else {
        console.log("Player updated successfully.");
      }
    }).catch((err: any) => {
      console.log("Error updating Player with id=" + player._id);
    });
};

exports.getAllPlayer = (req: any, res: any) => {
  Player.find()
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      console.log("error lors de la récupération des players => " + err);
    });
};

const formatPlayer = (player: any) => {
  //console.log("DEBUG => formatPlayer => player : " + player);
  return {
    nourriture: player.nourriture,
    vie: player.vie,
    argent: player.argent,
    neutrality: player.neutrality,
    step: player.step,
    player_id: player.id
  }
}
exports.formatPlayer = formatPlayer;