const { isHome, isAway, getSideScores, reCalc } = require('../recalc');

const game = {
    "game": [{
        "goals": 0, "ownGoals": 1, "position": "AWAY_DEF",
        "player": {
            "ratings": {
                "all": { "mu": 25, "sig": 8.333333333333334 },
                "def": { "mu": 25, "sig": 8.333333333333334 },
                "off": { "mu": 25, "sig": 8.333333333333334 },
            }
        },
    },
    {
        "goals": 3, "ownGoals": 2, "position": "AWAY_OFF",
        "player": {
            "firstName": "dasd",
            "lastName": "ddddd",
            "ratings": {
                "all": { "mu": 25, "sig": 8.333333333333334 },
                "def": { "mu": 25, "sig": 8.333333333333334 },
                "off": { "mu": 25, "sig": 8.333333333333334 },
            }
        },
    },
    {
        "goals": 2, "ownGoals": 3, "position": "HOME_DEF",
        "player": {
            "firstName": "fafdfsdf",
            "lastName": "fsfsdfsdfsd",
            "ratings": {
                "all": { "mu": 25, "sig": 8.333333333333334 },
                "def": { "mu": 25, "sig": 8.333333333333334 },
                "off": { "mu": 25, "sig": 8.333333333333334 },
            }
        },
    },
    {
        "goals": 1, "ownGoals": 1, "position": "HOME_OFF",
        "player": {
            "firstName": "dads",
            "lastName": "dasdas",
            "ratings": {
                "all": { "mu": 25, "sig": 8.333333333333334 },
                "def": { "mu": 25, "sig": 8.333333333333334 },
                "off": { "mu": 25, "sig": 8.333333333333334 },
            }
        },
    }
    ],
    length: 1,
}

test('isHome', () => {
    expect(isHome('AWAY_DEF')).toBeFalsy()
    expect(isHome('AWAY_OFF')).toBeFalsy()
    expect(isHome('HOME_DEF')).toBeTruthy()
    expect(isHome('HOME_OFF')).toBeTruthy()
})

test('isAway', () => {
    expect(isAway('AWAY_DEF')).toBeTruthy()
    expect(isAway('AWAY_OFF')).toBeTruthy()
    expect(isAway('HOME_DEF')).toBeFalsy()
    expect(isAway('HOME_OFF')).toBeFalsy()
})

test('getSideScores', () => {
    const g = { ...game };
    const expected = getSideScores(g.game);
    const actual = { homeTotal: 6, awayTotal: 7 };

    expect(expected).toEqual(actual);
})

test('reCalc', () => {
    const g = { ...game };
    const { game: [p1, p2, p3, p4], length } = reCalc(g);

    // AWAY_DEF
    expect(p1.player.ratings.all).not.toEqual(p1.player.adjustedRatings.all)
    expect(p1.player.ratings.def).not.toEqual(p1.player.adjustedRatings.def)
    expect(p1.player.ratings.off).toEqual(p1.player.adjustedRatings.off)

    // AWAY_OFF
    expect(p2.player.ratings.all).not.toEqual(p2.player.adjustedRatings.all)
    expect(p2.player.ratings.def).toEqual(p2.player.adjustedRatings.def)
    expect(p2.player.ratings.off).not.toEqual(p2.player.adjustedRatings.off)

    // HOME_DEF
    expect(p3.player.ratings.all).not.toEqual(p3.player.adjustedRatings.all)
    expect(p3.player.ratings.def).not.toEqual(p3.player.adjustedRatings.def)
    expect(p3.player.ratings.off).toEqual(p3.player.adjustedRatings.off)

    // HOME_OFF
    expect(p4.player.ratings.all).not.toEqual(p4.player.adjustedRatings.all)
    expect(p4.player.ratings.def).toEqual(p4.player.adjustedRatings.def)
    expect(p4.player.ratings.off).not.toEqual(p4.player.adjustedRatings.off)

    expect(length).toBe(g.length)
})