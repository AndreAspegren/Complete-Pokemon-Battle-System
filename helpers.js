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
hit = user[2 + i].acc * statstates[user[8 + i].acc] >= randomacc() * (user[4 + i].status === 'par' ? 0.75 : 1) || user[2 + i].acc == 0
who == p1.pokemon[0] ? p1movehit = hit : p2movehit = hit
user[10 + i][user[10 + i].length - 1]['hit'] = hit
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
    if (what == 'moveorder' && p1move.priority != p2move.priority){
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
