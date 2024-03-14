function damage(move, move2, randomacc) {
    console.log(move)
    if (move.acc * uacc >= randomacc && !upar || move.acc * uacc * 0.75 >= randomacc && upar || move.acc == 0) {
        currenthp = ohp
        ohp -= move.dmg
        if (ohp < 0) ohp = 0
        battlemessage = 'Det gjorde ' + (currenthp - ohp) + ' damage!'
        updatestats(you, 'hp', ohp)
        if (move.effect2) eval(move.movetype + '()')
    } else {
        battlemessage = uname + ' bommet!'
        setTimeout(() => (moveannouncement(move, move2)), 2000)
    } 
    updateview()
}

function heal(move, move2, randomacc) {
    if (move.acc * uacc >= randomacc && !upar || move.acc * uacc * 0.75 >= randomacc && upar || move.acc == 0) {
        currenthp = uhp
        uhp += eval(move.heal)
        if (uhp > umaxhp) uhp = umaxhp
        battlemessage = uname + ' healet ' + (uhp - currenthp) + ' hp!'
        updatestats(me, 'hp', uhp)
    } else battlemessage = uname + ' bommet!'
    updateview()
    setTimeout(() => (moveannouncement(move, move2)), 2000)
}

function status(move, move2, randomacc) {
    if (move.acc * uacc >= randomacc && !upar || move.acc * uacc * 0.75 >= randomacc && upar || move.acc == 0) {
        if (you == 'foe' && rival.status || you == 'friend' && player.status) battlemessage = oname + ' har allerede en statustilstand!'
        else {
            battlemessage = oname + ' ble ' + move.statustype
            updatestats(you, move.statustype, move.effect)
        }
    } else battlemessage = uname + ' bommet!'
    updateview()
    setTimeout(() => (moveannouncement(move, move2)), 2000)
}

function statusheal(move, move2, randomacc) {
    if (move.acc * uacc >= randomacc && !upar || move.acc * uacc * 0.75 >= randomacc && upar || move.acc == 0) {
        if (me == 'friend' && !player.status || me == 'foe' && !rival.status) battlemessage = oname + ' har allerede en statustilstand!'
        else {
            battlemessage = uname + ' ble ' + move.statustype
            updatestats(me, move.statustype, move.effect)
        }
    } else battlemessage = uname + ' bommet!'
    updateview()
    setTimeout(() => (moveannouncement(move, move2)), 2000)
}

function weatherchange(move, move2, randomacc) {
    if (move.acc * uacc > randomacc && !upar || move.acc * uacc * 0.75 > randomacc && upar || move.acc == 0) {
        weather.weather = move.weather
        weather.image = weather.images[move.weather]
    } else battlemessage = uname + ' bommet!'
    updateview()
    setTimeout(() => (moveannouncement(move, move2)), 2000)
}

function stat(move, move2, randomacc) {
    if (randomacc > move.acc * uacc && !upar || randomacc > move.acc * uacc * 0.75 && upar || move.acc == 0) {
        for (let i = 0; i < move.effecttype.length; i++){
            who = me == 'friend' ? player : rival 
            updatestats(move.who[i], move.effecttype[i], (who[move.effecttype[i]] += move.effect[i]))
        }
    } else battlemessage = uname + ' bommet!'
    updateview()
    setTimeout(() => (moveannouncement(move, move2)), 2000)
}


function updatestats(who, what, value) {                                        // endrer på enten hp, stat stages eller status conditions basert på hva 
    let target = (who === 'friend') ? player1.pokemon[0] : player2.pokemon[0]   // parameterene er
    let stattarget = (who === 'friend') ? player : rival

    if (what === 'hp') {
        target.hp = value
    } else if (['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva'].includes(what)) stattarget[what] = value
    else {
        if (what != 'allstatus'){
            stattarget[what] = value
            stattarget.status = value
            stattarget.statusimage = value ? statusimages[what] : ''
        }
        else {
            stattarget['brn'] = value
            stattarget['par'] = value
            stattarget['psn'] = value
            stattarget['tox'] = value
            stattarget['slp'] = value
            stattarget['frz'] = value
            stattarget.status = value
            stattarget.statusimage = '' 
        }
    }
}

function whoismoving(who) {  
    u = 'u'
    o = 'o'
    if (who == 'friend') {
        me = 'friend'              
        uname = player1.pokemon[0].name
        uhp = player1.pokemon[0].hp
        umaxhp = player1.pokemon[0].maxhp
        uatk = statstates[player.atk]
        uatkstage = player.atk
        udef = statstates[player.def]
        udefstage = player.def
        usatk = statstates[player.satk]
        usatkstage = player.satk
        usdef = statstates[player.sdef]
        usdefstage = player.sdef
        uspe = statstates[player.spe]
        uspestage = player.spe
        uacc = statstates2[player.acc]
        uaccstage = player.acc
        ueva = statstates2[player.eva]
        uevastage = player.eva
        ustatus = player.status
        ubrn = player.brn
        upar = player.par
        upsn = player.psn
        utox = player.tox
        uslp = player.slp
        ufrz = player.frz

        you = 'foe'
        oname = player2.pokemon[0].name
        ohp = player2.pokemon[0].hp
        omaxhp = player2.pokemon[0].maxhp
        oatk = statstates[rival.atk]
        oatkstage = rival.atk
        odef = statstates[rival.def]
        odefstage = rival.def
        osatk = statstates[rival.satk]
        osatkstage = rival.satk
        osdef = statstates[rival.sdef]
        osdefstage = rival.sdef
        ospe = statstates[rival.spe]
        ospestage = rival.spe
        oacc = statstates2[rival.acc]
        oaccstage = rival.acc
        oeva = statstates2[rival.eva]
        oevastage = rival.eva
        ostatus = player.status
        obrn = player.brn
        opar = rival.par
        opsn = player.psn
        otox = player.tox
        oslp = player.slp
        ofrz = player.frz
    } else {
        me = 'foe'
        uname = player2.pokemon[0].name
        uhp = player2.pokemon[0].hp
        umaxhp = player2.pokemon[0].maxhp
        uatk = statstates[rival.atk]
        uatkstage = rival.atk
        udef = statstates[rival.def]
        udefstage = rival.def
        usatk = statstates[rival.satk]
        usatkstage = rival.satk
        usdef = statstates[rival.sdef]
        usdefstage = rival.sdef
        uspe = statstates[rival.spe]
        uspestage = rival.spe
        uacc = statstates2[rival.acc]
        uaccstage = rival.acc
        ueva = statstates2[rival.eva]
        uevastage = rival.eva
        ustatus = player.status
        ubrn = rival.brn
        upar = rival.brn
        upsn = rival.psn
        utox = rival.tox
        uslp = rival.slp
        ufrz = rival.frz

        you = 'friend'
        oname = player1.pokemon[0].name
        ohp = player1.pokemon[0].hp
        omaxhp = player1.pokemon[0].maxhp
        oatk = statstates[player.atk]
        oatkstage = player.atk
        odef = statstates[player.def]
        odefstage = player.def
        osatk = statstates[player.satk]
        osatkstage = player.satk
        osdef = statstates[player.sdef]
        osdefstage = player.sdef
        ospe = statstates[player.spe]
        ospestage = player.spe
        oacc = statstates2[player.acc]
        oaccstage = player.acc
        oeva = statstates2[player.eva]
        oevastage = player.eva
        ostatus = player.status
        obrn = player.brn
        opar = player.par
        opsn = player.psn
        otox = player.tox
        oslp = player.slp
        ofrz = player.frz
    }
}
