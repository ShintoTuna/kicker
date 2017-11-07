const functions = require('firebase-functions');
const trueskill = require('trueskill');

exports.calcRanks = functions.database
    .ref('/games/{pushId}')
    .onCreate((event) => {
        const data = event.data.val();

        if (!data) {
            console.log('no data', data);
            return null;
        }

        if (data.ranked) { return null; }

        const gameObj = calcRanks(data);

        return event.data.ref.set(gameObj)
    })

function calcRanks(data) {
    const finalScore = getFinalScore(data.game);
    const all_players = [];
    const pos_players = [];

    if (finalScore.away === finalScore.home) { return null; }

    const winner = finalScore.home > finalScore.away ? 'home' : 'away';

    data.game.map((p) => {
        const rank = isHome(p.position) && winner === 'home' ? 1 : 2;
        const skill = isOff(p.position) ? p.player.ratings.off : p.player.ratings.def;
        all_players.push({ pos: p.position, skill: p.player.ratings.all, rank })
        pos_players.push({ pos: p.position, skill, rank })
    })

    trueskill.AdjustPlayers(all_players);
    trueskill.AdjustPlayers(pos_players);

    const game = data.game.map((p) => {
        const all = all_players.find((ap) => p.position === ap.pos).skill;

        const def = isDef(p.position) ? pos_players.find((ap) => p.position === ap.pos).skill : p.player.ratings.def;
        const off = isOff(p.position) ? pos_players.find((ap) => p.position === ap.pos).skill : p.player.ratings.off;

        p.player.adjustedRatings = { all, off, def };

        return p;
    });


    const gameObj = {
        game,
        timestamp: new Date(),
        ranked: true,
    };

    console.log(`ranked a game`);
    console.log(gameObj);

    return gameObj;
}

function getFinalScore(data) {
    return data.reduce((mem, p) => {
        if (isHome(p.position)) {
            mem.home += p.goals;
            mem.away += p.ownGoals;
        }

        if (isAway(p.position)) {
            mem.away += p.goals;
            mem.home += p.ownGoals;
        }

        return mem;
    }, { away: 0, home: 0 })
}

function isHome(pos) {
    return pos === 'HOME_DEF' || pos === 'HOME_OFF';
}

function isAway(pos) {
    return pos === 'AWAY_DEF' || pos === 'AWAY_OFF';
}

function isDef(pos) {
    return pos === 'AWAY_DEF' || pos === 'HOME_DEF';
}

function isOff(pos) {
    return pos === 'AWAY_OFF' || pos === 'HOME_OFF';
}
