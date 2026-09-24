package com.abc.resume.system.service.impl;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.RandomUtil;
import com.abc.resume.constants.CacheConstants;
import com.abc.resume.constants.CommonConstants;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.LoginUserDTO;
import com.abc.resume.system.service.TokenService;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.RedisUtils;
import com.abc.resume.util.StringUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class TokenServiceImpl implements TokenService {

    @Value("${token.expireTime}")
    private Integer tokenExpireTime;

    @Value("${token.refreshTime}")
    private Integer refreshTime;

    @Value("${token.secret}")
    private String secret;


    @Value("${token.header}")
    private String tokenHeader;

    @Override
    public String createToken(LoginUserDTO loginUser) {
        String tokenKey = RandomUtil.randomString(8);
        loginUser.setTokenKey(tokenKey);
        fillLoginUserParam(loginUser);
        refreshToken(loginUser);

        return createToken(tokenKey, loginUser.getUserId());
    }

    private String createToken(String tokenKey, String userId) {
        Map<String, Object> tokenMap = new HashMap<>();
        tokenMap.put(CommonConstants.LOGIN_TOKEN_KEY, tokenKey);
        tokenMap.put(CommonConstants.JWT_USERID, userId);

        return Jwts.builder()
                .setClaims(tokenMap)
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }

    private void fillLoginUserParam(LoginUserDTO loginUser) {
    }

    @Override
    public void refreshToken(LoginUserDTO loginUser) {
        String loginTokenCacheKey = CacheConstants.getFinalKey(CacheConstants.LOGIN_TOKEN_KEY, loginUser.getTokenKey());
        LoginUserDTO loginUserDTO = RedisUtils.get(loginTokenCacheKey, LoginUserDTO.class);
        if (ObjectUtil.isNull(loginUserDTO)) {
            loginUser.setLoginTime(System.currentTimeMillis());
        }
        loginUser.setExpireTime(System.currentTimeMillis() + tokenExpireTime * 60 * 1000);
        RedisUtils.set(loginTokenCacheKey, loginUser,  tokenExpireTime, TimeUnit.MINUTES);
    }

    @Override
    public void validateToken(LoginUserDTO loginUser) {
        long nowTime = System.currentTimeMillis();
        if (loginUser.getExpireTime() > nowTime + refreshTime * 60 * 1000) {
            return;
        }
        refreshToken(loginUser);
    }

    @Override
    public String getToken(HttpServletRequest request) {
        String token = request.getHeader(tokenHeader);
        if (StringUtils.isEmpty(token)) {
            return null;
        }
        return token.replace(CommonConstants.TOKEN_PREFIX, "");
    }

    @Override
    public LoginUserDTO getLoginUserDTO(String token) {
        try {
            Claims claims = parseToken(token);
            String tokenKey = claims.get(CommonConstants.LOGIN_TOKEN_KEY).toString();
            return RedisUtils.get(CacheConstants.getFinalKey(CacheConstants.LOGIN_TOKEN_KEY, tokenKey), LoginUserDTO.class);
        } catch (Exception e) {
            log.error("解析Token用户信息出错，{}", e.getMessage(), e);
            throw new GlobalException(ExceptionEnum.UNAUTHORIZED_EXCEPTION);
        }
    }

    private Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.error("解析JWT出错，{}", e.getMessage(), e);
            throw new GlobalException(ExceptionEnum.UNAUTHORIZED_EXCEPTION);
        }

    }

    @Override
    public void invalidToken(String token) {
        AssertUtils.isNotEmpty(token, ExceptionEnum.PARAM_EXCEPTION);

        LoginUserDTO loginUser = getLoginUserDTO(token);
        if (ObjectUtil.isNull(loginUser)) {
            return;
        }

        String loginTokenCacheKey = CacheConstants.getFinalKey(CacheConstants.LOGIN_TOKEN_KEY, loginUser.getTokenKey());
        RedisUtils.del(loginTokenCacheKey);

    }
}
