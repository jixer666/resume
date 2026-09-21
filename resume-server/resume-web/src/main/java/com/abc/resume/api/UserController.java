package com.abc.resume.api;

import com.abc.resume.core.result.ApiResult;
import com.abc.resume.system.domain.dto.LoginDTO;
import com.abc.resume.system.domain.dto.RegisterDTO;
import com.abc.resume.system.domain.vo.LoginVO;
import com.abc.resume.system.domain.vo.UserInfoVO;
import com.abc.resume.system.service.UserService;
import com.abc.resume.system.utils.SecurityUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api(tags = "用户接口")
@RestController
@RequestMapping("/system/user")
public class UserController {

    @Autowired
    private UserService userService;

    @ApiOperation("登录")
    @PostMapping("/login")
    public ApiResult<LoginVO> login(@RequestBody LoginDTO loginDTO) {
        LoginVO loginVO = userService.login(loginDTO);
        return ApiResult.success(loginVO);
    }

    @ApiOperation("注册")
    @PostMapping("/register")
    public ApiResult<Void> register(@RequestBody RegisterDTO registerDTO) {
        userService.register(registerDTO);
        return ApiResult.success();
    }

    @ApiOperation("获取用户信息")
    @GetMapping("/info")
    public ApiResult<UserInfoVO> getUserInfo() {
        UserInfoVO userInfo = userService.getUserInfo(SecurityUtils.getUserId());
        return ApiResult.success(userInfo);
    }


}
