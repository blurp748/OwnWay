import * as mongoose from 'mongoose';

function toJSON(this: any) {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
}

// ----------------------------------------------------
// ---------------------- Player ----------------------
// ----------------------------------------------------

const playerSchema = new mongoose.Schema(
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

// ----------------------------------------------------
// ---------------------- Carte -----------------------
// ----------------------------------------------------

const cardSchema = new mongoose.Schema(
    {
        pnjName: { type: String, required: true },
        description: { type: String, required: true },
        pnjImage: { type: String, required: true },
        bgImage: { type: String, required: true },
        choices: [
            {
                description: { type: String, required: true },
                nourriture: { type: Number, min: 0, max: 100 },
                vie: { type: Number, min: 0, max: 100 },
                argent: { type: Number, min: 0, max: 100 },
                neutrality: { type: Number, min: 0, max: 100 }
            }
        ]
    },
    { timestamps: true }
);

cardSchema.method("toJSON", toJSON);

const Card = mongoose.model("card", cardSchema);

// Initialisation Database
const db = {
    mongoose: mongoose,
    url: "mongodb://172.17.0.3:27017/API_Info701",
    player: Player,
    card: Card
};

module.exports = db;
export default db;