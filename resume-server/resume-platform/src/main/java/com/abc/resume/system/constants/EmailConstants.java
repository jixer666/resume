package com.abc.resume.system.constants;

public class EmailConstants {

    public static final String FROM_EMAIL = "2770063826@qq.com";

    public static final String EMAIL_CODE = "emailCode";

    public static final String REGISTER_TITLE = "注册账号邮件";

    public static final String REGISTER_CONTENT = "<html>" +
            "<body style='font-family: Arial, sans-serif; line-height: 1.5;'>" +
            "<div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>" +
            "<h2 style='color: #333;'>尊敬的用户，</h2>" +
            "<p>您好！感谢您使用我们的服务。</p>" +
            "<p>您的验证码是：<span style='font-size: 18px; font-weight:600'>%s</span>，有效期为 <strong>5分钟</strong>。</p>" +
            "<p>请您在有效期内使用此验证码进行操作。</p>" +
            "<p>如您并未发起此请求，您可以安全地忽略此邮件。</p>" +
            "<p>为了保障您的账户安全，请勿将此验证码透露给他人。</p>" +
            "<p>感谢您的配合与支持！</p>" +
            "<p>祝您生活愉快！</p>" +
            "<footer style='margin-top: 20px; font-size: 12px; color: #777;'>本邮件由系统自动生成，请勿回复。</footer>" +
            "</div>" +
            "</body>" +
            "</html>";

    public static final String FORGET_PWD_TITLE = "Omni找回密码邮件";

    public static final String FORGET_PWD_USERNAME = "username";

    public static final String FORGET_PWD_CONTENT = "<html>\n" +
            "<body style='font-family: Arial, sans-serif; line-height: 1.5;'>" +
            "<div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>" +
            "<h2 style='color: #333;'>尊敬的用户，</h2>" +
            "<p>我们收到了您重置 Omni 账户密码的申请。</p>\n" +
            "<p>您的账号：<strong>%s</strong>，您的验证码是：<span style='font-size: 18px; font-weight:600'>%s</span>，有效期为 <strong>5分钟</strong>。</p>" +
            "<p>请您在有效期内使用此验证码进行操作。</p>" +
            "<p>如您并未发起此请求，您可以安全地忽略此邮件。</p>" +
            "<p>为了保障您的账户安全，请勿将此验证码透露给他人。</p>" +
            "<p>感谢您的配合与支持！</p>" +
            "<p>祝您生活愉快！</p>" +
            "<footer style='margin-top: 20px; font-size: 12px; color: #777;'>本邮件由系统自动生成，请勿回复。</footer>" +
            "</div>\n" +
            "</body>\n" +
            "</html>";


}
