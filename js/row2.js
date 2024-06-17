addLayer("n", {
    name: "nucleus", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF0000",
    branches: ['q'],
    requires: new Decimal(6), // Can be a function that takes requirement increases into account
    resource: "nucleus", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {return player.q.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    passiveGeneration() { return (hasMilestone("a", 1))?1:0 },
    canBuyMax() { return hasMilestone("s", 0) },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("e", 13)) mult = mult.times(new Decimal(new Decimal(player.e.points.add(1)).exp(1.1)))
        if (hasUpgrade("n", 22)) mult = mult.times(Decimal.pow(player.a.points, 2))
        mult = mult.times(player.a.points.exp(1.1))
        mult = mult.times((Decimal.pow(new Decimal(player.s.points.pow(3).times(3)).add(1), 2)))
        mult = mult.times(Decimal.max(new Decimal(10).pow(getBuyableAmount('a', 11)), 1))
        if (player.cn.points > 0) mult = mult.times(new Decimal(10).pow(player.c.points.times(10).times(Decimal.log2(player.c.points.add(new Decimal(2).times(Decimal.log2(Decimal.log10(player.n.points.add(10)).div(8).add(2))))))))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Fundamental Power",
            description: "Increase quark gain by 2x",
            cost: new Decimal(10),
        },
        12: {
            title: "Synergize Atoms",
            description: "Increase atom gain by atom amount",
            cost: new Decimal(1e3),
        },
        13: {
            title: "Effecient Atoms",
            description: "Increase atom gain by nucleus amount",
            cost: new Decimal(5e4),
        },
        21: {
            title: "Big Atomic Number",
            description: "Increase quark gain by atom amount",
            cost: new Decimal(1e6),
        },
        22: {
            title: "Reverse Synergy",
            description: "Increase nucleus gain by atom.",
            cost: new Decimal(1e28)
        },
    },

    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("a", 2) && resettingLayer=="a") keep.push("upgrades")
        if (hasMilestone("s", 2) && resettingLayer=="s") keep.push("upgrades")
        if (hasMilestone("en", 1) && resettingLayer=="en") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset("n", keep)
    },

    automate() {
		if (hasMilestone('a', 2) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				if (tmp[this.layer].upgrades[id].unlocked) buyUpgrade(this.layer, id);
			};
		};
	},
})














addLayer("e", {
    name: "electron", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    branches: ['q'],
    requires: new Decimal(20), // Can be a function that takes requirement increases into account
    resource: "electron", // Name of prestige currency
    baseResource: "quarks", // Name of resource prestige is based on
    baseAmount() {return player.q.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    canBuyMax() { return hasMilestone("a", 3) },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.div((Decimal.pow(new Decimal(player.s.points).pow(3).times(3).add(1), 2)))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    upgrades: {
	    11: {
		    title: "Energy Generation",
		    description: "Generate 1 matter per second.",
	    	cost: new Decimal(1),
	    },
        12: {
            title: "Automatical Scaling",
            description: "Increase matter gain by 10x.",
            cost: new Decimal(5)
        },
        13: {
            title: "Quark Charge",
            description: "Increase nucleus gain by electron.",
            cost: new Decimal(15)
        },
    },

    automate() {
		if (hasMilestone('a', 2) && player[this.layer].auto_upgrades) {
			for (const id in tmp[this.layer].upgrades) {
				if (tmp[this.layer].upgrades[id].unlocked) buyUpgrade(this.layer, id);
			};
		};
	},
    autoPrestige() { return (hasMilestone("a", 4) && player.e.auto) },
    resetsNothing() { return hasMilestone("s", 4) },
})