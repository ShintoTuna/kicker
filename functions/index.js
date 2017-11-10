const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { reCalcRating, reCalcAvg } = require('./recalc');

admin.initializeApp(functions.config().firebase);

exports.recalc = functions.firestore
    .document('/games/{gameID}').onCreate((event) => {
        const store = admin.firestore();
        const data = event.data.data();
        const updatedData = reCalcRating(data)

        const updates = [];
        updatedData.game.forEach((p) => {
            const playerID = p.player._id;

            const promise = store.collection('/players').doc(playerID).update({
                ratings: p.player.adjustedRatings,
                avgs: reCalcAvg(p),
            });

            updates.push(promise);
        });

        updates.push(event.data.ref.set(updatedData));

        return Promise.all(updates);
    });
