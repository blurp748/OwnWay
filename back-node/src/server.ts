import http from "http";
import app from "./server/app";
import mongoose from "mongoose";
//import db from "./database/player";

const connectToDataBase = async (url: string, options: { user: string | undefined, pass: string | undefined }) => {

    console.log(`Options = ${options.user} - ${options.pass}`)

    console.log("On essaie de se connecter à la BDD");
    /* db.mongoose
        .connect(db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Connected to the database!");
        })
        .catch((err : any) => {
            console.log("Cannot connect to the database!", err);
            process.exit();
        });
    */
}

const launchServer = async (app: any, options: { host: string, port: number }) => {
    const adress = `http://${options.host}:${options.port}`;
    console.log(`On lance le serveur à l'adresse : ${adress}`);
    return new Promise((resolve, rejects) => {
        const server = http
            .createServer(app)
            .listen(options.port, () => {
                const closeServer = async () => {
                    await server.close();
                    console.log("Server fermé");
                }
                process.once("SIGINT", closeServer).once("SIGTERM", closeServer);
                console.log("On a lancé le serveur");
                return resolve
            })
            .on("error", ((error) => {
                return rejects(error);
            }))
    })
}

const startServer = async (app: any) => {
    console.log("On lance les services du serveur et de la BDD");
    try {
        await Promise.all([
            connectToDataBase("mongodb://localhost:27017", {
                user: process.env.USERNAME,
                pass: process.env.PASSWORD
            }),
            launchServer(app, {
                host: "localhost",
                port: 3000
            })
        ]);
        console.log("On a lancé tous les services");
    } catch (error) {
        console.log(error);
    }
}

startServer(app);