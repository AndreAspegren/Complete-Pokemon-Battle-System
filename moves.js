async function damage() {
    await playsound()
    ohp -= dmgcalc()
    if (ohp < 0) ohp = 0
    effectivenessmsg()
    updatestats(you, 'hp', ohp)
    if (checkacc2()) await eval(move.effect2 + '()')
}

async function flinch() {
    if (turn = 0) protected = 'flinch'
}

async function heal() {
    playsound()
    currenthp = uhp
    uhp += eval(move.heal)
    if (uhp > umaxhp) uhp = umaxhp
    battlemessage = uname + ' healet ' + (uhp - currenthp) + ' hp!'
    updatestats(me, 'hp', uhp)
}

async function sethazard() {
    max = { spk: 3, tspk: 2, strk: 1, stwb: 1 }
    if (ostat[move.effect] < max[move.effect]) {
        ostat[move.effect] += 1
        hazardmsg(move.effect, o)
    }
    else battlemessage = 'Men det feilet!'
}

async function confuse() {
    if (!ostat.cnf) {
        updatestats(you, 'cnf', 1)
        battlemessage = oname + ' ble forvirret!'
    }
    else battlemessage = oname + ' er allerede forvirret!'
}

async function suicide() {
    await delay(2000)
    updatestats(me, 'hp', 0)
    battlemessage = uname + ' døde!'
    updateview()
    await delay(2000)
}

async function protect() {
    ithit = checkprotect()
    if (((ocurrentmove.dmg || ocurrentmove.effect === true)) && ithit) {
        if (ocurrentmove.who) {
            if (ocurrentmove.who.some(str => str.includes('u'))) protected = 'protected'
        }
        else protected = 'protected'
    }
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
        ohp -= dmgcalc()
        if (ohp < 0) ohp = 0
        updatestats(you, 'hp', ohp)
        updateview()
        await delay(2000)
        if (!ohp) break
    }
    if (types[move.type][otype1] * types[move.type][otype2] != 1) {
        effectivenessmsg()
        updateview()
        await delay(2000)
    }
    battlemessage = 'Det traff ' + count + (count == 1 ? ' gang!' : ' ganger!')
}

async function confused() {
    battlemessage = uname + ' er forvirret!'
    updateview()
    await delay(2000)
    if (ustat.cnf == 4 || Math.random() < 1 / 3) {
        battlemessage = uname + ' kom seg ut av det!'
        updatestats(who[turn], 'cnf', false)
    } else {
        if (Math.random() < 1 / 3) {
            await playsound()
            uhp -= Math.round(((((2 * 10 / 5) + 2)) * (40 * (uatk / udef)) / 12 + 2) * (ustatus == 'brn' ? 0.5 : 1))
            if (uhp < 0) uhp = 0
            updatestats(me, 'hp', uhp)
            battlemessage = 'Den skadet seg selv i sin forvirring!'
            updatestats(who[turn], 'cnf', ustat.cnf + 1)
        } else return
    }
    updateview()
    await delay(2000)
}

async function trickroom() {
    global.trickroom = 1,
    battlemessage = uname + ' vridde dimensjonene!'
}

async function status() {
    if (!o.status) {
        await playsound()
        statusmsg(move.statustype, u)
        updatestats(you, move.statustype)
    }
    else battlemessage = oname + ' har allerede en statustilstand!'
}

async function statusheal() {
    if (u.status) {
        await playsound()
        battlemessage = uname + ' ble ' + move.statustype
        updatestats(me, move.statustype, move.effect)
    }
    else battlemessage = uname + ' har ikke en statustilstand!'
}

async function weatherchange() {
    playsound()
    weather.weather = move.weather
    weather.image = weather.images[move.weather]
    weathermsg()
}

async function stat() {
    if (move.movetype == 'stat') await playsound()
    for (let i = 0; i < move.effect.length; i++) {
        target = (me == 'friend' && move.who[i] == 'u') || (me == 'foe' && move.who[i] == 'o') ? [player, 'friend'] : [rival, 'foe']
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

function updatestats(who, what, value) {
    let target = (who === 'friend') ? p1.pokemon[0] : p2.pokemon[0]
    let stattarget = (who === 'friend') ? player : rival
    let hvem = (who === 'friend') ? p1 : p2

    if (what === 'hp') target.hp = value
    else if (['atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva', 'cnf'].includes(what)) stattarget[what] = value
    else {
        hvem.pokemon[0].status = what
        if (what == 'tox' && !value) stattarget['txc'] = 1
    }
}

function whoismoving(who, i) {
    turn = i
    u = who === 'friend' ? p1.pokemon[0] : p2.pokemon[0]
    ustat = who === 'friend' ? player : rival
    me = who === 'friend' ? 'friend' : 'foe'
    move = who == 'friend' ? p1move : p2move

    uname = u.name
    uhp = u.hp
    umaxhp = u.maxhp
    uatk = u.atk
    uatkstat = statstates[ustat.atk]
    uatkstage = ustat.atk
    udef = u.def
    udefstat = statstates[ustat.def]
    udefstage = ustat.def
    uspa = u.spa
    uspastat = statstates[ustat.spa]
    uspastage = ustat.spa
    uspd = u.spd
    uspdstat = statstates[ustat.spd]
    uspdstage = ustat.spd
    uspe = u.spe
    uspestat = statstates[ustat.spe]
    uspestage = ustat.spe
    uacc = statstates2[ustat.acc]
    uaccstat = ustat.acc
    ueva = statstates2[ustat.eva]
    uevastat = ustat.eva
    utype1 = u.type1
    utype2 = u.type2
    ustatus = u.status
    umovehit = who === 'friend' ? p1movehit : p2movehit

    o = who === 'friend' ? p2.pokemon[0] : p1.pokemon[0]
    ostat = who === 'friend' ? rival : player
    you = who === 'friend' ? 'foe' : 'friend'
    oname = o.name
    ohp = o.hp
    omaxhp = o.maxhp
    oatk = o.atk
    oatkstat = statstates[ostat.atk]
    oatkstage = ostat.atk
    odef = o.def
    odefstat = statstates[ostat.def]
    odefstage = ostat.def
    ospa = o.spa
    ospastat = statstates[ostat.spa]
    ospastage = ostat.spa
    ospd = o.spd
    ospdstat = statstates[ostat.spd]
    ospdstage = ostat.spd
    ospe = o.spe
    ospestat = statstates[ostat.spe]
    ospestage = ostat.spe
    oacc = statstates2[ostat.acc]
    oaccstat = ostat.acc
    oeva = statstates2[ostat.eva]
    oevastat = ostat.eva
    otype1 = o.type1
    otype2 = o.type2
    ostatus = o.status
    ocurrentmove = who == 'foe' ? p1movehistory[-1] ? p1movehistory[-1] : p1movehistory[0] : p2movehistory[-1] ? p2movehistory[-1] : p2movehistory[0]
}

