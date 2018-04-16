const nodemailer = require('nodemailer');
const fs = require('fs');
const underscore = require('underscore');
const admin = require('firebase-admin');


// Generate test SMTP service account from ethereal.email
exports.handler = function(event, context, callback) {
    const serviceAccount = require('../src/assets/service-key.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();

    // Seules les requêtes POST génére un envoi de mail
    if (event.httpMethod === 'POST') {


        const document = db.doc('parents');

        document.get()
            .then((querySnapshot) => {
                const data = [];

                querySnapshot.forEach(documentSnapshot => {
                    data.push(documentSnapshot.data());
                });

                console.log(data);
                return;
                const template = fs.readFileSync('./src/assets/template.html', 'utf8');
                const compiled = underscore.template(template);
                const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_SMTP,
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.MAIL_USER, // generated ethereal user
                        pass: process.env.MAIL_PASS// generated ethereal password
                    }
                });

                // setup email data with unicode symbols
                const mailOptions = {
                    from: '"College Communautaire 🎓" <collegecommunautaire@nordnet.fr>', // sender address
                    to: 'f.watteau@gmail.com', // list of receivers
                    subject: 'Ajout d\'informations ✔', // Subject line
                    text: 'Informations mises à jour', // plain text body
                    html: compiled(JSON.parse(event.body)) // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s by %s', info.messageId, '${process.env.MAIL_USER}');
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });

                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({traitement: 'done'})
                });
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    } else {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({traitement: 'none'})
        });
    }
};