const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Manish <${process.env.EMAIL_FROM}`;
    }


    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            console.log('mmmmmmmmmmmmmmmm')
            return nodemailer.createTransport({
                
                service: 'SendGrid', 
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD

                }
            })
        }


        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
            //activate in gmail 'less secure app' option
        });
    }

    async send(template, subject) {

        //render
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject
            }
        );

        //send the actual email
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html),
            //html:
        };

        //send the email
        //await transporter.sendMail(mailOptions);

        await this.newTransport().sendMail(mailOptions);

    }

    async sendWelcome() {
        await this.send('welcome', 'welcome to our community');
    }

    async sendPassReset() {
        await this.send('passwordReset', 'Your password reset token valid for 5 min')
    }
}