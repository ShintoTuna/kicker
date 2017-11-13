const trueskill = require('trueskill');

function reCalcRating(data, playerMap) {
    const { game } = data;
    const sideScores = getSideScores(game);
    const { awayTotal, homeTotal } = sideScores
    const winnerSide = getWinner(sideScores);

    const overall = [];
    const positional = []

    // prepare for trueskill calculation
    game.map((p) => {
        const isWinner = (isHome(p.position) && winnerSide === 'home') || (isAway(p.position) && winnerSide === 'away')
        const rank = isWinner ? 1 : 2;
        const skill = isOff(p.position) ? playerMap[p.playerId].ratings.off : playerMap[p.playerId].ratings.def;
        const allSkill = playerMap[p.playerId].ratings.all;
        overall.push({ pos: p.position, skill: [allSkill.mu, allSkill.sig], rank })
        positional.push({ pos: p.position, skill: [skill.mu, skill.sig], rank })
    })

    // adjust ratings
    trueskill.AdjustPlayers(overall);
    trueskill.AdjustPlayers(positional);

    // update ratings
    const gameUpdated = game.map((p) => {
        const [allMu, allSig] = overall.find((ap) => p.position === ap.pos).skill;

        const [defMu, defSig] = isDef(p.position) ?
            positional.find((ap) => p.position === ap.pos).skill :
            [playerMap[p.playerId].ratings.def.mu, playerMap[p.playerId].ratings.def.sig];

        const [offMu, offSig] = isOff(p.position) ?
            positional.find((ap) => p.position === ap.pos).skill :
            [playerMap[p.playerId].ratings.off.mu, playerMap[p.playerId].ratings.off.sig];

        p.adjustedRatings = {
            all: { mu: allMu, sig: allSig },
            off: { mu: offMu, sig: offSig },
            def: { mu: defMu, sig: defSig },
        };

        p.ratings = {
            all: { mu: playerMap[p.playerId].ratings.all.mu, sig: playerMap[p.playerId].ratings.all.sig },
            off: { mu: playerMap[p.playerId].ratings.off.mu, sig: playerMap[p.playerId].ratings.off.sig },
            def: { mu: playerMap[p.playerId].ratings.def.mu, sig: playerMap[p.playerId].ratings.def.sig },
        }

        p.firstName = playerMap[p.playerId].firstName;
        p.lastName = playerMap[p.playerId].lastName;

        return p;
    });

    return Object.assign({}, data, {
        game: gameUpdated,
        score: { home: sideScores.homeTotal, away: sideScores.awayTotal }
    });
};

// test this
function getWinner({ awayTotal, homeTotal }) {
    if (homeTotal === awayTotal) {
        throw new Error('Can not be a tie');
    }

    return homeTotal > awayTotal ? 'home' : 'away';
}

function getSideScores(data) {
    return data.reduce((mem, p) => {
        if (isHome(p.position)) {
            mem.homeTotal += p.goals;
            mem.awayTotal += p.ownGoals;
        }

        if (isAway(p.position)) {
            mem.awayTotal += p.goals;
            mem.homeTotal += p.ownGoals;
        }

        return mem;
    }, { awayTotal: 0, homeTotal: 0 })
}

function reCalcAvg(pos, player, result) {
    const { position, goals, ownGoals } = pos;
    const { avgs } = player;
    const homeWon = result.home > result.away;
    const isWinner = (isHome(position) && homeWon) || (isAway(position) && !homeWon);

    const newAvgs = {
        all: {
            games: avgs.all.games + 1,
            goals: avgs.all.goals + goals,
            ownGoals: avgs.all.ownGoals + ownGoals,
            wins: isWinner ? avgs.all.wins + 1 : avgs.all.wins,
        }
    }
    const posName = isDef(position) ? 'def' : 'off';

    newAvgs[posName] = {
        games: avgs[posName].games + 1,
        goals: avgs[posName].goals + goals,
        ownGoals: avgs[posName].ownGoals + ownGoals,
        wins: isWinner ? avgs[posName].wins + 1 : avgs[posName].wins,
    }

    return Object.assign({}, avgs, newAvgs);
}

const isHome = (pos) => ['HOME_DEF', 'HOME_OFF'].includes(pos);
const isAway = (pos) => ['AWAY_DEF', 'AWAY_OFF'].includes(pos);
const isDef = (pos) => ['AWAY_DEF', 'HOME_DEF'].includes(pos);
const isOff = (pos) => ['AWAY_OFF', 'HOME_OFF'].includes(pos);

module.exports = {
    reCalcRating,
    reCalcAvg,
    getSideScores,
    isAway,
    isHome,
    isDef,
    isOff,
}