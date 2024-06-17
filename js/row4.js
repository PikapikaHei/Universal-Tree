addLayer("s", {
    name: "Star", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#52B2BF",
    branches: ['a'],
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "star shard", // Name of prestige currency
    baseResource: "atom", // Name of resource prestige is based on
    canBuyMax() { return hasMilestone("s", 5) },
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.16, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effectDescription() {
        return "which are boosting Nucelus, Electrons and Atoms generation by "+format(Decimal.pow(new Decimal(player.s.points).pow(3).times(3).add(1), 2))+"x"
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    milestones: {
        0: {
            requirementDescription: "1 Star Shard",
            done() { return player.s.best.gte(1) },
            effectDescription: "You can buy max Atoms, unlock auto-prestige for Atoms.",
            toggles: [["a", "auto"]],
        },
        1: {
            requirementDescription: "2 Star Shard",
            done() { return player.s.best.gte(2) },
            effectDescription: "Keep Atom Milestones and Buyables on reset.",
        },
        2: {
            requirementDescription: "3 Star Shard",
            done() { return player.s.best.gte(3) },
            effectDescription: "Keep Nucleus Upgrades, Atom Upgrades, and Atom on reset.",
        },
        3: {
            requirementDescription: "5 Star Shard",
            done() { return player.s.best.gte(5) },
            effectDescription: "Unlock auto-prestige for Star Shards.",
            toggles: [["s", "auto"]],
        },
        4: {
            requirementDescription: "8 Star Shard",
            done() { return player.s.best.gte(8) },
            effectDescription: "Electron and Atom Prestige doesn't reset anything",
        },
        5: {
            requirementDescription: "1,000 Star Shard",
            done() { return player.s.best.gte(1000) },
            effectDescription: "You can buy max Star Shard, unlock auto-buyer for Atoms Buyables, and Star Shard doesn't reset anything.",
            toggles: [["s", "auto_buyables"]],
        },
    },

    upgrades: {
        11: {
            title: "Blue Star",
            description: "Increase matter gain by star shard",
            cost: new Decimal(8),
        },
        12: {
            title: "White Star",
            description: "Increase energy gain by star shard",
            cost: new Decimal(20),
        },
    },

    autoPrestige() { return (hasMilestone("s", 3) && player.s.auto) },
    resetsNothing() { return hasMilestone("s", 5 ) },
}),
















addLayer("c", {
    name: "cell nucleus", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFC0C8",
    branches: ['n', 'a'],
    requires: new Decimal(30), // Can be a function that takes requirement increases into account
    resource: "cell nucleus", // Name of prestige currency
    baseResource: "atoms", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    effectDescription() {
        return "which are boosting Nucleus generation by "+format(new Decimal(10).pow(player.c.points.times(10).times(Decimal.log2(player.c.points.add(new Decimal(2).times(Decimal.log2(Decimal.log10(player.n.points.add(10)).div(8).add(2))))))))+"x<br>(Boost is affected by Nucleus)"
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
})















addLayer("m", {
    name: "matter machines", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#888888",
    branches: ['q', 'en'],
    requires: new Decimal(1e5), // Can be a function that takes requirement increases into account
    resource: "matter machines", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.en.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    effectDescription() {
        return "which are boosting Matter generation by "+format(player.m.points.pow(2).times(1e4))+"x"
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},


})