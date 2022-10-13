import db from "../model";
const Card = db.card;

exports.nextCard = (req: any, res: any) => {
    console.log("TODO : choose the nextCard");
    console.log("req.body : " + req.body);
    const player = req.body.player;
}
