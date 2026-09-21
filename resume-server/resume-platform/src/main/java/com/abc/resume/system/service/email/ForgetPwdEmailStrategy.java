package com.abc.resume.system.service.email;

import cn.hutool.core.util.RandomUtil;
import com.abc.resume.constants.CacheConstants;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.system.constants.EmailConstants;
import com.abc.resume.system.domain.dto.EmailDTO;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.domain.vo.EmailVO;
import com.abc.resume.system.service.UserService;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.EnvironmentUtils;
import com.abc.resume.util.RedisUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@EmailStrategy(EmailTypeEnum.FORGET)
public class ForgetPwdEmailStrategy implements IEmailStrategy {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserService userService;

    @Override
    public EmailVO sendEmail(EmailDTO emailDTO) {
        checkSendEmail(emailDTO);
        saveForgetPwdCode(emailDTO);

        try {
            if (!EnvironmentUtils.isProd()) {
            } else {
                doSend(mailSender, emailDTO);
            }
        } catch (Exception e) {
            log.error("发送找回密码邮件出错，{}", e.getMessage(), e);
            throw new GlobalException("发送找回密码邮件出错");
        }

        return buildEmailVoByEmailDTO(emailDTO);
    }

    private void checkSendEmail(EmailDTO emailDTO) {
        String email = emailDTO.getEmail();
        User user = userService.getUserByEmail(email);
        AssertUtils.isNotEmpty(user, "该邮箱并未被绑定，请先注册");
        emailDTO.getDetailsMap().put(EmailConstants.FORGET_PWD_USERNAME, user.getUsername());
    }

    private void saveForgetPwdCode(EmailDTO emailDTO) {
        String emailCacheKey = CacheConstants.getFinalKey(CacheConstants.EMAIL_FORGET_PWD_UUID, emailDTO.getEmailUuid());
        String emailRecheckCacheKey = CacheConstants.getFinalKey(CacheConstants.EMAIL_FORGET_PWD_RECHECK, emailDTO.getEmailUuid());
        String emailCode = RandomUtil.randomNumbers(6);
        log.info("发送找回密码验证码，key:{}, code:{}", emailCacheKey, emailCode);

        emailDTO.getDetailsMap().put(EmailConstants.EMAIL_CODE, emailCode);

        RedisUtils.set(emailCacheKey, emailCode, CacheConstants.EMAIL_FORGET_PWD_UUID_EXPIRE_TIME, TimeUnit.MINUTES);
        RedisUtils.set(emailRecheckCacheKey, emailDTO.getEmail(), CacheConstants.EMAIL_FORGET_PWD_UUID_EXPIRE_TIME, TimeUnit.MINUTES);
    }

    @Override
    public String getTitle(Map<String, String> params) {
        return EmailConstants.FORGET_PWD_TITLE;
    }

    @Override
    public String getContent(Map<String, String> params) {
        return String.format(EmailConstants.FORGET_PWD_CONTENT, params.get(EmailConstants.FORGET_PWD_USERNAME), params.get(EmailConstants.EMAIL_CODE));
    }
}
