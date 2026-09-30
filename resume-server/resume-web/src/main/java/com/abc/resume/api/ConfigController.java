package com.abc.resume.api;

import com.abc.resume.core.result.ApiResult;
import com.abc.resume.system.domain.vo.ResumeConfigVO;
import com.abc.resume.system.service.ConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author LiJunXi
 * @date 2026/9/26
 */
@Api(tags = "配置接口")
@RestController
@RequestMapping("/config")
public class ConfigController {

    @Autowired
    private ConfigService configService;

    @ApiOperation("查询简历前端配置")
    @GetMapping("/resume")
    public ApiResult<ResumeConfigVO> getResumeConfig() {
        return ApiResult.success(configService.getResumeConfig());
    }

}
