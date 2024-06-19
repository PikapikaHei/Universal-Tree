addLayer("p", {
    name: "plants", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#AAAA00",
    branches: ['c'],
    requires: new Decimal(30), // Can be a function that takes requirement increases into account
    resource: "plants", // Name of prestige currency
    baseResource: "cell nucleus", // Name of resource prestige is based on
    baseAmount() {return player.c.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    effectDescription() {
        if (player.p.points > 0) boost = Decimal.log2(player.p.points.times(1.5).add(2)).add(1)
        else boost = 1
        return "which are boosting nucleus exponent and atom amount by "+boost.toFixed(2)+"x"
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    milestones: {
        0: {
            requirementDescription: "1 Plants",
            done() { return player.p.best.gte(1) },
            effectDescription: "Nucleus is boosted by x1e50",
        },
        1: {
            requirementDescription: "10 Plants",
            done() { return player.p.best.gte(10) },
            effectDescription: "Plants no longer reset anything.",
        },
        2: {
            requirementDescription: "200 Plants",
            done() { return player.p.best.gte(200) },
            effectDescription: "Unlock auto-prestige for Plants.",
            toggles: [['p', 'auto']]
        },
    },

    autoPrestige() { return (hasMilestone("p", 2) && player.p.auto) },
    resetsNothing() { return hasMilestone("p", 1 ) },
})









addLayer("co", {
    name: "celestial objects", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        time: new Decimal(0),
    }},
    color: "#946B00",
    branches: ['s'],
    requires: new Decimal(1e6), // Can be a function that takes requirement increases into account
    resource: "celestial objects", // Name of prestige currency
    baseResource: "star shards", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    tabFormat: {
        "Main": {
            content: ["main-display",
                "prestige-button",
                "blank",
                ["display-text",
                function() {return 'AUTO PRESTIGE: (Won\'t work until you unlock it)'}],
                ["toggle",
                function() {return ['co', 'auto']}]],
        },
        "Void": {
            content: ["main-display",
                ["display-text",
                function() {return 'You have ' + formatWhole(player.co.time)+' Void'},
                {}],
                "blank",
                "milestones",
                "blank",
                "upgrades",
                "blank",
                "buyables"],
        },
        "Black Holes": {
            content: ["main-display",
                "challenges"]
        }
    },

    update(diff) {
        if(hasUpgrade('co', 11) && !hasUpgrade('co', 12)) player.co.time = player.co.time.plus(new Decimal(diff).times(Decimal.pow(1.3, player.co.points)))
        if(hasUpgrade('co', 12)) player.co.time = player.co.time.plus(new Decimal(diff).times(Decimal.pow(2, player.co.points)))
    },

    milestones: {
        0: {
            requirementDescription: "100 Void",
            done() { return player.co.time.gte(100) },
            effectDescription: "Keep Atoms Milestones on all resets.",
        },
        1: {
            requirementDescription: "1,000 Void",
            done() { return player.co.time.gte(1e3) },
            effectDescription: "Keep Star Shards Milestones on all resets.",
        },
        2: {
            requirementDescription: "1,000 Celestial Objects",
            done() { return player.co.best.gte(4000) },
            effectDescription: "Keep Nucleus and Star Shards Upgrades on all resets.",
        },
    },

    upgrades: {
        11: {
            title: "Empty Spaces",
            description: "Unlock the generating of Voids.",
            cost: new Decimal(5),
        },
        12: {
            title: "Increased Turbulence",
            description: "Celestial Objects boosts Void even more.",
            cost: new Decimal(10),
        },
        13: {
            title: "Celestial Automation",
            description: "Unlock auto-prestige for Celestial Objects",
            cost: new Decimal(100),
        },
    },

    buyables: {
        11: {
            cost() { return new Decimal(6e3).times(Decimal.pow(19, getBuyableAmount('co', this.id))) },
			title() { return 'Planets' },
			canAfford() { return player.co.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			purchaseLimit() { return 100 },
			buy() {
				player.co.points = player.co.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			display() {
				let text = '';
				return 'Increase atom amount by x10<br><br>Cost: ' + formatWhole(this.cost()) + ' celestial objects<br><br>Bought: ' + formatWhole(getBuyableAmount('co', this.id)) + '/' + this.purchaseLimit();
			},
        },
        12: {
            cost() { return new Decimal(5e4).times(Decimal.pow(438, getBuyableAmount('co', this.id))) },
			title() { return 'Solar Systems' },
			canAfford() { return player.co.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
			purchaseLimit() { return 100 },
			buy() {
				player.co.points = player.co.points.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			display() {
				let text = '';
				return 'Increase Planets power by x2<br><br>Cost: ' + formatWhole(this.cost()) + ' celestial objects<br><br>Bought: ' + formatWhole(getBuyableAmount('co', this.id)) + '/' + this.purchaseLimit();
			},
            unlocked() {
                return hasChallenge('co', 11)
            },
        },
    },

    challenges: {
        11: {
            name: "Black Hole NGM X-1",
            challengeDescription: "Nucleus gain multiplier is in it's 10000th root instead.",
            canComplete: function() {return player.t.points.gte(4)},
            goalDescription: "4 Tokens",
            rewardDisplay: "Unlock a new buyable.",
            unlocked() {
                return hasMilestone('co', 2)
            }
        },
    },

    autoPrestige() { return (hasUpgrade("co", 13) && player.co.auto) },
})





















// THE BELOW LAYER IS USELESS
addLayer("r4", {
    name: "reset4", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "[R4]", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1000, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Reset", // Name of prestige currency
    baseResource: "matter", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    effectDescription() {
        return "<br><br>(Use this if you did something wrong and can't progress, as getting too many mult in the start of a run can make you unable to progress)"
    },
    resetDescription: "Perform a Row 5 Reset: ",
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: Decimal.div(1, new Decimal(10).pow(new Decimal(10).pow(new Decimal(10).pow(new Decimal(10))))), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
})