package com.abc.resume.system.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ChannelEnum {

    WX("wx", "微信"),

    ;

    private String ch;
    private String desc;

    public static ChannelEnum chOf(String ch) {
        for (ChannelEnum channelEnum : ChannelEnum.values()) {
            if (channelEnum.ch.equals(ch)) {
                return channelEnum;
            }
        }
        return null;
    }
}
