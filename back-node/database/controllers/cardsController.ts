import db from "../model";
const Card = db.card;
const Player = db.player;

exports.nextCard = (req: any, res: any) => {
  console.log("TODO : choose the nextCard");
  console.log("req.body : " + req.body);
  // Récupérer le joueur, la carte actuelle, et la réponse choisie
  var player;
  Player.findById(req.body.player_id)
    .then((playerFound) => {
      player = playerFound;
      console.log("player found : " + player);
    })
    .catch((err) => {
      console.log("Error while find player with id => " + err);
      res.status(500).send({ message: "Error while find player with id => " + err });
    });
  const card = req.body.card;
  const choice = req.body.choice;

  console.log("player : "); console.log(player);

  // Modifier les stats du joueur en fonction de la réponse choisie
  // TODO : modifier les stats du joueur en fonction de la réponse choisie

  // Trouver la carte suivante
  // TODO : trouver la carte suivante

  // Changement de carte
  // TODO : stocker la carte courante dans la liste des cartes parcourues par le joueur

  res.send("TODO : choose the nextCard");
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

exports.findCardWithId = (id: String) => {
  return new Promise((resolve, reject) => {
    Card.findById(id).then((card) => {
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