const nodemailer = require('nodemailer');
const underscore = require('underscore');
const template = '<html>\n' +
    '<head>\n' +
    '    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">\n' +
    '    <style type="text/css">\n' +
    '        <!--\n' +
    '        #outlook a {padding:0}\n' +
    '        .ReadMsgBody{width:100%}\n' +
    '        .ExternalClass {width:100%}\n' +
    '        .ExternalClass * {line-height:100%}\n' +
    '        body {margin:0;padding:0}\n' +
    '        table, td {border-collapse:collapse}\n' +
    '        img {border:0;height:auto;line-height:100%;outline:none;text-decoration:none}\n' +
    '        p {display:block;margin:13px 0}\n' +
    '        -->\n' +
    '    </style>\n' +
    '</head>\n' +
    '<body style="background:#F4F4F4">\n' +
    '<div>\n' +
    '    <div style="background-color:#F4F4F4">\n' +
    '        <div style="margin:0px auto; max-width:600px">\n' +
    '            <table cellpadding="0" cellspacing="0" align="center" border="0" style="font-size:0px;width:100%">\n' +
    '                <tbody>\n' +
    '                <tr>\n' +
    '                    <td style="text-align:center; vertical-align:top; direction:ltr; font-size:0px; padding:20px 0px 20px 0px">\n' +
    '                        <div class="mj-column-per-66 outlook-group-fix" style="vertical-align:top; display:inline-block; direction:ltr; font-size:13px; text-align:left; width:100%">\n' +
    '                            <table cellpadding="0" cellspacing="0" width="100%" border="0">\n' +
    '                                <tbody>\n' +
    '                                <tr>\n' +
    '                                    <td align="left">\n' +
    '                                        <h1>Site de covoiturage du collège ordinaire</h1>\n' +
    '                                    </td>\n' +
    '                                </tr>\n' +
    '                                </tbody>\n' +
    '                            </table>\n' +
    '                        </div>\n' +
    '                        <div class="mj-column-per-33 outlook-group-fix" style="vertical-align:top; display:inline-block; direction:ltr; font-size:13px; text-align:left; width:100%">\n' +
    '                            <table cellpadding="0" cellspacing="0" width="100%" border="0">\n' +
    '                                <tbody>\n' +
    '                                <tr>\n' +
    '                                    <td align="right" style="word-wrap:break-word; font-size:0px; padding:0px 25px 0px 0px; padding-top:0px; padding-bottom:0px">\n' +
    '                                        <div class="" style="color:#55575d; font-family:Helvetica,Arial,sans-serif; font-size:11px; line-height:22px; text-align:right">\n' +
    '                                            <p style="margin:10px 0"></p>\n' +
    '                                        </div>\n' +
    '                                    </td>\n' +
    '                                </tr>\n' +
    '                                </tbody>\n' +
    '                            </table>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '                </tbody>\n' +
    '            </table>\n' +
    '        </div>\n' +
    '        <div style="margin:0px auto; max-width:600px; background:#ffffff">\n' +
    '            <table cellpadding="0" cellspacing="0" align="center" border="0" style="font-size:0px; width:100%; background:#ffffff">\n' +
    '                <tbody>\n' +
    '                <tr>\n' +
    '                    <td style="text-align:center; vertical-align:top; direction:ltr; font-size:0px; padding:20px 0px 20px 0px">\n' +
    '                        <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top; display:inline-block; direction:ltr; font-size:13px; text-align:left; width:100%">\n' +
    '                            <table cellpadding="0" cellspacing="0" width="100%" border="0">\n' +
    '                                <tbody>\n' +
    '                                <tr>\n' +
    '                                    <td align="left" style="word-wrap:break-word; font-size:0px; padding:0px 25px 0px 25px; padding-top:0px; padding-bottom:0px">\n' +
    '                                        <div class="" style="color:#55575d; font-family:Helvetica,Arial,sans-serif; font-size:13px; line-height:22px; text-align:left">\n' +
    '                                            <h1 style="font-size:30px; text-align:center; font-weight:300; max-width:300px; margin:30px auto 40px; line-height:1.2">\n' +
    '                                                Des informations ont été mises à jour\n' +
    '                                            </h1>\n' +
    '                                            <h2 style="font-size:20px; font-weight:300; margin:25px 0 5px">#CollègeCommunautaire <a href="http://collegecommunautaire.online.fr" style="color:#0069CC; font-size:14px">\n' +
    '                                                voir</a> </h2>\n' +
    '                                            <table cellpadding="0" cellspacing="0" style="width:100%; padding-bottom:20px">\n' +
    '                                                <tbody>\n' +
    '                                                <tr>\n' +
    '                                                    <td style="padding:2px 0">\n' +
    '                                                        <div style="font-weight:bold"><%= name %></div>\n' +
    '                                                        <div>habitant à <%= address %> </div>\n' +
    '                                                </tr>\n' +
    '                                                </tbody>\n' +
    '                                            </table>\n' +
    '                                        </div>\n' +
    '                                    </td>\n' +
    '                                </tr>\n' +
    '                                </tbody>\n' +
    '                            </table>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '                </tbody>\n' +
    '            </table>\n' +
    '        </div>\n' +
    '        <div style="margin:0px auto; max-width:600px">\n' +
    '            <table cellpadding="0" cellspacing="0" align="center" border="0" style="font-size:0px; width:100%">\n' +
    '                <tbody>\n' +
    '                <tr>\n' +
    '                    <td style="text-align:center; vertical-align:top; direction:ltr; font-size:0px; padding:20px 0px 20px 0px">\n' +
    '                        <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top; display:inline-block; direction:ltr; font-size:13px; text-align:left; width:100%">\n' +
    '                            <table cellpadding="0" cellspacing="0" width="100%" border="0">\n' +
    '                                <tbody>\n' +
    '                                <tr>\n' +
    '                                    <td align="center" style="word-wrap:break-word; font-size:0px; padding:0px 20px 0px 20px; padding-top:0px; padding-bottom:0px">\n' +
    '                                        <div class="" style="color:#55575d; font-family:Helvetica,Arial,sans-serif; font-size:11px; line-height:22px; text-align:center">\n' +
    '                                            <a href="https://www.college-communautaire.org/">\n' +
    '                                                <img align="middle" alt="Collège" src="https://image.jimcdn.com/app/cms/image/transf/none/path/se7f0efb1bca3cf87/image/i5c1e5456e0a5bc9e/version/1411230388/retour-%C3%A0-la-page-d-accueil.jpg">\n' +
    '                                            </a>\n' +
    '                                        </div>\n' +
    '                                    </td>\n' +
    '                                </tr>\n' +
    '                                <tr>\n' +
    '                                    <td align="center" style="word-wrap:break-word; font-size:0px; padding:0px 20px 0px 20px; padding-top:0px; padding-bottom:0px">\n' +
    '                                        <div class="" style="color:#55575d; font-family:Helvetica,Arial,sans-serif; font-size:11px; line-height:22px; text-align:center">\n' +
    '                                            <p style="margin:10px 0"></p>\n' +
    '                                        </div>\n' +
    '                                    </td>\n' +
    '                                </tr>\n' +
    '                                </tbody>\n' +
    '                            </table>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '                </tbody>\n' +
    '            </table>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <br>\n' +
    '    <img src="http://emails.tps.apientreprise.fr/oo/AM8AAATDifEAAbMXiEYAAG3_5U4AAVQ9d1kAAAAAAAV14QBa0wf5SKB7OatiScaNQ9xRGtMOUgAFPI0/50a092ac/e.gif" height="1" width="1" alt="" border="0" style="height:1px; width:1px; border:0">\n' +
    '</div>\n' +
    '</body>\n' +
    '</html>';

// Generate test SMTP service account from ethereal.email
exports.handler = function(event, context, callback) {
    // Seules les requêtes POST génére un envoi de mail
    if (event.httpMethod === 'POST') {
        // const template = fs.readFileSync('./template.html', 'utf8');
        const compiled = underscore.template(template);
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_SMTP,
            secure: process.env.MAIL_SECURE, // true for 465, false for other ports
            port: process.env.MAIL_PORT, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASS// generated ethereal password
            }
        });

        // setup email data with unicode symbols
        const paramaters = JSON.parse(event.body);
        const mailOptions = {
            from: '"College Communautaire 🎓" <collegecommunautaire@nordnet.fr>', // sender address
            bcc: paramaters.emails, // list of receivers
            subject: 'Ajout d\'informations ✔', // Subject line
            text: 'Informations mises à jour', // plain text body
            html: compiled(paramaters.parent) // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Message sent: %s by %s', info.messageId, '${process.env.MAIL_USER}');
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }

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