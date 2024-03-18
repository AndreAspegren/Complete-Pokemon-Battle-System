buttonsenabled = true
let battlemessage = ''
let turncounter = 0
let random
let p1moved = false
let player2moved = false
let protectactive
let p1protect
let p2protect 
let p1movehistory = []
let p2movehistory = []

const types = [
    /* Normal */[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1, 1],
    /* Fire */[1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1, 1],
    /* Water */[1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1, 1],
    /* Electric*/[1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1],
    /* Grass */[1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 1, 0.5, 1, 0.5, 1, 0.5, 1, 1],
    /* Ice */[1, 0.5, 0.5, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1, 0.5, 1, 0.5, 1, 1],
    /* Fighting*/[2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5, 1],
    /* Poison */[1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2, 1],
    /* Ground */[1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 1, 2, 1, 1, 1, 2, 1, 1],
    /* Flying */[1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 0.5, 1, 2, 1, 0.5, 1, 1],
    /* Psychic*/[1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1, 1],
    /* Bug */[1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5, 1],
    /* Rock */[1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
    /* Ghost */[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1, 1],
    /* Dragon */[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0, 1],
    /* Dark */[1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5, 1],
    /* Steel */[1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2, 1],
    /* Fairy */[1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1, 1],
    /* No Type*/[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]


let statstates = [
    2 / 8, 2 / 7, 2 / 6, 2 / 5, 2 / 4, 2 / 3, 2 / 2, 3 / 2, 4 / 2, 5 / 2, 6 / 2, 7 / 2, 8 / 2
]

let statstates2 = [
    3 / 9, 3 / 8, 3 / 7, 3 / 6, 3 / 5, 3 / 4, 3 / 3, 4 / 3, 5 / 3, 6 / 3, 7 / 3, 8 / 3, 9 / 3
]

let player = {
    atk: 6,
    def: 6,
    spa: 6,
    spd: 6,
    spe: 6,
    acc: 6,
    eva: 6,
    toxcounter: 1,
}

let rival = {
    atk: 6,
    def: 6,
    spa: 6,
    spd: 6,
    spe: 6,
    acc: 6,
    eva: 6,
    toxcounter: 1,
}

let weather = {
    weather: '',
    image: '',
    images: {
        sun: '<img src="pictures/status/sun.png" style="width: 5vh; height: auto;" alt="">',
        rain: '<img src="pictures/status/rain.png" style="width: 5vh; height: auto;" alt="">',
        sandstorm: '<img src="pictures/status/sandstorm.png" style="width: 5vh; height: auto;" alt="">',
        snow: '<img src="pictures/status/snow.png" style="width: 5vh; height: auto;" alt="">',
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
    'hsl(48, 92%, 57%)',
    'hsl(97, 52%, 53%)',
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
    'hsl(330, 49%, 68%)']

const pokemon = [
    {
        name: "Dwebble",
        avatar: `<img style="height: auto; width: 20vh" src="pictures/pokemon/dwebble.png" alt="">`,
        maxhp: 1000000,
        hp: 1000000,
        atk: 10,
        def: 10,
        spa: 10,
        spd: 10,
        spe: 10,
        status: '',
        move: [3, 1, 2, 14],
        type1: 11,
        type2: 12,
    },
    {
        name: "Charmander",
        avatar: `<img style="height: auto; width: 20vh" src="pictures/pokemon/charmander.png" alt="">`,
        maxhp: 12,
        hp: 12,
        atk: 11,
        def: 8,
        spa: 13,
        spd: 1,
        spe: 1,
        status: '',
        move: [3, 3, 3, 3],
        type1: 1,
        type2: 18,
    },
]

const moves = [
    {
        name: 'Protect',
        type: 0,
        acc: 0,
        movetype: 'protect',
        priority: 4
    },
    {
        name: 'Rock Blast',
        type: 12,
        acc: 90,
        movetype: 'multihit',
        dmg: 25,
    },
    {
        name: 'Giga Impact',
        type: 0,
        acc: 90,
        movetype: 'movethencd',
        dmg: 150,
    },
    {
        name: 'Tackle',
        type: 0,
        acc: 100,
        movetype: 'damage',
        dmg: 40,
    },
    {
        name: 'Toxic',
        type: 7,
        acc: 0,
        movetype: 'status',
        statustype: 'tox',
        effect: true,
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
    },
    {
        name: 'Recover',
        type: 0,
        acc: 0,
        movetype: 'heal',
        heal: 'uhp + umaxhp * 0.5'
    },
    {
        name: 'Growl',
        type: 0,
        acc: 0,
        movetype: 'stat',
        effecttype: ['atk'],
        effect: [-1],
        who: ['o'],
    },
    {
        name: 'Quick Attack',
        type: 0,
        acc: 100,
        movetype: 'damage',
        dmg: 40,
        accuracy: 100
    },
    {
        name: 'Swords Dance',
        type: 0,
        acc: 0,
        movetype: 'stat',
        effecttype: 'aup2',
        ueffect: 2
    },
    {
        name: 'Explosion',
        type: 0,
        acc: 100,
        movetype: 'suicide',
        dmg: 250,
        accuracy: 100
    },
    {
        name: 'Smokescreen',
        type: 13,
        acc: 0,
        movetype: 'stat',
        effecttype: ['acc'],
        effect: [-1],
        who: ['o'],
    },
    {
        name: 'Will o Wisp',
        type: 1,
        acc: 85,
        movetype: 'status',
        statustype: 'brn',
        effect: true,
    },
    {
        name: 'Sandstorm',
        type: 3,
        acc: 0,
        movetype: 'weatherchange',
        weather: 'sandstorm'
    },
    {
        name: 'Rain Dance',
        type: 2,
        acc: 0,
        movetype: 'weatherchange',
        weather: 'rain'
    },
    {
        name: 'Lunar Dance',
        type: 0,
        acc: 0,
        movetype: 'statusheal',
        statustype: '',
        effect: false,
    },
    {
        name: 'Curse',
        type: 13,
        acc: 0,
        movetype: 'stat',
        effecttype: ['spe', 'atk', 'def'],
        effect: [-1, 1, 1],
        who: ['u', 'u', 'u'],
    },
]

p1 = {
    name: 'Red',
    avatar: `<div>
    <img style="height: 20vh; width: auto" src="https://archives.bulbagarden.net/media/upload/thumb/d/d3/Lets_Go_Pikachu_Eevee_Red.png/250px-Lets_Go_Pikachu_Eevee_Red.png" alt="}">
    `,
    pokemon: [pokemon[0], pokemon[1], pokemon[1], pokemon[0], pokemon[1], pokemon[0]].map(p => JSON.parse(JSON.stringify(p)))
}

p2 = {
    name: 'Cynthia',
    avatar: `
    <img style="height: 20vh; width: auto" src="https://www.serebii.net/pokemonmasters/syncpairs/cynthia.png" alt="">`,
    pokemon: [pokemon[1], pokemon[0]].map(p => JSON.parse(JSON.stringify(p)))
}

const movesounds = {
    tackle: new Audio('sounds/moves/tackle.mp3'),
    curse: new Audio('sounds/moves/curse.mp3'),
    smokescreen: new Audio('sounds/moves/smokescreen.mp3'),
    statup: new Audio('sounds/moves/statup.mp3'),
    statdown: new Audio('sounds/moves/statdown.mp3'),
    statup: new Audio('sounds/moves/statup.mp3'),
    tackle: new Audio('sounds/moves/tackle.mp3'),
    protect: new Audio('sounds/moves/protect.mp3'),
    gigaimpact: new Audio('sounds/moves/gigaimpact.mp3'),
    rockblast: new Audio('sounds/moves/rockblast.mp3'),
    raindance: new Audio('sounds/moves/raindance.mp3'),
}




