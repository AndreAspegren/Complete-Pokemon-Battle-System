async function moveevents(i) {
    if (mon[i] == p1.pokemon[0] && move == 'switch') return
    if (ustat.cnf) await confused()
    await deathdisplay(i)
    if (move.turn2 && !move.dmg || move.movetype == 'recharge') await multiturnmove(i)
    if (!endturn) {
        if (['slp', 'frz', 'par'].includes(mon[i].status)) await statusing()
        if (statused) return statused = false
        battlemessage = mon[i].name + ' brutke ' + move.name + '!'
        updateview()
        await delay(2000)
        if (invul[turn]) me == 'friend' ? p1invul = false : p2invul = false
        if (protected && umovehit) nomove()
        else if (umovehit || move.acc == 0) await window[move.movetype]()
        else missed()
        await deathdisplay(i)
    }
    endturn = false
}

async function statusing() {
    if (['frz'].includes(mon[i].status)) {
        if (Math.random() < 0.2) {
            battlemessage = uname + ' smeltet ut!'
            updatestats(who[i], '')
        } else {
            battlemessage = uname + ' er frosset fast!'
            endturn = true
        }
    }
    if (['slp'].includes(mon[i].status)) {
        if (mon[i].status == 'slp3' || mon[i].status != 'slp' && Math.random() < 0.5) {
            battlemessage = uname + ' våknet!'
            updatestats(who[i], '')
        } else {
            let slp = mon[i].status
            updatestats(who[i], slp.length > 3 ? slp.replace(/\d+$/, num => + num + 1) : slp + '1')
            battlemessage = uname + ' sover raskt!'
            endturn = true
        }
    }
    if (['par'].includes(mon[i].status)) {
        if (paralysed) {
            battlemessage = uname + ' er paralysert! Den kan ikke bevege seg!'
            endturn = true
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

async function deathdisplay(i) {
    if (mon[i].hp == 0) endturn = true
    for (let i = 0; i < 2; i++) {
        if (mon[i].hp == 0 && ((who[i] == 'friend' && !deadp1) || (who[i] == 'foe' && !deadp2))) {
            updateview()
            await delay(1500)
            battlemessage = mon[i].name + ' døde!'
            updateview()
            resetstats(stats[i], mon[i])
            await delay(1500)
            who[i] == 'friend' ? deadp1 = true : deadp2 = true
            updateview()
        }
    }
}

function nomove() {
    let message = { protected: ' beskyttet seg selv!', flinch: ' ble rystet!' }
    battlemessage = oname + message[protected]
    protected = false
}


