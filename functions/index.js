const functions = require('firebase-functions');

exports.calcRanks = functions.database
    .ref('/games/{pushId}')
    .onWrite((event) => {
        const data = event.data.val();

        if (data.ranked) { return }

        const game = data.map((participant) => {
            participant.player.rantings = { all: 0, def: 0, off: 0 };
        });

        const gameObj = {
            game,
            timestamp: new Date(),
            ranked: true,
        };

        console.log(`ranked game ${pushId}`);
        console.log(gameObj);

        return event.data.ref.set(gameObj)
    })