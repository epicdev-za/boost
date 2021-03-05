const APIUtil = require("./../../APIUtil");
const sanitizer = require("./../../sanitizer");
const ServerException = require("./../../ServerException");
const SanctumUtil = require("./../../SanctumUtil");
const fs = require("fs");
const nodemailer = require("nodemailer");
const nuxt_config = require("../../../../../../nuxt.config");
const moment = require("moment");

module.exports = function(req, res, next){
    const username = sanitizer.cleanExtraSymbols(APIUtil.extract(req.body, "username"));

    SanctumUtil.post("/api/sanctum/system/initiate-password-recovery", {email: username}).then(async (password_recovery_attempt) => {
        let email_address = password_recovery_attempt.email_address;
        let link = req.headers.origin + "/password-reset?r=" + password_recovery_attempt.reference;
        let reset_link = req.headers.origin + "/login";
        let expiry_time = password_recovery_attempt.requested_time + password_recovery_attempt.ttl;
        expiry_time = moment.unix(expiry_time).format("D/M/YYYY HH:mm:ss");

        let html_template = fs.readFileSync(__dirname + "/../../../assets/html/forgot-password-template.html", "utf8") + "";
        html_template = html_template.replace(/\${primary_color}/g, nuxt_config.default.vuetify.theme.themes.light.primary);
        html_template = html_template.replace(/\${secondary_color}/g, nuxt_config.default.vuetify.theme.themes.light.secondary);
        html_template = html_template.replace(/\${accent_color}/g, nuxt_config.default.vuetify.theme.themes.light.accent);
        html_template = html_template.replace(/\${link}/g, link);
        html_template = html_template.replace(/\${reset_link}/g, reset_link);
        html_template = html_template.replace(/\${expiry_time}/g, expiry_time);

        const config = require("./../../../../../../server.config");
        if(config.email_server !== undefined) {
            try{
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
            }catch (e){
                next(e);
            }
        }else{
            throw new ServerException(400, "unable_to_mail", "Unable to send recovery email");
        }
    }).catch(next);
}