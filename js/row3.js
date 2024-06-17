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
            if (hasUpgrade('n', 12) && hasUpgrade('a', 12) && hasUpgrade('a', 13)) mult = mult.div((player.a.points.exp(1.5)).times(Decimal.pow(Decimal.log10(player.n.points), new Decimal(10).times(Decimal.log10(player.points)))))
            if (hasUpgrade('n', 13)) mult = mult.div(Decimal.log2(player.n.points))
            if (hasUpgrade('a', 11)) mult = mult.div(player.e.points.exp(1.2))
            if (hasUpgrade('a', 21)) mult = mult.div(Decimal.pow(2, player.e.points))
            if (player.s.points > 0) mult = mult.div((Decimal.pow(new Decimal(player.s.points).pow(3).times(3).add(1), 2)))
            if (getBuyableAmount('a', 12) > 0) mult = mult.div(Decimal.max(new Decimal(new Decimal(10).times((Decimal.max(new Decimal(1.5).pow(getBuyableAmount('a', 12)), 1)))).pow(Decimal.max(getBuyableAmount('a', 11), 1))))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effectDescription() {
        return "which are boosting Nucleus generation by "+format(player.a.points.exp(1.1))+"x"
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
        if (((layers[resettingLayer].row > this.row) && !hasMilestone("s", 2)) || !resettingLayer == "c") layerDataReset("a", keep)
    },

    automate() {
		if (hasMilestone('s', 4) && player[this.layer].auto_buyables) {
			for (const id in tmp[this.layer].buyables) {
				if (tmp[this.layer].buyables[id].unlocked) buyUpgrade(this.layer, id);
			};
		};
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
    },

    buyables: {
        11: {
            cost() { return getBuyableAmount('a', this.id).add(15) },
			title() { return 'Compounds' },
			canAfford() { return player.a.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			purchaseLimit() { return 1000 },
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
			purchaseLimit() { return 1000 },
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














addLayer("en", {
    name: "Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#BBBB00",
    branches: ['e'],
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "electron", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    doReset(resettingLayer) {
        if (resettingLayer=="c") keep.push("milestones")
        if (resettingLayer=="c") keep.push("upgrades")
        if (resettingLayer=="c") keep.push("buyables")
        if (!resettingLayer == "c") layerDataReset("a", keep)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('s', 12)) mult = mult.times(Decimal.log2(player.s.points))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effectDescription() {
        return "which are boosting Quarks and Nucleus generation by "+format((Decimal.pow(new Decimal(player.en.points).add(1), 1.5)).times(Decimal.max(new Decimal(5).pow(getBuyableAmount('en', 11)), 1)))+"x"
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    milestones: {
        1: {
            requirementDescription: "15 Energy",
            done() { return player.en.best.gte(15) },
            effectDescription: "Unlock auto-prestige for Energy, and keep Nucleus Upgrades on reset.<br>(Turing this on can make you unable to gain<br>nucleus later in the game until you turn it off)",
            toggles: [["en", "auto"]]
        },
        2: {
            requirementDescription: "1,000 Energy",
            done() { return player.en.best.gte(1e3) },
            effectDescription: "Energy doesn't reset anything.",
        },
    },

    buyables: {
        11: {
            cost() { return Decimal.pow(new Decimal(4), getBuyableAmount('en', this.id)) },
			title() { return 'Nuclear Fushion' },
			canAfford() { return player.en.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			purchaseLimit() { return 5 },
			buy() {
				player.en.points = player.en.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			display() {
				let text = '';
				return 'Increase total energy effect by x5<br><br>Cost: ' + formatWhole(this.cost()) + ' energy<br><br>Bought: ' + formatWhole(getBuyableAmount('en', this.id)) + '/' + this.purchaseLimit();
			},
        }
    },

    autoPrestige() { return (hasMilestone("en", 1) && player.en.auto) },
    resetsNothing() { return hasMilestone("en", 3) },
})
