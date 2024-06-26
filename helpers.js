function resetstats(stat, mon) {
    const stats = ['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva']
    stats.forEach(stat => who[stat] = 6)
    Object.assign(stat, { toxcounter: 1, cnf: false })
    if (mon) {
        if (mon.item.cd) mon.item.cd = false
        if (mon.ability.cd) mon.ability.cd = false
        mon.status = ''
    } 
    stat == player ? p1movehistory = [] : p2movehistory = []
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function randomacc() {
    return Math.ceil(Math.random() * 100)
}

function checkacc() {
    let invulmon = mon[0] == p1.pokemon[0] ? p2invul : p1invul
    let random = randomacc()
    let accwithoutpar = move[0].acc * statstates[stats[0].acc] * weatheracc() >= random
    let hit = (move[0].acc * statstates[stats[0].acc] * (mon[0].status == 'par' ? 0.75 : 1) * weatheracc() >= random || move[0].acc == 0) && !invulmon
    paralysed = mon[0].status == 'par' && !hit && accwithoutpar
    mon[0] == p1.pokemon[0] ? p1movehit = hit : p2movehit = hit
    if (movehistory[0] > 0) movehistory[0][movehistory[0].length - 1]['hit'] = hit
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
    if (move[turn].effect2 && move[turn].acc2 >= randomacc() || move[turn].acc2 == 0) return true
    return false
}

async function playsound(what) {
    if (what) {
        movesounds[what].play()
        await delay(movesounds[what].duration * 1000)
        return
    }
    const sound = movesounds[move[0].name.toLowerCase().replace(/ /g, '')]
    // sound.play()
    // await delay(sound.duration / 2 * 1000)
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
    if (types[move[0].type][type1[0]] * types[move[0].type][type2[0]] == 0) return 0 // Immunity
    return Math.round(((((((2 * 10 / 5) + 2)) * (move[0].dmg * (move[0].dmgtype == 'phy' ? mon[0].atk / mon[1].def : mon[0].spa / mon[1].spd))) / 12 + 2) *
        weatherdmg() * // Weather
        ((Math.floor(Math.random() * 16) == 0) ? 2 : 1) * // Crit
        (move[0].type == type1[0] || type2[0] ? 1.5 : 1) * // Stab
        (types[move[0].type][type1[0]] * types[move[0].type][type2[0]]) * // Type effectiveness
        (pstatus[0] == 'brn' ? 0.5 : 1) * // Burn
        ((Math.floor(Math.random() * 16) + 85) / 100))) // Random
}

function weatherdmg() {
    if (weather.weather == 'sun') {
        if (move.type == 1) return 1.5
        if (move.type == 2) return 0.5
    }
    if (weather.weather == 'rain') {
        if (move.type == 1) return 0.5
        if (move.type == 2) return 1.5
        if (['Solar Beam', 'Solar Blade'].includes(move[0].name) && move[0].dmg) return 0.5
    }
    if (weather.weather == 'sandstorm') {
        if (['Solar Beam', 'Solar Blade'].includes(move[0].name) && move[0].dmg) return 0.5
    }
    if (weather.weather == 'hail') {
        if (['Solar Beam', 'Solar Blade'].includes(move[0].name) && move[0].dmg) return 0.5
    }
    return 1
}

function randommove() {
    return Math.floor(Math.random() * 4)
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

function setturn(i, what) {
    let n = i % 2 == 0 ? 0 : 1
    turn = i
    if (what != 'newpokemon') p1faster = checkspeed(what ? 'round' : null)
    p1turn = p1faster && n == 0 || !p1faster && n == 1
    who = p1turn ? ['p1', 'p2'] : ['p2', 'p1']
    mon = p1turn ? [p1.pokemon[0], p2.pokemon[0]] : [p2.pokemon[0], p1.pokemon[0]]
    move = [p1turn ? p1move : p2move, p1turn ? p2move : p1move]
    stats = p1turn ? [player, rival] : [rival, player]
    trainer = p1turn ? [p1, p2] : [p2, p1]
    movehistory = p1turn ? [p1movehistory, p2movehistory] : [p2movehistory, p1movehistory]
    invul = p1turn ? [p1invul, p2invul] : [p2invul, p1invul]
    monname = [mon[0].name, mon[1].name]
    maxhp = [mon[0].maxhp, mon[1].maxhp]
    hp = [mon[0].hp, mon[1].hp]
    atk = [mon[0].atk, mon[1].atk]
    def = [mon[0].def, mon[1].def]
    spa = [mon[0].spa, mon[1].spa]
    spd = [mon[0].spd, mon[1].spd]
    spe = [mon[0].spe, mon[1].spe]
    acc = [stats[0].acc, stats[1].acc]
    eva = [stats[0].eva, stats[1].eva]
    type1 = [mon[0].type1, mon[1].type1]
    type2 = [mon[0].type2, mon[1].type2]
    pstatus = [mon[0].status, mon[1].status]
    if (what == 'turn') checkacc(mon[0])
    ithit = p1turn ? p1movehit : p2movehit
}
