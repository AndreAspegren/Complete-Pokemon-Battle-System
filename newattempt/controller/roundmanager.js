roundmanager()
async function roundmanager() {
    while (global.inturn) {
        if (p1movehistory.length < 1 || !p1movehistory[p1movehistory.length - 1]?.turn2) await new Promise(resolve => window.moved = resolve)
        await prelimfunctions()
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
        checkliveness()
        await endofroundevents()
    }
}

async function roundmanager() {
    while (global.battleon) {
        if (!actors.p1.stats.forcedmove) await new Promise(resolve => window.moved = resolve)
        else actors.p1.stats.forcedmove = false
        await checkqueue(0)
        await setmoves()
        for (let i = 0; i < 2; i++) {
            await setturn(i, 'turn')
            await moveevents(i)
            updateview()
            await delay(2000)
        }
        await checkqueue(1)
        await endofrounddamage()
        checkliveness()
    }
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
            who[i] == 'p1' ? (player.trapped = false, deadp1 = null, await seeroster()) : (deadp2 = null, newpokemonout = p2.pokemon.splice(indexcheck(), 1)[0], p2.pokemon.unshift(newpokemonout))
            setturn(i, 'newpokemon')
            if (who[0] == 'p1') assignpp()
            battlemessage = trainer[0].name + ' sendte ut ' + monname[0] + '!'
            updateview()
            await delay(2000)
            await onentry()
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

async function setmoves() {
    buttonsenabled = false
    if (player.move != 'struggle' && !p1movehistory[p1movehistory.length -1]?.turn2) p1.pokemon[0].pp[player.move]--
    if (rival.move != 'struggle' && !p2movehistory[p2movehistory.length -1]?.turn2) p2.pokemon[0].pp[rival.move]--
    p1move = p1movehistory[p1movehistory.length -1]?.turn2 ? p1movehistory[p1movehistory.length -1].turn2 : Number.isInteger(player.move) ? JSON.parse(JSON.stringify(moves[p1.pokemon[0].move[player.move]])) : player.move
    p2move = !p2movehistory[p2movehistory.length -1]?.turn2 ? JSON.parse(JSON.stringify(moves[p2.pokemon[0].move[rival.move]])) : p2movehistory[p2movehistory.length -1]?.turn2
    p1movehistory.push(p1move)
    p2movehistory.push(p2move)
}

async function setmove(i) {
    player.move = i 
    rival.move = setenemymove()
    await delay(1)
    window.moved()
}

function checkliveness() {
    let gamestate = "live"
    if (actors.p1.pokemon.every(p => p.hp === 0)) 
    battlemessage = p1.pokemon.every(p => p.hp === 0) ? 'Du tapte!' : p2.pokemon.every(p => p.hp === 0) ? 'Du vant!' : ''
    buttonsenabled = battlemessage == '' ? true : false
    updateview()
    if (battlemessage != '') return global.battleon = false
    return global.battleon = true
}

async function changeto(who, switchmove) {
    if (who != 0 && p1.pokemon[0].hp == 0) {            // død bytte
        element = p1.pokemon.splice(who, 1)[0]
        p1.pokemon.unshift(element)
        resolvechange()
    }
    else if (who != 0 && p1.pokemon[who].hp != 0) {     // levende bytte 
        battlemessage = p1.name + ' byttet ut ' + p1.pokemon[0].name + ' med ' + p1.pokemon[who].name + '!'
        buttonsenabled = false
        updateview()
        await delay(2000)
        resetstats(player, p1.pokemon[0])
        item = p1.pokemon.splice(who, 1)[0]
        p1.pokemon.unshift(item)
        updateview()
        await delay(2000)
        resolvechange()
        if (switchmove === 'undefined') {
            assignpp('p1')
            player.move = 'switch'
            rival.move = setenemymove()
            moved()
        }
    }
}

async function changepokemon(who, what, newmon) {
    let deadname = who.pokemon.name
    element = who.pokemon.splice(newmon, 1)[0]
    who.pokemon.unshift(element)
    resetstats(who.stats, who.pokemon[0])
    if (what == "alive") battlemessage = `${who.name} byttet ut ${deadname} med ${who.pokemon[0].name}!`
    else battlemessage = `${who.name} sendte ut ${who.pokemon[0].name}!`
}
