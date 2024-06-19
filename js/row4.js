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
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("co", 1)) keep.push("milestones")
        if (hasMilestone("co", 2)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effectDescription() {
        return "which are boosting Matter, Quarks, Nucleus and Atoms generation by "+format((Decimal.min((Decimal.pow(new Decimal(player.s.points).pow(3).times(3).add(1), 2)), 1e6)))+"x (Limit: 100,000x, the effect limit is 10x smaller for atoms)"
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
            effectDescription: "Electron and Atom Prestige doesn't reset anything, Star Shard doesn't reset Energy or Energy Milestones.",
        },
        5: {
            requirementDescription: "50 Star Shard",
            done() { return player.s.best.gte(50) },
            effectDescription: "You can buy max Star Shard, and Star Shard doesn't reset anything.",
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
            description: "Increase quarks gain by star shard",
            cost: new Decimal(35),
        },
        13: {
            title: "Yellow Star",
            description: "Increase matter machines gain by star shard",
            cost: new Decimal(95),
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
        if (hasMilestone('m', 4)) mult = mult.div(5)
        return mult
    },
    directMult() {
        mult = new Decimal(1)
        if (hasUpgrade('c', 11)) mult = mult.times(Decimal.log2(player.e.points))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Direct Multiplier",
            description: "Increase cell nucleus amount by electron amount.",
            cost: new Decimal(3)
        }
    },

    milestones: {
        0: {
            requirementDescription: "24 Cell Nucleus",
            done() { return player.c.best.gte(24) },
            effectDescription: "Unlock auto-prestige for Cell Nucleus, and Cell Nucleus doesn't reset anything.",
            toggles: [['c', 'auto']]
        },
    },

    autoPrestige() { return (hasMilestone("c", 0) && player.c.auto) },
    resetsNothing() { return hasMilestone("c", 0 ) },
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
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "matter machines", // Name of prestige currency
    baseResource: "electron", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    passiveGeneration() { return (hasMilestone("m", 1))?0.5:0 },
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    effectDescription() {
        if (!hasMilestone('m', 3)) { 
            if (!hasMilestone('m', 2)) return "which are boosting Matter generation by "+format(player.m.points.times(10).pow(2).times(1e4))+"x"
            else return "which are boosting Matter generation by "+format(player.m.points.times(10).pow(2).times(1e4))+"x and Nucleus by " + player.m.points.times(10).pow(10).times(1e4).toFixed(2) + "x"
        } else {
            return "which are boosting Matter generation by "+format(player.m.points.times(10).pow(10).times(1e4))+"x and Nucleus by " + player.m.points.times(10).pow(50).times(1e4).toFixed(2) + "x"
        }
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('s', 13)) mult = mult.times(Decimal.pow(player.s.points, 1.05))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    milestones: {
        0: {
            requirementDescription: "5 Matter Machines",
            done() { return player.m.best.gte(5) },
            effectDescription: "Matter Machines doesn't reset Nucleus Upgrades.",
        },
        1: {
            requirementDescription: "20 Matter Machines",
            done() { return player.m.best.gte(20) },
            effectDescription: "You get 50% of matter machines every second.",
        },
        2: {
            requirementDescription: "50 Matter Machines",
            done() { return player.m.best.gte(50) },
            effectDescription: "Matter Machines also boosts Nucleus with increased effect.",
        },
        3: {
            requirementDescription: "80 Matter Machines",
            done() { return player.m.best.gte(80) },
            effectDescription: "The effect of Matter Machines boosting Matter and Nucleus are both better, and unlock auto-prestige for Matter Machines",
            toggles: [["m", "auto"]]
        },
        4: {
            requirementDescription: "200 Matter Machines",
            done() { return player.m.best.gte(200) },
            effectDescription: "Matter Machines doesn't reset anything, and Cell Nucleus cost is divided by 5.",
        },
    },

    autoPrestige() { return (hasMilestone("m", 3) && player.m.auto) },
    resetsNothing() { return hasMilestone("m", 4) },
})
