buttonsenabled = false
let battlemessage = ''

const types = [
    /* Normal */ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 1, 0.5, 1],
    /* Fire */   [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 1, 2, 1],
    /* Water */  [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1],
    /* Electric*/[1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1],
    /* Grass */  [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 1, 0.5, 1, 0.5, 1, 0.5, 1],
    /* Ice */    [1, 0.5, 0.5, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1, 0.5, 1, 0.5, 1],
    /* Fighting*/[2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 2, 0.5],
    /* Poison */ [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 0, 2],
    /* Ground */ [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 1, 2, 1, 1, 1, 2, 1],
    /* Flying */ [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 0.5, 1, 2, 1, 0.5, 1],
    /* Psychic*/ [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0, 0.5, 1],
    /* Bug */    [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 2, 0.5, 0.5],
    /* Rock */   [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 2, 1, 0.5, 1],
    /* Ghost */  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 1],
    /* Dragon */ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0.5, 0],
    /* Dark */   [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 0.5, 1, 0.5],  
    /* Steel */  [1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0.5, 2],  
    /* Fairy */  [1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 1],  
    /* No Type*/ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  
 ]
 

function calculatedamagemultiplier(user, opponent) {
    dmgmultiplier = types[Object.keys(types)[user.pokemon[0].type]][opponent.pokemon[3].type1] * types[Object.keys(types)[user.pokemon[0].type]][opponent.pokemon[3].type2]
    if (types[Object.keys(types)[moves[0].type]][pokemon[3].type1] == 0 || types[Object.keys(types)[moves[0].type]][pokemon[3].type2] == 0) dmgmultiplier = 0    
}



let statstates = [
    2 / 8, 2 / 7, 2 / 6, 2 / 5, 2 / 4, 2 / 3, 2 / 2, 3 / 2, 4 / 2, 5 / 2, 6 / 2, 7 / 2, 8 / 2
]

let statstates2 = [
    3 / 9, 3 / 8, 3 / 7, 3 / 6, 3 / 5, 3 / 4, 3 / 3, 4 / 3, 5 / 3, 6 / 3, 7 / 3, 8 / 3, 9 / 3
]

let player = {
    atk: 6,
    def: 6,
    satk: 6,
    sdef: 6,
    spe: 6,
    acc: 6,
    eva: 6,
    status: false,
    brn: false,
    par: false,
    psn: false,
    tox: false,
    slp: false,
    frz: false,
    statusimage: ''
}

let rival = {
    atk: 6,
    def: 6,
    satk: 6,
    sdef: 6,
    spe: 6,
    acc: 6,
    eva: 6,
    status: false,
    brn: false,
    par: false,
    psn: false,
    tox: false,
    slp: false,
    frz: false,
    statusimage: ''
}

let statusimages = {
    brn: '<img src="pictures/status/brnimage.png" style="width: 5vh; height: auto;" alt="">',
    par: '<img src="pictures/status/parimage.png" style="width: 6vh; height: auto;" alt="">',
    psn: '<img src="pictures/status/psnimage.png" style="width: 6vh; height: auto;" alt="">',
    slp: '<img src="pictures/status/slpimage.png" style="width: 6vh; height: auto;" alt="">',
    frz: '<img src="pictures/status/frzimage.png" style="width: 6vh; height: auto;" alt="">',
}

let weatherimages = {
    sun: '<img src="pictures/status/sun.png" style="width: 5vh; height: auto;" alt="">',
    rain: '<img src="pictures/status/rain.png" style="width: 5vh; height: auto;" alt="">',
    sandstorm: '<img src="pictures/status/sandstorm.png" style="width: 5vh; height: auto;" alt="">',
    snow: '<img src="pictures/status/snow.png" style="width: 5vh; height: auto;" alt="">',
}

let weather = weatherimages.rain

const pokemon = [
    {
        name: "Dwebble",
        image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/557.png',
        avatar: `<img style="height: auto; width: 20vh" src="pictures/pokemon/dwebble.png" alt="">`,
        maxhp: 10,
        hp: 10,
        attack: 10,
        defense: 10,
        specialattack: 10,
        specialdefense: 10,
        speed: 10,
        statuscondition: null,
        move1: 4,
        move2: 2,
        move3: 16,
        move4: 17,
        type1: 11,
        type2: 12,
    },
    {
        name: "Charmander",
        image: 'https://p1.hiclipart.com/preview/935/447/707/pokemon-charmander-character-png-clipart.jpg',
        avatar: `<img style="height: auto; width: 20vh" src="https://p1.hiclipart.com/preview/935/447/707/pokemon-charmander-character-png-clipart.jpg" alt="">`,
        maxhp: 12,
        hp: 12,
        attack: 11,
        defense: 8,
        specialattack: 13,
        specialdefense: 9,
        speed: 13,
        statuscondition: null,
        move1: 8,
        move2: 2,
        move3: 9,
        move4: 10,
        type1: 1,
        type2: 19,
    },
    {
        name: "Squirtle",
        image: 'https://p1.hiclipart.com/preview/255/94/461/squirtle-with-a-default-happy-face-png-clipart.jpg',
        avatar: `<img style="height: auto; width: 20vh" src="https://p1.hiclipart.com/preview/255/94/461/squirtle-with-a-default-happy-face-png-clipart.jpg" alt="">`,
        maxhp: 14,
        hp: 14,
        attack: 10,
        defense: 13,
        specialattack: 10,
        specialdefense: 12,
        speed: 9,
        statuscondition: null,
        move1: 4,
        move2: 11,
        move3: 12,
        move4: 13,
        type1: 2,
        type2: 19,
    },
    {
        name: "Bulbasaur",
        image: 'https://p1.hiclipart.com/preview/500/67/774/dinosaur-bulbasaur-ivysaur-venusaur-drawing-poison-green-cartoon-png-clipart-thumbnail.jpg',
        avatar: `<img style="height: auto; width: 20vh" src="https://p1.hiclipart.com/preview/500/67/774/dinosaur-bulbasaur-ivysaur-venusaur-drawing-poison-green-cartoon-png-clipart-thumbnail.jpg" alt="">`,
        maxhp: 13,
        hp: 13,
        attack: 9,
        defense: 10,
        specialattack: 12,
        specialdefense: 12,
        speed: 10,
        statuscondition: null,
        move1: 4,
        move2: 2,
        move3: 1,
        move4: 14,
        type1: 4,
        type2: 7,
    },
    {
        name: "Pikachu",
        image: 'https://p7.hiclipart.com/preview/585/436/845/icon-pikachu-transparent-background.jpg',
        avatar: `<img style="height: auto; width: 20vh" src="https://p7.hiclipart.com/preview/585/436/845/icon-pikachu-transparent-background.jpg" alt="">`,
        maxhp: 11,
        hp: 11,
        attack: 10,
        defense: 8,
        specialattack: 11,
        specialdefense: 9,
        speed: 15,
        statuscondition: null,
        move1: 0,
        move2: 2,
        move3: 3,
        move4: 15,
        type1: 3,
        type2: 19,
    }
];

const moves = [
    {
        name: 'Thunder Shock',
        type: 3,
        movetype: 'damage',
        dmg: 40,
        accuracy: 100
    },
    {
        name: 'Vine Whip',
        type: 4,
        movetype: 'damage',
        dmg: 45,
        accuracy: 100
    },
    {
        name: 'Growl',
        type: 0,
        movetype: 'statchange',
        usereffect: 0,
        opposingeffect: 'adown1'
    },
    {
        name: 'Quick Attack',
        type: 0,
        movetype: 'prioritydamage',
        dmg: 40,
        accuracy: 100
    },
    {
        name: 'Tackle',
        type: 0,
        movetype: 'damage',
        dmg: 40,
        accuracy: 100
    },
    {
        name: 'Swords Dance',
        type: 0,
        movetype: 'statchange',
        usereffect: 'aup2',
        opposingeffect: 0
    },
    {
        name: 'Explosion',
        type: 0,
        movetype: 'suicide',
        dmg: 250,
        accuracy: 100
    },
    {
        name: 'Rock Blast',
        type: 12,
        movetype: 'multihit',
        dmg: 25,
        accuracy: 100
    },
    {
        name: 'Scratch',
        type: 0,
        movetype: 'damage',
        dmg: 40,
        accuracy: 100
    },
    {
        name: 'Ember',
        type: 1,
        movetype: 'damage',
        dmg: 40,
        accuracy: 100
    },
    {
        name: 'Smokescreen',
        type: 1,
        movetype: 'statchange',
        usereffect: 0,
        opposingeffect: 'accdown1'
    },
    {
        name: 'Tail Whip',
        type: 0,
        movetype: 'statchange',
        usereffect: 0,
        opposingeffect: 'ddown1'
    },
    {
        name: 'Water Gun',
        type: 2,
        movetype: 'damage',
        dmg: 40,
        accuracy: 100
    },
    {
        name: 'Withdraw',
        type: 2,
        movetype: 'statchange',
        usereffect: 'dup1',
    },
    {
        name: 'Recover',
        type: 0,
        movetype: 'status',
        usereffect: 'heal',
        heal: 0.5
    },
    {
        name: 'Spark',
        type: 3,
        movetype: 'plain damage',
        dmg: 60
    },
    {
        name: 'Will o Wisp',
        type: 1,
        movetype: 'status',
        dmg: 60
    },
    {
        name: 'Sandstorm',
        type: 3,
        movetype: 'weather',
        dmg: 60
    },
]

player1 = {
    name: 'Red',
    avatar: `<div>
    <img style="height: 20vh; width: auto" src="https://archives.bulbagarden.net/media/upload/thumb/d/d3/Lets_Go_Pikachu_Eevee_Red.png/250px-Lets_Go_Pikachu_Eevee_Red.png" alt="}">
    `,
    pokemon: [pokemon[0]]
}

player2 = {
    name: 'Cynthia',
    avatar: `
    <img style="height: 20vh; width: auto" src="https://www.serebii.net/pokemonmasters/syncpairs/cynthia.png" alt="">`,
    pokemon: [pokemon[1]]
}
