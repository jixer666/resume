package com.abc.resume.system.domain.dto;

import com.abc.resume.system.domain.entity.User;
import com.alibaba.fastjson2.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginUserDTO implements UserDetails {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户唯一标识
     */
    private String tokenKey;

    /**
     * 登录时间
     */
    private Long loginTime;

    /**
     * 过期时间
     */
    private Long expireTime;

    /**
     * 权限列表
     */
    private Set<String> permissions;

    /**
     * 角色列表
     */
    private Set<String> roles;

    private String loginLocation;

    private String browser;

    private String os;

    /**
     * 用户信息
     */
    private User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    /**
     * 账户是否未过期,过期无法验证
     */
    @JSONField(serialize = false)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 指定用户是否解锁,锁定的用户无法进行身份验证
     */
    @JSONField(serialize = false)
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 指示是否已过期的用户的凭据(密码),过期的凭据防止认证
     */
    @JSONField(serialize = false)
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 是否可用 ,禁用的用户不能身份验证
     */
    @JSONField(serialize = false)
    @Override
    public boolean isEnabled() {
        return true;
    }


    public LoginUserDTO(User user, Set<String> permissions, Set<String> roles) {
        this.userId = user.getUid();
        this.user = user;
        this.permissions = permissions;
        this.roles = roles;
    }
}
