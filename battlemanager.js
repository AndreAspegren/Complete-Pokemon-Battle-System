async function battlemanager(p1move) {
    turncounter = 0
    buttonsenabled = false
    p1move = moves[p1move]
    p2move = moves[p2.pokemon[0].move[randommove()]]
    if (p1move.type === 'priority' && p2move.type !== 'priority') p1isfaster = true
    else if (p1move.type !== 'priority' && p2move.type === 'priority') p1isfaster = false
    else if (p1move.type === 'priority' && p2move.type === 'priority') {
        if (p1move.prioritystage > p2move.prioritystage) p1isfaster = true
        else if (p1move.prioritystage < p2move.prioritystage) p1isfaster = false
        else p1isfaster = Math.random() < 0.5
    } 
    if (p1move.type !== 'priority' && p2move.type != 'priority') {
        if (p1faster()) p1isfaster = true
        else if (!p1faster()) p1isfaster = false
    }
   
    if (p1isfaster) {
        p1moved = true
        whoismoving('friend')
        battlemessage = p1.pokemon[0].name + ' brukte ' + p1move.name + '!'
        updateview()
        await delay(2000)
        move = p1move
        await eval(p1move.movetype + "()") 
        await delay(2000)
    } else {
        whoismoving('foe')
        battlemessage = p1.pokemon[0].name + ' brukte ' + p2move.name + '!'
        updateview()
        await delay(2000)
        move = p2move
        await eval(p2move.movetype + "(p2move)")
        await delay(2000)
    }
    if (!protectactive){
        if (p1moved && p2.pokemon[0].hp != 0) {
            whoismoving('foe')
            battlemessage = p2.pokemon[0].name + ' brukte ' + p2move.name + '!'
            updateview()
            await delay(2000)
            move = p2move
            await eval(p2move.movetype + "(p2move)")
            await delay(2000)
        } else if (!p1moved && p1.pokemon[0].hp != 0) {
            whoismoving('friend')
            battlemessage = p1.pokemon[0].name + ' brukte ' + p1move.name + '!'
            updateview()
            await delay(2000)
            move = p1move
            await eval(p1move.movetype + "(p1move)")
            await delay(2000)
        }
    }
    endofround()
}

async function endofround() {
    if (p1.pokemon[0].status == 'brn' || p2.pokemon[0].status == 'brn') await endofrounddamage('brn', 0.125)
    if (p1.pokemon[0].status == 'psn' || p2.pokemon[0].status == 'brn') await endofrounddamage('psn', 0.125)
    if (p1.pokemon[0].status == 'tox' || p2.pokemon[0].status == 'tox') await endofrounddamage('tox', 0.125)
    if (weather.weather == 'sandstorm') await endofrounddamage('sandstorm', 0.125)


    if (p1.pokemon[0].hp == 0) {
        changepokemon('dead')
    }
    if (p2.pokemon[0].hp == 0) {
        p2.pokemon[0].status = ''
        resetstats(false)
        item = p2.pokemon.splice(0, 1)[0]
        p2.pokemon.push(item)
    }
    if (p2.pokemon.every(pokemon => pokemon.hp == 0)) {
        battlemessage = 'Du vant!'
    }
    else if (p1.pokemon.every(pokemon => pokemon.hp == 0)) {
        battlemessage = 'Du tapte!'
    } else {
        battlemessage = ''
        buttonsenabled = true
    }
    p1moved = false
    if (!p1.pokemon[0].hp == 0) updateview()
}

async function endofrounddamage(what, value) {
    let timer = 0
    let p1status = p1.pokemon[0].status == what
    let p2status = p2.pokemon[0].status == what

    if (p1faster() && p1status && p1.pokemon[0].hp > 0 || p1faster() && what == 'sandstorm' && ![8, 12, 16].includes(p1.pokemon[0].type1) &&
        ![8, 12, 16].includes(p1.pokemon[0].type2) && p1.pokemon[0].hp > 0) {
            p1.pokemon[0].hp -= p1.pokemon[0].maxhp * (what == 'tox' ? value * player.toxcounter : value)
        if (p1.pokemon[0].hp < 0) p1.pokemon[0].hp = 0
        if (what == 'tox') player.toxcounter++
        updateview()
        timer += 2000
    } else if (!p1faster() && p2status && p2.pokemon[0].hp > 0 || !p1faster() && what == 'sandstorm' && ![8, 12, 16].includes(p2.pokemon[0].type1) &&
        ![8, 12, 16].includes(p2.pokemon[0].type2) && p2.pokemon[0].hp > 0) {
            p2.pokemon[0].hp -= p2.pokemon[0].maxhp * (what == 'tox' ? value * rival.toxcounter : value)
        if (p2.pokemon[0].hp < 0) p2.pokemon[0].hp = 0
        if (what == 'tox') rival.toxcounter++
        updateview()
        timer += 2000
    }
    if (!p1faster() && p1status && p1.pokemon[0].hp > 0 || !p1faster() && what == 'sandstorm' && ![8, 12, 16].includes(p1.pokemon[0].type1) &&
        ![8, 12, 16].includes(p1.pokemon[0].type2 && p1.pokemon[0].hp > 0)) {
        await delay(timer)
        p1.pokemon[0].hp -= p1.pokemon[0].maxhp * (what == 'tox' ? value * player.toxcounter : value)
        if (p1.pokemon[0].hp < 0) p1.pokemon[0].hp = 0
        if (what == 'tox') player.toxcounter++
        updateview()
    } else if (p1faster() && p2status && p2.pokemon[0].hp > 0 || p1faster() && what == 'sandstorm' && ![8, 12, 16].includes(p2.pokemon[0].type1) &&
        ![8, 12, 16].includes(p2.pokemon[0].type1) && p2.pokemon[0].hp > 0) {
        await delay(timer)
        p2.pokemon[0].hp -= p2.pokemon[0].maxhp * (what == 'tox' ? value * rival.toxcounter : value)
        if (p2.pokemon[0].hp < 0) p2.pokemon[0].hp = 0
        if (what == 'tox') rival.toxcounter++
        updateview()
    }
    await delay(timer + timer)
}

function resetstats(isp1) {
    target = isp1 ? player : rival
    stats = ['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva']
    stats.forEach(stat => {
        target[stat] = 6
    })
    target.toxcounter = 1
}


async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomacc() {
    return Math.ceil(Math.random() * 100)
}

function randommove() {
    return Math.floor(Math.random() * 4)
}

function p1faster() {
    if (p1.pokemon[0].spe > p2.pokemon[0].spe) return true
    else if (p2.pokemon[0].spe > p1.pokemon[0].spe) return false
    return Math.random() < 0.5
}

