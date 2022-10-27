import console from "console";
import { ObjectId } from "mongoose";
import db from "../model";
const playerController = require("./playersController.ts");
const Card = db.card;
const Player = db.player;

// Récupérer le joueur, la carte actuelle, et la réponse choisie
exports.nextCard = async (req: any, res: any) => {
  /*
    On récupère : 
      ~- l'id du joueur
      ~- nourriture
      ~- vie
      ~- argent
      ~- neutrality
      ~- step
      ~- choice
  */

  console.log("req.body : "); console.log(req.body);
  var player: any;
  player = await Player.findById(req.body.player_id);
  const choice = req.body.choice;
  console.log("player found : " + player);

  if (player != undefined) {
    const idCurrentCard = player.card;
    console.log("card found from player: " + idCurrentCard);

    if (idCurrentCard != undefined && idCurrentCard != null) {
      const playedCard = await Card.findById(idCurrentCard);
      if (playedCard != undefined && playedCard != null) {
        // Modifier les stats du joueur en fonction de la réponse choisie
        player.nourriture += playedCard.choices[choice].nourriture;
        player.vie += playedCard.choices[choice].vie;
        player.argent += playedCard.choices[choice].argent;
        player.neutrality += playedCard.choices[choice].neutrality;
        player.step += 1;

        const dependances = playedCard.dependances[0];
        if (dependances != undefined) {
          const stepDependance = dependances.step;
          if (stepDependance != undefined) {
            const step = player.step;
            console.log("We're trying to find a card with step : ");
            // Trouver la carte suivante

            // Récupérer toutes les cartes disponibles selon le step actuel du joueur

            var cards = await Card.find();
            if (cards != undefined && cards != null) {
              for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const dependances = card.dependances[0];
                if (dependances != undefined) {
                  const stepDependance = dependances.step;
                  if (stepDependance != undefined) {
                    if (stepDependance.min > step ||
                      (stepDependance.max != undefined && stepDependance.max != null
                        && stepDependance.max < step)) {
                      cards.splice(i, 1);
                    }
                  }
                }
              };
              console.log("cards found with step filter : " + cards);
              if (cards.length > 0) {
                player.card = cards;
                player.step = player.step + 1;
                // Supprimer les cartes que le joueur a déjà joué

                for (let i = 0; i < cards.length; i++) {
                  const card = cards[i];
                  for (let j = 0; j < player.playedCards.length; j++) {
                    const cardPlayed = player.playedCards[j];
                    if (card._id == cardPlayed) {
                      cards.splice(i, 1);
                    }
                  }
                }

                console.log("cards after already played filter : " + cards);

                // Supprimer les cartes qui ne sont pas disponibles selon la neutralité actuelle du joueur
                for (let i = 0; i < cards.length; i++) {
                  const card = cards[i];
                  console.log("card : "); console.log(card);
                  const dependances = card.dependances[0];
                  if ((dependances != undefined && dependances.neutrality != undefined &&
                    (dependances.neutrality.min > player.neutrality || dependances.neutrality.max < player.neutrality))) {
                    cards.splice(i, 1);
                  }
                }

                console.log("cards after neutrality filter : " + cards);

                // Random dans les cartes restantes
                const randomCard = cards[Math.floor(Math.random() * cards.length)];
                // Changement de carte
                player.playedCards.push(player.card);
                console.log("random card choose : " + randomCard);
                console.log("player : " + player);

                // Sauvegarde du joueur
                const playerSaved = await playerController.savePlayer(player, randomCard);
                const dataToSend = {
                  player: playerController.formatPlayer(playerSaved ? playerSaved : player),
                  card: formatCard(randomCard),
                }
                console.log("DEBUG => /next => dataToSend : "); console.log(dataToSend);
                res.send(dataToSend);
              } else if (cards.length == 0) {
                console.log("No card found after step filter");
                res.send("No card found! You win (or we had an error ^^') !");
              } else {
                console.log("Error while finding next with dependances ! cards.length < 0 !");
                res.status(500).send({ message: "Error while find next with dependances ! => ERROR card.lengh < 0 !" })
              }
            } else {
              console.log("Error while find cards => " + cards);
              res.status(500).send({ message: "Error while find cards => " + cards });
            }
          } else {
            console.log("Error while find next => No step's dependances found !");
            res.status(500).send({ message: "Error while find next => No step's dependances found !" });
          }
        } else {
          console.log("Error while find next => No dependances found !");
          res.status(500).send({ message: "Error while find next => No dependances found !" });
        }
      } else {
        console.log("Error while find card => " + playedCard);
        res.status(500).send({ message: "Error while find card => " + playedCard });
      }
    } else {
      console.log("Card sended is not found !");
      res.status(500).send("Card sended is not found !");
    }
  } else {
    console.log("Error /next = player not found");
    res.status(500).send("Error /player/next : player not found");
  }
}

exports.findFirstCard = () => {
  return new Promise((resolve, reject) => {
    Card.find().then((cards_founded) => {
      if (cards_founded.length == 0) {
        console.log("No card found => create a new one");
        createFirst().then((card) => {
          resolve(formatCard(card));
        }).catch((err) => {
          reject(err);
        });
      } else {
        var card_found: any = undefined;
        cards_founded.forEach(card => {
          if (card_found == undefined) {
            // condition : card.dependances[0].step.max = 0
            const dependances = card.dependances[0];
            if (dependances != undefined) {
              const step = dependances.step;
              if (step != undefined) {
                if (step.max == 0) {
                  card_found = card;
                }
              }
            }
          }
        });
        console.log("card_found : " + card_found);
        if (card_found != undefined) {
          const returnCard = new Card(card_found);
          resolve(formatCard(returnCard));
        } else {
          createFirst().then((card) => {
            resolve(formatCard(card));
          }).catch((err) => {
            reject(err);
          });
        }
      }
    }).catch((err) => {
      console.log("Error while find first card => " + err);
    })
  });
}

exports.findCardWithId = (id: ObjectId) => {
  console.log("DEBUG => findCardWithId => id : " + id);
  return new Promise((resolve, reject) => {
    Card.findById(id).then((card) => {
      console.log("DEBUG => findCardWithId => card : " + card);
      resolve(formatCard(card));
    }).catch((err) => {
      console.log("Error while find card with id => " + err);
      reject(err);
    });
  });
}

exports.getAllCards = (req: any, res: any) => {
  Card.find()
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      console.log("error lors de la récupération des cards => " + err);
    });
};

async function createFirst() {
  const card = new Card({
    pnjName: "oldrym",
    pnjImage: "oldrym",
    bgImage: "forest",
    description: "Hey ! You're finally awake ?",
    choices: [
      { description: "Yes, but who are you ?" },
      { description: "No !" },
      { description: "Yep bro !" }
    ],
    dependances: [{ step: { min: 0, max: 0 } }]
  });
  return new Promise((resolve, reject) => {
    card.save()
      .then((card) => { resolve(card) })
      .catch((err) => { reject(err); });
  });
}

const formatCard = (card: any) => {
  return {
    id: card._id,
    pnjName: card.pnjName,
    pnjImage: card.pnjImage,
    bgImage: card.bgImage,
    description: card.description,
    choices: card.choices,
  };
}
exports.formatCard = formatCard;