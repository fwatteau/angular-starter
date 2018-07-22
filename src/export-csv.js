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
        const fields = ['id', 'mail', 'phone', 'name', 'children', 'updateAt', 'diff'];
        const opts = { fields };
        const data = [];
        const now = new Date();

        querySnapshot.forEach(documentSnapshot => {
            let value = documentSnapshot.data();
            if (value.updateAt) {
                const updateAt = new Date(value.updateAt);
                value.diff = (now - updateAt)/1000/3600/24;
            } else {
                value.diff = -1;
            }
            data.push(value);
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