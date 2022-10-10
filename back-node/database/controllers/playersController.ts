import db from "../model";
const Player = db.player;

exports.findPlayer = (req: any, res: any) => {

    const id = req.body.player_id;
    console.log("id : " + id);

    Player.findById(id)
      .then((data: any) => {
        if (!data)
          res.status(404).send({ message: "Not found Player with id " + id });
        else {
            //ici tu renvoie card + player
            res.send(data);
        }
      })
      .catch(() => {
        res
          .status(500)
          .send({ message: "Error retrieving Player with id=" + id });
      });
};