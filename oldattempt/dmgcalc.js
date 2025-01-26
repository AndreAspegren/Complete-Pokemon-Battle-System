function dmgcalc() {
    if (movedmgimmune()) return 0 // Immunity
    return Math.round( 
        basedmg() *
        weatherdmg() * // Weather
        setcrit() * // Crit
        stab() * // Stab
        typeeffectiveness() * // Type effectiveness
        burndmgreduction() * // Burn
        randomdmg() * // Random
        checkscreens()
    )
}

function basedmg(){
    return (((((2 * 10 / 5) + 2)) * (move[0].dmg * (move[0].dmgtype == 'phy' ? mon[0].atk / mon[1].def : mon[0].spa / mon[1].spd))) / 12 + 2)
}

function setcrit(){
    return ((Math.floor(Math.random() * critratio()) == 0) ? 2 : 1)
}

function movedmgimmune(){
    return types[move[0].type][type1[0]] * types[move[0].type][type2[0]] == 0
}

function stab(){
    return (move[0].type == type1[0] || type2[0] ? 1.5 : 1)
}

function typeeffectiveness(){
    return (types[move[0].type][type1[1]] * types[move[0].type][type2[1]])
}

function burndmgreduction() {
    return (pstatus[0] == 'brn' ? 0.5 : 1)
}

function randomdmg(){
    return ((Math.floor(Math.random() * 16) + 85) / 100)
}