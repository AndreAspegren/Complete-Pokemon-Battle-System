function resetstats(stat, mon) {
    const stats = ['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva']
    stats.forEach(s => stat[s] = 6)
    Object.assign(stat, { toxcounter: 1, cnf: false, inlove: false, trapped: false, })
    if (mon) {
        if (mon.item) if (mon.item.cd) mon.item.cd = false
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
    if (move[turn].effect2 && move[turn].acc2 >= randomacc() || move[turn].acc2 == 0) return movehistory[0][movehistory[0].length - 1]['acc2hit'] = true
    return movehistory[0][movehistory[0].length - 1]['acc2hit'] = false
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
    if (what == 'round' && "priority" in p1move || "priority" in p2move) {
        p1priority = null
        p2priority = null
        "priority" in p1move ? p1priority = p1move.priority : p1priority = 0 
        "priority" in p2move ? p2priority = p2move.priority : p2priority = 0 
        if (p1priority != p2priority) return p1priority > p2priority
    }
    let p1speed = p1.pokemon[0].spe * statstates[player.spe] * (p1.pokemon[0].status === 'par' ? 0.25 : 1)
    let p2speed = p2.pokemon[0].spe * statstates[rival.spe] * (p2.pokemon[0].status === 'par' ? 0.25 : 1)
    if (!global.trickroom && p1speed != p2speed) return p1speed > p2speed
    if (global.trickroom && p1speed != p2speed) return p1speed < p2speed
    return Math.random() > 0.5
}



function checkscreens() {
    if (stats[1].auveil) return 0.5
    if (stats[1].reflect && move[0].dmgtype == 'phy') return 0.5
    if (stats[1].lscreen && move[0].dmgtype == 'spe') return 0.5
    return 1
}

function critratio() {
    let stage = (move[0].crit ? move[0].crit : 0) + (item[0].crit ? item[0].crit : 0) + (ability[0].crit ? ability[0].crit : 0)
    let stages = [24, 8, 2, 1]
    if (stage > 3) stage = 3
    return stages[stage]
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

async function updatescreens() {
    const name = {'auveil': 'Aurora Veil', 'reflect': 'Reflect', 'lscreen': 'Light Screen'}
    for (const s of ['auveil', 'reflect', 'lscreen']) {
        if (player[s] > 1) player[s]--
        if (rival[s] > 1) rival[s]--

        if (player[s] == 1) {
            player[s]--
            battlemessage = `${p1.name} sin ${name[s]} forsvant!`
            updateview()
            await delay(2000)
        }

        if (rival[s] == 1) {
            rival[s]--
            battlemessage = `${p2.name} sin ${name[s]} forsvant!`
            updateview()
            await delay(2000)
        }
    }
}

function checkprotect() {
    if (turn == 1) {
        return movehistory[0][movehistory[0].length - 1]['hit'] = false
    }
    if (movehistory[0].length <= 1 || movehistory[0][movehistory[0].length - 2].movetype == 'protect' && movehistory[0][movehistory[0].length - 2].hit == false) {
        return movehistory[0][movehistory[0].length - 1]['hit'] = true
    }
    let count = 0
    for (let i = movehistory[0].length - 2; i >= 0; i--) {
        if (movehistory[0][i].movetype == 'protect' && movehistory[0][i].hit) count++
        else break
    }
    return movehistory[0][movehistory[0].length - 1]['hit'] = 100 * Math.pow(2 / 3, count) > randomacc()
}

function indexcheck() {
    return p2.pokemon.findIndex(pokemon => pokemon.hp !== 0)
}

async function setturn(i, what) {
    let n = i % 2 == 0 ? 0 : 1
    turn = i
    if (what != 'newpokemon' && n == 0) p1faster = checkspeed(what ? 'round' : null)
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
    ability = [mon[0].ability, mon[1].ability]
    item = [mon[0].ability, mon[1].ability]
    pstatus = [mon[0].status, mon[1].status]
    if (what == 'turn') checkacc()
    ithit = p1turn ? p1movehit : p2movehit
    queue = p1turn ? [playerqueue, rivalqueue] : [rivalqueue, playerqueue]
    team = p1turn ? [p1.pokemon.map(p => p), p2.pokemon.map(p => p)] : [p2.pokemon.map(p => p), p1.pokemon.map(p => p)]
}
