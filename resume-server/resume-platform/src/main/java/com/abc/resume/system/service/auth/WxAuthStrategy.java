package com.abc.resume.system.service.auth;

import com.abc.resume.config.WechatConfig;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.LoginDTO;
import com.abc.resume.system.domain.dto.LoginUserDTO;
import com.abc.resume.system.domain.dto.RegisterDTO;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.domain.enums.ChannelEnum;
import com.abc.resume.system.service.UserService;
import com.abc.resume.system.service.auth.domain.WxJsCode2SessionResp;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.HttpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Objects;

@Service
@AuthStrategy(AuthTypeEnum.WX)
public class WxAuthStrategy extends BaseAuthStrategy implements IAuthStrategy {

    private static final String WX_CODE_REQ_URL = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
    private static final int TIMEOUT = 4000;

    @Autowired
    private WechatConfig wechatConfig;

    @Autowired
    private UserService userService;

    @Override
    public LoginUserDTO authenticate(LoginDTO loginDTO) {
        AssertUtils.isNotEmpty(loginDTO.getCode(), ExceptionEnum.PARAM_EXCEPTION);
        // 获取openid
        String url = String.format(WX_CODE_REQ_URL, wechatConfig.getAppid(), wechatConfig.getAppSecret(), loginDTO.getCode());
        WxJsCode2SessionResp wxJsCode2SessionResp = HttpUtils.get(url, WxJsCode2SessionResp.class, TIMEOUT);
        AssertUtils.isNotEmpty(wxJsCode2SessionResp, ExceptionEnum.BIZ_EXCEPTION.getCode(), "微信登录超时，请稍后再试");
        AssertUtils.isTrue(wxJsCode2SessionResp.isSuccess(), ExceptionEnum.BIZ_EXCEPTION.getCode(), wxJsCode2SessionResp.getErrmsg());
        // 查询用户信息
        User user = userService.getUserByOpenidAndCh(wxJsCode2SessionResp.getOpenid(), ChannelEnum.WX.getCh());
        if (Objects.isNull(user)) {
            // 未查询到用户，先注册用户
            RegisterDTO registerDTO = buildRegisterDTO(wxJsCode2SessionResp);
            user = doRegister(registerDTO);
        }
        AssertUtils.isTrue(!user.getIsDelete().equals(user.getUid()), ExceptionEnum.BIZ_EXCEPTION.getCode(), "用户已被禁用");
        return new LoginUserDTO(user, null, new HashSet<>());
    }

    private RegisterDTO buildRegisterDTO(WxJsCode2SessionResp wxJsCode2SessionResp) {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setCh(ChannelEnum.WX.getCh());
        registerDTO.setOpenid(wxJsCode2SessionResp.getOpenid());
        registerDTO.setUsername(wxJsCode2SessionResp.getOpenid());
        return registerDTO;
    }

    @Override
    public User doRegister(RegisterDTO registerDTO) {
        User user = buildUserByRegisterDTO(registerDTO);
        userService.saveUser(user);
        return user;
    }

}
