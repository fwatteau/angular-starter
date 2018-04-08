const admin = require('../node_modules/firebase-admin');
const request = require('../node_modules/ajax-request');
const https = require('https');
const serviceAccount = require("./assets/service-key.json");

const data = require("./assets/data.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://covoiturage-app.firebaseio.com"
});

data && Object.keys(data).forEach(key => {
    const nestedContent = data[key];
    // console.log(key, data);
    if (typeof nestedContent === "object") {
        Object.keys(nestedContent)
            .forEach(docTitle => {
                nestedContent[docTitle].id = docTitle;
                if (nestedContent[docTitle].classroom && nestedContent[docTitle].classroom.startsWith('3')) {
                    console.info('Eleve ' + nestedContent[docTitle].name + ' identifié en troisième (classe='
                        + nestedContent[docTitle].classroom + ')')
                } else {
                    console.info('Recherche ' + nestedContent[docTitle].address);

                    https.get('https://api-adresse.data.gouv.fr/search/?q=' + nestedContent[docTitle].address, (resp) => {
                        let data = '';

                        // A chunk of data has been recieved.
                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        // The whole response has been received. Print out the result.
                        resp.on('end', () => {
                            try {
                                const body = JSON.parse(data);
                                if (!body ||
                                    !body.features ||
                                    !body.features.length) {
                                    console.warn('No geo point found for ' + nestedContent[docTitle].name);
                                    return;
                                } else {
                                    nestedContent[docTitle].address = body.features[0].properties.label;
                                    nestedContent[docTitle].geom = {
                                        lat: body.features[0].geometry.coordinates[1]
                                        , lng: body.features[0].geometry.coordinates[0]
                                    };
                                }

                                admin.firestore()
                                    .collection(key)
                                    .doc(docTitle)
                                    .set(nestedContent[docTitle])
                                    .then(() => {
                                        console.log("Document successfully written " + nestedContent[docTitle].name + "!");
                                    })
                                    .catch((error) => {
                                        console.error("Error writing document: ", error);
                                    });
                            } catch (e) {
                                console.log('Erreur ' + docTitle + ' : ' + e);
                            }
                        });

                    }).on("error", (err) => {
                        console.log('Erreur ' + docTitle + ' : ' + e);
                    });
                }
            });
    }
});