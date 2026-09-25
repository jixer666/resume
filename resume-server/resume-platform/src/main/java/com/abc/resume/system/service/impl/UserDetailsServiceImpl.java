package com.abc.resume.system.service.impl;

import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.security.context.SecurityAuthContext;
import com.abc.resume.system.domain.dto.LoginUserDTO;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.service.UserService;
import com.abc.resume.system.utils.SecurityUtils;
import com.abc.resume.util.AssertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getUserByUsername(username);
        AssertUtils.isNotEmpty(user, ExceptionEnum.LOGIN_EXCEPTION);
        AssertUtils.isTrue(!user.getIsDelete().equals(user.getId()), ExceptionEnum.LOGIN_EXCEPTION.getCode(), "用户已被禁用，无法登录");
        AssertUtils.isTrue(SecurityUtils.matchesPassword(SecurityAuthContext.getContext().getCredentials().toString(),
                user.getPassword()), ExceptionEnum.LOGIN_EXCEPTION);
//        List<String> roles = roleService.getRoleKeysByUserId(user.getUserId());
//        Set<String> perms = menuService.getMenusByUserId(user.getUserId())
//                .stream()
//                .map(Menu::getPerms)
//                .filter(item -> !Objects.isNull(item))
//                .collect(Collectors.toSet());
//
//        return new LoginUserDTO(user, perms, new HashSet<>(roles));
        return new LoginUserDTO(user, null, new HashSet<>());

    }
}
