import db from "../model";
const Card = db.card;

exports.nextCard = (req: any, res: any) => {
  console.log("TODO : choose the nextCard");
  console.log("req.body : " + req.body);
  const player = req.body.player;
}

exports.findFirstCard = () => {
  return new Promise((resolve, reject) => {
    Card.find().then((cards_founded) => {
      if (cards_founded.length == 0) {
        console.log("No card found => create a new one");
        createFirst().then((card) => {
          resolve(card);
        }).catch((err) => {
          reject(err);
        });
      } else {
        var card_found : any = undefined;
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
    description: "Hey ! You finally awake ?",
    choices: [
      { description: "Yes, but who are you ?" },
      { description: "No ! I'm always on the moon" },
      { description: "Yes, I'm awake. But who are you, and where I am ?" }
    ],
    dependances: [{ step: { min: 0, max: 0 } }]
  });
  return new Promise((resolve, reject) => {
    card.save()
      .then((card) => { resolve(card) })
      .catch((err) => { reject(err); });
  });
}