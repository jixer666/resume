package com.abc.resume.api;

import com.abc.resume.core.page.PageDTO;
import com.abc.resume.core.page.PageResult;
import com.abc.resume.core.result.ApiResult;
import com.abc.resume.resume.domain.dto.UserResumeCreateDTO;
import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.vo.UserResumeVO;
import com.abc.resume.resume.service.UserResumeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = "用户简历接口")
@RestController
@RequestMapping("/resume")
public class UserResumeController {

    @Autowired
    private UserResumeService userResumeService;

    @ApiOperation("查询用户简历分页")
    @PostMapping("/page")
    public ApiResult<PageResult> getUserResumePage(@RequestBody UserResumePageDTO dto) {
        PageResult pageResult = userResumeService.getUserResumePage(dto);
        return ApiResult.success(pageResult);
    }

    @ApiOperation("创建简历")
    @PostMapping("/create")
    public ApiResult<UserResumeVO> createResume(@RequestBody UserResumeCreateDTO dto) {
        UserResumeVO resumeVO = userResumeService.createResume(dto);
        return ApiResult.success(resumeVO);
    }

}
