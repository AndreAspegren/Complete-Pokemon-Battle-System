async function focussash() {
    await updatestats(mon[1], 'hp', 1)
    await updatestats(who[1], 'item.cd', true)
    updateview()
    await delay(2000)
    battlemessage = monname[1] + ' overlevde med en hp takket være Focus Sash!'
    updateview()
    await delay(2000)
}

