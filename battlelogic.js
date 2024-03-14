function battlemanager(playermove) {

    random = Math.floor(Math.random() * 4)                                          // definere rival move
    if (random == 0) rivalmove = moves[player2.pokemon[0].move1]
    if (random == 1) rivalmove = moves[player2.pokemon[0].move2]
    if (random == 2) rivalmove = moves[player2.pokemon[0].move3]
    if (random == 3) rivalmove = moves[player2.pokemon[0].move4]

    if (playermove.type === 'priority' && rivalmove.type !== 'priority') playerIsFaster = true
    else if (playermove.type !== 'priority' && rivalmove.type === 'priority') playerIsFaster = false
    else if (playermove.type === 'priority' && rivalmove.type === 'priority') {
        if (playermove.prioritystage > rivalmove.prioritystage) playerIsFaster = true
        else if (playermove.prioritystage < rivalmove.prioritystage) playerIsFaster = false
        else playerIsFaster = Math.random() < 0.5
    } else {
        if (player1.pokemon[0].speed > player2.pokemon[0].speed) {
            playerIsFaster = true
        } else if (player1.pokemon[0].speed < player2.pokemon[0].speed) {
            playerIsFaster = false
        } else playerIsFaster = Math.random() < 0.5
    }
    movedecider(playermove, rivalmove)
}

function movedecider(playermove, rivalmove) {
    if (moves[playermove].movetype == 'damage') damagemove(moves[playermove])
    if (moves[playermove].movetype == 'status') statusmove(moves[playermove])
    if (moves[playermove].movetype == 'weather') weathermove(moves[playermove])
    if (moves[playermove].movetype == 'statchange') statchangemove(moves[playermove])
}


function damagemove(move) {
    whoismoving('friend')
    ohp -= move.dmg
    if (ohp <= 0) ohp = 0
    battlemessage = uname + ' brukte ' + move.name + '!'
    updatestats('foe', 'hp', ohp)
    updateview()
}

function statusmove(move) {
    whoismoving('friend')
    battlemessage = uname + ' brukte ' + move.name + '!'
    updatestats('foe', move.statustype, move.effect)
    updateview()
}

function weathermove(move) {
    whoismoving('friend')
    battlemessage = uname + ' brukte ' + move.name + '!'
    weatherimage = weatherimages.sandstorm
    updatestats('foe', 'brn', true)
    updateview()
}

function statchangemove(move) {
    whoismoving('friend')
    oatkstage = oatkstage + move.effect
    battlemessage = uname + ' brukte ' + move.name + '!'
    updatestats(move.who, move.stateffect, oatkstage)
    updateview()
}

function updatestats(who, what, value) {                                        // endrer på enten hp, stat stages eller status conditions basert på hva 
    let target = (who === 'friend') ? player1.pokemon[0] : player2.pokemon[0]   // parameterene er
    let stattarget = (who === 'friend') ? player : rival

    if (what === 'hp') {
        target.hp = value
    } else if (['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva'].includes(what)) stattarget[what] = value
    else {
        let condition = what.replace('bad', '')
        stattarget[what] = value
        stattarget.status = value
        stattarget.statusimage = value ? statusimages[condition] : ''
    }
}

function whoismoving(who) {                 // Define variables for the one using the move (player or rival)
    if (who == 'friend') {                  // u = user og o = opponent
        uname = player1.pokemon[0].name
        uhp = player1.pokemon[0].hp
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

        oname = player2.pokemon[0].name
        ohp = player2.pokemon[0].hp
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
    } else {
        uname = player2.pokemon[0].name
        uhp = player2.pokemon[0].hp
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

        oname = player1.pokemon[0].name
        ohp = player1.pokemon[0].hp
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
    }
}