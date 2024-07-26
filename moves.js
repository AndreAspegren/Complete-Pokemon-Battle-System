async function damage() {
    await playsound()
    hp[1] -= dmgcalc()
    effectivenessmsg()
    await updatestats(who[1], 'hp', hp[1])

    if (checkacc2() && move[0].effect2) {
        updateview()
        await delay(1000)
        await window[move[0].effect2]()
    }
}

async function flinch() {
    if (turn = 0 && mon[1].hp > 0) protected = 'flinch'
}

async function acrobatics() {
    let dmg = 55
    if (!mon[0].item) dmg = 110
    else if (mon[0].item.name == 'Flying Gem') {
        dmg = 143
        updatestats(mon[0], 'item', null)
    }
    move[0]['dmg'] = dmg
    await damage()
}

async function trapped() {
    battlemessage = monname[1] + ' kan ikke flykte!'
    cantflee = true
}

async function autotomize() {
    if (mon[0].weight > 0.1) {
        mon[0].weight -= 100
        battlemessage = monname[0] + ' ble lettere!'
    }
    await stat()
}

async function auroraveil() {
    if (weather.weaher == 'snow' && !stats[1].auveil) {
        updatestats(who[0], 'auveil', 5)
        screenmsg()
    } else failed()
}

async function screen() {
    if (!stats[1][move[0].screentype]) {
        updatestats(who[0], move[0].screentype, 5)
        screenmsg()
    }
    if (move[0].movetype != 'screen') return
    else failed()
}

async function healallstatus() {
    team[0].map((p, i) => {
        if (i != 0) p.status = ''
    })
    battlemessage = trainer[0] + ' sitt lag ble helbredet fra statusforhold!'
}

async function infatuation() {
    if ((mon[0].sex == 'male' && mon[1].sex == 'female' || mon[0].sex == 'female' && mon[1].sex == 'male') && mon[1].hp > 0 && !invul[1] && !stats[1].inlove) {
        battlemessage = monname[1] + ' ble forelsket i ' + monname[0] + '!'
        updatestats(mon[1], 'inlove', true)
        console.log(stats[1].inlove)
    } else failed()
}

async function acupressure() {
    let stats = ['atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva']
    let chosenstat = Math.floor(Math.random() * stats.length)
    if (stats.every(chosenstat => stats[0][chosenstat] > 11)) failed()
    while (stats[0][stat] > 11) chosenstat = Math.floor(Math.random() * stats.length)
    move[0].effecttype = [stats[chosenstat]]
    await stat()
}

async function alluringvoice() {
    if (movehistory[1][movehistory.length - 1]['statboosted']) if (movehistory[1][movehistory.length - 1]['statboosted'] == true) {
        confuse()
    }
}

async function damagewithrecoil() {
    await playsound()
    let currenthp = hp[1]
    hp[1] -= dmgcalc()
    if (hp[1] < 0) hp[1] = 0
    effectivenessmsg()
    await updatestats(who[1], 'hp', hp[1])
    if (hp[0] > 0 && (currenthp - hp[1]) * move[0].effect > 1) {
        let recoil = (currenthp - hp[1]) * move[0].effect
        await updatestats(who[0], 'hp', recoil)
        battlemessage = monname[0] + ' tok ' + recoil + ' i recoil damage!'
    }
}

async function afteryou() {
    battlemessage = monname[1] + ' tok det snille tilbudet!'
    queue[1].push(
        {
            round: 1,
            timeinround: 0,
            id: mon[1].id,
            function: function () {
                if (this.id === mon[0].id) {
                    movehistory[0][movehistory[0].length - 1].priority = 5
                } else if (this.id === mon[1].id) {
                    movehistory[1][movehistory[1].length - 1].priority = 5
                }
            }
        }
    )
}

async function dmgheal() {
    await playsound()
    let currenthp = hp[1]
    hp[1] -= dmgcalc()
    if (hp[1] < 0) hp[1] = 0
    effectivenessmsg()
    await updatestats(who[1], 'hp', hp[1])

    if (hp[0] != maxhp[0]) {
        updateview()
        await delay(1000)
        updatestats(mon[0], 'hp', (currenthp - hp[0]) * move[0].value)
        battlemessage = monname[1] + ' hadde sin energi tappet!'
    }
}

async function heal() {
    await playsound()
    currenthp = hp[0]
    if (move[0].healtype == '%') hp[0] += maxhp[0] * move[0].heal
    if (move[0].healtype == 'flat') hp[0] += move[0].heal
    if (hp[0] > maxhp[0]) hp[0] = maxhp[0]
    battlemessage = monname[0] + ' healet ' + (hp[0] - currenthp) + ' hp!'
    await updatestats(who[0], 'hp', hp[0])
}

async function sethazard() {
    max = { spk: 3, tspk: 2, strk: 1, stwb: 1 }
    if (stats[1][move[0].effect] < max[move[0].effect]) {
        stats[1][move[0].effect] += 1
        hazardmsg(who[1] == 'p1' ? p1.name : p2.name, move[0].effect)
    }
    else battlemessage = 'Men det feilet!'
}

async function confuse() {
    if (!stats[1].cnf) {
        updatestats(who[1], 'cnf', 1)
        battlemessage = monname[1] + ' ble forvirret!'
    }
    else battlemessage = monname[1] + ' er allerede forvirret!'
}

async function suicide() {
    await delay(2000)
    updatestats(who[0], 'hp', 0)
    battlemessage = monname[0] + ' døde!'
    updateview()
    await delay(2000)
}

async function bellydrum() {
    await updatestats(who[0], 'hp', hp[0] -= hp[0].maxhp / 2)
    if (hp[0] >= 0) {
        battlemessage = monname[0] + ' mistet halvparten av livet sitt!'
        updateview()
        await delay(1200)
        if (stats[0].atk != 12) await playsound('statup')
        updatestats(who[0], 'atk', 12)
        statmsg(monname[0], 'atk', 3)
    }
}

async function protect() {
    let ithit = checkprotect()
    if (((move[1].dmg || move[1].effect == true || [move[1].who].includes('you'))) && ithit) protected = 'protected'
    if (ithit) playsound()
    else battlemessage = 'Men det feilet'
}

async function bestow() {
    if (mon[0]?.item && !mon[1]?.item) {
        mon[1].item = mon[0].item
        mon[1].item?.cd = false
        mon[0].item = null
        battlemessage = monname[0] + ' ga itemet sitt til ' + monname[1] + '!'
    }
    else failed()
}

async function multidmg() {
    let count = 0
    let random = Math.random()
    let hits = random < 3 / 8 ? 2 : random < 6 / 8 ? 3 : random < 7 / 8 ? 4 : 5
    for (let i = 0; i < hits; i++) {
        count++
        await playsound()
        hp[1] -= dmgcalc()
        if (hp[1] < 0) hp[1] = 0
        await updatestats(who[1], 'hp', hp[1])
        updateview()
        await delay(2000)
        if (hp[1] == 0) break
    }
    if (types[move[0].type][type1[0]] * types[move[0].type][type2[0]] != 1) {
        effectivenessmsg()
        updateview()
        await delay(2000)
    }
    battlemessage = 'Det traff ' + count + (count == 1 ? ' gang!' : ' ganger!')
}

async function confused() {
    battlemessage = monname[0] + ' er forvirret!'
    updateview()
    await delay(2000)
    if (stats[0].cnf == 4 || Math.random() < 1 / 3) {
        battlemessage = monname[0] + ' kom seg ut av det!'
        updatestats(who[0], 'cnf', false)
    } else {
        if (Math.random() < 1 / 3) {
            endturn = true
            await playsound()
            hp[0] -= Math.round(((((2 * 10 / 5) + 2)) * (40 * (atk[0] / def[0])) / 12 + 2) * (pstatus[0] == 'brn' ? 0.5 : 1))
            if (hp[0] < 0) hp[0] = 0
            updatestats(who[0], 'hp', hp[0])
            battlemessage = 'Den skadet seg selv i sin forvirring!'
            updatestats(who[0], 'cnf', stats[0].cnf + 1)
        }
    }
    updateview()
    await delay(2000)
}

async function trickroom() {
    global.trickroom = 1,
        battlemessage = monname[0] + ' vridde dimensjonene!'
}

async function losehpifmiss() {
    if (!move[0].hit) {
        battlemessage = monname[0] + ' bommet og krashet i en vegg!'
        updatestats(who[0], 'hp', hp[0] * move[0].hploss)
    }
    else damage()
}

async function avalanche() {
    if (turn == 1 && move[1].dmg && movehistory[1][movehistory[1].length - 1].hit) {
        move[0].dmg *= 2
        damage()
    }
    else damage()
}

async function banefulbunker() {
    await protect()
    if (protected == 'protected') {
        queue[0].push({
            round: 0,
            timeinround: 1,
            id: mon[1].id,
            function: function () {
                if (mon[0].id == this.id && mon[0].status == '') {
                    statusmsg(monname[0], 'psn')
                    updatestats(who[0], 'status', 'psn')
                }
            }
        })
    }
}

async function barbbarrage() {
    if (mon[1].status == 'psn' || mon[1].status == 'tox') {
        move[0].dmg *= 2
        damage()
    }
    else damage()
}

async function status() {
    if (!pstatus[1]) {
        await playsound()
        statusmsg(monname[1], move[0].statustype)
        updatestats(who[1], move[0].movetype, move[0].statustype)
    }
    else battlemessage = monname[1] + ' har allerede en statustilstand!'
}

async function beatup() {
    let dmgmons = [mon[0].atk / 10 + 5]
    team[0].forEach((p, i) => { if (!p.status && p.hp != 0 && i != 0) dmgmons.push(mon[i].atk / 10 + 5) })

    for (let dmg of dmgmons) {
        await playsound()
        move[0].dmg = dmg
        hp[1] -= dmgcalc()
        if (hp[1] < 0) hp[1] = 0
        await updatestats(who[1], 'hp', hp[1])
        if (hp[1] == 0) break
    }

    effectivenessmsg()
    battlemessage = 'Det traff' + dmgmons.length + ' ganger!'
}

async function behemoth() {
    if (stats[0].dynamax) move[0].dmg *= 2
    await damage()
}

async function belch() {
    if (mon[0]?.eatenberry) await damage()
    else await failed()
}

async function switchuser() {
    updateview()
    await delay(1500)
    if (trainer[0].pokemon.slice(1).some(p => p.hp > 0)) {
        if (who[0] == 'p1') {
            await changepokemon('switchmove')
            assignpp()
        }
        else {
            const index = p2.pokemon.findIndex(p => p.hp > 0)
            const [pokemon] = p2.pokemon.splice(index, 1)
            p2.pokemon.unshift(pokemon)
        }
    }
}

async function statusheal() {
    if (pstatus[0]) {
        await playsound()
        battlemessage = monname[0] + ' ble ' + move.statustype
        updatestats(who[0], move[0].statustype, move[0].effect)
    }
    else battlemessage = monname[0] + ' har ikke en statustilstand!'
}

async function weatherchange() {
    playsound()
    weather.weather = move.weather
    weather.image = weather.images[move[0].weather]
    weathermsg()
}

async function stat(who, what, value) {  // endre stats
    if (!who) { // hvis det er et move
        for (let i = 0; i < move[0].effect.length; i++) {
            let target = mon[0] == p1.pokemon[0] && move[0].who[i] == 'me' || mon[0] == p2.pokemon[0] && move[0].who[i] == 'you' ? player : rival
            let name = target == player ? p1.pokemon[0].name : p2.pokemon[0].name
            let person = target == player ? 'p1' : 'p2'
            let currentstat = target[move[0].effecttype[i]]
            let newtempstat = currentstat + move[0].effect[i]
            let newstat = newtempstat > 12 ? 12 : newtempstat < 0 ? 0 : newtempstat

            if (currentstat >= 12 && move[0].effect[i] > 0 || currentstat <= 0 && move[0].effect[i] < 0) { // hvis stat ikke kan endres mer
                if (move[0].movetype != 'stat') continue
                statmsg(name, move[0].effecttype[i], move[0].effect[i] > 0 ? 0 : -4)
                updateview()
                await delay(1100)
                continue
            }

            if (move[0].effect[i] < 0 && i == 0) await playsound('statdown')
            if (move[0].effect[i] > 0 && i == 0) await playsound('statup')
            else if (move[0].effect[i] > 0 && i > 0) if (move[0].effect[i - 1] < 0) await playsound('statup')

            statmsg(name, move[0].effecttype[i], newstat - currentstat)
            updatestats(person, move[0].effecttype[i], newstat)
            updateview()
            await delay(1100)
        }
    }
    else for (let i = 0; i < what.length; i++) { // hvis det er noe annet enn et move
        let target = mon[0] == p1.pokemon[0] && who[i] == 'me' || mon[0] == p2.pokemon[0] && who[i] == 'you' ? player : rival
        let name = target == player ? p1.pokemon[0].name : p2.pokemon[0].name
        let person = target == player ? 'p1' : 'p2'
        let currentstat = target[what[i]]
        let newtempstat = currentstat + value[i]
        let newstat = newtempstat > 12 ? 12 : newtempstat < 0 ? 0 : newtempstat

        if (currentstat >= 12 && value[i] > 0 || currentstat <= 0 && value[i] < 0) continue

        if (value[i] < 0 && i == 0) await playsound('statdown')
        if (value[i] > 0 && i == 0) await playsound('statup')
        else if (value[i] > 0 && i > 0) if (value[i - 1] < 0) await playsound('statup')

        statmsg(name, what[i], newstat - currentstat)
        updatestats(person, what[i], newstat)
        updateview()
        await delay(1100)
    }
}

async function updatestats(who, what, value, what2) {
    let mon = who == 'p1' ? p1.pokemon[0] : p2.pokemon[0]
    let stat = who == 'p1' ? player : rival

    if (what == 'hp') {
        if (value < 0) value = 0
        if (mon.hp == mon.maxhp && value === 0 && mon.item?.effect === 'fullhpdmgsurvival' && mon.item?.cd === false) return await window[mon.item.name.toLowerCase().replace(/ /g, '')]()
        if (mon.hp == mon.maxhp && value === 0 && mon.ability.effect === 'fullhpdmgsurvival' && mon.ability.cd === false) return await window[mon.ability.name.toLowerCase().replace(/ /g, '')]()
        mon.hp = value
        if (mon.hp == 0) await deathdisplay(mon)
    }
    else if (['atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva', 'cnf', 'inlove', 'auveil', 'reflect', 'lscreen'].includes(what)) {
        stat[what] = value
        if (movehistory[0].length > 0) movehistory[0][movehistory[0].length - 1]['statboosted'] = stat[what] < value
    }
    else if (what == 'status') {
        mon.status = value
        if (value == false) stat['txc'] = 1
    }
    else what2 ? mon[what][what2] = value : mon[what] = value
}
