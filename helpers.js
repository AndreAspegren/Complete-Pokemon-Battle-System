function resetstats(who){
    stats = ['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva']
    stats.forEach(stat => who[stat] = 6)
    who.toxcounter = 1
    who.confused = false
    who == player ? p1movehistory = [] : p2movehistory = []
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

function checkacc(who, i) {
hit = currentmove[i].acc * statstates[stats[i].acc] >= randomacc() * (mon[i].status === 'par' ? 0.75 : 1) || currentmove[i].acc == 0
who == p1.pokemon[0] ? p1movehit = hit : p2movehit = hit
movehistory[i][movehistory[i].length - 1]['hit'] = hit
}

function checkacc2() {
    if (move.effect2 && move.acc2 >= randomacc() || move.acc2 == 0) return true
    return false
}

async function playsound(what) {
    if (what){
        movesounds[what].play()
        await delay(movesounds[what].duration * 1000)
        return
    }
    sound = movesounds[move.name.toLowerCase().split(' ').join('')]
    sound.play()
    await delay(sound.duration / 2 * 1000)
}

function checkspeed(what){
    if (what && p1move.priority != p2move.priority){
    return (typeof p1move.priority === 'number' && !(typeof p2move.priority === 'number')) || (p1move.priority > p2move.priority)
    } 
    if (p1.pokemon[0].spe * statstates[player.spe] != p2.pokemon[0].spe * statstates[rival.spe]){
        return p1.pokemon[0].spe * statstates[player.spe] > p2.pokemon[0].spe * statstates[rival.spe]
    } 
    return Math.random() > 0.5
}

function dmgcalc() {
    if (types[move.type][otype1] * types[move.type][otype2] == 0) return 0
    return Math.round(((((((2 * 10 / 5) + 2)) * (move.dmg * (move.dmgtype == 'phy' ? uatk / odef : uspa / ospd))) / 12 + 2) *
        1 *
        ((Math.floor(Math.random() * 16) == 0) ? 2 : 1) *
        (move.type == utype1 || utype2 ? 1.5 : 1) *
        (types[move.type][otype1] * types[move.type][otype2]) *
        (ustatus == 'brn' ? 0.5 : 1) *
        ((Math.floor(Math.random() * 16) + 85) / 100)))
}

function checkprotect() {
    if (turn == 0) {
        let count = 0
        let history = me == 'friend' ? p1movehistory : p2movehistory
        if (history.length > 1) {
            for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].movetype && history[i].movetype == 'protect' && history[i].hit) count++
                else break
            }
        }
        let hit = 100 * Math.pow(0.67, count) > randomacc()
        user[10 + turn][user[10 + turn].length - 1]['hit'] = hit
        if (user[10 + turn].length > 1){
            if (user[10 + turn][user[10 + turn].length - 2].movetype == 'protect' && user[10 + turn][user[10 + turn].length - 2].hit == false) return true
        }
        return hit
    } else {
        user[10 + turn][user[10 + turn].length - 1]['hit'] = false
        return false
    } 
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
    currentmove = [p1faster ? p1move : p2move, p1faster ? p2move : p1move]
    movehistory = [p1faster ? p1movehistory : p2movehistory, p1faster ? p2movehistory : p1movehistory]
    monstatus = [p1faster ? p1.pokemon[0].status : p2.pokemon[0].status, p1faster ? p2.pokemon[0].status : p1.pokemon[0].status]
}
