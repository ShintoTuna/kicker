const trueskill = require('trueskill');

function reCalc(data) {
    const { game } = data;
    const sideScores = getSideScores(game);
    const { awayTotal, homeTotal } = sideScores
    const winnerSide = getWinner(sideScores);

    const overall = [];
    const positional = []

    // prepare for trueskill calculation
    game.map((p) => {
        const rank = isHome(p.position) && winnerSide === 'home' ? 1 : 2;
        const skill = isOff(p.position) ? p.player.ratings.off : p.player.ratings.def;
        const allSkill = p.player.ratings.all
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
            positional.find((ap) => p.position === ap.pos).skill : [p.player.ratings.def.mu, p.player.ratings.def.sig];

        const [offMu, offSig] = isOff(p.position) ?
            positional.find((ap) => p.position === ap.pos).skill : [p.player.ratings.off.mu, p.player.ratings.off.sig];

        p.player.adjustedRatings = {
            all: { mu: allMu, sig: allSig },
            off: { mu: offMu, sig: offSig },
            def: { mu: defMu, sig: defSig },
        };

        return p;
    });

    return Object.assign({}, data, { game: gameUpdated });
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

const isHome = (pos) => ['HOME_DEF', 'HOME_OFF'].includes(pos);
const isAway = (pos) => ['AWAY_DEF', 'AWAY_OFF'].includes(pos);
const isDef = (pos) => ['AWAY_DEF', 'HOME_DEF'].includes(pos);
const isOff = (pos) => ['AWAY_OFF', 'HOME_OFF'].includes(pos);

module.exports = {
    reCalc,
    getSideScores,
    isAway,
    isHome,
    isDef,
    isOff,
}