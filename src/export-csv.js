const admin = require('../node_modules/firebase-admin');
const json2csv = require('../node_modules/json2csv').parse;
const serviceAccount = require("./assets/service-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://covoiturage-app.firebaseio.com"
});

admin.firestore()
    .collection("parents")
    .get()
    .then((querySnapshot) => {
        const fields = ['id', 'mail', 'name', 'children'];
        const opts = { fields };
        const data = [];

        querySnapshot.forEach(documentSnapshot => {
            data.push(documentSnapshot.data());
        });
        try {
            const csv = json2csv(data, opts);
            console.log(csv);
        } catch (err) {
            console.error(err);
        }
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });