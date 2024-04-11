async function moveevents(i) {
    completed = false
    if (mon[i] == p1.pokemon[0] && move == 'switch') return        // switch out
    if (movehistory[i].length != 1) {                                     // movethencd rest    
        if (movehistory[i][movehistory[i].length - 2].effect == 'movethencd' && movehistory[i][movehistory[i].length - 2].hit == true && movehistory[i][movehistory[i].length - 2].cd != true) {
            movehistory[i][movehistory[i].length - 1]['cd'] = true
            battlemessage = uname + ' må hvile!'
            completed = true
            skipchoice = false
        }
    }
    if (mon[i].hp == 0) await deathdisplay(i, 'turn')         
    if (skipturn && mon[i].hp != 0) await turnskip(i)
    if (currentmove[i].effect == 'hidethencd') await hidethencd(i)
    if (movehistory[i].length != 1) {
        if (movehistory[i][movehistory[i].length -2].effect == 'hidethencd' && movehistory[i][movehistory[i].length -1] == 'skipchoice') await hidethencd(i)
    }
    if (!completed) {                                       // hvis ikke noe annet, så dette
        battlemessage = mon[i].name + ' brutke ' + currentmove[i].name + '!'
        updateview()
        await delay(2000)
        await window[currentmove[i].movetype]()
    }
} 

async function hidethencd(i){
    if (currentmove[i].effect == 'hidethencd'){
        thismove = currentmove[i].name.toLowerCase().split(' ').join('')
        hidemessage = {
            dig: mon[turn].name + ' gravde seg under bakken!',
            fly: mon[turn].name + ' fløy opp høyt!',
            phantomforce: mon[turn].name + ' forsvant med en gang!',
            Dive: mon[turn].name + ' stupte undervann!',
            Bounce: mon[turn].name + ' hoppet opp høyt!',
        }
        mon[i] == p1.pokemon[0] ? p1invul = thismove : p2invul = thismove
        battlemessage = hidemessage[thismove]
        completed = true
        skipchoice = true
    } else {
        battlemessage = mon[i].name + ' brutke ' + movehistory[i][movehistory[i].length -2].name + '!'
        updateview()
        mon[i] == p1.pokemon[0] ? p1invul = false : p2invul = false
        completed = true
        await delay(2000)
        await window[movehistory[i][movehistory[i].length -2].movetype]()
        skipchoice = false
    }
}

async function deathdisplay(i, turn){
    if (turn) affected = [stats[i], mon[i]]
    !turn && (i == 0 && p1faster || i == 0 && !p1faster) ? affected = [player, p1.pokemon[0]] : affected = [rival, p2.pokemon[0]]
    resetstats(affected[0])
    completed = true
    updateview()
    await delay(2000)
    battlemessage = affected[1].name + ' døde!'
    updateview()
    await delay(2000)
    turn && stats[i] == player ? deadp1 = true : deadp2 = true
    !turn && affected[0] == player ? deadp1 = true : deadp2 = true
}

async function turnskip(i){
        if (skipturn == true) {
            battlemessage = mon[n].name + ' brutke ' + currentmove[i].name + '!'
            updateview()
            await delay(2000)
            battlemessage = oname + ' beskyttet seg selv!'
        }
        if (skipturn == 'flinch') battlemessage = uname  + ' ble rystet!'
        completed = true
        skipturn = false
}


