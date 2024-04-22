let buttonsenabled = true
let battlemessage = ''
let protected = false
let p1movehistory = []
let p2movehistory = []
let p1movehit = null
let p2movehit = null
let deadp1 = null
let deadp2 = null
let p1invul = null
let p2invul = null
let p2nextmove = null
let statused = null
let isconfused = null
let paralysed = null
let endturn = false
let gameon = true

const types = [
    /* Normal 0*/[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1, 1],
    /* Fire 1*/[1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1, 1],
    /* Water 2*/[1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1, 1],
    /* Grass 3*/[1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 1, 0.5, 1, 0.5, 1, 0.5, 1, 1],
    /* Electric 4*/[1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1],
    /* Ice 5*/[1, 0.5, 0.5, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1, 0.5, 1, 0.5, 1, 1],
    /* Fighting 6*/[2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5, 1],
    /* Poison 7*/[1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2, 1],
    /* Ground 8*/[1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 1, 2, 1, 1, 1, 2, 1, 1],
    /* Flying 9*/[1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 0.5, 1, 2, 1, 0.5, 1, 1],
    /* Psychic 10*/[1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1, 1],
    /* Bug 11*/[1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5, 1],
    /* Rock 12*/[1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
    /* Ghost 13*/[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1, 1],
    /* Dragon 14*/[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0, 1],
    /* Dark 15*/[1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5, 1],
    /* Steel 16*/[1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2, 1],
    /* Fairy 17*/[1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1, 1],
    /* No Type 18*/[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const statstates = [
    2 / 8, 2 / 7, 2 / 6, 2 / 5, 2 / 4, 2 / 3, 2 / 2, 3 / 2, 4 / 2, 5 / 2, 6 / 2, 7 / 2, 8 / 2
]

const statstates2 = [
    3 / 9, 3 / 8, 3 / 7, 3 / 6, 3 / 5, 3 / 4, 3 / 3, 4 / 3, 5 / 3, 6 / 3, 7 / 3, 8 / 3, 9 / 3
]

let global = {
    trickroom: false
}

let player = {
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
    txc: 1,      // toxic counter
}

let rival = {
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
    txc: 1,
}

let weather = {
    weather: '',
    image: '',
    images: {
        sun: '<img src="pictures/status/sun.png" style="width: 5vh; height: auto;" alt="">',
        rain: '<img src="pictures/status/rain.png" style="width: 5vh; height: auto;" alt="">',
        sandstorm: '<img src="pictures/status/sandstorm.png" style="width: 5vh; height: auto;" alt="">',
        hail: '<img src="pictures/status/snow.png" style="width: 5vh; height: auto;" alt="">',
    }
}

const statusimages = {
    brn: '<img src="pictures/status/brnimage.png" style="width: 5vh; height: auto;" alt="">',
    par: '<img src="pictures/status/parimage.png" style="width: 6vh; height: auto;" alt="">',
    psn: '<img src="pictures/status/psnimage.png" style="width: 6vh; height: auto;" alt="">',
    tox: '<img src="pictures/status/psnimage.png" style="width: 6vh; height: auto;" alt="">',
    slp: '<img src="pictures/status/slpimage.png" style="width: 6vh; height: auto;" alt="">',
    frz: '<img src="pictures/status/frzimage.png" style="width: 6vh; height: auto;" alt="">',
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

const items = {
    focussash: {
        name: 'Focus Sash',
        effect: 'fullhpdmgsurvival',
        cd: false,
    } 
}

const abilities = [
    {
        name: 'Intimidate',
        activateonentry: true,
        cd: false,
        effect: 'atkdown',
    },
    {
        name: 'Sturdy',
        effect: 'survive1hpfromfull',
        cd: false,
    } 
]

const moves = [
    {
        name: 'Tackle',
        type: 0,
        acc: 100,
        movetype: 'damage',
        dmg: 40,
        pp: 35,
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'U Turn',
        type: 11,
        acc: 100,
        movetype: 'damage',
        effect2: 'switchuser',
        acc2: 0,
        dmg: 70,
        pp: 35,
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Protect',
        type: 0,
        acc: 0,
        movetype: 'protect',
        priority: 4,
        pp: 10,
    },
    {
        name: 'Rock Blast',
        type: 12,
        acc: 90,
        movetype: 'multidmg',
        dmg: 25,
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Giga Impact',
        type: 0,
        acc: 90,
        movetype: 'damage',
        turn2: {
            movetype: 'recharge'
        },
        dmg: 150,
        pp: 35,
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Fly',
        type: 9,
        movetype: 'invul',
        turn2: {
            name: 'Fly',
            type: 9,
            dmg: 90,
            acc: 95,
            movetype: 'damage',
            dmgtype: 'phy',
            pp: 10,
        },
    },
    {
        name: 'Toxic',
        type: 7,
        acc: 0,
        movetype: 'status',
        statustype: 'tox',
        effect: true,
        pp: 10,
    },
    {
        name: 'Power Up Punch',
        type: 6,
        acc: 0,
        movetype: 'damage',
        dmg: 40,
        effect2: 'stat',
        acc2: 100,
        effecttype: ['atk'],
        effect: [1],
        who: ['u'],
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Recover',
        type: 0,
        acc: 0,
        movetype: 'heal',
        heal: 'uhp + umaxhp * 0.5',
        pp: 10,
    },
    {
        name: 'Growl',
        type: 0,
        acc: 0,
        movetype: 'stat',
        effecttype: ['atk'],
        effect: [-1],
        who: ['o'],
        pp: 10,
    },
    {
        name: 'Quick Attack',
        type: 0,
        acc: 100,
        movetype: 'damage',
        dmg: 40,
        acc: 100,
        priority: 1,
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Swords Dance',
        type: 0,
        acc: 0,
        movetype: 'stat',
        effecttype: ['atk'],
        effect: [2],
        who: ['o'],
        pp: 10,
    },
    {
        name: 'Explosion',
        type: 0,
        dmg: 250,
        acc: 100,
        acc2: 0,
        movetype: 'damage',
        effect2: 'suicide',
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Smokescreen',
        type: 13,
        acc: 0,
        movetype: 'stat',
        effecttype: ['acc'],
        effect: [-1],
        who: ['o'],
        pp: 10,
    },
    {
        name: 'Will o Wisp',
        type: 1,
        acc: 85,
        movetype: 'status',
        statustype: 'brn',
        effect: true,
        pp: 10,
    },
    {
        name: 'Sandstorm',
        type: 3,
        acc: 0,
        movetype: 'weatherchange',
        weather: 'sandstorm',
        pp: 10,
    },
    {
        name: 'Rain Dance',
        type: 2,
        acc: 0,
        movetype: 'weatherchange',
        weather: 'rain',
        pp: 10,
    },
    {
        name: 'Lunar Dance',
        type: 0,
        acc: 0,
        movetype: 'statusheal',
        statustype: '',
        effect: false,
        pp: 10,
    },
    {
        name: 'Curse',
        type: 13,
        acc: 0,
        movetype: 'stat',
        effecttype: ['spe', 'atk', 'def'],
        effect: [-1, 1, 1],
        who: ['u', 'u', 'u'],
        pp: 10,
    },
    {
        name: 'Rock Throw',
        type: 12,
        acc: 90,
        movetype: 'damage',
        dmg: 50,
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Bite',
        type: 15,
        acc: 100,
        movetype: 'damage',
        dmg: 60,
        effect2: 'flinch',
        acc2: 20,
        dmgtype: 'phy',
        pp: 10,
    },
    {
        name: 'Spikes',
        type: 8,
        acc: 0,
        movetype: 'sethazard',
        effect: 'spk',
        pp: 20,
    },
    {
        name: 'Toxic Spikes',
        type: 7,
        acc: 0,
        movetype: 'sethazard',
        effect: 'tspk',
        pp: 20,
    },
    {
        name: 'Stealth Rock',
        type: 12,
        acc: 0,
        movetype: 'sethazard',
        effect: 'strk',
        pp: 20,
    },
    {
        name: 'Sticky Web',
        type: 11,
        acc: 0,
        movetype: 'sethazard',
        effect: 'stwb',
        pp: 20,
    },
    {
        name: 'Solar Beam',
        type: 3,
        movetype: 'charge',
        turn2: {
            name: 'Solar Beam',
            type: 3,
            dmg: 120,
            acc: 100,
            movetype: 'damage',
            dmgtype: 'spe',
            pp: 20,
        }
    },
    {
        name: 'Dig',
        type: 8,
        dmg: 80,
        acc: 100,
        movetype: 'damage',
        effect: 'invulthendmg',
        pp: 20,
    },
    {
        name: 'Confuse Ray',
        type: 13,
        acc: 100,
        movetype: 'confuse',
        pp: 20,
    },
    {
        name: 'Trick Room',
        type: 10,
        acc: 0,
        movetype: 'trickroom',
        pp: 5,
        priority: -7,
    },
    {
        name: 'Double Edge',
        type: 0,
        dmg: 120,
        acc: 0,
        movetype: 'damage',
        effect2: 'recoil',
        acc2: 0,
        pp: 20,
    },
]

let pokemon = [
    {
        name: "Dwebble",
        avatar: `<img style="height: auto; width: 20vh" src="pictures/pokemon/dwebble.png" alt="">`,
        maxhp: 10000,
        hp: 10000,
        atk: 10,
        def: 10,
        spa: 10,
        spd: 10,
        spe: 10,
        status: '',
        move: [29, 14, 0, 3],
        pp: [],
        type1: 11,
        type2: 12,
        ability: JSON.parse(JSON.stringify(abilities[1])),
        item: JSON.parse(JSON.stringify(items.focussash)),
    },
    {
        name: "Charmander",
        avatar: `<img style="height: auto; width: 20vh" src="pictures/pokemon/charmander.png" alt="">`,
        maxhp: 1,
        hp: 1,
        atk: 11,
        def: 8,
        spa: 13,
        spd: 10,
        spe: 1,
        status: '',
        move: [0, 0, 0, 0],
        pp: [],
        type1: 1,
        type2: 18,
        ability: JSON.parse(JSON.stringify(abilities[1])),
        item: JSON.parse(JSON.stringify(items.focussash)),
    },
    {
        name: "kek",
        avatar: `<img style="height: auto; width: 20vh" src="pictures/pokemon/charmander.png" alt="">`,
        maxhp: 1,
        hp: 1,
        atk: 11,
        def: 8,
        spa: 13,
        spd: 10,
        spe: 1,
        status: '',
        move: [0, 0, 0, 0],
        pp: [],
        type1: 1,
        type2: 18,
    },
]

let p1 = {
    name: 'Red',
    avatar: `<div>
    <img style="height: 20vh; width: auto" src="https://archives.bulbagarden.net/media/upload/thumb/d/d3/Lets_Go_Pikachu_Eevee_Red.png/250px-Lets_Go_Pikachu_Eevee_Red.png" alt="}">
    `,
    pokemon: [pokemon[0], pokemon[1], pokemon[0]].map(p => JSON.parse(JSON.stringify(p)))
}

let p2 = {
    name: 'Cynthia',
    avatar: `
    <img style="height: 20vh; width: auto" src="https://www.serebii.net/pokemonmasters/syncpairs/cynthia.png" alt="">`,
    pokemon: [pokemon[1], pokemon[2], pokemon[0]].map(p => JSON.parse(JSON.stringify(p)))
}

const movesounds = {
    tackle: new Audio('sounds/moves/tackle.mp3'),
    curse: new Audio('sounds/moves/curse.mp3'),
    smokescreen: new Audio('sounds/moves/smokescreen.mp3'),
    statup: new Audio('sounds/moves/statup.mp3'),
    statdown: new Audio('sounds/moves/statdown.mp3'),
    protect: new Audio('sounds/moves/protect.mp3'),
    gigaimpact: new Audio('sounds/moves/gigaimpact.mp3'),
    rockblast: new Audio('sounds/moves/rockblast.mp3'),
    raindance: new Audio('sounds/moves/raindance.mp3'),
    sandstorm: new Audio('sounds/moves/sandstorm.mp3'),
    bite: new Audio('sounds/moves/sandstorm.mp3'),
    fly: new Audio('sounds/moves/fly.mp3'),
    rockblast: new Audio('sounds/moves/tackle.mp3'),
    uturn: new Audio('sounds/moves/tackle.mp3'),
}




