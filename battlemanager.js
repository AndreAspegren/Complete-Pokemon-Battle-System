async function battlemanager(test) {
    buttonsenabled = false
    p1move = moves[test]
    p2move = moves[p2.pokemon[0].move[randommove()]]
    p1movehistory.push(p1move)
    p2movehistory.push(p2move)
    p1faster = determinemoveorder()

    whoismoving(p1faster ? 'friend' : 'foe')
    battlemessage = uname + ' brukte ' + (p1faster ? p1move.name : p2move.name) + '!'
    updateview()
    await delay(2000)
    await eval(p1faster ? p1move.movetype + '()' : p2move.movetype + "()")
    await delay(2000)
   
    
    endofround()
    return 

    whoismoving(!p1faster ? 'friend' : 'foe')
    battlemessage = uname + ' brukte ' + (!p1faster ? p1move.name : p2move.name) + '!'
    updateview()
    await delay(2000)
    await eval(!p1faster ? p1move.movetype + '()'  : p2move.movetype + "()")
    await delay(2000)
    endofround()
}

async function endofround() {
    if (p1.pokemon[0].status == 'brn' || p2.pokemon[0].status == 'brn') await endofrounddamage('brn', 0.125)
    if (p1.pokemon[0].status == 'psn' || p2.pokemon[0].status == 'brn') await endofrounddamage('psn', 0.125)
    if (p1.pokemon[0].status == 'tox' || p2.pokemon[0].status == 'tox') await endofrounddamage('tox', 0.125)
    if (weather.weather == 'sandstorm') await endofrounddamage('sandstorm', 0.125)
    faster = p1faster ? p1 : p2
    slower = !p1faster ? p1 : p2

    if (faster.pokemon[0].hp == 0) deathmanager(faster == p1 ? true : false)
    if (slower.pokemon[0].hp == 0) deathmanager(faster != p1 ? true : false)

    battlemessage = p2.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du vant!' : p1.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du tapte!' : '';
    buttonsenabled = true
    updateview()
}

async function endofrounddamage(what, value) {
    let faster = p1faster ? p1.pokemon[0] : p2.pokemon[0]
    let slower = !p1faster ? p1.pokemon[0] : p2.pokemon[0]
    let fasterstat = p1faster ? player : rival
    let slowerstat = !p1faster ? player : rival

    if (faster.status == what && faster.hp > 0 || what == 'sandstorm' && ![8, 12, 16].includes(faster.type1) &&
        ![8, 12, 16].includes(faster.type2) && faster.hp > 0) {
        faster.hp -= faster.maxhp * (what == 'tox' ? value * fasterstat.toxcounter : value)
        if (faster.hp < 0) faster.hp = 0
        if (what == 'tox') fasterstat.toxcounter++
        updateview()
    }
    await delay(2000)
    if (slower.status == what && slower.hp > 0 || what == 'sandstorm' && ![8, 12, 16].includes(slower.type1) &&
        ![8, 12, 16].includes(slower.type2) && slower.hp > 0) {
        slower.hp -= slower.maxhp * (what == 'tox' ? value * slowerstat.toxcounter : value)
        if (slower.hp < 0) slower.hp = 0
        if (what == 'tox') slowerstat.toxcounter++
        updateview()
    }
    await delay(2000)
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function randomacc() {
    return Math.ceil(Math.random() * 100)
}

function randommove() {
    return Math.floor(Math.random() * 4)
}


function checkacc() {
    if (p1move.acc * statstates[player.acc] >= randomacc() * (p1.pokemon[0].status == 'par' ? 0.75 : 1) || p1move.acc == 0) p1movehit = true
    else p1movehit = true
    if (p1move.acc * statstates[player.acc] >= randomacc() * (p1.pokemon[0].status == 'par' ? 0.75 : 1) || p1move.acc == 0) p2movehit = true
    else p2movehit = false
}
function checkacc2() {
    if (move.effect2 && move.acc2 >= randomacc()) return true
    else return false
}

function determinemoveorder() {
    if (p1move.priority && !p2move.priority) return true
    else if (!p1move.priority && p2move.priority) return false
    else if (p1move.priority && p2move.priority) {
        if (p1move.priority > p2move.priority) return true
        else if (p1move.priority < p2move.priority) return false
        else return Math.random() < 0.5
    }
    else if (!p1move.priority && !p2move.priority) {
        if (p1.pokemon[0].spe > p2.pokemon[0].spe) return true
        else if (p2.pokemon[0].spe > p1.pokemon[0].spe) return false
        return Math.random() < 0.5
    }
}

function deathmanager(who) {
    target = who ? player : rival
    stats = ['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva']
    stats.forEach(stat => {
        target[stat] = 6
    })
    target.toxcounter = 1
    if (who) changepokemon('dead')
    else {
        item = p2.pokemon.splice(0, 1)[0]
        p2.pokemon.push(item)
    }
}



