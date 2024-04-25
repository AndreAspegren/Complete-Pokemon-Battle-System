async function focussash() {
    await updatestats(mon[1], 'hp', 1)
    await updatestats(who[1], 'item', true, 'cd')
    updateview()
    await delay(2000)
    battlemessage = monname[1] + ' overlevde med 1 hp takket være Focus Sash!'
    updateview()
    await delay(2000)
}

