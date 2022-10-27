import db from "../model";
const Card = db.card;

exports.initDB = async (req: any, res: any) => {
    console.log("DEBUG => initDB => start");
    await cardA.save();
    await cardB.save();
    await cardC.save();

    console.log("DEBUG => initDB => end");
    res.send("initDB done");
};

const cardA = new Card({
    pnjName: "farfan",
    description: "Tu veux rentrer ? Il va falloir payer, mon ami !",
    pnjImage: "farfan",
    bgImage: "entree_ville",
    choices: [
        {
            description: "Ok, je vais payer",
            argent: -10
        },
        { description: "Eh ! Regarde là bas, c'est quoi ? *Courrir à l'intérieur de la ville*" },
        {
            description: "*Donner un coup de poing* Je paye pas moi !",
            neutrality: -15
        },
    ],
    dependances: [
        {
            step: {
                min: 1
            }
        }
    ]
});

const cardB = new Card({
    pnjName: "gorsh",
    description: "Hey ! Avec Chipie, on se demandait si tu pouvais nous aider à retrouver mon collier ?",
    pnjImage: "gorsh",
    bgImage: "foret",
    choices: [
        {
            description: "Bien sûr ! Je vais chercher ça pour vous ! *trouver le collier et lui rendre*",
            neutrality: 15,
            nourriture: 10
        },
        { description: "On se connait ? *parir*" },
        {
            description: "*Chercher le collier, mais le garder pour vous*",
            argent: 10,
            neutrality: -15
        }
    ],
    dependances: [
        {
            step: {
                min: 1
            }
        }
    ]
});

const cardC = new Card({
    pnjName: "farfan",
    description: "Encore toi ? Tu vas payer pour la dernière fois !",
    pnjImage: "farfan",
    bgImage: "ville",
    choices: [
        {
            description: "Désolé, je t'offre une bière en compensation ?",
            argent: -10,
            nourriture: 10,
            neutrality: 10
        },
        {
            description: "Excuse-moi... Tiens, une petite compensation pour m'excuser.",
            argent: -20
        },
        {
            description: "Tu veux en reprendre, ça t'as pas suffit la dernière fois ? *Donner un coup de poing dans le visage*",
            neutrality: -10
        }
    ],
    dependances: [
        {
            neutrality: {
                max: 40
            },
            step: {
                min: 2
            }
        }
    ]
});
