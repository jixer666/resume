package com.abc.resume.system.service.email;

import cn.hutool.extra.spring.SpringUtil;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.system.constants.EmailConstants;
import com.abc.resume.system.domain.dto.EmailDTO;
import com.abc.resume.system.domain.vo.EmailVO;
import com.abc.resume.util.EnvironmentUtils;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Map;

public interface IEmailStrategy {

    EmailVO sendEmail(EmailDTO emailDTO);

    String getTitle(Map<String, String> params);

    String getContent(Map<String, String> params);

    default void doSend(JavaMailSender mailSender, EmailDTO emailDTO) {
        SpringUtil.getBean("threadPoolTaskExecutor", ThreadPoolTaskExecutor.class).submit(() -> {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);
                helper.setFrom(emailDTO.getFrom());
                helper.setTo(emailDTO.getTo());
                helper.setSubject(getTitle(emailDTO.getDetailsMap()));
                helper.setText(getContent(emailDTO.getDetailsMap()), true);
                mailSender.send(message);
            } catch (MessagingException e) {
                throw new GlobalException(e.getMessage());
            }
        });
    }

    default EmailVO buildEmailVoByEmailDTO(EmailDTO emailDTO) {
        EmailVO emailVO = new EmailVO();
        emailVO.setEmailUuid(emailDTO.getEmailUuid());
        if (EnvironmentUtils.isDev()) {
            emailVO.setEmail(emailDTO.getDetailsMap().get(EmailConstants.EMAIL_CODE));
        }
        return emailVO;
    }

}
