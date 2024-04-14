async function moveevents(i) {
    if (mon[i] == p1.pokemon[0] && move == 'switch') return
    if (ustat.cnf) await confused()
    if (mon[i].hp == 0) await deathdisplay(i, 'turn')
    else if (move.turn2 && !move.dmg || move.movetype == 'recharge') await multiturnmove(i)
    else {
        if (['slp', 'frz', 'par'].includes(mon[i].status)) await statusing()
        if (statused) return statused = false
        battlemessage = mon[i].name + ' brutke ' + move.name + '!'
        updateview()
        await delay(2000)
        if (invul[turn]) me == 'friend' ? p1invul = false : p2invul = false
        if (protected && umovehit) nomove()
        else if (umovehit || move.acc == 0) await window[move.movetype]()
        else missed()
    }
}

async function statusing() {
    if (['frz'].includes(mon[i].status)) {
        if (Math.random() < 0.2) {
            battlemessage = uname + ' smeltet ut!'
            updatestats(who[i], '')
        } else {
            battlemessage = uname + ' er frosset fast!'
            statused = true
        }
    }
    if (['slp'].includes(mon[i].status)) {
        if (mon[i].status == 'slp3' || mon[i].status != 'slp' && Math.random() < 0.5) {
            battlemessage = uname + ' våknet!'
            updatestats(who[i], '')
        } else {
            let slp = mon[i].status
            updatestats(who[i], slp.length > 3 ? slp.replace(/\d+$/, num => +num + 1) : slp + '1')
            battlemessage = uname + ' sover raskt!'
            statused = true
        }
    }
    if (['par'].includes(mon[i].status)) {
        if (paralysed) {
            battlemessage = uname + ' er paralysert! Den kan ikke bevege seg!'
            statused = true
            paralysed = false
        } else return
    }
    updateview()
    await delay(2000)
}

async function multiturnmove(i) {
    if (move.movetype == 'invul' || move.movetype == 'charge') {
        if (['Solar Beam', 'Solar Blade'].includes(move.name) && !move.dmg && weather.weather == 'sun') {
            who[i] == 'friend' ? (p1move = JSON.parse(JSON.stringify(p1move.turn2)), p1movehistory.pop(), p1movehistory.push(JSON.parse(JSON.stringify(p1move)))) :
            (p2move = JSON.parse(JSON.stringify(p2move.turn2)), p2movehistory.pop(), p2movehistory.push(JSON.parse(JSON.stringify(p2move))))
            return
        } 
        let message = {
            dig: ' gravde seg under bakken!',
            fly: ' fløy opp høyt!',
            phantomforce: ' forsvant med en gang!',
            dive: ' stupte undervann!',
            bounce: ' hoppet opp høyt!',
            solarbeam: ' samlet opp sollys!',
            razorwind: ' pisket opp en storm!'
        }
        battlemessage = uname + message[move.name.toLowerCase().replace(/ /g, '')]
        if (move.movetype == 'invul') mon[i] == p1.pokemon[0] ? p1invul = move.name : p2invul = move.name
    }
    if (move.movetype == 'recharge') battlemessage = uname + ' må hvile!'
}

async function deathdisplay(i, turn) {
    let deadmon = null
    deadmon = (turn ? deadmon = [stats[i], mon[i]] : !turn && (i == 0 && p1faster || i == 0 && !p1faster) ? 
    [player, p1.pokemon[0]] : [rival, p2.pokemon[0]])
    updateview()
    await delay(2000)
    battlemessage = deadmon[1].name + ' døde!'
    updateview()
    await delay(2000)
    deadp1 = (turn && stats[i] == player) || (!turn && deadmon[0] == player)
    deadp2 = !deadp1
}

function nomove() {
    let message = { protected: ' beskyttet seg selv!', flinch: ' ble rystet!' }
    battlemessage = oname + message[protected]
    protected = false
}


