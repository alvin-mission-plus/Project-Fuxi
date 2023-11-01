const nodemailer = require('nodemailer');

function ResetPasswordEmail(recipient, token) {
    const username = 'hungnmps24605@fpt.edu.vn';
    const password = 'huxk hsqk xskp cnhu';
    const link = `exp://10.10.11.129:19000/change-password?token=${token}`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: username,
            pass: password,
        },
    });

    const mailOptions = {
        from: username,
        to: recipient,
        subject: '[Fuxi] - Password Reset Request',
        html: htmlContent(link),
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(401);
            } else {
                console.log('Email sent successfully!', info.response);
                resolve(200);
            }
        });
    });
}

module.exports = {
    ResetPasswordEmail,
};

function htmlContent(link) {
    return `   
   <html>
   <head></head>
   <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
      <!--100% body table-->
      <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
         style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
         <tr>
            <td>
               <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                  align="center" cellpadding="0" cellspacing="0">
                  <tr>
                     <td style="height:80px;">&nbsp;</td>
                  </tr>
                  <tr>
                     <td style="text-align:center;">
                        <a href="https://rakeshmandal.com" title="logo" target="_blank">
                        <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                        </a>
                     </td>
                  </tr>
                  <tr>
                     <td style="height:20px;">&nbsp;</td>
                  </tr>
                  <tr>
                     <td>
                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                           style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                           <tr>
                              <td style="height:40px;">&nbsp;</td>
                           </tr>
                           <tr>
                              <td style="padding:0 35px;">
                                 <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                    requested to reset your password
                                 </h1>
                                 <span
                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                 <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                    We've received a password reset request for your FUXI account. A unique reset link has been generated for you. To reset your password, click the link below and follow the instructions.
                                 </p>
                                 <a href="https://rakeshmandal.com"
                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; margin-bottom:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                 Password</a>
                                 <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                    The password reset link will expire in 1 hours. If you do not reset your password within this time, you will need to request another reset.
                                    If you did not request a password reset, please report this to us immediately.
                                 </p>
                                 <p style="color:#455056; font-size:15px;line-height:24px; margin:0; margin-top: 35px">
                                    If you did not request a password reset, please report this to us immediately.
                                 </p>
                                 <p style="color:#455056; font-size:15px;line-height:24px; margin:0; margin-top: 35px">Thank you for using our service.
                                 </p>
                              </td>
                           </tr>
                           <tr>
                              <td style="height:40px;">&nbsp;</td>
                           </tr>
                        </table>
                     </td>
                  <tr>
                     <td style="height:20px;">&nbsp;</td>
                  </tr>
                  <tr>
                  </tr>
                  <tr>
                     <td style="height:80px;">&nbsp;</td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
      <!--/100% body table-->
   </body>
   </html>
   `;
}
