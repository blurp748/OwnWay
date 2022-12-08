import db from "../model";
import cards = require('../data/cards.json')
const Card = db.card;
const Player = db.player;

exports.initDB = async (req: any, res: any) => {
    console.log("DEBUG => initDB => start");
    const cardsToSave = cards.cards;
    cardsToSave.forEach((cardJSON) => {
        const cardMongo = new Card(cardJSON);
        let alreadySaved = false;

        Card.find().then(async (cards) => {
            cards.forEach((cardInDB) => {
                if ((cardInDB.description === cardMongo.description) &&
                    (cardInDB.pnjName === cardMongo.pnjName)) { alreadySaved = true; }
            });
            if (!alreadySaved) { await cardMongo.save(); }
        });
    });
    console.log("DEBUG => initDB => end");
    res.send("initDB done");
};

exports.init = async () => {
    const cardsToSave = cards.cards;
    cardsToSave.forEach((cardJSON) => {
        const cardMongo = new Card(cardJSON);
        let alreadySaved = false;

        Card.find().then(async (cards) => {
            cards.forEach((cardInDB) => {
                if ((cardInDB.description === cardMongo.description) &&
                    (cardInDB.pnjName === cardMongo.pnjName)) { alreadySaved = true; }
            });
            if (!alreadySaved) { await cardMongo.save(); }
        });
    });
    return "init done";
}

exports.resetDB = async (req: any, res: any) => {
    console.log("Clear card DB");
    let result = [];
    result.push(await Card.deleteMany({}));
    result.push(await Player.deleteMany({}));
    res.send(result);
}