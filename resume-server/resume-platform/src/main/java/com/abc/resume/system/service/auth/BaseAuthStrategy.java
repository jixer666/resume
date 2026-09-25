package com.abc.resume.system.service.auth;

import com.abc.resume.constants.CommonConstants;
import com.abc.resume.system.domain.dto.RegisterDTO;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.domain.enums.ChannelEnum;
import com.abc.resume.util.IdUtils;
import com.abc.resume.util.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Objects;

public class BaseAuthStrategy {

    public User buildUserByRegisterDTO(RegisterDTO registerDTO) {
        User user = new User();
        user.setUid(IdUtils.getIdStr());
        user.setUsername(StringUtils.isEmpty(registerDTO.getUsername()) ? StringUtils.EMPTY : registerDTO.getUsername());
        user.setPassword(StringUtils.isEmpty(registerDTO.getPassword()) ? StringUtils.EMPTY : new BCryptPasswordEncoder().encode(registerDTO.getPassword()));
        ChannelEnum channelEnum = ChannelEnum.chOf(registerDTO.getCh());
        user.setNickname(Objects.isNull(channelEnum) ? CommonConstants.DEFAULT_NICKNAME : channelEnum.getDesc() + CommonConstants.DEFAULT_NICKNAME);
        user.setAvatar(CommonConstants.DEFAULT_AVATAR);
        user.setOpenid(registerDTO.getOpenid());
        user.setCh(registerDTO.getCh());
        user.setEmail(StringUtils.isEmpty(registerDTO.getEmail()) ? StringUtils.EMPTY : registerDTO.getEmail());
        user.setCommonParams();
        return user;
    }

}
