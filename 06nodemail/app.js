import mailer from "nodemailer"
import dotenv from "dotenv"
import rd from "readline-sync"
import figlet from "figlet"

import chalk from "chalk"
dotenv.config()

async function sendEmail(){
    try {
        let userEmail = rd.questionEMail("From: ")
        let apppass = rd.question("Enter your App Pass: ")
        let to = rd.questionEMail("To: ")
        let subject = rd.question("Subject: ")
        let text = rd.question("Text: ")

        let userDetails = mailer.createTransport({
            service: "gmail",
            auth: {
                user: userEmail,
                pass: apppass,
            }
        })

        const sender = await userDetails.sendMail({
            from: userEmail,
            to,
            subject,
            text,
        })
        console.log("EMAIL SENT",
        sender.messageId)
    } catch (error) {
        console.log(error);
    }
}


// sendEmail()



import twilio from 'twilio';
// twilio
async function twilios() {
    

const accountSid = rd.question("Enter your Acoount Sid: ")
const authToken = rd.question("Enter your Auth Token: ")
const client = twilio(accountSid, authToken);


let body = rd.question("Body: ")
let from = rd.question("From: ")
let to = rd.question("To: ")

await client.messages
  .create({
     body,
     from,
     to,   
   })
  .then(message => console.log(`Message sent with SID: ${message.sid}`))
  .catch(error => console.error('Error  message:'));  

}

while (true) {

    console.log(chalk.cyan(figlet.textSync(" Sender Tool CLI", { horizontalLayout: "full" })));
    let req = rd.question('01: Email \n02: Twilio \n03: both \n04: exit \nEnter your option: ')
    switch (req) {
        case "1":
            await sendEmail()

            break;
        case "2":
            await twilios()

            break;
        case "3":
            await sendEmail()
            await twilios()
            break;
        case "4":
            process.exit(0);

        default:
            console.log("Invalid input");
            break;
    }
}