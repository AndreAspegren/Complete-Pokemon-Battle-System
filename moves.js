function damage(move, move2, randomacc) {
    if (move.acc * uacc >= randomacc && !upar || move.acc * uacc * 0.75 >= randomacc && upar || move.acc == 0) {
        currenthp = ohp
        ohp -= move.dmg
        if (ohp < 0) ohp = 0
        battlemessage = 'Det gjorde ' + (currenthp - ohp) + ' damage!'
        updatestats(you, 'hp', ohp)
        if (move.effect2 && move.acc2 >= randomacc) eval(move.effect2 + '(move, move2, randomacc)')
        else setTimeout(() => (moveannouncement(move, move2)), 2000)
} else {
    battlemessage = uname + ' bommet!'
    setTimeout(() => (moveannouncement(move, move2)), 2000)
} 
updateview()
}

// damage = ((((2 * level / 5) + 2)) * (dmg * uatk / adef)) / 50 + 2 * multiplier * crit * random
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
    } else {
        battlemessage = uname + ' bommet!'
    } 
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
            if (what == 'tox' && !value) stattarget['toxcounter'] = 1
            stattarget.statusimage = value ? statusimages[what] : ''
        }
        else {
            stattarget['brn'] = value
            stattarget['par'] = value
            stattarget['psn'] = value
            stattarget['tox'] = value
            stattarget['toxcounter'] = 1
            stattarget['slp'] = value
            stattarget['frz'] = value
            stattarget.status = value
            stattarget.statusimage = '' 
        }
    }
}


function whoismoving(who) {
    if (who === 'friend') {

        me = 'friend';
        uname = player1.pokemon[0].name;
        uhp = player1.pokemon[0].hp;
        umaxhp = player1.pokemon[0].maxhp;
        uatk = statstates[player.atk];
        uatkstat = player1.pokemon[0].atk;
        uatkstage = player.atk;
        udef = statstates[player.def];
        udefstat = player1.pokemon[0].def;
        udefstage = player.def;
        usatk = statstates[player.satk];
        usatkstat = player1.pokemon[0].satk;
        usatkstage = player.satk;
        usdef = statstates[player.sdef];
        usdefstat = player1.pokemon[0].sdef;
        usdefstage = player.sdef;
        uspe = statstates[player.spe];
        uspestat = player1.pokemon[0].spe;
        uspestage = player.spe;
        uacc = statstates2[player.acc];
        uaccstat = player.acc;
        uaccstage = player.acc;
        ueva = statstates2[player.eva];
        uevastat = player.eva; 
        uevastage = player.eva;
        ustatus = player.status;
        utype1 = player1.pokemon[0].type1;
        utype2 = player1.pokemon[0].type2;

        you = 'foe';
        oname = player2.pokemon[0].name;
        ohp = player2.pokemon[0].hp;
        omaxhp = player2.pokemon[0].maxhp;
        oatk = statstates[rival.atk];
        oatkstat = player2.pokemon[0].atk;
        oatkstage = rival.atk;
        odef = statstates[rival.def];
        odefstat = player2.pokemon[0].def;
        odefstage = rival.def;
        osatk = statstates[rival.satk];
        osatkstat = player2.pokemon[0].satk;
        osatkstage = rival.satk;
        osdef = statstates[rival.sdef];
        osdefstat = player2.pokemon[0].sdef;
        osdefstage = rival.sdef;
        ospe = statstates[rival.spe];
        ospestat = player2.pokemon[0].spe;
        ospestage = rival.spe;
        oacc = statstates2[rival.acc];
        oaccstat = rival.acc; 
        oaccstage = rival.acc;
        oeva = statstates2[rival.eva];
        oevastat = rival.eva; 
        oevastage = rival.eva;
        ostatus = rival.status;
        otype1 = player2.pokemon[0].type1;
        otype2 = player2.pokemon[0].type2;
    } else {
        me = 'foe';
        uname = player2.pokemon[0].name;
        uhp = player2.pokemon[0].hp;
        umaxhp = player2.pokemon[0].maxhp;
        uatk = statstates[rival.atk];
        uatkstat = player2.pokemon[0].atk;
        uatkstage = rival.atk;
        udef = statstates[rival.def];
        udefstat = player2.pokemon[0].def;
        udefstage = rival.def;
        usatk = statstates[rival.satk];
        usatkstat = player2.pokemon[0].satk;
        usatkstage = rival.satk;
        usdef = statstates[rival.sdef];
        usdefstat = player2.pokemon[0].sdef;
        usdefstage = rival.sdef;
        uspe = statstates[rival.spe];
        uspestat = player2.pokemon[0].spe;
        uspestage = rival.spe;
        uacc = statstates2[rival.acc];
        uaccstage = player.acc;
        ueva = statstates2[rival.eva];
        uevastage = rival.eva;
        ustatus = rival.status;
        utype1 = player2.pokemon[0].type1;
        utype2 = player2.pokemon[0].type2;

       
        you = 'friend';
        oname = player1.pokemon[0].name;
        ohp = player1.pokemon[0].hp;
        omaxhp = player1.pokemon[0].maxhp;
        oatk = statstates[player.atk];
        oatkstat = player1.pokemon[0].atk;
        oatkstage = player.atk;
        odef = statstates[player.def];
        odefstat = player1.pokemon[0].def;
        odefstage = player.def;
        osatk = statstates[rival.satk];
        osatkstat = player1.pokemon[0].satk;
        osatkstage = player.satk;
        osdef = statstates[player.sdef];
        osdefstat = player1.pokemon[0].sdef;
        osdefstage = player.sdef;
        ospe = statstates[player.spe];
        ospestat = player1.pokemon[0].spe;
        ospestage = player.spe;
        oacc = statstates2[player.acc];
        oaccstat = player.acc;
        oaccstage = player.acc;
        oeva = statstates2[player.eva];
        oevastat = player.eva; y
        oevastage = player.eva;
        ostatus = player.status;
        otype1 = player1.pokemon[0].type1;
        otype2 = player1.pokemon[0].type2;
    }
}

