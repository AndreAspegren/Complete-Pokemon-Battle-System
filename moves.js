async function damage() {
    if (umovehit) {
        sound = movesounds[move.name.toLowerCase().split(' ').join('')]
        sound.play() 
        await delay(sound.duration / 2 * 1000)
        currenthp = ohp
        ohp -= dmgcalc()
        if (ohp < 0) ohp = 0
        battlemessage = 'Det gjorde ' + (currenthp - ohp) + ' damage!'
        updatestats(you, 'hp', ohp)
        if (checkacc2()) eval(move.effect2 + '()')
    } else {
        battlemessage = uname + ' bommet!'
        updateview()
    }
}

async function heal() {
    if (umovehit) {
        sound = movesounds[move.name.toLowerCase().split(' ').join('')]
        sound.play()
        await delay(sound.duration / 2 * 1000)
        currenthp = uhp
        uhp += eval(move.heal)
        if (uhp > umaxhp) uhp = umaxhp
        battlemessage = uname + ' healet ' + (uhp - currenthp) + ' hp!'
        updatestats(me, 'hp', uhp)
    } else{
        battlemessage = uname + ' bommet!'
        updateview()
    } 
}

async function endofturndmg(){
    if (umovehit && umovecd) {
        sound = movesounds[move.name.toLowerCase().split(' ').join('')]
        sound.play() 
        await delay(sound.duration / 2 * 1000)
        currenthp = ohp
        ohp -= dmgcalc()
        if (ohp < 0) ohp = 0
        battlemessage = 'Det gjorde ' + (currenthp - ohp) + ' damage!'
        updatestats(you, 'hp', ohp)
        if (checkacc2()) eval(move.effect2 + '()')
    } else if (!umovehit) {
        battlemessage = uname + ' bommet!'
        updateview()
    }
    else {
        battlemessage = uname + ' må hvile!'
        updateview()
    }
}

async function protect(){
    console.log(uprotect, olastmove.dmg, olastmove.effect == true)
    if (uprotect >= randomacc() && olastmove.dmg || olastmove.who?.some(entry => entry.includes('u')) || olastmove.effect == true){
        sound = movesounds[move.name.toLowerCase().split(' ').join('')]
        sound.play() 
        await delay(sound.duration / 2 * 1000)
        protectactive = true
        uprotect *= 0.67   
    }
}

function dmgcalc() {
    return ((((((2 * 10 / 5) + 2)) * (move.dmg * uatk / odef)) / 12 + 2) *
        1 *
        ((Math.floor(Math.random() * 16) == 0) ? 2 : 1) *
        (move.type == utype1 || utype2 ? 1.5 : 1) *
        (types[move.type][otype1] * types[move.type][otype2]) *
        (ustatus == 'brn' ? 0.5 : 1) *
        ((Math.floor(Math.random() * 16) + 85) / 100))
}

async function status() {
    if (umovehit) {
        if (you == 'foe' && p2.pokemon[0].status != '' || you == 'friend' && p1.pokemon[0].status != '') battlemessage = oname + ' har allerede en statustilstand!'
        else {
            sound = movesounds[move.name.toLowerCase().split(' ').join('')]
            sound.play()
            await delay(sound.duration / 2 * 1000)
            battlemessage = oname + ' ble ' + move.statustype
            updatestats(you, move.statustype)
        }
    } else{
        battlemessage = uname + ' bommet!'
        updateview()
    } 
}

async function statusheal() {
    if (umovehit) {
        if (u == 'friend' && p1.pokemon[0].status == '' || u == 'foe' && p2.pokemon[0].status == '') battlemessage = uname + ' har ikke en statustilstand!'
        else {
            sound = movesounds[move.name.toLowerCase().split(' ').join('')]
            sound.play() 
            await delay(sound.duration / 2 * 1000)
            battlemessage = uname + ' ble ' + move.statustype
            updatestats(me, move.statustype, move.effect)
        }
    } else {
        battlemessage = uname + ' bommet!'
        updateview()
    }
}

async function weatherchange() {
    if (umovehit) {
        sound = movesounds[move.name.toLowerCase().split(' ').join('')]
        sound.play() 
        await delay(sound.duration / 2 * 1000)
        weather.weather = move.weather
        weather.image = weather.images[move.weather]
    } else {
        battlemessage = uname + ' bommet!'
        updateview()
    }
}

async function stat() {    
    if (umovehit) {
        sound = movesounds[move.name.toLowerCase().split(' ').join('')]
        sound.play()
        await delay(sound.duration * 1000)
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
            updatestats(target[1], move.effecttype[i], newstat)
            if (move.effect[i] == move.effect[0] && move.effect[i] < 0) {
                movesounds.statdown.play();
            } else if (move.effect[i] == move.effect[0] && move.effect[i] > 0 || move.effect[i] > 0 && move.effect[i-1] < 0) {
                movesounds.statup.play();
            }            
            determinemessage(move.effecttype[i], move.effect[i])
            updateview()
            await delay(1100)
        }
    } else {
        battlemessage = uname + ' bommet!'
        updateview()
    } 
}

function determinemessage(type, movement){
    typemap = { 'atk': 0, 'def': 1, 'spa': 2, 'spd': 3, 'spe': 4, 'acc': 5, 'eva': 6 }
    stats = [' sitt angrep', ' sitt forsvar', ' sitt spesielle angrep', ' sitt spesielle forsvar', ' sin hastighet', ' sin treffsikkerthet', ' sin unnvikelse']
    statsmovement = [' falt betraktelig!', ' falt!', '', ' økte!', ' økte netraktelig!']
    return battlemessage = targetname + stats[typemap[type]] + statsmovement[movement+2]
}

function updatestats(who, what, value) {
    let target = (who === 'friend') ? p1.pokemon[0] : p2.pokemon[0]
    let stattarget = (who === 'friend') ? player : rival
    let hvem = (who === 'friend') ? p1 : p2
    if (what === 'hp') {
        target.hp = value
    } else if (['atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva'].includes(what)) {
        stattarget[what] = value
    }
    else {
        hvem.pokemon[0].status = what
        if (what == 'tox' && !value) stattarget['toxcounter'] = 1
    }
}

function whoismoving(who) {
    current = who === 'friend' ? p1.pokemon[0] : p2.pokemon[0]
    ustat = who === 'friend' ? player : rival
    me = who === 'friend' ? 'friend' : 'foe'
    move = who == 'friend' ? p1move : p2move
    uprotect = who == 'friend' ? p1protect : p2protect
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
    umovehit = who == 'friend' ? p1movehit : p2movehit
    umovecd = 
    
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
    olastmove = who == 'foe' ? p1movehistory[-1] ? p1movehistory[-1] : p1movehistory[0] : p2movehistory[-1] ? p2movehistory[-1] : p2movehistory[0]
}

