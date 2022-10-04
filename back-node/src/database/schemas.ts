import mongoose, { model, Schema } from "mongoose";

mongoose.Promise = global.Promise;

function toJSON(this: any) {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
}

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
playerSchema.method("toJSON", toJSON);
const Player = model("Player", playerSchema);

const db = {
mongoose: mongoose,
url: "mongodb://localhost:27017?serverSelectionTimeoutMS=10000",
player: Player
};
export { db };