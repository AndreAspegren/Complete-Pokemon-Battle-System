function endofroundmsg(who, what) {
    const options = { brn: 'tok brannskade', psn: 'tok giftskade', tox: 'tok giftskade', sandstorm: 'ble skadet av sandstormen' }
    battlemessage = who.name + ' ' + options[what]
}

async function effectivenessmsg() {
    console.log(types[move[0].type][type1[1]], types[move[0].type][type2[1]])
    const effect = (types[move[0].type][type1[1]] * types[move[0].type][type2[1]])
    if (effect == 0) battlemessage = 'Det har ingen effekt på ' + oname + '!'
    else if (effect > 1) battlemessage = 'Det var super effektivt!'
    else if (effect < 1) battlemessage = 'Det var ikke veldig effektivt!'
}

function statmsg(who, type, change) {
    const typemap = { 'atk': 0, 'def': 1, 'spa': 2, 'spd': 3, 'spe': 4, 'acc': 5, 'eva': 6 }
    stats = [' sitt angrep', ' sitt forsvar', ' sitt spesielle angrep', ' sitt spesielle forsvar', ' sin hastighet', ' sin treffsikkerthet', ' sin unnvikelse']
    statsmovement = [' kan ikke gå lavere', ' falt dramatisk!', ' falt betraktelig!', ' falt!', '', ' økte!', ' økte betraktelig!',' økte dramatisk!', ' kan ikke gå høyere!']
    battlemessage = who + stats[typemap[type]] + statsmovement[change + 4]
}

function inlovemsg(){
    battlemessage = monname[0] + ' er forelsket!'
}

function weathermsg(){
    const weathermessages = {
        rain: 'Det begynte å reine!',
        sandstorm: 'En sandstorm brygget!',
        sun: 'Sollyset ble hardt!',
        snow: 'Det begynte å hagle!',
    }
    battlemessage = weathermessages[move[0].weather]
}

function screenmsg(){
    if (move[0].screentype == 'reflect') battlemessage = 'En barriere var formet for å svekke fysiske angrep!'
    else if (move[0].screentype == 'lscreen') battlemessage = 'En barriere var formet for å svekke spesielle angrep!'
    else if (move[0].movetype == 'auroraveil') battlmessage = 'Aurora Veil gjorde laget ditt sterkere mot fysiske og spesielle angrep!'
}

function missed(){
    battlemessage = monname[0] + ' bommet!'
}

function failed(){
    battlemessage = 'Men det feilet!'
}

function statusmsg(who, what){
    let statusconditions = {
        brn: ' ble brent!',
        psn: ' ble forgiftet!',
        tox: ' ble veldig forgiftet!',
        par: ' ble paralysert!',
        slp: ' sovna!'
    }
    battlemessage = who + statusconditions[what]
}

function hazardmsg(who, what) {
    let hazardmsgs = {
        spk: 'Spikes var spredt rundt føttene til ' + who + ' sitt lag!',
        tspk: 'Giftpigger var spredt rundt føttene til ' + who + ' sitt lag!',
        strk: 'Spissede steiner svever i luften rundt ' + who + ' sitt lag!',
        stwb: 'Et klebrig nett brer seg ut under ' + who + ' sitt lag!'
    }
    battlemessage = hazardmsgs[what]
}

function hazarddmgmsg(who, what) {
    let hazards = {
        0: who + ' ble skadet av pigger!',
        1: who + ' har blitt forgiftet!',
        2: 'Spisse steiner graver inni ' + who + '!',
        3: who + ' ble fanget i et klebrig nett!',
    }
    battlemessage = hazards[what]
}