async function damage() {
    await playsound()
    hp[1] -= dmgcalc()
    if (hp[1] < 0) hp[1] = 0
    effectivenessmsg()
    await updatestats(mon[1], 'hp', hp[1])
    if (checkacc2() && move[0].effect2) await window[move[0].effect2]()
}

async function flinch() {
    if (turn = 0) protected = 'flinch'
}

async function heal() {
    playsound()
    currenthp = hp[0]
    hp[0] += eval(move.heal)
    if (hp[0] > umaxhp) hp[0] = maxhp[0]
    battlemessage = monname[0] + ' healet ' + (hp[0] - currenthp) + ' hp!'
    updatestats(mon[0], 'hp', hp[0])
}

async function sethazard() {
    max = { spk: 3, tspk: 2, strk: 1, stwb: 1 }
    if (stats[1][move.effect] < max[move.effect]) {
        stats[1][move.effect] += 1
        hazardmsg(move[0].effect, who[1] == 'p1' ? p1.name : p2.name)
    }
    else battlemessage = 'Men det feilet!'
}

async function confuse() {
    if (!stats[1].cnf) {
        updatestats(mon[1], 'cnf', 1)
        battlemessage = monname[1] + ' ble forvirret!'
    }
    else battlemessage = monname[1] + ' er allerede forvirret!'
}

async function suicide() {
    await delay(2000)
    updatestats(mon[0], 'hp', 0)
    battlemessage = monname[0] + ' døde!'
    updateview()
    await delay(2000)
}

async function protect() {
    let ithit = checkprotect()
    if (((move[1].dmg || move[1].effect == true || [move[1].who].includes('you'))) && ithit) protected = 'protected'
    if (ithit) playsound()
    else battlemessage = 'Men det feilet'
}


async function multidmg() {
    let count = 0
    let random = Math.random()
    let hits = random < 3 / 8 ? 2 : random < 6 / 8 ? 3 : random < 7 / 8 ? 4 : 5
    for (let i = 0; i < hits; i++) {
        count++
        await playsound()
        hp[1] -= dmgcalc()
        if (hp[1] < 0) hp[1] = 0
        who[1] == 'p1' ? p1.pokemon[0].hp = hp[1] : p2.pokemon[0].hp = hp[1]
        updateview()
        await delay(2000)
        if (!hp[1]) break
    }
    if (types[move[0].type][type1[0]] * types[move[0].type][type2[0]] != 1) {
        effectivenessmsg()
        updateview()
        await delay(2000)
    }
    battlemessage = 'Det traff ' + count + (count == 1 ? ' gang!' : ' ganger!')
    await updatestats(mon[1], 'hp', hp[1])
}

async function confused() {
    battlemessage = monname[0] + ' er forvirret!'
    updateview()
    await delay(2000)
    if (stats[0].cnf == 4 || Math.random() < 1 / 3) {
        battlemessage = monname[0] + ' kom seg ut av det!'
        updatestats(mon[0], 'cnf', false)
    } else {
        if (Math.random() < 1 / 3) {
            endturn = true
            await playsound()
            hp[0] -= Math.round(((((2 * 10 / 5) + 2)) * (40 * (atk[0] / def[0])) / 12 + 2) * (pstatus[0] == 'brn' ? 0.5 : 1))
            if (hp[0] < 0) hp[0] = 0
            updatestats(mon[0], 'hp', hp[0])
            battlemessage = 'Den skadet seg selv i sin forvirring!'
            updatestats(mon[0], 'cnf', stats[0].cnf + 1)
        }
    }
    updateview()
    await delay(2000)
}

async function trickroom() {
    global.trickroom = 1,
    battlemessage = monname[0] + ' vridde dimensjonene!'
}

async function status() {
    if (!pstatus[1]) {
        await playsound()
        statusmsg(move[0].statustype, who[1])
        updatestats(mon[1], move[0].statustype)
    }
    else battlemessage = monname[1] + ' har allerede en statustilstand!'
}

async function switchuser() {
    updateview()
    await delay(1500)
    if (trainer[0].pokemon.slice(1).some(p => p.hp > 0)) {
        if (who[0] == 'p1') {
            await changepokemon('switchmove')
            assignpp()
        }
        else {
            const index = p2.pokemon.findIndex(p => p.hp > 0)
            const [pokemon] = p2.pokemon.splice(index, 1)
            p2.pokemon.unshift(pokemon)
        }
    }
}

async function statusheal() {
    if (pstatus[0]) {
        await playsound()
        battlemessage = monname[0] + ' ble ' + move.statustype
        updatestats(mon[0], move[0].statustype, move[0].effect)
    }
    else battlemessage = monname[0] + ' har ikke en statustilstand!'
}

async function weatherchange() {
    playsound()
    weather.weather = move.weather
    weather.image = weather.images[move[0].weather]
    weathermsg()
}

async function stat(who, what, value) {
    const statmove = move[0].movetype == 'stat' && !who ? true : false 
    const stats = {
        'atk': 'angrep',        'def': 'forsvar',
        'spa': 'spesialangrep', 'spd': 'spesialforsvar',
        'spe': 'hastighet',     'acc': 'nøyaktighet',
        'eva': 'unngåelse',
    }

    if (statmove) await playsound()
    for (let i = 0; i < (who ? what.length : move[0].effect.length); i++) {
        let currentstat = who ? who[i][what[i]] : target[0][move.effecttype[i]]
        let effect = who ? value[i] : move.effect[i]
        let what = who ? what[i] : move.effecttype[i]
        let mon = who ? null : move.who == 'me' ? mon[0] : mon[1]

        if (!statmove && ((currentstat == 12 && effect > 0 || (currentstat == 0 && effect < 0)))) continue
        
        let target = (who[0] == 'p1' && move[0].who[i] == 'me') || (me == 'p2' && move.who[i] == 'you') ? [player, 'p1'] : [rival, 'p2']
        let newstat = Math.min(12, Math.max(0, (who ? currentstat + value[i] : target[0][move.effecttype[i]] + move.effect[i])))
        let changemsg = (currentstat == 11 && effect == 2) ? 1 : (currentstat == 1 && effect == -2) ? -1 : effect
        
        if ((currentstat == 12 && effect > 0 || currentstat == 0 && effect < 0) && statmove) {
            battlemessage = mon.name + ' sin ' + stats[what] + 'kan ikke gå ' + (effect > 0 ? 'høyere!' : 'lavere!')
            updateview()
            await delay(1100)
            continue
        }
        if (i == 0 && effect < 0 && currentstat != 0) await playsound('statdown')
        else if ((i == 0 || (who ? value[i - 1] : move.effect[i - 1]) < 0) && currentstat != 12 && effect > 0) await playsound('statup')

        statmsg(who ? who : mon, what, changemsg)
        updatestats(target[1], what, newstat)
        updateview()
        await delay(1100)
    }
}

async function updatestats(who, what, value, what2) {
    let mon = who == 'p1' ? p1.pokemon[0] : p2.pokemon[0]
    let stat = who == 'p1' ? player : rival

    if (what == 'hp') {
        if (who.hp == who.maxhp && value === 0 && who.item.effect === 'fullhpdmgsurvival' && !mon.item.cd) return await focussash()
        who.hp = value
        if (value == 0) await deathdisplay(who)
    }
    else if (['atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva', 'cnf'].includes(what)) stat[what] = value
    else if (what == 'status') {
        mon.status = value
        if (value == false) stat['txc'] = 1
    }
    else what2 ? mon[what][what2] = value : mon[what] = value
}
