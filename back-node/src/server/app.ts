import express from "express";
import cors from "cors";
import { router } from "./router";
import { db } from "~/database/schemas";

const app = express();

const connectToDataBase = async (url: string) => {

    console.log("On essaie de se connecter à la BDD");
    db.mongoose.connect(url).then(() => {
            console.log("Connexion à la BDD réussie");
        }).catch((error: any) => {
            console.log("Erreur de connexion à la BDD : " + error.message);
            process.exit(1);
        });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectToDataBase(db.url);
app.use("/", router);

app.listen(3000, () => {
    console.log("On a lancé le serveur");
});

export default app;