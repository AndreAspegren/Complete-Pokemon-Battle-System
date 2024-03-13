function battlemanager(playermove){

    random = Math.floor(Math.random() * 4)                                          // definere rival move
    if (random == 0) rivalmove = moves[rival.pokemon[0].move1]
    if (random == 1) rivalmove = moves[rival.pokemon[0].move2]
    if (random == 2) rivalmove = moves[rival.pokemon[0].move3]
    if (random == 3) rivalmove = moves[rival.pokemon[0].move4]

    if (player.pokemon[0].speed > rival.pokemon[0].speed) playerisfaster = true     // definere hvem som skal gå først
    if (player.pokemon[0].speed == rival.pokemon[0].speed) playerisfaster = playerisfaster = Math.floor(Math.random() * 2) == 1
    if (playermove.type == 'priority') playerisfaster = true
    if (playermove.type == 'priority') playerisfaster = true
    if (playermove.type == 'priority' && rivalmove.type == 'priority') playerisfaster = Math.floor(Math.random() * 2) == 1
    movedecider(playermove, rivalmove)
}

function movedecider(playermove, rivalmove){
    if (moves[playermove].movetype) damagemove(moves[playermove])
}

function damagemove(move){
    whoismoving('friend')
    ahp -= move.dmg
    if (ahp <= 0) ahp = 0
    updateahp('friend', ahp)
    updateview()
}

function updateahp(who, newhealth) {
    if (who == 'friend') rival.pokemon[0].hp = newhealth;
    else player.pokemon[0].hp= newhealth;
}

damage = ((((2 * level / 5) + 2)) * (dmg * uatk / adef)) / 50 + 2 * multiplier * crit * random

function whoismoving(who) {         // definere variabler for den som bruker movet (player eller rival)
    if (who == 'friend') {
        uname = player.pokemon[0].name
        uhp = player.pokemon[0].hp
        uatk = statstates[playeratk]
        uatkstage = playeratk
        udef = statstates[playerdef]
        udefstage = playerdef
        usatk = statstates[playersatk]
        usatkstage = playersatk
        usdef = statstates[playersdef]
        usdefstage = playersdef
        uspe = statstates[playerspe]
        uspestage = playerspe
        uacc = playeracc
        uaccstage = statstates2[playeracc]
        ueva = playereva
        uevastage = statstates2[playereva]
        
        aname = rival.pokemon[0].name
        ahp = rival.pokemon[0].hp
        aatk = statstates[rivalatk]
        aatkstage = rivalatk
        adef = statstates[rivaldef]
        adefstage = rivaldef
        asatk = statstates[rivalsatk]
        asatkstage = rivalsatk
        asdef = statstates[rivalsdef]
        asdefstage = rivalsdef
        aspe = statstates[rivalspe]
        aspestage = rivalspe
        aacc = rivalacc
        aaccstage = statstates2[rivalacc]
        aeva = rivaleva
        aevastage = statstates2[rivaleva]
    } else {
        uname = rival.pokemon[0].name
        uhp = rival.pokemon[0].hp
        uatk = statstates[rivalatk]
        uatkstage = rivalatk
        udef = statstates[rivaldef]
        udefstage = rivaldef
        usatk = statstates[rivalsatk]
        usatkstage = rivalsatk
        usdef = statstates[rivalsdef]
        usdefstage = rivalsdef
        uspe = statstates[rivalspe]
        uspestage = rivalspe
        uacc = rivalacc
        uaccstage = statstates2[rivalacc]
        ueva = rivaleva
        uevastage = statstates2[rivaleva]
        
        aname = player.pokemon[0].name
        ahp = player.pokemon[0].hp
        aatk = statstates[playeratk]
        aatkstage = playeratk
        adef = statstates[playerdef]
        adefstage = playerdef
        asatk = statstates[playersatk]
        asatkstage = playersatk
        asdef = statstates[playersdef]
        asdefstage = playersdef
        aspe = statstates[playerspe]
        aspestage = playerspe
        aacc = playeracc
        aaccstage = statstates2[playeracc]
        aeva = playereva
        aevastage = statstates2[playereva]
    }
}
