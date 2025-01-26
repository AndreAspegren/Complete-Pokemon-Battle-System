let buttonsenabled = true
let battlemessage = ''
let protected = false
let playermove = null
let enemymove = null
let p1movehistory = []
let p2movehistory = []
let p1movehit = null
let p2movehit = null
let turncounter = 0
let deadp1 = null
let deadp2 = null
let p1invul = null
let p2invul = null
let statused = null
let isconfused = null
let paralysed = null
let endturn = false
let gameon = true
let acc2hit = false
let playerqueue = []
let rivalqueue = []
let queue = []

let global = {
    trickroom: false,
    app: document.getElementById("app")
}


const types = {
    "Normal":   { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 2, "Poison": 1, "Ground": 1, "Flying": 1, "Psychic": 1, "Bug": 1, "Rock": 1, "Ghost": 0, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Fire":     { "Normal": 1, "Fire": 0.5, "Water": 2, "Grass": 0.5, "Electric": 1, "Ice": 1, "Fighting": 1, "Poison": 1, "Ground": 2, "Flying": 1, "Psychic": 1, "Bug": 0.5, "Rock": 2, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Water":    { "Normal": 1, "Fire": 0.5, "Water": 0.5, "Grass": 2, "Electric": 1, "Ice": 0.5, "Fighting": 1, "Poison": 1, "Ground": 2, "Flying": 1, "Psychic": 1, "Bug": 1, "Rock": 2, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Grass":    { "Normal": 1, "Fire": 2, "Water": 0.5, "Grass": 0.5, "Electric": 0.5, "Ice": 2, "Fighting": 1, "Poison": 2, "Ground": 0.5, "Flying": 2, "Psychic": 1, "Bug": 2, "Rock": 2, "Ghost": 1, "Dragon": 2, "Dark": 1, "Steel": 2, "Fairy": 1, "No Type": 1 },
    "Electric": { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 0.5, "Ice": 1, "Fighting": 1, "Poison": 1, "Ground": 2, "Flying": 0.5, "Psychic": 1, "Bug": 1, "Rock": 1, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Ice":      { "Normal": 1, "Fire": 2, "Water": 0.5, "Grass": 2, "Electric": 1, "Ice": 0.5, "Fighting": 2, "Poison": 1, "Ground": 2, "Flying": 2, "Psychic": 1, "Bug": 1, "Rock": 2, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 2, "Fairy": 1, "No Type": 1 },
    "Fighting": { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 1, "Poison": 0.5, "Ground": 1, "Flying": 2, "Psychic": 2, "Bug": 0.5, "Rock": 0.5, "Ghost": 0, "Dragon": 1, "Dark": 0.5, "Steel": 1, "Fairy": 2, "No Type": 1 },
    "Poison":   { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 0.5, "Electric": 1, "Ice": 1, "Fighting": 1, "Poison": 0.5, "Ground": 2, "Flying": 1, "Psychic": 2, "Bug": 0.5, "Rock": 1, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 0, "Fairy": 0.5, "No Type": 1 },
    "Ground":   { "Normal": 1, "Fire": 2, "Water": 1, "Grass": 0.5, "Electric": 2, "Ice": 1, "Fighting": 1, "Poison": 2, "Ground": 1, "Flying": 0, "Psychic": 1, "Bug": 0.5, "Rock": 2, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 2, "Fairy": 1, "No Type": 1 },
    "Flying":   { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 2, "Electric": 0.5, "Ice": 1, "Fighting": 2, "Poison": 1, "Ground": 1, "Flying": 1, "Psychic": 1, "Bug": 2, "Rock": 0.5, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Psychic":  { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 2, "Poison": 2, "Ground": 1, "Flying": 1, "Psychic": 0.5, "Bug": 1, "Rock": 1, "Ghost": 1, "Dragon": 1, "Dark": 0, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Bug":      { "Normal": 1, "Fire": 0.5, "Water": 1, "Grass": 2, "Electric": 1, "Ice": 1, "Fighting": 0.5, "Poison": 0.5, "Ground": 1, "Flying": 0.5, "Psychic": 2, "Bug": 1, "Rock": 1, "Ghost": 0.5, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Rock":     { "Normal": 1, "Fire": 2, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 2, "Fighting": 0.5, "Poison": 1, "Ground": 0.5, "Flying": 2, "Psychic": 1, "Bug": 2, "Rock": 1, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Ghost":    { "Normal": 0, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 1, "Poison": 1, "Ground": 1, "Flying": 1, "Psychic": 2, "Bug": 1, "Rock": 1, "Ghost": 2, "Dragon": 1, "Dark": 0.5, "Steel": 1, "Fairy": 1, "No Type": 1 },
    "Dragon":   { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 1, "Poison": 1, "Ground": 1, "Flying": 1, "Psychic": 1, "Bug": 1, "Rock": 1, "Ghost": 1, "Dragon": 2, "Dark": 1, "Steel": 0.5, "Fairy": 0, "No Type": 1 },
    "Dark":     { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 0.5, "Poison": 1, "Ground": 1, "Flying": 1, "Psychic": 2, "Bug": 1, "Rock": 1, "Ghost": 2, "Dragon": 1, "Dark": 0.5, "Steel": 1, "Fairy": 0.5, "No Type": 1 },
    "Steel":    { "Normal": 1, "Fire": 0.5, "Water": 0.5, "Grass": 1, "Electric": 0.5, "Ice": 2, "Fighting": 1, "Poison": 1, "Ground": 1, "Flying": 1, "Psychic": 1, "Bug": 1, "Rock": 2, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 0.5, "Fairy": 2, "No Type": 1 },
    "Fairy":    { "Normal": 1, "Fire": 0.5, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 2, "Poison": 0.5, "Ground": 1, "Flying": 1, "Psychic": 1, "Bug": 1, "Rock": 1, "Ghost": 1, "Dragon": 2, "Dark": 1, "Steel": 0.5, "Fairy": 1, "No Type": 1 },
    "Null":     { "Normal": 1, "Fire": 1, "Water": 1, "Grass": 1, "Electric": 1, "Ice": 1, "Fighting": 1, "Poison": 1, "Ground": 1, "Flying": 1, "Psychic": 1, "Bug": 1, "Rock": 1, "Ghost": 1, "Dragon": 1, "Dark": 1, "Steel": 1, "Fairy": 1, "No Type": 1 }
}




const statstates = [
    2 / 8, 2 / 7, 2 / 6, 2 / 5, 2 / 4, 2 / 3, 2 / 2, 3 / 2, 4 / 2, 5 / 2, 6 / 2, 7 / 2, 8 / 2
]

const statstates2 = [
    3 / 9, 3 / 8, 3 / 7, 3 / 6, 3 / 5, 3 / 4, 3 / 3, 4 / 3, 5 / 3, 6 / 3, 7 / 3, 8 / 3, 9 / 3
]

let player = {
    move: null,
    trapped: false,
    atk: 6,
    def: 6,
    spa: 6,
    spd: 6,
    spe: 6,
    acc: 6,
    eva: 6,
    cnf: false,  // Confused
    spk: false,  // Spikes
    tspk: false, // Toxic Spikes
    strk: false, // Stealth Rock
    stwb: false, // Sticky Web
    auveil: 0,
    reflect: 0,
    lscreen: 0,
    trapped: false,
    sub: false,
    txc: 1,      // toxic counter
    inlove: false,
    dynamax: false,
}

// let actors = {
//     players: [
//         {
//             name: 'Red',
//             avatar: `<div>
//             <img style="height: 20vh; width: auto" src="https://archives.bulbagarden.net/media/upload/thumb/d/d3/Lets_Go_Pikachu_Eevee_Red.png/250px-Lets_Go_Pikachu_Eevee_Red.png" alt="}">
//             `,
//             pokemon: [pokemon[0], pokemon[1], pokemon[1], pokemon[0]].map(p => JSON.parse(JSON.stringify(p)))
//         },
//         {
//             name: 'Cynthia',
//             avatar: `
//             <img style="height: 20vh; width: auto" src="https://www.serebii.net/pokemonmasters/syncpairs/cynthia.png" alt="">`,
//             pokemon: [pokemon[2], pokemon[2], pokemon[0]].map(p => JSON.parse(JSON.stringify(p)))
//         }
//     ],
//     stats: [
//         {
//             move: null,
//             trapped: false,
//             atk: 6,
//             def: 6,
//             spa: 6,
//             spd: 6,
//             spe: 6,
//             acc: 6,
//             eva: 6,
//             cnf: false,  // Confused
//             spk: false,  // Spikes
//             tspk: false, // Toxic Spikes
//             strk: false, // Stealth Rock
//             stwb: false, // Sticky Web
//             auveil: 0,
//             reflect: 0,
//             lscreen: 0,
//             trapped: false,
//             sub: false,
//             txc: 1,      // toxic counter
//             inlove: false,
//             dynamax: false,
//         },
//         {
//             move: null,
//             trapped: false,
//             atk: 6,
//             def: 6,
//             spa: 6,
//             spd: 6,
//             spe: 6,
//             acc: 6,
//             eva: 6,
//             cnf: false,
//             spk: false,
//             tspk: false,
//             strk: false,
//             stwb: false,
//             auveil: 0,
//             reflect: 0,
//             lscreen: 0,
//             trapped: false,
//             sub: false,
//             txc: 1,
//             inlove: false,
//             dynamax: false,
//         }
//     ],
// }

let rival = {
    move: null,
    trapped: false,
    atk: 6,
    def: 6,
    spa: 6,
    spd: 6,
    spe: 6,
    acc: 6,
    eva: 6,
    cnf: false,
    spk: false,
    tspk: false,
    strk: false,
    stwb: false,
    auveil: 0,
    reflect: 0,
    lscreen: 0,
    trapped: false,
    sub: false,
    txc: 1,
    inlove: false,
    dynamax: false,
}

let weather = {
    weather: 'sun',
    image: '<img src="media/pictures/status/sun.png" style="width: 5vh; height: auto;" alt="">',
    images: {
        sun: '<img src="media/pictures/status/sun.png" style="width: 5vh; height: auto;" alt="">',
        rain: '<img src="media/pictures/status/rain.png" style="width: 5vh; height: auto;" alt="">',
        sandstorm: '<img src="media/pictures/status/sandstorm.png" style="width: 5vh; height: auto;" alt="">',
        hail: '<img src="media/pictures/status/snow.png" style="width: 5vh; height: auto;" alt="">',
    }
}

const statusimages = {
    brn: '<img src="media/pictures/status/brnimage.png" style="width: 5vh; height: auto;" alt="">',
    par: '<img src="media/pictures/status/parimage.png" style="width: 6vh; height: auto;" alt="">',
    psn: '<img src="media/pictures/status/psnimage.png" style="width: 6vh; height: auto;" alt="">',
    tox: '<img src="media/pictures/status/psnimage.png" style="width: 6vh; height: auto;" alt="">',
    slp: '<img src="media/pictures/status/slpimage.png" style="width: 6vh; height: auto;" alt="">',
    frz: '<img src="media/pictures/status/frzimage.png" style="width: 6vh; height: auto;" alt="">',
}

const typecolors = ['hsl(58, 20%, 56%)',
    'hsl(25, 84%, 56%)',
    'hsl(220, 82%, 66%)',
    'hsl(97, 52%, 53%)',
    'hsl(48, 92%, 57%)',
    'hsl(177, 46%, 71%)',
    'hsl(2, 65%, 45%)',
    'hsl(301, 44%, 44%)',
    'hsl(43, 68%, 64%)',
    'hsl(255, 80%, 75%)',
    'hsl(341, 93%, 65%)',
    'hsl(67, 75%, 41%)',
    'hsl(50, 54%, 46%)',
    'hsl(266, 26%, 46%)',
    'hsl(257, 97%, 59%)',
    'hsl(24, 23%, 35%)',
    'hsl(240, 19%, 76%)',
    'hsl(330, 49%, 68%)'
]

const movesounds = {
    tackle: new Audio('media/sounds/moves/tackle.mp3'),
    curse: new Audio('media/sounds/movescurse.mp3'),
    smokescreen: new Audio('media/sounds/moves/smokescreen.mp3'),
    statup: new Audio('media/sounds/moves/statup.mp3'),
    statdown: new Audio('media/sounds/moves/statdown.mp3'),
    protect: new Audio('media/sounds/moves/protect.mp3'),
    gigaimpact: new Audio('media/sounds/moves/gigaimpact.mp3'),
    rockblast: new Audio('media/sounds/moves/rockblast.mp3'),
    raindance: new Audio('media/sounds/moves/raindance.mp3'),
    sandstorm: new Audio('media/sounds/moves/sandstorm.mp3'),
    bite: new Audio('media/sounds/moves/sandstorm.mp3'),
    fly: new Audio('media/sounds/moves/fly.mp3'),
    rockblast: new Audio('media/sounds/moves/tackle.mp3'),
    uturn: new Audio('media/sounds/moves/tackle.mp3'),
}

const items = [
    {
        name: 'Focus Sash',
        effect: 'fullhpdmgsurvival',
        trigger: 'fullhpko',
        cd: false,
    }
]

const abilities = [
    {
        name: 'Intimidate',
        trigger: 'onentry',
        cd: false,
        effect: 'atkdown',
    },
    {
        name: 'Sturdy',
        effect: 'fullhpdmgsurvival',
        trigger: 'fullhpko',
        cd: false,
    }
]









