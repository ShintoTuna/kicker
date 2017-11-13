const { isHome, isAway, getSideScores, reCalcRating, reCalcAvg } = require('../recalc');
const playerMap = {
    123: {
        "ratings": {
            all: { mu: 25, sig: 8.333333333333334 },
            def: { mu: 25, sig: 8.333333333333334 },
            off: { mu: 25, sig: 8.333333333333334 },
        },
        "avgs": {
            all: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            def: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            off: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
        },
    },
    234: {
        "ratings": {
            all: { mu: 25, sig: 8.333333333333334 },
            def: { mu: 25, sig: 8.333333333333334 },
            off: { mu: 25, sig: 8.333333333333334 },
        },
        "avgs": {
            all: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            def: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            off: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
        },
    },
    345: {
        "ratings": {
            all: { mu: 25, sig: 8.333333333333334 },
            def: { mu: 25, sig: 8.333333333333334 },
            off: { mu: 25, sig: 8.333333333333334 },
        },
        "avgs": {
            all: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            def: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            off: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
        },
    },
    456: {
        "ratings": {
            all: { mu: 25, sig: 8.333333333333334 },
            def: { mu: 25, sig: 8.333333333333334 },
            off: { mu: 25, sig: 8.333333333333334 },
        },
        "avgs": {
            all: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            def: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
            off: { games: 0, goals: 0, ownGoals: 0, wins: 0 },
        },
    }
}
const game = {
    "game": [
        { goals: 1, ownGoals: 1, position: "AWAY_DEF", playerId: 123, },
        { goals: 3, ownGoals: 2, position: "AWAY_OFF", playerId: 234, },
        { goals: 2, ownGoals: 3, position: "HOME_DEF", playerId: 345, },
        { goals: 1, ownGoals: 1, position: "HOME_OFF", playerId: 456, }
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
    const actual = { homeTotal: 6, awayTotal: 8 };

    expect(expected).toEqual(actual);
})

test('reCalcRating', () => {
    const g = { ...game };
    const p = { ...playerMap };
    const { game: [p1, p2, p3, p4], length, score } = reCalcRating(g, p);

    // AWAY_DEF
    expect(p[p1.playerId].ratings.all).not.toEqual(p1.adjustedRatings.all)
    expect(p[p1.playerId].ratings.def).not.toEqual(p1.adjustedRatings.def)
    expect(p[p1.playerId].ratings.off).toEqual(p1.adjustedRatings.off)

    expect(p[p1.playerId].ratings.all).toEqual(p1.ratings.all)
    expect(p[p1.playerId].ratings.def).toEqual(p1.ratings.def)
    expect(p[p1.playerId].ratings.off).toEqual(p1.ratings.off)

    // AWAY_OFF
    expect(p[p2.playerId].ratings.all).not.toEqual(p2.adjustedRatings.all)
    expect(p[p2.playerId].ratings.def).toEqual(p2.adjustedRatings.def)
    expect(p[p2.playerId].ratings.off).not.toEqual(p2.adjustedRatings.off)

    expect(p[p2.playerId].ratings.all).toEqual(p2.ratings.all)
    expect(p[p2.playerId].ratings.def).toEqual(p2.ratings.def)
    expect(p[p2.playerId].ratings.off).toEqual(p2.ratings.off)

    // HOME_DEF
    expect(p[p3.playerId].ratings.all).not.toEqual(p3.adjustedRatings.all)
    expect(p[p3.playerId].ratings.def).not.toEqual(p3.adjustedRatings.def)
    expect(p[p3.playerId].ratings.off).toEqual(p3.adjustedRatings.off)

    expect(p[p3.playerId].ratings.all).toEqual(p3.ratings.all)
    expect(p[p3.playerId].ratings.def).toEqual(p3.ratings.def)
    expect(p[p3.playerId].ratings.off).toEqual(p3.ratings.off)

    // HOME_OFF
    expect(p[p4.playerId].ratings.all).not.toEqual(p4.adjustedRatings.all)
    expect(p[p4.playerId].ratings.def).toEqual(p4.adjustedRatings.def)
    expect(p[p4.playerId].ratings.off).not.toEqual(p4.adjustedRatings.off)

    expect(p[p4.playerId].ratings.all).toEqual(p4.ratings.all)
    expect(p[p4.playerId].ratings.def).toEqual(p4.ratings.def)
    expect(p[p4.playerId].ratings.off).toEqual(p4.ratings.off)

    expect(score).toEqual({ away: 8, home: 6 });
    expect(length).toBe(g.length)
})

test('reCalcAvg', () => {
    const g = { ...game };
    const p = { ...playerMap };
    const participant = g.game[0];
    const player = p[participant.playerId];
    const result = { away: 8, home: 6 };
    const newAvgs = reCalcAvg(participant, player, result);

    // AWAY_DEF
    expect(newAvgs.all.games).toBe(1)
    expect(newAvgs.all.goals).toBe(1)
    expect(newAvgs.all.ownGoals).toBe(1)
    expect(newAvgs.all.wins).toBe(1)

    expect(newAvgs.def.games).toBe(1)
    expect(newAvgs.def.goals).toBe(1)
    expect(newAvgs.def.ownGoals).toBe(1)
    expect(newAvgs.def.wins).toBe(1)

    expect(newAvgs.off.games).toBe(0)
    expect(newAvgs.off.goals).toBe(0)
    expect(newAvgs.off.ownGoals).toBe(0)
    expect(newAvgs.off.wins).toBe(0)

})