import { Service } from "typedi";
import IMailService from "./interfaces/mail.service.interface";
import { EMail, NodeMailSettings, OTP } from "src/@types";
import Config from "@Config";
import nodemailer, { Transporter } from "nodemailer";
import EmailExecption from "@exceptions/email.exception";
import HttpCodes from "@constants/http.codes.enum";
import { Address } from "nodemailer/lib/mailer";
import getDateTime from "@utils/getDateTime";

/**
 * The `MailService` class is responsible for handling the business logic for
 * sending mails to the clients
 * 
 * @class MailService
 * @implements IMailService
 */
@Service()
class MailService implements IMailService {

    private NodeMailSettings: NodeMailSettings;

    private transporter: Transporter;

    // initialize mail service with mail config
    constructor() {
        // mailer config
        this.NodeMailSettings = {
            service: Config?.MAIL_SERVICE_PROVIDER ?? "",
            host: Config?.MAIL_SERVICE_HOST ?? "",
            port: Config?.MAIL_SERVICE_PORT ?? "",
            secure: true,
            requireTLS: true,
            auth: {
                user: Config?.MAIL_SERVICE_AUTH_USER ?? "",
                pass: Config?.MAIL_SERVICE_AUTH_PASSWORD ?? "",
            },
            tls: {
                // Enable TLS encryption
                ciphers: "SSLv3",
            },
        }
        // mail tranporter
        this.transporter = nodemailer.createTransport(this.NodeMailSettings);
    }


    async sendMail(email: EMail): Promise<any> {
        try {
            let info = await this.transporter.sendMail({
                from: email.from,
                to: email.to,
                subject: email.subject,
                html: email?.html,
                text: email?.text
            });
            return info;
        } catch (error: any) {
            throw new EmailExecption(`Something went worng !`,
                HttpCodes.CONFLICT,
                `${error?.message}`,
                `@MailService.class: @sendMail.method() ${JSON.stringify(error)}`)
        }
    }

    async sendNewUserVerificationOtp(userName: string, userEmailAddress: Address, otp: OTP): Promise<any> {
        try {
            const email: EMail = {
                from: { name: "Team MBDB", address: "admin@moviebunkers.com" },
                to: userEmailAddress,
                subject: `Hey,${userName} 💞 ! Your Movie Adventure Awaits. Verify Your Account and Start Exploring🎬`,
                html: `
                <div
                  class="container"
                  style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                  <h2>Hi ${userName} 💞 !,<br/>Congratulations! 💐 Your account has been successfully created.</h2>
                  <h3>Please verify email using otp <code style="font-size: 1.2rem">${otp?.code}</code> to activate your account. Once your account is activated🔓,
                  you'll be able to access all the features and benefits of our website 💻 .</h3>
                  <p style="margin-bottom: 10px;">Please use the below sign up OTP to get started,</p>
                  <p style="margin-bottom: 30px;">OTP Expires at :⏳ ${getDateTime(otp?.expiryDate)}</p>
                  <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp?.code}</h1>
             </div>
              `,

            }

            return await this.sendMail(email);
        } catch (error) {
            throw error;
        }
    }

}


export default MailService;