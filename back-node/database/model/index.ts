import * as mongoose from 'mongoose';
require("dotenv").config();

function toJSON(this: any) {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
}

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
                nourriture: { type: Number, min: -100, max: 100, default: 0 },
                vie: { type: Number, min: -100, max: 100, default: 0 },
                argent: { type: Number, min: -100, max: 100, default: 0 },
                neutrality: { type: Number, min: -100, max: 100, default: 0 },
            }
        ],
        dependances: [
            {
                nourriture: {
                    min: {type: Number, default: 0},
                    max: {type: Number, default: 100}
                },
                vie: {
                    min: {type: Number, default: 0},
                    max: {type: Number, default: 100},
                },
                argent: {
                    min: {type: Number, default: 0},
                    max: {type: Number, default: 100}
                },
                neutrality: {
                    min: {type: Number, default: 0},
                    max: {type: Number, default: 100}
                },
                step: {
                    min: {type: Number, default: 1},
                    max: {type: Number}
                }
            }
        ]
    },
    { timestamps: true }
);

cardSchema.method("toJSON", toJSON);

const Card = mongoose.model("card", cardSchema);


// ----------------------------------------------------
// ---------------------- Player ----------------------
// ----------------------------------------------------

const playerSchema = new mongoose.Schema(
    {
        nourriture: { type: Number, min: 0, max: 100, required: true },
        vie: { type: Number, min: 0, max: 100, required: true },
        argent: { type: Number, min: 0, max: 100, required: true },
        neutrality: { type: Number, min: 0, max: 100, required: true },
        step: { type: Number, required: true },
        card: { type: mongoose.Types.ObjectId, ref: "Card", required: true },
        playedCards: [cardSchema]
    },
    { timestamps: true }
);

playerSchema.method("toJSON", toJSON);

const Player = mongoose.model("player", playerSchema);

// Initialisation Database
const db = {
    mongoose: mongoose,
    url: process.env.MONGODB_URI,
    player: Player,
    card: Card
};

module.exports = db;
export default db;