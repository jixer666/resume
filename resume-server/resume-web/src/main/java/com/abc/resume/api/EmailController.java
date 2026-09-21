package com.abc.resume.api;

import com.abc.resume.core.result.ApiResult;
import com.abc.resume.system.domain.dto.EmailDTO;
import com.abc.resume.system.domain.vo.EmailVO;
import com.abc.resume.system.service.EmailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "邮箱接口")
@RestController
@RequestMapping("/system/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @ApiOperation("发送邮件")
    @PostMapping("/send")
    public ApiResult<EmailVO> sendEmail(@RequestBody EmailDTO emailDTO) {
        EmailVO emailVO = emailService.sendEmail(emailDTO);
        return ApiResult.success(emailVO);
    }

}
