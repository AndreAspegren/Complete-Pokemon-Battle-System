async function battlemanager(moveinput, pp) {
    prelimfunctions(moveinput, pp)

    for (let i = 0; i < 2; i++) {
        checkacc(mon[i], i)
        whoismoving(who[i], i)
        await moveevents(i)
        updateview()
        await delay(2000)
    }
    setspeed()
    await endofrounddamage()
    await newpokemon()

    battlemessage = p1.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du tapte!' : p2.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du vant!' : ''
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
    if (skipchoice) {
        console.log('hei')
        battlemanager()
    } 
    await multiturnevents()
}

async function multiturnevents(){
    roundcounter++
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

async function hazards(who) {      
    let what = who == p1.pokemon[0] ? [player.spk, player.tspk, player.strk, player.stwb, player] : [rival.spk, rival.tspk, rival.strk, rival.stwb, rival]
    let damage = [[1 / 8, 1 / 6, 1 / 4], ['psn', 'tox'], [(1 / 8) * types[12][who.type1] * types[12][who.type2]]]


    for (let i = 0; i < 4; i++) {
        if (what[i] > 0 && who.hp != 0) {
            if (i == 1) updatestats(who == p1.pokemon[0] ? 'friend' : 'foe', damage[i][what[i] - 1])
            if (i == 0 || i == 2) {
                effect = Math.round((who.maxhp * damage[i][what[i] - 1]))
                who.hp -= effect < 1 ? effect = 1 : effect
                if (who.hp < 0) who.hp = 0
            }
            hazardsdmgmsg(i, who)
            if (who.hp == 0) await deathdisplay(i)
            updateview()
            await delay(2000)
            if (i == 3 && whostat[0].spe > 0) {
                statmsg('spe', -1, who.name)
                whostat[4].spe--
                await playsound('statdown')
                updateview()
                await delay(2000)  
            }
        }
    }
}

async function prelimfunctions(moveinput, pp) {
    buttonsenabled = false
    p1.pokemon[0].pp[pp]--
    if (!skipchoice) p1move = moveinput != 'switch' ? moves[moveinput] : moveinput
    else p1move = 'skipchoice'
    p2move = moves[p2.pokemon[0].move[randommove()]]
    p1movehistory.push(JSON.parse(JSON.stringify(p1move)))
    p2movehistory.push(JSON.parse(JSON.stringify(p2move)))
    setspeed('round')
    if (p1move == 'switch') await hazards(p1.pokemon[0])
}

