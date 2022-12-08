import console from "console";
import { ObjectId } from "mongoose";
import db from "../model";
const data = require("../data/data");
const playerController = require("./playersController.ts");
const Card = db.card;
const Player = db.player;

/**
 * Récupère un joueur particulier
 * @param data données passé par la méthode post
 * @return le joueur trouvé
 */
async function getPlayer(data: any) {
  return await Player.findById(data.player_id)
}

/**
 * Retrouve la carte courrante du joueur
 * @param player Joueur stoqué dans la BDD
 * @return La carte courante
 */
async function getCurrentCard(player: any) {
  return await Card.findById(player.card);
}

function filterStep(cards: any, actualStep: Number) {
  var cardsSelected: any[] = [];
  cards.forEach((card: any) => {
    var stepDependance = card.dependances[0].step;
    if (stepDependance.max) {
      if (stepDependance.min <= actualStep && stepDependance.max >= actualStep) {
        cardsSelected.push(card);
      } else {
        //console.warn("filterStep => On retire la carte "); console.log(card);
      }
    } else {
      if (stepDependance.min <= actualStep) {
        cardsSelected.push(card);
      } else {
        //console.warn("filterStep => On retire la carte "); console.log(card);
      }
    }
  })
  return cardsSelected;
}

function filterNeutrality(cards: any, actualNotority: Number) {
  var cardsSelected: any[] = [];
  cards.forEach((card: any) => {
    var neutralityDependance = card.dependances[0].neutrality;
    if (neutralityDependance.min <= actualNotority && neutralityDependance.max >= actualNotority) {
      cardsSelected.push(card);
    } else {
      //console.warn("filterNeutrality => On retire la carte "); console.log(card);
    }
  });
  return cardsSelected;
}

function filterAlreadyPlayed(cards: any, cardsPlayedWithChoice: any[]) {
  var cardsSelected: any[] = [];
  if (cardsPlayedWithChoice != undefined) {
    cards.forEach((cardToCheck: any) => {
      var isAlreadyPlayed = false;
      cardsPlayedWithChoice.forEach((cardPlayed: any) => {
        if (JSON.stringify(cardPlayed.card._id) == JSON.stringify(cardToCheck._id)) {
          isAlreadyPlayed = true;
          //console.warn("filterAlreadyPlayed => On retire la carte "); console.log(cardToCheck);
        }
      })
      if (!isAlreadyPlayed) { cardsSelected.push(cardToCheck); }
    });
  } else {
    cardsSelected = cards;
  }
  return cardsSelected;
}

function filterCardDependances(cards: any, cardsPlayedWithChoice: any[]) {
  var cardsSelected: any[] = [];
  if (cardsPlayedWithChoice != undefined) {
    cards.forEach((cardToCheck: any) => {
      var cardDependance = cardToCheck.dependances[0].card;
      if (cardDependance == undefined) {
        cardsSelected.push(cardToCheck);
      } else {
        var isAccessible = false;
        //console.log(`cardDependance.no_card = ${cardDependance.no_card}`)
        console.log(`cardDependance.choice_to_access = ${cardDependance.choice_to_access}`)
        cardsPlayedWithChoice.forEach((cardPlayed: any) => {
          //console.log(`cardPlayed.card.no_card = ${cardPlayed.card.no_card}`)
          if (cardPlayed.card.no == cardDependance.no_card) {
            if (cardDependance.choice_to_access.length == 0) {
              isAccessible = true;
            } else {
              cardDependance.choice_to_access.forEach((choice: any) => {
                if (cardPlayed.choice == choice) {
                  isAccessible = true;
                  //console.warn("filterCardDependances => On retire la carte "); console.log(cardToCheck);
                }
              });
            }
          }
        });
        if (isAccessible) {
          cardsSelected.push(cardToCheck);
        }
      }
    });
  } else {
    cardsSelected = cards;
  }
  return cardsSelected;
}

/**
 * Cherche et met à jour la prochaine carte que le joueur va avoir
 * @param data structure de donnée comprenant le joueur et la carte courante
 * @return la structure de donnée avec le joueur, et la nouvelle carte à jouer
 */
async function getNextCard(data: any) {
  /*
    TODO : Fonctions pour récupérer la prochaine carte
    //- Récupérer toutes les cartes
    //- Filtrer par step
    //- Filtrer par autres dépendances
    //- Retirer les cartes déjà joués
    //- Sélectionner une carte aléatoirement dans le reste
    //- Ajouter la carte courrante dans la liste des cartes déjà joués
    //- Mettre la carte dans le joueur
    //- Renvoyer le joueur + nouvelle carte
  */
  var player = data.player;
  const cards = await Card.find();
  //console.log("All cards = "); console.log(cards);

  const cardsFilterStep = filterStep(cards, player.step);
  //console.log("Cards filtered by step = "); console.log(cardsFilterStep);

  const cardsFiltrerNeutrality = filterNeutrality(cardsFilterStep, player.neutrality);
  //console.log("Cards filtered by notoriety = "); console.log(cardsFiltrerNeutrality);

  const playerCardNChoice = {
    card: data.card,
    choice: data.choice
  }
  player.playedCards.push(playerCardNChoice);
  //console.log("PlayerCardNChoice = "); console.log(playerCardNChoice);
  //console.log("Player.playedCards = "); console.log(player.playedCards);

  const cardsFilterAlreadyPlayed = filterAlreadyPlayed(cardsFiltrerNeutrality, player.playedCards);
  //console.log("Cards filtered by already played = "); console.log(cardsFilterAlreadyPlayed);

  const cardFilterCardDependances = filterCardDependances(cardsFilterAlreadyPlayed, player.playedCards);
  //console.log("Cards filtered by card dependances = "); console.log(cardFilterCardDependances);

  const cardToPlay = cardFilterCardDependances[Math.floor(Math.random() * cardFilterCardDependances.length)];
  //console.log(`Card to play = ${cardToPlay}`);

  player.card = cardToPlay;

  return ({
    player: player,
    choice: data.choice,
    card: cardToPlay
  });
}

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
  const dataReceived = req.body;
  var player = await getPlayer(dataReceived);
  if (player != undefined && player != null) {
    player!!.step = dataReceived.step;
    player!!.nourriture = dataReceived.nourriture;
    player!!.vie = dataReceived.vie;
    player!!.argent = dataReceived.argent;
    player!!.neutrality = dataReceived.neutrality;

    var card = await getCurrentCard(player);
    var data = {
      player: player,
      choice: dataReceived.choice,
      card: card
    }
    data = await getNextCard(data);

    playerController.savePlayer(data.player, data.card).then((playerSaved: any) => {
      let finishToSend = false;
      let playerToSend = playerController.formatPlayer(playerSaved);
      let cardToSend;
      if (data.card) {
        cardToSend = formatCard(data.card);
      } else {
        cardToSend = null;
        finishToSend = true;
      }
      const dataToSend = {
        player: playerToSend,
        card: cardToSend,
        finish: finishToSend
      };
      if (dataToSend.card == undefined) {
        dataToSend.finish = true;
      }
      res.send(dataToSend);
    }).catch((err: any) => {
      res.status(500).send(`Error happend when saving player => ${err}`)
    });
  } else {
    res.status(500).send(`Error happend when getting player => ${player}`)
  }
}

exports.findFirstCard = () => {
  return new Promise((resolve, reject) => {
    Card.find().then((cards_founded) => {
      if (cards_founded.length == 0) {
        console.log("No card found => Empty Database");
        //data.initDB(resolve, reject)
        reject("No card found => Empty Database");
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
        //console.log("card_found : " + card_found);
        if (card_found != undefined) {
          const returnCard = new Card(card_found);
          resolve(formatCard(returnCard));
        } else {
          reject("No card found")
        }
      }
    }).catch((err) => {
      console.log("Error while find first card => " + err);
    })
  });
}

exports.findCardWithId = (id: ObjectId) => {
  //console.log("DEBUG => findCardWithId => id : " + id);
  return new Promise((resolve, reject) => {
    Card.findById(id).then((card) => {
      //console.log("DEBUG => findCardWithId => card : " + card);
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