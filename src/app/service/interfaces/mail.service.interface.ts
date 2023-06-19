import { EMail, OTP } from "src/@types";
import { Address } from "nodemailer/lib/mailer";



interface IMailService {
    sendMail(email: EMail): Promise<any>;
    sendNewUserVerificationOtp(userName: string, userEmailAddress: Address, otp: OTP): Promise<any>
}

export default IMailService;