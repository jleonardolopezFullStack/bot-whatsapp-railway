const qrcode = require("qrcode-terminal");
const nodemailer = require("nodemailer");

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  console.log(message.body);
});

client.on("message", (message) => {
  if (message.body === "Ping") {
    client.sendMessage(message.from, "pong");
  }
});

const main = async () => {
  let transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "danielarairanswap@hotmail.com",
      pass: "N@la27011756",
    },
    port: 465,
    host: "smtp.hotmail.com",
  });

  let info = transporter.sendMail(
    {
      from: "danielarairanswap@hotmail.com", // sender address
      to: "danielarairanswap@hotmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
      attachments: [
        {
          // file on disk as an attachment
          filename: "qr.jpg",
          path: "./qr.jpg", // stream this file
        },
      ],
    },
    function (error, info) {
      if (error) {
        console.log(error);
        return { message: `An error has occured` };
      }
      return { message: "Email sent succesfuly" };
    }
  );
};

main();

/* const sendEmail = () => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      port: 465,
      secure: true,
    });

    const mail_configs = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Testing koding 101 Email",
      text: "Justing checking if this email will be sent",
      attachments: [
        {
          // file on disk as an attachment
          filename: "qr.png",
          path: "./qr.png", // stream this file
        },
      ],
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}; */

client.initialize();
