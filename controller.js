function battlemanager(playermove) {

    random = Math.floor(Math.random() * 4)                                          // definere rival move
    if (random == 0) rivalmove = moves[player2.pokemon[0].move1]
    if (random == 1) rivalmove = moves[player2.pokemon[0].move2]
    if (random == 2) rivalmove = moves[player2.pokemon[0].move3]
    if (random == 3) rivalmove = moves[player2.pokemon[0].move4]

    if (player1.pokemon[0].speed > player2.pokemon[0].speed) playerisfaster = true     // definere hvem som skal gå først
    if (player1.pokemon[0].speed == player2.pokemon[0].speed) playerisfaster = playerisfaster = Math.floor(Math.random() * 2) == 1
    if (playermove.type == 'priority') playerisfaster = true
    if (playermove.type == 'priority') playerisfaster = true
    if (playermove.type == 'priority' && rivalmove.type == 'priority') playerisfaster = Math.floor(Math.random() * 2) == 1
    movedecider(playermove, rivalmove)
}

function movedecider(playermove, rivalmove) {
    if (moves[playermove].movetype == 'priority') damagemove(moves[playermove])
}

function damagemove(move) {
    whoismoving('friend')
    ohp -= moves[player1.pokemon[0].move1].dmg
    if (ohp <= 0) ohp = 0
    battlemessage = uname + ' brukte ' + moves[player1.pokemon[0].move1].name + '!'
    updatestats('foe', 'brn', false)
    updateview()
}

function test() {
    whoismoving('friend')
    updatestats('foe', 'brn', true)
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
        uacc = player.acc
        uaccstage = statstates2[player.acc]
        ueva = player.eva
        uevastage = statstates2[player.eva]

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
        oacc = rival.acc
        oaccstage = statstates2[rival.acc]
        oeva = rival.eva
        oevastage = statstates2[rival.eva]
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
        uacc = rival.acc
        uaccstage = statstates2[rival.acc]
        ueva = rival.eva
        uevastage = statstates2[rival.eva]

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
        oacc = player.acc
        oaccstage = statstates2[player.acc]
        oeva = player.eva
        oevastage = statstates2[player.eva]
    }
}


// damage = ((((2 * level / 5) + 2)) * (dmg * uatk / adef)) / 50 + 2 * multiplier * crit * random
