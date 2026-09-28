package com.abc.resume.api;

import com.abc.resume.core.result.ApiResult;
import com.abc.resume.system.domain.dto.OssFileUploadDTO;
import com.abc.resume.system.domain.vo.FileVO;
import com.abc.resume.system.service.OssService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author LiJunXi
 * @date 2026/9/28
 */
@Api(tags = "OSS接口")
@RestController
@RequestMapping("/system/oss")
public class OssController {

    @Autowired
    private OssService ossService;

    @ApiOperation("上传文件")
    @PostMapping("/upload")
    public ApiResult<FileVO> uploadOss(@Validated OssFileUploadDTO req) {
        return ApiResult.success(ossService.uploadOss(req));
    }

    @ApiOperation("下载文件")
    @GetMapping("/download/{fileId}")
    public ResponseEntity<byte[]> downloadOss(@PathVariable("fileId") Long fileId){
        return ossService.downloadOss(fileId);
    }


}
