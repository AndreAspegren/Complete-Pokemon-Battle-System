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
    if (((move[1].dmg || move[1].effect == true || [move[1].who].includes('u'))) && ithit) protected = 'protected'
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

async function stat() { // refactor dette kaoset
    if (move[0].movetype == 'stat') await playsound()
    for (let i = 0; i < move[0].effect.length; i++) {
        target = (who[0] == 'friend' && move[0].who[i] == 'u') || (me == 'foe' && move.who[i] == 'o') ? [player, 'friend'] : [rival, 'foe']
        targetname = me == 'friend' && move.who[i] == 'u' || me == 'foe' && move.who[i] == 'u' ? uname : oname
        currentstat = target[0][move.effecttype[i]]
        newstat = target[0][move.effecttype[i]] + move.effect[i]

        if (currentstat == 0 && newstat < 0 && move.movetype == 'stat') {
            newstat = 0
            battlemessage = name + ' sin ' + move.effecttype[i] + ' kan ikke gå lavere'
        }
        else if (currentstat == 12 && newstat > 12 && move.movetype == 'stat') {
            newstat = 12
            battlemessage = uname + ' sin ' + move.effecttype[i] + ' kan ikke gå høyere'
        }

        if (i == 0 && move.effect[i] < 0 && currentstat != 0) await playsound('statdown')
        else if ((i == 0 && move.effect[i] > 0 || move.effect[i] > 0 && move.effect[i - 1] < 0) && currentstat != 12) await playsound('statup')

        updatestats(target[1], move.effecttype[i], newstat)
        statmsg(move.effecttype[i], move.effect[i], targetname)
        updateview()
        await delay(1100)
    }
}

async function updatestats(who, what, value) {
    let stattarget = (who == 'p1') ? player : rival
    let trainer = (who == 'p1') ? p1 : p2
    let mon = (who == 'p1') ? p1.pokemon[0] : p2.pokemon[0]

    if (what === 'hp') {
        if (who.hp === who.maxhp && value === 0 && who.item.effect === 'fullhpdmgsurvival' && !who.item.cd) {
            return await who.item.function()
        }
        who.hp = value
        if (value === 0) await deathdisplay(who)
    }
    else if (['atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva', 'cnf'].includes(what)) {
        stattarget[what] = value
    }
    else if (what === 'status') {
        trainer.pokemon[0].status = value;
        if (value === 'tox' && !value) stattarget['txc'] = 1
    } 
    else {
        console.log(mon, what, value)
        mon[what] = false
    } 
}





