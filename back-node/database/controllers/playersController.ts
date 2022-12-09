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
        cards.findCardWithId(playerDB.card).then((cardFind: any) => {
          let dataToSend = {
            player: formatPlayer(playerDB),
            card: cards.formatCard(cardFind)
          }
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
    player.save()
      .then((playerCreated: any) => {
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
      .status(500)
      .send({ message: "Erreur lors de la création du player : " + err });
  })
};

exports.savePlayer = (player: any, newCard: any) => {
  return new Promise((resolve, reject) => {
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
          reject("Not found Player with id " + player._id);
        } else {
          resolve(data);
        }
      }).catch((err: any) => {
        console.log("Error updating Player with id=" + player._id);
        reject("Error updating Player with id=" + player._id);
      });
  })
};

exports.getAllPlayer = (req: any, res: any) => {
  Player.find()
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      console.log("error lors de la récupération des players => " + err);
    });
};

exports.deletePlayer = async (req: any, res: any) => {
  const id = req.body.player_id;

  const dbresp = await Player.findByIdAndRemove(id);
  if (!dbresp) {
    res.status(500).send({ message: "Not found Player with id " + id });
  } else {
    res.send({ message: "Player was deleted successfully!" });
  }
}

const formatPlayer = (player: any) => {
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