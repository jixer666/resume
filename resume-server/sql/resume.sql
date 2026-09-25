-- ----------------------------
-- 简历表（P4 持久化）
-- 整份简历 JSON 一步存取，不拆表；resume_json 为外部输入真边界，服务端做结构校验
-- ----------------------------
CREATE TABLE IF NOT EXISTS `resume` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` varchar(50) NOT NULL COMMENT '归属用户uid',
  `title` varchar(128) NOT NULL COMMENT '简历名称',
  `resume_json` json DEFAULT NULL COMMENT '整份简历JSON(IRESUMEJSON)',
  `layout` varchar(64) DEFAULT NULL COMMENT '布局标识',
  `thumbnail` varchar(512) DEFAULT NULL COMMENT '缩略图地址',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `status` tinyint NOT NULL COMMENT '状态',
  `ver` int NOT NULL COMMENT '版本号',
  `is_delete` bigint NOT NULL COMMENT '是否删除（未删除=创建时间毫秒，删除=主键ID）',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_resume_user` (`user_id`, `is_delete`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='简历表';
