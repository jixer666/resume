package com.abc.resume.system.service.impl;

import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.strategy.ServiceProvider;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.LoginDTO;
import com.abc.resume.system.domain.dto.LoginUserDTO;
import com.abc.resume.system.domain.dto.RegisterDTO;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.domain.enums.ChannelEnum;
import com.abc.resume.system.domain.vo.*;
import com.abc.resume.system.mapper.UserMapper;
import com.abc.resume.system.service.TokenService;
import com.abc.resume.system.service.UserService;
import com.abc.resume.system.service.auth.AuthTypeEnum;
import com.abc.resume.system.service.auth.IAuthStrategy;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends BaseService implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ServiceProvider serviceProvider;

    @Autowired
    private TokenService tokenService;

    @Override
    public User getUserByUsername(String username) {
        AssertUtils.isNotEmpty(username, ExceptionEnum.PARAM_EXCEPTION);
        return userMapper.selectUserByUsername(username);
    }

    @Override
    public User getUserByUid(String uid) {
        AssertUtils.isNotEmpty(uid, ExceptionEnum.PARAM_EXCEPTION);
        return userMapper.selectUserByUid(uid);
    }

    @Override
    public User getUserByOpenidAndCh(String openid, String ch) {
        AssertUtils.isNotEmpty(openid, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(ch, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(ChannelEnum.chOf(ch), ExceptionEnum.PARAM_EXCEPTION.getCode(), "未知渠道来源");
        return userMapper.getUserByOpenidAndCh(openid, ch);
    }

    @Override
    public User getUserByEmail(String email) {
        AssertUtils.isNotEmpty(email, ExceptionEnum.PARAM_EXCEPTION);
        return userMapper.selectUserByEmail(email);
    }

    @Override
    public User saveUser(User user) {
        AssertUtils.isNotEmpty(user, ExceptionEnum.PARAM_EXCEPTION);
        int row = userMapper.insertUser(user);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
        return user;
    }

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        AssertUtils.isNotEmpty(loginDTO, ExceptionEnum.PARAM_EXCEPTION);
        IAuthStrategy authStrategy = getAuthStrategyByAuthType(loginDTO.getAuthType());
        LoginUserDTO loginUserDTO = authStrategy.authenticate(loginDTO);
        String token = tokenService.createToken(loginUserDTO);
        return new LoginVO(token);
    }

    private IAuthStrategy getAuthStrategyByAuthType(Integer authType) {
        AuthTypeEnum authTypeEnum = AuthTypeEnum.typeOf(authType);
        AssertUtils.isNotEmpty(authTypeEnum, ExceptionEnum.BIZ_EXCEPTION);
        return serviceProvider.getService(authTypeEnum, IAuthStrategy.class);
    }

    @Override
    public void register(RegisterDTO registerDTO) {
        AssertUtils.isNotEmpty(registerDTO, ExceptionEnum.PARAM_EXCEPTION);
        IAuthStrategy authStrategy = getAuthStrategyByAuthType(registerDTO.getAuthType());
        authStrategy.doRegister(registerDTO);
    }

    @Override
    public UserInfoVO getUserInfo(String uid) {
        AssertUtils.isNotEmpty(uid, ExceptionEnum.PARAM_EXCEPTION);
        UserInfoVO userInfoVO = new UserInfoVO();
        User user = getUserByUid(uid);
        userInfoVO.setUser(BeanUtils.copyProperties(user, UserVO.class));
        return userInfoVO;
    }

}
