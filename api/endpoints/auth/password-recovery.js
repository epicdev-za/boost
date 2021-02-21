const APIUtil = require("./../../APIUtil");
const sanitizer = require("./../../sanitizer");
const ServerException = require("./../../ServerException");
const SanctumUtil = require("./../../SanctumUtil");
const fs = require("fs");
const nodemailer = require("nodemailer");

module.exports = function(req, res, next){
    const username = sanitizer.cleanExtraSymbols(APIUtil.extract(req.body, "username"));

    SanctumUtil.post("/api/sanctum/system/initiate-password-recovery", {email: username}).then(async (password_recovery_attempt) => {
        let email_address = password_recovery_attempt.email_address;
        let link = req.headers.origin + "/password-reset?r=" + password_recovery_attempt.reference;
        let reset_link = req.headers.origin + "/login";
        let expiry_time = password_recovery_attempt.requested_time + password_recovery_attempt.ttl;

        let html_template = fs.readFileSync(__dirname + "/../../../assets/html/forgot-password-template.html", "utf8");
        html_template.replaceAll("${link}", link);
        html_template.replaceAll("${reset_link}", reset_link);
        html_template.replaceAll("${expiry_time}", expiry_time);
        console.log(html_template);

        const config = require("./../../../../../server.config");
        if(config.email_server !== undefined) {
            let server = nodemailer.createTransport(config.email_server);

            server.sendMail({
                from: "System",
                to: email_address,
                subject: "Password Recovery",
                html: html_template
            });

            res.send({
                success: true
            });
        }else{
            throw new ServerException(400, "unable_to_mail", "Unable to send recovery email");
        }
    }).catch(next);
}