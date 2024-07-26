async function moveevents(i) {
    let hitcheck = false
    if (mon[0].hp <= 0 || movehistory[0][movehistory[0].length - 1] == 'switch') return
    if (mon[0] == p1.pokemon[0] && move == 'switch' || mon[0].hp == 0) return await delay(1000)
    if (stats[0].cnf) await confused()
    if (move[0].turn2 && !move[0].dmg || move.movetype == 'recharge') {
        hitcheck = true
        return await multiturnmove()
    } 
    if (!endturn) {
        if (['slp', 'frz', 'par'].includes(mon[i].status)) await statusing(i)
        if (statused) return statused = false
        battlemessage = mon[0].name + ' brutke ' + move[0].name + '!'
        updateview()
        await delay(2000)
        if (stats[0].inlove && Math.random() > 0.5) return inlovemsg()
        if (invul[0]) who[0] == 'p1' ? p1invul = false : p2invul = false
        if (protected && ithit) nomove()
        else if ((ithit || move[0].acc == 0) && (mon[1].hp != 0 ||
            (mon[1].hp == 0 && !move[0].dmg && move[0].effect != true && !move[0].who.includes('u')))) {
            await window[move[0].movetype]()
            hitcheck = true
        }
        else missed()
    }
    sethit()
}

async function statusing() {
    if (['frz'].includes(pstatus[0])) {
        if (Math.random() < 0.2) {
            battlemessage = monname[0] + ' smeltet ut!'
            updatestats(mon[i], '')
        } else {
            battlemessage = monname[0] + ' er frosset fast!'
            endturn = true
        }
    }
    if (['slp'].includes(pstatus[0])) {
        if (mon[i].status == 'slp3' || mon[0].status != 'slp' && Math.random() < 0.5) {
            battlemessage = monname[0] + ' våknet!'
            updatestats(mon[0], '')
        } else {
            let slp = pstatus[0]
            updatestats(mon[0], slp.length > 3 ? slp.replace(/\d+$/, num => + num + 1) : slp + '1')
            battlemessage = monname[0] + ' sover raskt!'
            endturn = true
        }
    }
    if (['par'].includes(pstatus[0])) {
        if (paralysed) {
            battlemessage = monname[0] + ' er paralysert! Den kan ikke bevege seg!'
            endturn = true
            paralysed = false
        } else return
    }
    updateview()
    await delay(2000)
}

function sethit(hitbool) {
    let lastMove = movehistory[0]?.[movehistory[0].length - 1]
    if (lastMove && lastMove.hit === undefined) movehistory[0][movehistory[0].length - 1].hit = hitbool
}


async function multiturnmove() {
    if (move[0].movetype == 'invul' || move[0].movetype == 'charge') {
        if (['Solar Beam', 'Solar Blade'].includes(move[0].name) && !move[0].dmg && weather.weather == 'sun') {
            who[0] == 'p1' ? (p1move = JSON.parse(JSON.stringify(p1move.turn2)), p1movehistory.pop(), p1movehistory.push(JSON.parse(JSON.stringify(p1move)))) :
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
        battlemessage = monname[0] + message[move[0].name.toLowerCase().replace(/ /g, '')]
        if (move[0].movetype == 'invul') mon[0] == p1.pokemon[0] ? p1invul = move[0].name : p2invul = move[0].name
    }
    if (move[0].movetype == 'recharge') battlemessage = monname[0] + ' må hvile!'
}

async function deathdisplay(who) {
    updateview()
    await delay(1500)
    battlemessage = who.name + ' døde!'
    updateview()
    resetstats(who == p1.pokemon[0] ? player : rival, who)
    await delay(1500)
    who == p1.pokemon[0] ? deadp1 = true : deadp2 = true
    updateview()
    await delay(1500)
}

function nomove() {
    let message = { protected: ' beskyttet seg selv!', flinch: ' ble rystet!' }
    battlemessage = monname[1] + message[protected]
    protected = false
}


