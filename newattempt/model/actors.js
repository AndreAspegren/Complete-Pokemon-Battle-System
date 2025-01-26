let actors = {
    "p1": {
        name: 'Red',
        avatar: `
        <img style="height: 20vh; width: auto" src="https://archives.bulbagarden.net/media/upload/thumb/d/d3/Lets_Go_Pikachu_Eevee_Red.png/250px-Lets_Go_Pikachu_Eevee_Red.png" alt="}">
        `,
        pokemon: [pokemon[0], pokemon[1], pokemon[1], pokemon[0]].map(p => JSON.parse(JSON.stringify(p))),
        stats: {
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
            protected: false,
            currentmove: null,
            movehistory: [],
            movehit: null,
            fainted: false,
            invul: false,
            statused: false,
            confused: false,
            paralysed: false,
            acc2hit: false,
            queue: [],
            forcedmove: false
        }
    },
    "p2": {
        name: 'Cynthia',
        avatar: `
        <img style="height: 20vh; width: auto" src="https://www.serebii.net/pokemonmasters/syncpairs/cynthia.png" alt="">`,
        pokemon: [pokemon[2], pokemon[2], pokemon[0]].map(p => JSON.parse(JSON.stringify(p))),
        stats: {
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
            protected: false,
            currentmove: null,
            movehistory: [],
            movehit: null,
            fainted: false,
            invul: false,
            statused: false,
            confused: false,
            paralysed: false,
            acc2hit: false,
            queue: []
        }
    }
}
