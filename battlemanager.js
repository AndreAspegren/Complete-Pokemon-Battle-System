async function battlemanager(moveinput, pp) {
    prelimfunctions(moveinput, pp)

    for (let i = 0; i < 2; i++) {
        checkacc(mon[i], i)
        whoismoving(who[i], i)
        await moveevents(i)
    }
    setspeed()
    await endofrounddamage()
    await newpokemon()

    battlemessage = p2.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du vant!' : p1.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du tapte!' : ''
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
}

async function endofrounddamage() {      // brn, psn, tox, sandstorm
    let what = ['brn', 'brn', 'psn', 'psn', 'tox', 'tox', weather.weather, weather.weather]

    for (let i = 0; i < 8; i++) {
        n = i % 2 == 0 ? 0 : 1
        value = what[i] == 'brn' ? 0.125 : 0.0625
        if ((monstatus[n] == what[i] && mon[n].hp > 0 && i < 6) || (what[i] == 'sandstorm' && ![8, 12, 16].includes(mon[n].type1) &&
            ![8, 12, 16].includes(mon[n].type2) && mon[n].hp > 0)) {
            effect = Math.round((mon[n].maxhp * (what[i] == 'tox' ? value * stats[n].txc : value)))
            mon[n].hp -= effect < 1 ? effect = 1 : effect
            if (mon[n].hp < 0) mon[n].hp = 0
            if (what == 'tox') stats[n].toxcounter++
            endofroundmsg(what[i], mon[n])
            if (mon[n].hp == 0) await deathdisplay(i)
            updateview()
            await delay(2000)
        }
    }
}

async function newpokemon() {
    for (let i = 0; i < 2; i++) {
        if (mon[i].hp == 0 && !trainer[i].pokemon.every(pokemon => pokemon.hp == 0) &&
            (((trainer[i] == p1 ? p1faster : !p1faster) && i == 0) || ((trainer[i] == p1 ? !p1faster : p1faster) && i == 1))) {
            trainer[i] == p1 ? (deadp1 = null, await changepokemon()) : (deadp2 = null, newpokemonout = p2.pokemon.splice(indexcheck(), 1)[0], p2.pokemon.unshift(newpokemonout))
            battlemessage = trainer[i].name + ' sendte ut ' + mon[n].name + '!'
            updateview()
            await delay(3000)
            setspeed()
            await hazards(mon[i])
        }
    }
}

async function hazards(who) {      // spikes, toxic spikes, stealth rock, sticky web (soon)
    let what = who == p1.pokemon[0] ? [player.spk, player.tspk, player.strk, player.stwb] : [rival.spk, rival.tspk, rival.strk, rival.stwb]
    let damage = [[1/8, 1/6, 1/4], ['psn', 'tox'], [(1/8) * types[12][who.type1] * types[12][who.type2]]] 
    for (let i = 0; i < 4; i++) {
        if (what[i] && who.hp != 0) {
            if (i == 1) updatestats(who == p1.pokemon[0] ? 'friend' : 'foe', damage[i][what[i] -1])
            else {
                effect = Math.round((who.maxhp * damage[i][what[i] -1]))
                who.hp -= effect < 1 ? effect = 1 : effect
                if (who.hp < 0) who.hp = 0
            }
            hazardsdmgmsg(i, who)
            if (who.hp == 0) await deathdisplay(i)
            updateview()
            await delay(2000)
        }
    }
}

function hazardsdmgmsg(what, who){
    let hazards = {
        0: who.name + ' er skadet av pigger!',
        1: who.name + ' har blitt forgiftet!',
        2: 'Spisse steiner graver inni ' + who.name + '!',
        3: who.name + ' ble fanget i et klebrig nett!'
    }
    return battlemessage = hazards[what]
}


async function prelimfunctions(moveinput, pp) {
    buttonsenabled = false
    p1.pokemon[0].pp[pp]--
    p1move = moveinput != 'switch' ? moves[moveinput] : moveinput
    p2move = moves[p2.pokemon[0].move[randommove()]]
    p1movehistory.push(JSON.parse(JSON.stringify(p1move)))
    p2movehistory.push(JSON.parse(JSON.stringify(p2move)))
    setspeed('round')
    if (p1move == 'switch') await hazards(p1.pokemon[0]) 
}

