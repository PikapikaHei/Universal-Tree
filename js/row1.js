addLayer("q", {
    name: "quarks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4E40C8",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "quarks", // Name of prestige currency
    baseResource: "matter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    passiveGeneration() { return (hasMilestone("a", 0))?1:0 },
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('n', 11)) mult = mult.times(2)
        if (hasUpgrade('n', 21)) mult = mult.times(player.a.points.exp(1.2))
        if (hasUpgrade('s', 12)) mult = mult.times(Decimal.pow(player.s.points, 2))
        if (player.s.points > 0) mult = mult.times((Decimal.min((Decimal.pow(new Decimal(player.s.points).pow(3).times(3).add(1), 2)), 1e6)))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
})

