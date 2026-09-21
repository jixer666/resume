package com.abc.resume.system.service.auth;

import com.abc.resume.system.domain.dto.LoginDTO;
import com.abc.resume.system.domain.dto.LoginUserDTO;
import com.abc.resume.system.domain.dto.RegisterDTO;
import com.abc.resume.system.domain.entity.User;

public interface IAuthStrategy {

    LoginUserDTO authenticate(LoginDTO loginDTO);

    User doRegister(RegisterDTO registerDTO);

}
