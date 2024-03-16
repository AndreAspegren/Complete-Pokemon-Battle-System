function updatestats(who, what, value) {                                       
    let target = (who === 'friend') ? player1.pokemon[0] : player2.pokemon[0]   
    let stattarget = (who === 'friend') ? player : rival
    if (what === 'hp') {
        target.hp = value
    } else if (['atk', 'def', 'satk', 'sdef', 'spe', 'acc', 'eva'].includes(what)) stattarget[what] = value
    else {
        if (what != 'allstatus'){
            stattarget[what] = value
            stattarget.statusimage = value ? statusimages[what] : ''
        }
        else {
            stattarget['brn'] = value
            stattarget['par'] = value
            stattarget['psn'] = value
            stattarget['tox'] = value
            stattarget['slp'] = value
            stattarget['frz'] = value
            stattarget.statusimage = '' 
        }
        stattarget.status = value
        if (what == 'tox' && !value) stattarget['toxcounter'] = 1
    }
}

function whoismoving(who) {
    if (who === 'friend') {
        me = 'friend'
        uname = player1.pokemon[0].name
        uhp = player1.pokemon[0].hp
        umaxhp = player1.pokemon[0].maxhp
        uatk = statstates[player.atk]
        uatkstat = player1.pokemon[0].atk
        uatkstage = player.atk
        udef = statstates[player.def]
        udefstat = player1.pokemon[0].def
        udefstage = player.def
        usatk = statstates[player.satk]
        usatkstat = player1.pokemon[0].satk
        usatkstage = player.satk
        usdef = statstates[player.sdef]
        usdefstat = player1.pokemon[0].sdef
        usdefstage = player.sdef
        uspe = statstates[player.spe]
        uspestat = player1.pokemon[0].spe
        uspestage = player.spe
        uacc = statstates2[player.acc]
        uaccstage = player.acc
        ueva = statstates2[player.eva]
        uevastage = player.eva
        ustatus = player.status
        utype1 = player1.pokemon[0].type1
        utype2 = player1.pokemon[0].type2
        upar = player.par

        you = 'foe';
        oname = player2.pokemon[0].name
        ohp = player2.pokemon[0].hp
        omaxhp = player2.pokemon[0].maxhp
        oatk = statstates[rival.atk]
        oatkstat = player2.pokemon[0].atk
        oatkstage = rival.atk
        odef = statstates[rival.def]
        odefstat = player2.pokemon[0].def
        odefstage = rival.def
        osatk = statstates[rival.satk]
        osatkstat = player2.pokemon[0].satk
        osatkstage = rival.satk
        osdef = statstates[rival.sdef]
        osdefstat = player2.pokemon[0].sdef
        osdefstage = rival.sdef
        ospe = statstates[rival.spe]
        ospestat = player2.pokemon[0].spe
        ospestage = rival.spe
        oacc = statstates2[rival.acc]
        oaccstage = rival.acc
        oeva = statstates2[rival.eva]
        oevastage = rival.eva
        ostatus = rival.status
        otype1 = player2.pokemon[0].type1
        otype2 = player2.pokemon[0].type2
    } else {
        me = 'foe'
        uname = player2.pokemon[0].name
        uhp = player2.pokemon[0].hp
        umaxhp = player2.pokemon[0].maxhp
        uatk = statstates[rival.atk]
        uatkstat = player2.pokemon[0].atk
        uatkstage = rival.atk
        udef = statstates[rival.def]
        udefstat = player2.pokemon[0].def
        udefstage = rival.def
        usatk = statstates[rival.satk]
        usatkstat = player2.pokemon[0].satk
        usatkstage = rival.satk
        usdef = statstates[rival.sdef]
        usdefstat = player2.pokemon[0].sdef
        usdefstage = rival.sdef
        uspe = statstates[rival.spe]
        uspestat = player2.pokemon[0].spe
        uspestage = rival.spe
        uacc = statstates2[rival.acc]
        uaccstage = player.acc
        ueva = statstates2[rival.eva]
        uevastage = rival.eva
        ustatus = rival.status
        utype1 = player2.pokemon[0].type1
        utype2 = player2.pokemon[0].type2
        upar = rival.par

        you = 'friend';
        oname = player1.pokemon[0].name
        ohp = player1.pokemon[0].hp
        omaxhp = player1.pokemon[0].maxhp
        oatk = statstates[player.atk]
        oatkstat = player1.pokemon[0].atk
        oatkstage = player.atk
        odef = statstates[player.def]
        odefstat = player1.pokemon[0].def
        odefstage = player.def
        osatk = statstates[player.satk]
        osatkstat = player1.pokemon[0].satk
        osatkstage = player.satk
        osdef = statstates[player.sdef]
        osdefstat = player1.pokemon[0].sdef
        osdefstage = player.sdef
        ospe = statstates[player.spe]
        ospestat = player1.pokemon[0].spe
        ospestage = player.spe
        oacc = statstates2[player.acc]
        oaccstage = player.acc
        oeva = statstates2[player.eva]
        oevastage = player.eva
        ostatus = player.status
        otype1 = player1.pokemon[0].type1
        otype2 = player1.pokemon[0].type2
    }
}

