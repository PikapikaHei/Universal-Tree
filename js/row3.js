addLayer("t", {
    name: "token", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "[T]", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1000, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: Decimal.fromComponents(1, 1, 12400000), // Can be a function that takes requirement increases into account
    resource: "token", // Name of prestige currency
    baseResource: "nucleus", // Name of resource prestige is based on
    baseAmount() {return player.n.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 10, // Prestige currency exponent
    effectDescription() {
        return "<br>(Used for various different stuff later in the game)"
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
})













addLayer("a", {
    name: "Atoms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00FF00",
    branches: ['n', 'e'],
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "atoms", // Name of prestige currency
    baseResource: "nucleus", // Name of resource prestige is based on
    baseAmount() {return player.n.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    canBuyMax() { return hasMilestone("s", 0) },
    passiveGeneration() { return (hasMilestone("n", 1))?1:0 },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('n', 12) && !hasUpgrade('a', 12) && !hasUpgrade('a', 13)) mult = mult.div(player.a.points.exp(1.5))
            if (hasUpgrade('n', 12) && hasUpgrade('a', 12) && !hasUpgrade('a', 13)) mult = mult.div((player.a.points.exp(1.5)).times(Decimal.pow(Decimal.log10(player.n.points), 10)))
            if (hasUpgrade('n', 12) && hasUpgrade('a', 12) && hasUpgrade('a', 13)) mult = mult.div((player.a.points.exp(1.5)).times(Decimal.pow(Decimal.log10(player.n.points), new Decimal(10).times(Decimal.min(Decimal.log10(player.points), 5)))))
            if (hasUpgrade('n', 13)) mult = mult.div(Decimal.log2(player.n.points))
            if (hasUpgrade('a', 11)) mult = mult.div(player.e.points.exp(1.2))
            if (hasUpgrade('a', 21)) mult = mult.div(Decimal.pow(2, player.e.points))
            if (player.s.points > 0) mult = mult.div((Decimal.min((Decimal.pow(new Decimal(player.s.points).pow(3).times(3).add(1), 2)), 1e5)))
            if (getBuyableAmount('a', 12) > 0) mult = mult.div(Decimal.max(new Decimal(new Decimal(10).times((Decimal.max(new Decimal(1.5).pow(getBuyableAmount('a', 12)), 1)))).pow(Decimal.max(getBuyableAmount('a', 11), 1))))
            if (mult < 1e-100 && !hasUpgrade('a', 22)) mult = new Decimal(1e-100)
            if (hasUpgrade('a', 22)) if (mult < new Decimal(1e-100).div(new Decimal(10).pow(Decimal.max(player.a.points.sub(24).times(10), 0)))) mult = new Decimal(new Decimal(1e-100).div(new Decimal(10).pow(Decimal.max(player.a.points.sub(24).times(10), 0))))
        return mult
    },
    directMult() {
        mult = new Decimal(1)
        if (player.p.points > 0) mult = mult.times(Decimal.log2(player.p.points.times(1.5).add(2)).add(1))
        if (getBuyableAmount('co', 11) > 0) mult = mult.times(Decimal.pow(new Decimal(10).times(Decimal.pow(2, getBuyableAmount('co', 12))), getBuyableAmount('co', 11)))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effectDescription() {
        return "which are boosting Nucleus generation by "+format(player.a.points.exp(1.1))+"x<br>(Atoms gain boost is limited)"
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("s", 1) && resettingLayer=="s") keep.push("milestones")
        if (hasMilestone("s", 1) && resettingLayer=="s") keep.push("buyables")
        if (hasMilestone("s", 2) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("en", 0) && resettingLayer=="en") keep.push("milestones")
        if (hasMilestone("en", 0) && resettingLayer=="en") keep.push("buyables")
        if (resettingLayer=="c") keep.push("milestones")
        if (resettingLayer=="c") keep.push("upgrades")
        if (resettingLayer=="c") keep.push("buyables")
        if (resettingLayer=="en") keep.push("upgrades")
        if (hasMilestone("co", 0)) keep.push("milestones")
        if (((layers[resettingLayer].row > this.row) && !hasMilestone("s", 2)) || !resettingLayer == "c") layerDataReset("a", keep)
    },

    milestones: {
        0: {
            requirementDescription: "3 Atoms",
            done() { return player.a.best.gte(3) },
            effectDescription: "You get 100% of Quarks every second.",
        },
        1: {
            requirementDescription: "5 Atoms",
            done() { return player.a.best.gte(5) },
            effectDescription: "You get 100% of Nucleus every second.",
        },
        2: {
            requirementDescription: "7 Atoms",
            done() { return player.a.best.gte(7) },
            effectDescription: "Unlock auto-buyer for Electron Upgrades, and keep Nucleus Upgrades on reset.",
            toggles: [["e", "auto_upgrades"]],
        },
        3: {
            requirementDescription: "8 Atoms",
            done() { return player.a.best.gte(8) },
            effectDescription: "You can buy max Electron.",
        },
        4: {
            requirementDescription: "9 Atoms",
            done() { return player.a.best.gte(9) },
            effectDescription: "Unlock auto-prestige for Electron.",
            toggles: [["e", "auto"]],
        },
    },

    upgrades: {
        11: {
            title: "Quick Quarks",
            description: "Increase atom gain by quark amount.",
            cost: new Decimal(11),
        },
        12: {
            title: "Ultimate Synergizing",
            description: "Nucleus Upgrade 2 also affected by nucleus amount.",
            cost: new Decimal(14),
        },
        13: {
            title: "Legendary Synergizing",
            description: "Atoms Upgrade 2 also affected by matter amount.",
            cost: new Decimal(17),
        },
        21: {
            title: "Raise the Threshold",
            description: "Increase atom gain by electron amount.",
            cost: new Decimal(19),
        },
        22: {
            title: "Breaking Records",
            description: "Increase boost atoms generation limit by atoms amount.",
            cost: new Decimal(24),
        },
    },

    buyables: {
        11: {
            cost() { return getBuyableAmount('a', this.id).add(15) },
			title() { return 'Compounds' },
			canAfford() { return player.a.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			purchaseLimit() { return 10 },
			buy() {
				player.a.points = player.a.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			display() {
				let text = '';
				return 'Increase atom and nucleus gain by x10<br><br>Cost: ' + formatWhole(this.cost()) + ' atoms<br><br>Bought: ' + formatWhole(getBuyableAmount('a', this.id)) + '/' + this.purchaseLimit();
			},
        },
        12: {
            cost() { return getBuyableAmount('a', this.id).times(2).add(18) },
			title() { return 'Objects' },
			canAfford() { return player.a.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			purchaseLimit() { return 5 },
			buy() {
				player.a.points = player.a.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			display() {
				let text = '';
				return 'Increase Atoms Buyable 1 power by x1.5 each<br><br>Cost: ' + formatWhole(this.cost()) + ' atoms<br><br>Bought: ' + formatWhole(getBuyableAmount('a', this.id)) + '/' + this.purchaseLimit();
			},
        },
    },

    autoPrestige() { return (hasMilestone("s", 0) && player.a.auto) },
    resetsNothing() { return hasMilestone("s", 4) },
})
