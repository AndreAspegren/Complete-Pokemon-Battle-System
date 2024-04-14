async function battlemanager(moveinput, enemymove, pp) {
    prelimfunctions(moveinput, enemymove, pp)

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

    await multiturnevents()
    battlemessage = p1.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du tapte!' : p2.pokemon.every(pokemon => pokemon.hp === 0) ? 'Du vant!' : ''
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
    await multiturndmgmoves()
}

async function multiturnevents(){
    if (global.trickroom) {
        if (global.trickroom == 6) {
            battlemessage = 'Dimensjonene gikk tilbake til normalt!'
            global.trickroom = 0
            updateview()
            await delay(2000)
        } else global.trickroom ++
    }
}

async function multiturndmgmoves() {
    flexmoves = [JSON.parse(JSON.stringify(p2move)), JSON.parse(JSON.stringify(p1move))]
    for (let i = 0; i < 2; i++) {
        if (flexmoves[i].turn2) i == 0 ? p2nextmove = flexmoves[i].turn2 : battlemanager(flexmoves[i].turn2, randommove())
    }
}

async function endofrounddamage() {      // brn, psn, tox, sandstorm
    let what = ['brn', 'brn', 'psn', 'psn', 'tox', 'tox', weather.weather, weather.weather]

    for (let i = 0; i < 8; i++) {
        let n = i % 2 == 0 ? 0 : 1
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
            resetstats(stats[i], mon[i])
            trainer[i] == p1 ? (deadp1 = null, await changepokemon()) : (deadp2 = null, newpokemonout = p2.pokemon.splice(indexcheck(), 1)[0], p2.pokemon.unshift(newpokemonout))
            setspeed()
            if (who[i] == 'friend') assignpp()
            battlemessage = trainer[i].name + ' sendte ut ' + mon[i].name + '!'
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
            if (i == 3 && whostat[4].spe > 0) {
                statmsg('spe', -1, who.name)
                updatestats(what[4] == player ? 'friend' : 'foe', 'spe', whostat[4].spe--)
                await playsound('statdown')
                updateview()
                await delay(2000)
            }
        }
    }
}

async function prelimfunctions(moveinput, enemymove, pp) {
    buttonsenabled = false
    if (moves[pp] && moves[pp].pp) p1.pokemon[0].pp[pp]--
    p1move = !Number.isInteger(moveinput) ? moveinput : moveinput != 'switch' ? moves[moveinput] : moveinput
    p2move = p2nextmove || moves[p2.pokemon[0].move[enemymove]]; p2nextmove = null
    p1movehistory.push(JSON.parse(JSON.stringify(p1move)))
    p2movehistory.push(JSON.parse(JSON.stringify(p2move)))
    setspeed('round')
    if (p1move == 'switch') await hazards(p1.pokemon[0])
}

