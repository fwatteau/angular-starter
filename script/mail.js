const nodemailer = require('nodemailer');
const fs = require('fs');
const underscore = require('underscore');


// Generate test SMTP service account from ethereal.email
exports.handler = function(event, context, callback) {
    // Seules les requêtes POST génére un envoi de mail
    if (event.httpMethod === 'POST') {
        const template = fs.readFileSync('./template.html', 'utf8');
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
        const paramaters = JSON.parse(event.body);
        const mailOptions = {
            from: '"College Communautaire 🎓" <collegecommunautaire@nordnet.fr>', // sender address
            to: paramaters.emails, // list of receivers
            subject: 'Ajout d\'informations ✔', // Subject line
            text: 'Informations mises à jour', // plain text body
            html: compiled(paramaters.parent) // html body
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
    } else {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({traitement: 'none'})
        });
    }
};