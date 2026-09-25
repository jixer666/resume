package com.abc.resume.api;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.core.result.ApiResult;
import com.abc.resume.resume.domain.dto.ResumeSaveDTO;
import com.abc.resume.resume.domain.vo.ResumeVO;
import com.abc.resume.resume.service.ResumeService;
import com.abc.resume.system.utils.SecurityUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api(tags = "简历接口")
@RestController
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @ApiOperation("保存简历")
    @PostMapping("/save")
    public ApiResult<ResumeVO> save(@RequestBody ResumeSaveDTO saveDTO) {
        ResumeVO resumeVO = resumeService.save(SecurityUtils.getUserId(), saveDTO);
        return ApiResult.success(resumeVO);
    }

    @ApiOperation("简历列表")
    @GetMapping("/list")
    public ApiResult<PageResult> list() {
        PageResult pageResult = resumeService.list(SecurityUtils.getUserId());
        return ApiResult.success(pageResult);
    }

    @ApiOperation("简历详情")
    @GetMapping("/detail/{id}")
    public ApiResult<ResumeVO> detail(@PathVariable("id") Long id) {
        ResumeVO resumeVO = resumeService.detail(SecurityUtils.getUserId(), id);
        return ApiResult.success(resumeVO);
    }

    @ApiOperation("复制简历")
    @PostMapping("/copy/{id}")
    public ApiResult<ResumeVO> copy(@PathVariable("id") Long id) {
        ResumeVO resumeVO = resumeService.copy(SecurityUtils.getUserId(), id);
        return ApiResult.success(resumeVO);
    }

    @ApiOperation("删除简历")
    @PostMapping("/delete/{id}")
    public ApiResult<Void> delete(@PathVariable("id") Long id) {
        resumeService.delete(SecurityUtils.getUserId(), id);
        return ApiResult.success();
    }

}
