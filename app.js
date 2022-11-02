const express = require("express");
var nodemailer = require('nodemailer');

// require('dotenv').config({ silent: process.env.NODE_ENV === 'production' });

const {
  google
} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post('/', function(req, res) {
  function getBadWords(str) {
    let badwords = ['http', 'www', 'seo', 'marketing', 'optimization', 'upgrade', 'platform', 'domain']
    let words = []
    badwords.forEach(word =>
      str.replace(/ /g, '').toLowerCase()
      .includes(word.replace(/ /g, '').toLowerCase()) ? words.push(word) : null)
    return words
  }

  if (getBadWords(req.body.message).length == 0) {

    const createTransporter = async () => {
      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
      });

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject("Failed to create access token :(");
          }
          resolve(token);
        });
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          accessToken,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN
        }
      });
      return transporter;
    };

    const sendEmail = async (emailOptions) => {
      let emailTransporter = await createTransporter();
      await emailTransporter.sendMail(emailOptions, function(err, info) {
        if (err) {
          resolve(false);
          res.send('error');
        } else {
          res.send('success');
          resolve(true);

        }

      });
    };

    sendEmail({
      subject: `Message from ${req.body.email}`,
      text: req.body.message,
      to: 'cibercarlossv@gmail.com', // client address
      from: process.env.EMAIL
    });
  } else {
    res.send('error');
  }
});

app.listen(PORT, function() {
  console.log(`Server running on port ${PORT}`)
})
