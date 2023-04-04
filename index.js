const qrcode = require("qrcode-terminal");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

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
      user: process.env.EMAIL || process.env.SMTP_USER,
      pass: process.env.PASS || process.env.SMTP_PASSWORD,
    },
    port: process.env.PORT || process.env.SMTP_PORT,
    host: process.env.HOST || process.env.SMTP_HOST,
  });

  let info = transporter.sendMail(
    {
      from: process.env.EMAIL, // sender address
      to: process.env.EMAIL, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<p>Este es el texto del correo electrónico.</p><img src="cid:imagen_adjunta" alt="Imagen adjunta" />`,
      attachments: [
        {
          filename: "qr.jpg", // Coloca aquí el nombre que deseas para la imagen adjunta
          path: path.join(__dirname, "qr.jpg"), // Construye la ruta absoluta de la imagen usando la propiedad __dirname
          cid: "imagen_adjunta", // Usa este ID para referenciar la imagen en el contenido del correo electrónico
        },
      ],
      /*       html: "<b>Hello world?</b>", // html body

      attachments: [
        {
          // file on disk as an attachment
          filename: "qr.jpg",
          path: "./qr.jpg", // stream this file
        },
      ], */
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
