import db from "../model";
const Player = db.player;
const Card = db.card;

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

exports.createPlayer = (req: any, res: any) => {
  const player = new Player({
    nourriture: 100,
    vie: 100,
    argent: 100,
    neutrality: 100,
    step: 0,
    card: null
  });

  player.save()
    .then((playerCreated: any) => {
      console.log("data : " + playerCreated);
      res.send(playerCreated);
    }).catch((err: any) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Player."
      });
    });
};

exports.savePlayer = (player: any, newCard: any) => {
  Player.findByIdAndUpdate(player._id, {
    nourriture: player.nourriture,
    vie: player.vie,
    argent: player.argent,
    neutrality: player.neutrality,
    step: player.step,
    card: newCard
  }, { new: true })
    .then((data: any) => {
      if (!data) {
        console.log("Not found Player with id " + player._id);
      } else {
        console.log("Player updated successfully.");
      }
    }).catch((err: any) => {
      console.log("Error updating Player with id=" + player._id);
    });
}