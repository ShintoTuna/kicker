const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { reCalcRating, reCalcAvg } = require('./recalc');

admin.initializeApp(functions.config().firebase);

exports.recalc = functions.firestore
    .document('/games/{gameID}').onCreate((event) => {
        const store = admin.firestore();
        const data = event.data.data();
        const batch = store.batch();

        return store.runTransaction((transaction) => {
            const players = data.game.map((participant) => {
                return transaction.get(store.collection('/players').doc(participant.playerId));
            });

            return Promise.all(players).then(playerDocs => {
                const playerMap = {};

                playerDocs.forEach((player) => {
                    playerMap[player.id] = player.data();
                });

                const updatedData = reCalcRating(data, playerMap);

                const playerUpdates = updatedData.game.map((p) => {
                    transaction.update(store.collection('/players').doc(p.playerId), {
                        ratings: p.adjustedRatings,
                        avgs: reCalcAvg(p, playerMap[p.playerId], updatedData.score),
                    })
                });

                return Promise.all(playerUpdates).then(() => {
                    return transaction.set(event.data.ref, updatedData);
                })
            });
        })
    });
