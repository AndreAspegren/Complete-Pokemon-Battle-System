function resetstats(who){
    stats = ['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva']
    stats.forEach(stat => {
        who[stat] = 6
    })
    who.toxcounter = 1
    if (who == player) p1movehistory = []
    if (who == rival) p2movehistory = []
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

function determinespeed(what){
    if (p1move.priority != p2move.priority && what == 'moveorder') return p1move.priority > p2move.priority
    if (p1.pokemon[0].spe * statstates[player.spe] != p2.pokemon[0].spe * statstates[rival.spe]) return p1.pokemon[0].spe * statstates[player.spe] > p2.pokemon[0].spe * statstates[rival.spe]
    return Math.random() > 0.5
}

function dmgcalc() {
    if (types[move.type][otype1] == 0 || types[move.type][otype2] == 0) return 0
    return Math.round(((((((2 * 10 / 5) + 2)) * (move.dmg * (move.dmgtype == 'phy' ? uatk / odef : uspa / ospd))) / 12 + 2) *
        1 *
        ((Math.floor(Math.random() * 16) == 0) ? 2 : 1) *
        (move.type == utype1 || utype2 ? 1.5 : 1) *
        (types[move.type][otype1] * types[move.type][otype2]) *
        (ustatus == 'brn' ? 0.5 : 1) *
        ((Math.floor(Math.random() * 16) + 85) / 100)))
}

function checkacc(who) {
    if (who == p1.pokemon[0]) p1movehit = p1move.acc * statstates[player.acc] >= randomacc() * (p1.pokemon[0].status === 'par' ? 0.75 : 1) || p1move.acc == 0
    if (who == p2.pokemon[0]) p2movehit = p2move.acc * statstates[rival.acc] >= randomacc() * (p2.pokemon[0].status === 'par' ? 0.75 : 1) || p2move.acc == 0
}

function checkprotect() {
    let using = me == 'friend' ? p1.pokemon[0] : p2.pokemon[0]
    let history = me == 'friend' ? p1movehistory : p2movehistory

    if (using == user[4]) {
        let count = 0
        if (history.length > 0) {
            for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].movetype && history[i].movetype == 'protect' && history[i].hit) count++
                else break
            }
        }
        return 100 * Math.pow(0.67, count) > randomacc()
    } else return false
}
