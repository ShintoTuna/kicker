const functions = require('firebase-functions');
const trueskill = require('trueskill');
const { reCalc } = require('./recalc');

exports.recalc = functions.firestore
    .document('/games/{gameID}').onCreate((event) => {
        const data = event.data.data();
        const updatedData = reCalc(data)

        return event.data.ref.set(updatedData);
    });
