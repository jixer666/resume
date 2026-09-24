package com.abc.resume.system.service;

import com.abc.resume.system.domain.dto.LoginDTO;
import com.abc.resume.system.domain.dto.RegisterDTO;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.domain.enums.ChannelEnum;
import com.abc.resume.system.domain.vo.LoginVO;
import com.abc.resume.system.domain.vo.UserInfoVO;

public interface UserService {

    User getUserByUsername(String username);

    User getUserByUid(String uid);

    User getUserByOpenidAndCh(String openid, String ch);

    LoginVO login(LoginDTO loginDTO);

    void register(RegisterDTO registerDTO);

    User getUserByEmail(String email);

    User saveUser(User user);

    UserInfoVO getUserInfo(String uid);

}
