package com.abc.resume.system.mapper;

import com.abc.resume.system.domain.entity.Server;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ServerMapper {
    Server selectServerByServerId(Long serverId);

    Server selectServerByName(String name);

    int insertServer(Server server);

    int updateServer(Server server);

    List<Server> selectServerList();
}
