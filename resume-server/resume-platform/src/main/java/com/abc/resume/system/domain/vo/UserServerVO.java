package com.abc.resume.system.domain.vo;

import lombok.Data;

import java.util.List;

@Data
public class UserServerVO {

    private List<ServerVO> serverList;

    private ServerVO lastEnterServer;

}
