package com.abc.resume.system.service;

import com.abc.resume.system.domain.dto.EmailDTO;
import com.abc.resume.system.domain.vo.EmailVO;

public interface EmailService {

    EmailVO sendEmail(EmailDTO emailDTO);

    void invalidEmailCode(String emailUuid);

    Boolean checkEmailCode(String emailUuid, String email, String emailCode);
}
