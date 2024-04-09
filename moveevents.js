async function moveevents(i) {
    completed = false
    if (mon[i] == p1.pokemon[0] && move == 'switch') return        // switch out
    
    if (movehistory[i].length != 1) {                                     // movethencd rest 
        if (movehistory[i][movehistory[i].length - 2].effect2 == 'cd' && movehistory[i][movehistory[i].length - 2].hit == true && movehistory[i][movehistory[i].length - 2].cd != true) {
            movehistory[i][movehistory[i].length - 1]['cd'] = true
            battlemessage = uname + ' må hvile!'
            completed = true
        }
    }
    if (mon[i].hp == 0) await deathdisplay(i, 'turn')           
    if (skipturn && mon[i].hp != 0) await turnskip(i)
    
    if (!completed) {                                       // hvis ikke noe annet, så dette
        battlemessage = mon[i].name + ' brutke ' + currentmove[i].name + '!'
        updateview()
        await delay(2000)
        await window[currentmove[i].movetype]()
    }
    updateview()
    await delay(2000)
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


