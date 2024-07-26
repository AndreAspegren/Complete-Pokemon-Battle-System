async function battlemanager(playermove, enemymove) {
    prelimfunctions(playermove, enemymove)
    for (let i = 0; i < 2; i++) {
        await setturn(i, 'turn')
        await moveevents(i)
        updateview()
        await delay(2000)
    }
    await checkqueue(1)
    await endofrounddamage()
    await newpokemon()
    await onentry()
    if (checkend()) await multiturndmgmoves()
    await endofroundevents()
}

async function updatetrickroom() {
    if (global.trickroom) {
        if (global.trickroom == 6) {
            battlemessage = 'Dimensjonene gikk tilbake til normalt!'
            global.trickroom = 0
            updateview()
            await delay(2000)
        } else global.trickroom++
    }
}

async function checkqueue(turninround) {
    for (let i = 0; i < 2; i++) {
        if (queue.length > 0) queue[i].forEach(async (action, index) => {
            if (action.round == 0 && action.timeinround == turninround) {
                await action.function()
                queue[i].splice(index, 1)
                updateview()
                await delay(2000)
            }
        })
    }
}

async function endofroundevents() {
    turncounter++
    for (let i = 0; i < 2; i++) queue[i].forEach(p => p.round--)
    await updatescreens()
    await updatetrickroom()
}

async function onentry() {
    for (let i = 0; i < 2; i++) {
        setturn(i)
        if (mon[0].ability.trigger == 'onentry' && !mon[0].ability.cd) await window[mon[0].ability.name.toLowerCase().replace(/ /g, '')]()
    }
}

async function multiturndmgmoves() {
    let arr = [p2move, p1move]
    for (let i = 0; i < 2; i++) {
        if (arr[i].turn2) i == 0 ? p2nextmove = p2move.turn2 : decideround(p1move.turn2, setenemymove())
    }
}

async function endofrounddamage() {      // brn, psn, tox, sandstorm
    let what = ['brn', 'brn', 'psn', 'psn', 'tox', 'tox', weather.weather, weather.weather]

    for (let i = 0; i < 8; i++) {
        setturn(i)
        value = what[i] == 'brn' ? 0.125 : 0.0625
        if ((pstatus[0] == what[i] && mon[0].hp > 0 && i < 6) || (what[i] == 'sandstorm' && ![8, 12, 16].includes(mon[0].type1) &&
            ![8, 12, 16].includes(mon[0].type2) && mon[0].hp > 0)) {
            effect = Math.round((mon[0].maxhp * (what[i] == 'tox' ? value * stats[0].txc : value)))
            mon[0].hp -= effect < 1 ? effect = 1 : effect
            if (mon[0].hp < 0) mon[0].hp = 0
            if (what == 'tox') stats[0].toxcounter++
            endofroundmsg(mon[0], what[i])
            updateview()
            await delay(2000)
            await updatestats(mon[0], 'hp', mon[0].hp)
        }
    }
}

async function newpokemon() {
    setturn(0)
    for (let i = 0; i < 2; i++) {
        if (mon[i].hp == 0 && !trainer[i].pokemon.every(p => p.hp == 0)) {
            resetstats(stats[i], mon[i])
            who[i] == 'p1' ? (cantflee = false, deadp1 = null, await changepokemon()) : (deadp2 = null, newpokemonout = p2.pokemon.splice(indexcheck(), 1)[0], p2.pokemon.unshift(newpokemonout))
            setturn(i, 'newpokemon')
            if (who[0] == 'p1') assignpp()
            battlemessage = trainer[0].name + ' sendte ut ' + monname[0] + '!'
            updateview()
            await delay(2000)
            await hazards(mon[0], who[0])
        }
    }
}

async function hazards(mon, who) {
    let what = who == 'p1' ? [player.spk, player.tspk, player.strk, player.stwb, player] : [rival.spk, rival.tspk, rival.strk, rival.stwb, rival]
    let damage = [[1 / 8, 1 / 6, 1 / 4], ['psn', 'tox'], [(1 / 8) * types[12][who.type1] * types[12][who.type2]]]

    for (let i = 0; i < 4; i++) {
        if (what[i] > 0 && mon.hp != 0) {
            if (i == 1) updatestats(who, 'status', damage[i][what[i] - 1]) // tspk
            if (i == 0 || i == 2) {                                         // spk, strk
                effect = Math.round((mon.maxhp * damage[i][what[i] - 1]))
                mon.hp -= effect < 1 ? effect = 1 : effect
                if (mon.hp < 0) mon.hp = 0
                hazarddmgmsg(mon.name, i)
                updateview()
                await delay(2000)
                updatestats(who, 'hp', mon.hp)
            }
            hazarddmgmsg(mon.name, i)
            updateview()
            await delay(2000)
            if (i == 3 && what[4].spe > 0) {        // stwb
                statmsg(mon.name, 'spe', -1)
                updatestats(who, 'spe', what[4].spe--)
                await playsound('statdown')
                updateview()
                await delay(2000)
            }
        }
    }
}

async function prelimfunctions(playermove, enemymove) {      
    buttonsenabled = false
    if (playermove != 'struggle') p1.pokemon[0].pp[playermove]--
    if (enemymove != 'struggle') p2.pokemon[0].pp[enemymove]--
    p1move = !Number.isInteger(playermove) ? playermove : playermove != 'switch' ? JSON.parse(JSON.stringify(moves[p1.pokemon[0].move[playermove]])) : playermove
    p2move = p2nextmove || JSON.parse(JSON.stringify(moves[p2.pokemon[0].move[enemymove]])); p2nextmove = null
    p1movehistory.push(p1move)
    p2movehistory.push(p2move)
    if (p1move == 'switch') await hazards(p1.pokemon[0])
    if (turncounter == 0) await onentry()
}

function checkend() {
    battlemessage = p1.pokemon.every(p => p.hp === 0) ? 'Du tapte!' : p2.pokemon.every(p => p.hp === 0) ? 'Du vant!' : ''
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
    if (battlemessage != '') return gameon = false
    return gameon = true
}
