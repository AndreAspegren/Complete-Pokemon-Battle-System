async function damage() {
    if (umovehit && ohp != 0) {
        await playsound()
        currenthp = ohp
        ohp -= dmgcalc()
        if (ohp < 0) ohp = 0
        effectivenessmsg()
        updatestats(you, 'hp', ohp)
        if (checkacc2()) await eval(move.effect2 + '()')
    } else missed()
}

async function heal() {
    if (umovehit) {
        playsound()
        currenthp = uhp
        uhp += eval(move.heal)
        if (uhp > umaxhp) uhp = umaxhp
        battlemessage = uname + ' healet ' + (uhp - currenthp) + ' hp!'
        updatestats(me, 'hp', uhp)
    } else missed()
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
    if (((ocurrentmove.dmg ||
        ocurrentmove.who.some(str => str.includes('u')) ||
        ocurrentmove.effect === true)) && ithit) protected = true
    if (ithit) playsound()
    if (!ithit) battlemessage = 'Men det feilet'
}

async function status() {
    if (umovehit) {
        if (you == 'foe' && p2.pokemon[0].status != '' || you == 'friend' && p1.pokemon[0].status != '') battlemessage = oname + ' har allerede en statustilstand!'
        else {
            playsound()
            battlemessage = oname + ' ble ' + move.statustype
            updatestats(you, move.statustype)
        }
    } else missed()
}

async function statusheal() {
    if (umovehit) {
        if (u == 'friend' && p1.pokemon[0].status == '' || u == 'foe' && p2.pokemon[0].status == '') battlemessage = uname + ' har ikke en statustilstand!'
        else {
            playsound()
            battlemessage = uname + ' ble ' + move.statustype
            updatestats(me, move.statustype, move.effect)
        }
    } else missed()
}

async function weatherchange() {
    if (umovehit) {
        playsound()
        weather.weather = move.weather
        weather.image = weather.images[move.weather]
        weathermsg()
    } else missed()
}

async function stat() {
    if (umovehit || move.movetype != 'stat') {
        if (move.movetype == 'stat') await playsound()
        let length = move.effect.length
        for (let i = 0; i < length; i++) {
            target = (me == 'friend' && move.who[i] == 'u') || (me == 'foe' && move.who[i] == 'o') ? [player, 'friend'] : [rival, 'foe']
            targetname = me == 'friend' && move.who[i] == 'u' || me == 'foe' && move.who[i] == 'u' ? uname : oname
            currentstat = target[0][move.effecttype[i]]
            newstat = target[0][move.effecttype[i]] + move.effect[i]

            if (newstat < 0) newstat = 0
            else if (newstat > 12) newstat = 12
            if (currentstat == newstat) battlemessage = (newstat == 12 ? uname + ' sin ' + move.effecttype[i] + ' kan ikke gå høyere' :
                uname + ' sin ' + move.effecttype[i] + ' kan ikke gå lavere')

            if (move.effect[i] == move.effect[0] && move.effect[i] < 0) await playsound('statdown')
            else if (move.effect[i] == move.effect[0] && move.effect[i] > 0 || move.effect[i] > 0 && move.effect[i - 1] < 0) await playsound('statup')

            updatestats(target[1], move.effecttype[i], newstat)
            statmsg(move.effecttype[i], move.effect[i])
            updateview()
            await delay(1100)
        }
    } else missed()
}

function updatestats(who, what, value) {
    let target = (who === 'friend') ? p1.pokemon[0] : p2.pokemon[0]
    let stattarget = (who === 'friend') ? player : rival
    let hvem = (who === 'friend') ? p1 : p2

    if (what === 'hp') target.hp = value
    else if (['atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva'].includes(what)) stattarget[what] = value
    else {
        hvem.pokemon[0].status = what
        if (what == 'tox' && !value) stattarget['txc'] = 1
    }
}

function whoismoving(who, i) {
    turn = i
    current = who === 'friend' ? p1.pokemon[0] : p2.pokemon[0]
    ustat = who === 'friend' ? player : rival
    me = who === 'friend' ? 'friend' : 'foe'
    move = who == 'friend' ? p1move : p2move

    uname = current.name
    uhp = current.hp
    umaxhp = current.maxhp
    uatk = current.atk
    uatkstat = statstates[ustat.atk]
    uatkstage = ustat.atk
    udef = current.def
    udefstat = statstates[ustat.def]
    udefstage = ustat.def
    uspa = current.spa
    uspastat = statstates[ustat.spa]
    uspastage = ustat.spa
    uspd = current.spd
    uspdstat = statstates[ustat.spd]
    uspdstage = ustat.spd
    uspe = current.spe
    uspestat = statstates[ustat.spe]
    uspestage = ustat.spe
    uacc = statstates2[ustat.acc]
    uaccstat = ustat.acc
    ueva = statstates2[ustat.eva]
    uevastat = ustat.eva
    utype1 = current.type1
    utype2 = current.type2
    ustatus = current.status
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

