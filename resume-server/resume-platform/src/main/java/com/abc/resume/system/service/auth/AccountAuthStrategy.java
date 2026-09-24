package com.abc.resume.system.service.auth;

import cn.hutool.core.util.RandomUtil;
import com.abc.resume.constants.CommonConstants;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.security.context.SecurityAuthContext;
import com.abc.resume.system.domain.dto.LoginDTO;
import com.abc.resume.system.domain.dto.LoginUserDTO;
import com.abc.resume.system.domain.dto.RegisterDTO;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.service.EmailService;
import com.abc.resume.system.service.UserService;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.IdUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AuthStrategy(AuthTypeEnum.ACCOUNT)
public class AccountAuthStrategy extends BaseAuthStrategy implements IAuthStrategy {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Override
    public LoginUserDTO authenticate(LoginDTO loginDTO) {
        preLoginCheck(loginDTO);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());
        SecurityAuthContext.setContext(authToken);
        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityAuthContext.removeContext();
        return (LoginUserDTO) authentication.getPrincipal();
    }

    public void preLoginCheck(LoginDTO loginDTO) {
        AssertUtils.isNotEmpty(loginDTO, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(loginDTO.getAuthType(), ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(loginDTO.getUsername(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "账户不能为空");
        AssertUtils.isNotEmpty(loginDTO.getPassword(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "密码不能为空");
        loginDTO.setUsername(loginDTO.getUsername().trim());
        loginDTO.setPassword(loginDTO.getPassword().trim());
    }

    @Override
    public User doRegister(RegisterDTO registerDTO) {
        preRegisterCheck(registerDTO);
        User user = buildUserByRegisterDTO(registerDTO);
        userService.saveUser(user);
        afterRegister(user, registerDTO);
        return user;
    }

    private void afterRegister(User user, RegisterDTO registerDTO) {
        emailService.invalidEmailCode(registerDTO.getEmailUuid());
    }

    public void preRegisterCheck(RegisterDTO registerDTO) {
        AssertUtils.isNotEmpty(registerDTO.getUsername(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "账号不能为空");
        AssertUtils.isNotEmpty(registerDTO.getPassword(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "密码不能为空");
        AssertUtils.isNotEmpty(registerDTO.getPasswordAgain(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "确认密码不能为空");
        AssertUtils.isTrue(registerDTO.getPassword().equalsIgnoreCase(registerDTO.getPasswordAgain()), ExceptionEnum.PARAM_EXCEPTION.getCode(), "两次输入密码不一致");
        AssertUtils.isNotEmpty(registerDTO.getAuthType(), ExceptionEnum.PARAM_EXCEPTION);
        registerDTO.setUsername(registerDTO.getUsername().trim());
        registerDTO.setPassword(registerDTO.getPassword().trim());
        User user = userService.getUserByUsername(registerDTO.getUsername());
        AssertUtils.isEmpty(user, ExceptionEnum.PARAM_EXCEPTION.getCode(), "账号已存在");
        user = userService.getUserByEmail(registerDTO.getEmail());
        AssertUtils.isEmpty(user, ExceptionEnum.PARAM_EXCEPTION.getCode(), "邮箱已被绑定");
        Boolean checkEmailCode = emailService.checkEmailCode(registerDTO.getEmailUuid(), registerDTO.getEmail(), registerDTO.getEmailCode());
        AssertUtils.isTrue(checkEmailCode, "邮箱验证码错误");
    }
}
