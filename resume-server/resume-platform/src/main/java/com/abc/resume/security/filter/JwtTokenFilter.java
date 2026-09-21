package com.abc.resume.security.filter;

import com.abc.resume.system.domain.dto.LoginUserDTO;
import com.abc.resume.system.service.TokenService;
import com.abc.resume.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = tokenService.getToken(request);
        if (StringUtils.isEmpty(token)) {
            chain.doFilter(request, response);
            return;
        }
        LoginUserDTO loginUserDTO = tokenService.getLoginUserDTO(token);
        if (Objects.isNull(loginUserDTO)) {
            chain.doFilter(request, response);
            return;
        }
        tokenService.validateToken(loginUserDTO);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginUserDTO, null, loginUserDTO.getAuthorities());
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        try {
            chain.doFilter(request, response);
        } finally {
            // 后置处理：清理 SecurityContext，防止线程复用导致的安全问题
            SecurityContextHolder.clearContext();
        }
    }
}
