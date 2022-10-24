import mongoose, { ObjectId } from "mongoose";
import db from "../model";
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

  console.log("req.body : " + req.body);
  var player: any;
  player = await Player.findById(req.body.player_id);
  const choice = req.body.choice;

  console.log("player found : " + player);

  if (player != undefined) {
    const idCurrentCard = player.card;
    console.log("card found from player: " + idCurrentCard);

    if (idCurrentCard != undefined && idCurrentCard != null) {
      Card.findById(idCurrentCard).then((card: any) => {
        // Modifier les stats du joueur en fonction de la réponse choisie
        player.nourriture += card.choices[choice].nourriture;
        player.vie += card.choices[choice].vie;
        player.argent += card.choices[choice].argent;
        player.neutrality += card.choices[choice].neutrality;

        const dependances = card.dependances[0];
        if (dependances != undefined) {
          const stepDependance = dependances.step;
          if (stepDependance != undefined) {
            const stepMin = stepDependance.min;
            const stepMax = stepDependance.max;
            console.log("We're trying to find a card with step min : " + stepMin + " and step max : " + stepMax);
            // Trouver la carte suivante

            // Récupérer toutes les cartes disponibles selon le step actuel du joueur

            Card.find({ "dependances.step.min": { $gt: stepMin }, "dependances.step.max": { $lte: stepMax } })
              .then((cards: any) => {
                console.log("cards found with step filter : " + cards);
                if (cards.length > 0) {
                  player.card = cards;
                  player.step = player.step + 1;
                  // Supprimer les cartes que le joueur a déjà joué

                  for (var playedCard in player.playedCards) {
                    cards.remove(playedCard);
                  }

                  console.log("cards after already played filter : " + cards);

                  // Supprimer les cartes qui ne sont pas disponibles selon la neutralité actuelle du joueur
                  cards.forEach((card: any) => {
                    if (card.neutrality.min > player.neutrality || card.neutrality.max < player.neutrality) {
                      cards.remove(card);
                    }
                  });

                  console.log("cards after neutrality filter : " + cards);

                  // Random dans les cartes restantes

                  // Changement de carte
                  // TODO : stocker la carte courante dans la liste des cartes parcourues par le joueur

                  console.log("TODO : choose the nextCard");
                  res.send("TODO : choose the nextCard");
                } else if (cards.length == 0) {
                  console.log("No card found after step filter");
                  res.send("No card found! You win (or we had an error ^^') !");
                } else {
                  console.log("Error while finding next with dependances ! cards.length < 0 !");
                  res.status(500).send({ message: "Error while find next with dependances ! => ERROR card.lengh < 0 !" })
                }
              })
              .catch((err: any) => {
                console.log("Error while find cards with step => " + err);
                res.status(500).send({ message: "Error while find cards with step => " + err });
              });
          } else {
            console.log("Error while find next => No step's dependances found !");
            res.status(500).send({ message: "Error while find next => No step's dependances found !" });
          }
        } else {
          console.log("Error while find next => No dependances found !");
          res.status(500).send({ message: "Error while find next => No dependances found !" });
        }
      }).catch((err) => {
        console.log("Error while find card => " + err);
        res.status(500).send({ message: "Error while find card => " + err });
      });
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
          resolve(formatData(card));
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
        const returnCard = new Card(card_found);
        resolve(formatData(returnCard));
      }
    }).catch((err) => {
      console.log("Error while find first card => " + err);
    })
  });
}

exports.findCardWithId = (id: ObjectId) => {
  //console.log("DEBUG => findCardWithId => id " + id);
  return new Promise((resolve, reject) => {
    Card.find({ "_id": id }).then((card) => {
      resolve(formatData(card));
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

function formatData(card: any) {
  return {
    id: card._id,
    pnjName: card.pnjName,
    pnjImage: card.pnjImage,
    bgImage: card.bgImage,
    description: card.description,
    choices: card.choices,
  };
}