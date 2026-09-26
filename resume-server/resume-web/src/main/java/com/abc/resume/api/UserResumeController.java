package com.abc.resume.api;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.core.result.ApiResult;
import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.dto.UserResumeSubmitDTO;
import com.abc.resume.resume.domain.vo.UserResumeVO;
import com.abc.resume.resume.service.UserResumeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

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

    @ApiOperation("查询用户简历详情")
    @GetMapping("/detail/{id}")
    public ApiResult<UserResumeVO> getUserResumeDetail(@PathVariable("id") Long id) {
        UserResumeVO resumeVO = userResumeService.getUserResumeDetail(id);
        return ApiResult.success(resumeVO);
    }

    @ApiOperation("提交简历")
    @PostMapping("/submit")
    public ApiResult<UserResumeVO> submitResume(@RequestBody UserResumeSubmitDTO dto) {
        UserResumeVO resumeVO = userResumeService.submitResume(dto);
        return ApiResult.success(resumeVO);
    }

    @ApiOperation("导出简历为 PDF")
    @GetMapping("/export/{id}")
    public ResponseEntity<byte[]> exportResume(@PathVariable("id") Long id) {
        byte[] pdf = userResumeService.exportPdf(id);
        HttpHeaders headers = new HttpHeaders();
        // 不能复用 BaseService.download()：它把 contentType 写死成 octet-stream，
        // 小程序端 uni.openDocument 要靠 application/pdf 才认得出文件类型
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("resume-" + id + ".pdf", StandardCharsets.UTF_8).build());
        headers.setContentLength(pdf.length);
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

}
