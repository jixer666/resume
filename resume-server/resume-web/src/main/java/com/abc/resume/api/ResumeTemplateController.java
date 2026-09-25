package com.abc.resume.api;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.core.result.ApiResult;
import com.abc.resume.resume.domain.dto.ResumeTemplatePageDTO;
import com.abc.resume.resume.service.ResumeTemplateService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "简历模板接口")
@RestController
@RequestMapping("/resume/template")
public class ResumeTemplateController {

    @Autowired
    private ResumeTemplateService resumeTemplateService;

    @ApiOperation("简历模板分页查询")
    @PostMapping("/page")
    public ApiResult<PageResult> getResumeTemplatePage(@RequestBody ResumeTemplatePageDTO dto){
        PageResult pageInfo = resumeTemplateService.getResumeTemplatePage(dto);
        return ApiResult.success(pageInfo);
    }

}
