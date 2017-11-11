const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { reCalcRating, reCalcAvg } = require('./recalc');

admin.initializeApp(functions.config().firebase);

exports.recalc = functions.firestore
    .document('/games/{gameID}').onCreate((event) => {
        const store = admin.firestore();
        const data = event.data.data();
        const updatedData = reCalcRating(data);
        const batch = store.batch();

        updatedData.game.forEach((p) => {
            batch.update(store.collection('/players').doc(p.player._id), {
                ratings: p.player.adjustedRatings,
                avgs: reCalcAvg(p),
            })
        });

        batch.set(event.data.ref, updatedData);

        return batch.commit();
    });
