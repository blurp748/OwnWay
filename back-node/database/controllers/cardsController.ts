import db from "../model";
const Card = db.card;

exports.nextCard = (req: any, res: any) => {
  console.log("TODO : choose the nextCard");
  console.log("req.body : " + req.body);
  const player = req.body.player;
}

exports.findFirstCard = () => {
  return new Promise((resolve, reject) => {
    Card.find({ dependances: { step: { min: 0, max: 0 } } }).then((card) => {
      console.log("Find first => ");
      console.log(card);
      if (card.length == 0) {
        console.log("No card found => create a new one");
        createFirst().then((card) => {
          console.log("Card created => "); console.log(card);
          resolve(card);
        }
        ).catch((err) => {
          reject(err);
        });
      } else {
        console.log("Card found => "); console.log(card);
        const returnCard = new Card(card);
        console.log("returnCard => "); console.log(returnCard);
        resolve(returnCard);
      }
    }).catch((err) => {
      console.log("Error while find first card => " + err);
    })
  });
}

exports.findCardWithId = (id: String) => {
  return new Promise((resolve, reject) => {
    Card.findById(id).then((card) => {
      console.log("Find card with id => "); console.log(card);
      resolve(card);
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
    description: "Hey ! You finally awaike ?",
    choices: [
      { description: "Yes, but who are you ?" },
      { description: "No ! I'm alwais on the moon" },
      { description: "Yes, I'm awaike. But who are you, and where I am ?" }
    ],
    dependances: [{ step: { min: 0, max: 0 } }]
  });
  return new Promise((resolve, reject) => {
    card.save()
      .then((card) => { console.log("New card = " + card); resolve(card) })
      .catch((err) => { console.log("Erreur lors de la création de la première carte => " + err); reject(err); });
  });
}