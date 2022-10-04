import * as mongoose from 'mongoose';

function toJSON(this: any) {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
}

// ----------------------------------------------------
// --------------------- Question ---------------------
// ----------------------------------------------------

var playerSchema = new mongoose.Schema(
    {
        nourriture: { type: Number, min: 0, max: 100 },
        vie: { type: Number, min: 0, max: 100 },
        argent: { type: Number, min: 0, max: 100 },
        neutrality: { type: Number, min: 0, max: 100 },
        step: { type: Number },
    },
    { timestamps: true }
);

playerSchema.method("toJSON", toJSON);

const Player = mongoose.model("player", playerSchema);

// Initialisation Database
const db = {
    mongoose: mongoose,
    url: "mongodb://localhost:27017",
    player: Player
};

module.exports = db;