package com.abc.resume.system.service.email;

import cn.hutool.core.util.RandomUtil;
import com.abc.resume.constants.CacheConstants;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.constants.EmailConstants;
import com.abc.resume.system.domain.dto.EmailDTO;
import com.abc.resume.system.domain.vo.EmailVO;
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
@EmailStrategy(EmailTypeEnum.REGISTER)
public class RegisterEmailStrategy implements IEmailStrategy {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public EmailVO sendEmail(EmailDTO emailDTO) {
        saveRegisterCode(emailDTO);

        try {
            if (EnvironmentUtils.isProd()) {
                doSend(mailSender, emailDTO);
            }
        } catch (Exception e) {
            log.error("发送注册邮件出错，{}", e.getMessage(), e);
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION.getCode(), "发送注册邮件出错");
        }

        return buildEmailVoByEmailDTO(emailDTO);
    }

    private void saveRegisterCode(EmailDTO emailDTO) {
        String emailCacheKey = CacheConstants.getFinalKey(CacheConstants.EMAIL_UUID, emailDTO.getEmailUuid());
        String emailRecheckCacheKey = CacheConstants.getFinalKey(CacheConstants.EMAIL_RECHECK, emailDTO.getEmailUuid());
        String emailCode = RandomUtil.randomNumbers(6);
        log.info("发送注册验证码，key:{}, code:{}", emailCacheKey, emailCode);

        emailDTO.getDetailsMap().put(EmailConstants.EMAIL_CODE, emailCode);

        RedisUtils.set(emailCacheKey, emailCode, CacheConstants.EMAIL_UUID_EXPIRE_TIME, TimeUnit.MINUTES);
        RedisUtils.set(emailRecheckCacheKey, emailDTO.getEmail(), CacheConstants.EMAIL_UUID_EXPIRE_TIME, TimeUnit.MINUTES);
    }

    @Override
    public String getTitle(Map<String, String> params) {
        return EmailConstants.REGISTER_TITLE;
    }

    @Override
    public String getContent(Map<String, String> params) {
        return String.format(EmailConstants.REGISTER_CONTENT, params.get(EmailConstants.EMAIL_CODE));
    }
}
