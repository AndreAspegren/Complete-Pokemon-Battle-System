function resetstats(who, dead) {
    const stats = ['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva']
    stats.forEach(stat => who[stat] = 6)
    Object.assign(who, { toxcounter: 1, cnf: false })
    if (dead) dead.status = ''
    who == player ? p1movehistory = [] : p2movehistory = []
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function randomacc() {
    return Math.ceil(Math.random() * 100)
}

function checkacc(who, i) {
    invulmon = mon[i] == p1.pokemon[0] ? p2invul : p1invul;
    let random = randomacc();
    let accwithoutpar = currentmove[i].acc * statstates[stats[i].acc] * weatheracc() >= random
    let hit = (currentmove[i].acc * statstates[stats[i].acc] * (mon[i].status == 'par' ? 0.75 : 1) * weatheracc() >= random || currentmove[i].acc == 0) && !invulmon
    paralysed = mon[i].status == 'par' && !hit && accwithoutpar
    who == p1.pokemon[0] ? p1movehit = hit : p2movehit = hit
    if (movehistory[i] > 0) movehistory[i][movehistory[i].length - 1]['hit'] = hit
}


function weatheracc() {
    if (weather.weather == 'sun') {
        if (move.name == 'Thunder') return 0.5
        if (move.name == 'Hurricane') return 0.5
    }
    if (weather.weather == 'rain') {
        if (move.name == 'Thunder') return 1000
        if (move.name == 'Hurricane') return 1000
    }
    if (weather.weather == 'hail') {
        if (move.name == 'Blizzard') return 1000
    }
    return 1
}

function checkacc2() {
    if (move.effect2 && move.acc2 >= randomacc() || move.acc2 == 0) return true
    return false
}

async function playsound(what) {
    if (what) {
        movesounds[what].play()
        await delay(movesounds[what].duration * 1000)
        return
    }
    const sound = movesounds[move.name.toLowerCase().replace(/ /g, '')]
    sound.play()
    await delay(sound.duration / 2 * 1000)
}

function checkspeed(what) {
    if (what == 'round' && p1move.priority != p2move.priority) {
        if (p1move.priority > 0 && !p2move.priority) return true
        if (p1move.priority < 0 && !p2move.priority) return false
        if (p2move.priority > 0 && !p1move.priority) return false
        if (p2move.priority < 0 && !p1move.priority) return true
        return p1move.priority > p2move.priority
    }
    let p1speed = p1.pokemon[0].spe * statstates[player.spe] * (p1.pokemon[0].status === 'par' ? 0.25 : 1)
    let p2speed = p2.pokemon[0].spe * statstates[rival.spe] * (p2.pokemon[0].status === 'par' ? 0.25 : 1)
    if (!global.trickroom && p1speed != p2speed) return p1speed > p2speed
    if (global.trickroom && p1speed != p2speed) return p1speed < p2speed
    return Math.random() > 0.5
}


function dmgcalc() {
    if (types[move.type][otype1] * types[move.type][otype2] == 0) return 0
    return Math.round(((((((2 * 10 / 5) + 2)) * (move.dmg * (move.dmgtype == 'phy' ? uatk / odef : uspa / ospd))) / 12 + 2) *
        weatherdmg() *
        ((Math.floor(Math.random() * 16) == 0) ? 2 : 1) *
        (move.type == utype1 || utype2 ? 1.5 : 1) *
        (types[move.type][otype1] * types[move.type][otype2]) *
        (ustatus == 'brn' ? 0.5 : 1) *
        ((Math.floor(Math.random() * 16) + 85) / 100)))
}

function weatherdmg() {
    if (weather.weather == 'sun') {
        if (move.type == 1) return 1.5
        if (move.type == 2) return 0.5
    }
    if (weather.weather == 'rain') {
        if (move.type == 1) return 0.5
        if (move.type == 2) return 1.5
        if (['Solar Beam', 'Solar Blade'].includes(move.name) && move.dmg) return 0.5
    }
    if (weather.weather == 'sandstorm') {
        if (['Solar Beam', 'Solar Blade'].includes(move.name) && move.dmg) return 0.5
    }
    if (weather.weather == 'hail') {
        if (['Solar Beam', 'Solar Blade'].includes(move.name) && move.dmg) return 0.5
    }
    return 1
}

function checkprotect() {
    if (turn == 1) return false
    if (movehistory[0].length <= 1) return true
    if (movehistory[0][movehistory[turn].length - 2].movetype == 'protect' && movehistory[0][movehistory[turn].length - 2].hit == false) return true
    let count = 0
    for (let i = movehistory[0].length - 1; i >= 0; i--) {
        if (movehistory[0][i].movetype && movehistory[0][i].movetype == 'protect' && movehistory[0][i].hit) count++
        else break
    }
    return movehistory[0][movehistory[0].length - 1]['hit'] = 100 * Math.pow(2 / 3, count) > randomacc()
}

function indexcheck() {
    return p2.pokemon.findIndex(pokemon => pokemon.hp !== 0)
}

function setspeed(round) {
    p1faster = checkspeed(round ? 'round' : null)

    who = [p1faster ? 'friend' : 'foe', p1faster ? 'foe' : 'friend']
    mon = [p1faster ? p1.pokemon[0] : p2.pokemon[0], p1faster ? p2.pokemon[0] : p1.pokemon[0]]
    stats = [p1faster ? player : rival, p1faster ? rival : player]
    trainer = [p1faster ? p1 : p2, p1faster ? p2 : p1]
    currentmove = [JSON.parse(JSON.stringify(p1faster ? p1move : p2move)), JSON.parse(JSON.stringify(p1faster ? p2move : p1move))]
    movehistory = [p1faster ? p1movehistory : p2movehistory, p1faster ? p2movehistory : p1movehistory]
    monstatus = [p1faster ? p1.pokemon[0].status : p2.pokemon[0].status, p1faster ? p2.pokemon[0].status : p1.pokemon[0].status]
    invul = [p1faster ? p1invul : p2invul, p1faster ? p2invul : p1invul]
}
