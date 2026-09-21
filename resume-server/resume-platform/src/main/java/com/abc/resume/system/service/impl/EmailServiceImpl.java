package com.abc.resume.system.service.impl;

import cn.hutool.core.util.RandomUtil;
import com.abc.resume.constants.CacheConstants;
import com.abc.resume.core.strategy.ServiceProvider;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.constants.EmailConstants;
import com.abc.resume.system.domain.dto.EmailDTO;
import com.abc.resume.system.domain.vo.EmailVO;
import com.abc.resume.system.service.EmailService;
import com.abc.resume.system.service.email.EmailTypeEnum;
import com.abc.resume.system.service.email.IEmailStrategy;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.RedisUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private ServiceProvider serviceProvider;

    @Override
    public EmailVO sendEmail(EmailDTO emailDTO) {
        AssertUtils.isNotEmpty(emailDTO, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(emailDTO.getEmail(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "邮箱不能为空");
        AssertUtils.isNotEmpty(emailDTO.getEmailType(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "邮箱类型不能为空");
        EmailTypeEnum emailTypeEnum = EmailTypeEnum.typeOf(emailDTO.getEmailType());
        AssertUtils.isNotEmpty(emailTypeEnum, ExceptionEnum.BIZ_EXCEPTION);
        IEmailStrategy emailStrategy = serviceProvider.getService(emailTypeEnum, IEmailStrategy.class);
        fillEmailParams(emailDTO);

        return emailStrategy.sendEmail(emailDTO);
    }

    private static void fillEmailParams(EmailDTO emailDTO) {
        emailDTO.setEmailUuid(RandomUtil.randomString(8));
        emailDTO.setFrom(EmailConstants.FROM_EMAIL);
        emailDTO.setTo(emailDTO.getEmail());
    }

    @Override
    public void invalidEmailCode(String emailUuid) {
        AssertUtils.isNotEmpty(emailUuid, "邮箱验证码不能为空");
        RedisUtils.del(CacheConstants.getFinalKey(CacheConstants.EMAIL_UUID, emailUuid));
        RedisUtils.del(CacheConstants.getFinalKey(CacheConstants.EMAIL_RECHECK, emailUuid));
    }

    @Override
    public Boolean checkEmailCode(String emailUuid, String email, String emailCode) {
        AssertUtils.isNotEmpty(emailUuid, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(email, ExceptionEnum.PARAM_EXCEPTION.getCode(), "邮箱不能为空");
        AssertUtils.isNotEmpty(emailCode, ExceptionEnum.PARAM_EXCEPTION.getCode(), "邮箱验证码不能为空");

        String emailRecheckCacheKey = CacheConstants.getFinalKey(CacheConstants.EMAIL_RECHECK, emailUuid);
        String trueEmail = RedisUtils.get(emailRecheckCacheKey);
        AssertUtils.isTrue(email.equalsIgnoreCase(trueEmail), ExceptionEnum.BIZ_EXCEPTION.getCode(),"邮箱验证失败，请重试");
        String emailCacheKey = CacheConstants.getFinalKey(CacheConstants.EMAIL_UUID, emailUuid);
        String trueCode = RedisUtils.get(emailCacheKey);
        AssertUtils.isNotEmpty(trueCode, ExceptionEnum.BIZ_EXCEPTION.getCode(), "邮箱验证码已失效");

        return trueCode.equalsIgnoreCase(emailCode);
    }
}
