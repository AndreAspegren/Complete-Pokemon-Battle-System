async function battlemanager(moveinput, enemymove, pp) {
    prelimfunctions(moveinput, enemymove, pp)

    for (let i = 0; i < 2; i++) {
        setturn(i, 'moveturn')
        await moveevents(i)
        updateview()
        await delay(2000)
    }
    await endofrounddamage()
    await newpokemon()
    await multiturnevents()
    if (checkend()) await multiturndmgmoves()
}

async function multiturnevents() {
    if (global.trickroom) {
        if (global.trickroom == 6) {
            battlemessage = 'Dimensjonene gikk tilbake til normalt!'
            global.trickroom = 0
            updateview()
            await delay(2000)
        } else global.trickroom++
    }
}

async function multiturndmgmoves() {
    let arr = [p2move, p1move]
    for (let i = 0; i < 2; i++) {
        if (arr[i].turn2) i == 0 ? p2nextmove = p2move.turn2 : battlemanager(p1move.turn2, randommove())
    }
}

async function endofrounddamage() {      // brn, psn, tox, sandstorm
    let what = ['brn', 'brn', 'psn', 'psn', 'tox', 'tox', weather.weather, weather.weather]

    for (let i = 0; i < 8; i++) {
        setturn(i)
        value = what[i] == 'brn' ? 0.125 : 0.0625
        if ((pstatus[0] == what[i] && mon[0].hp > 0 && i < 6) || (what[i] == 'sandstorm' && ![8, 12, 16].includes(mon[0].type1) &&
            ![8, 12, 16].includes(mon[0].type2) && mon[0].hp > 0)) {
            effect = Math.round((mon[0].maxhp * (what[i] == 'tox' ? value * stats[n].txc : value)))
            mon[0].hp -= effect < 1 ? effect = 1 : effect
            if (mon[0].hp < 0) mon[0].hp = 0
            if (what == 'tox') stats[0].toxcounter++
            endofroundmsg(what[i], mon[0])
            updateview()
            await delay(2000)
            await updatestats(mon[0], 'hp', mon[0].hp)
        }
    }
}

async function newpokemon() {
    for (let i = 0; i < 2; i++) {
        if (mon[i].hp == 0 && !trainer[i].pokemon.every(p => p.hp == 0)) {
            resetstats(stats[i], mon[i])
            trainer[i] == p1 ? (deadp1 = null, await changepokemon()) : (deadp2 = null, newpokemonout = p2.pokemon.splice(indexcheck(), 1)[0], p2.pokemon.unshift(newpokemonout))
            if (who[i] == 'p1') assignpp()
            setturn(i)
            battlemessage = trainer[i].name + ' sendte ut ' + monname[i] + '!'
            updateview()
            await delay(3000)
            await hazards(mon[i])
        }
    }
}

async function hazards(who) {
    let what = who == p1.pokemon[0] ? [player.spk, player.tspk, player.strk, player.stwb, player] : [rival.spk, rival.tspk, rival.strk, rival.stwb, rival]
    let damage = [[1 / 8, 1 / 6, 1 / 4], ['psn', 'tox'], [(1 / 8) * types[12][who.type1] * types[12][who.type2]]]
    

    for (let i = 0; i < 4; i++) {
        if (what[i] > 0 && who.hp != 0) {
            if (i == 1) updatestats(who, damage[i][what[i] - 1])
            if (i == 0 || i == 2) {
                effect = Math.round((who.maxhp * damage[i][what[i] - 1]))
                who.hp -= effect < 1 ? effect = 1 : effect
                if (who.hp < 0) who.hp = 0
                hazarddmgmsg(i, who.name)
                updateview()
                await delay(2000)
                updatestats(who, 'hp', who.hp)
            }
            hazarddmgmsg(i, who.name)
            updateview()
            await delay(2000)
            if (i == 3 && what[4].spe > 0) {
                statmsg('spe', -1, who.name)
                updatestats(who, 'spe', what[4].spe--)
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
    p1move = !Number.isInteger(moveinput) ? moveinput : moveinput != 'switch' ? JSON.parse(JSON.stringify(moves[moveinput])) : moveinput
    p2move = p2nextmove || JSON.parse(JSON.stringify(moves[p2.pokemon[0].move[enemymove]])); p2nextmove = null
    p1movehistory.push(p1move)
    p2movehistory.push(p2move)
    if (p1move == 'switch') await hazards(p1.pokemon[0])
}

function checkend() {
    battlemessage = p1.pokemon.every(p => p.hp === 0) ? 'Du tapte!' : p2.pokemon.every(p => p.hp === 0) ? 'Du vant!' : ''
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
    if (battlemessage != '') return false
    return true
}
