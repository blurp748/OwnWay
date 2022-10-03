import { model, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const playerSchema = new Schema({
    /*name: {
        type: String,
        required: true,
        unique: true,
    },*/
    game: {
        nourriture: Number,
        vie : Number,
        argent : Number,
        neutrality : Number,
        step : Number
    }
});

playerSchema.path("createdAt").immutable(true);
playerSchema.plugin(uniqueValidator);

export const Player = model("Player", playerSchema);