const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mureraksamantha@gmail.com',
        pass: 'sam2000'
    }
});

transporter.verify(function (error, success) {
    if(error) {
        console.log(error);
    } else {
        console.log('Server validation done and ready for messages.')
    }
});

const email = {
    from: 'mureraksamantha@gmail.com',
    to: 'mureraksamantha@gmail.com',
    subject: 'Sending A Simple Email using Node.js',
    text: 'Now is the time for all good men to send Email via Node.js!'
};

transporter.sendMail(email, function(error, success){
    if (error) {
        console.log(error);
    } else {
        console.log('Nodemailer Email sent: ' + success.response);
    }
});

