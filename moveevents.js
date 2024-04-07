async function moveevents(i) {
    completed = false
    if (user[4 + i] == p1.pokemon[0] && move == 'switch') return        // switch out
    
    if (user[10 + i].length != 1) {                                     // movethencd rest 
        if (user[10 + i][user[10 + i].length - 2].effect2 == 'cd' && user[10 + i][user[10 + i].length - 2].hit == true && user[10 + i][user[10 + i].length - 2].cd != true) {
            user[10 + i][user[10 + i].length - 1]['cd'] = true
            battlemessage = uname + ' må hvile!'
            completed = true
        }
    }
    if (user[4 + i].hp == 0) await deathdisplay(i, 'turn')           
    if (skipturn && user[4 + i].hp != 0) await turnskip(i)
    
    if (!completed) {                                       // hvis ikke noe annet, så dette
        battlemessage = user[4 + i].name + ' brutke ' + user[2 + i].name + '!'
        updateview()
        await delay(2000)
        await window[user[2 + i].movetype]()
    }
    updateview()
    await delay(2000)
} 

async function deathdisplay(i, turn){
    if (turn) affected = [user[8 + i], user[4 + i]]
    !turn && (i == 0 && p1faster || i == 0 && !p1faster) ? affected = [player, p1.pokemon[0]] : affected = [rival, p2.pokemon[0]]
    resetstats(affected[0])
    completed = true
    updateview()
    await delay(2000)
    battlemessage = affected[1].name + ' døde!'
    updateview()
    await delay(2000)
    turn && user[8 + i] == player ? deadp1 = true : deadp2 = true
    !turn && affected[0] == player ? deadp1 = true : deadp2 = true
}

async function turnskip(i){
        if (skipturn == true) {
            battlemessage = user[4 + i].name + ' brutke ' + user[2 + i].name + '!'
            updateview()
            await delay(2000)
            battlemessage = oname + ' beskyttet seg selv!'
        }
        if (skipturn == 'flinch') battlemessage = uname  + ' ble rystet!'
        completed = true
        skipturn = false
    }


