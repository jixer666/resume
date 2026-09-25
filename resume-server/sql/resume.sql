/*
 Navicat Premium Dump SQL

 Source Server         : 本地MySQL
 Source Server Type    : MySQL
 Source Server Version : 80043 (8.0.43)
 Source Host           : localhost:3306
 Source Schema         : resume

 Target Server Type    : MySQL
 Target Server Version : 80043 (8.0.43)
 File Encoding         : 65001

 Date: 25/09/2026 18:24:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for config
-- ----------------------------
DROP TABLE IF EXISTS `config`;
CREATE TABLE `config`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '配置编号',
  `group` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分组',
  `value` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '配置值',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `status` tinyint NOT NULL COMMENT '状态',
  `ver` int NOT NULL COMMENT '版本号',
  `is_delete` bigint NOT NULL COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uniq_config_code`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '配置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of config
-- ----------------------------

-- ----------------------------
-- Table structure for resume_template
-- ----------------------------
DROP TABLE IF EXISTS `resume_template`;
CREATE TABLE `resume_template`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '模板编号',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '描述',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '封面',
  `category` bigint NOT NULL COMMENT '分类',
  `template_json` json NULL COMMENT '模板JSON',
  `source` tinyint NOT NULL COMMENT '来源（1-官方预设 2-用户投稿）',
  `uid` bigint NOT NULL COMMENT '用户ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `status` tinyint NOT NULL COMMENT '状态',
  `ver` int NOT NULL COMMENT '版本号',
  `is_delete` bigint NOT NULL COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uniq_template_code`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '简历模板表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of resume_template
-- ----------------------------
INSERT INTO `resume_template` (`id`, `code`, `name`, `description`, `cover`, `category`, `template_json`, `source`, `uid`, `create_time`, `update_time`, `status`, `ver`, `is_delete`) VALUES (1, 'classic', '经典商务', '顶部通栏名片带配主题色章节条，投递绝大多数岗位都不会出错', '', 1, '{"layout":"classical","style":{"themeColor":"#0b63ce","firstTitleFontSize":"18px","secondTitleFontSize":"14px","textFontSize":"14px","secondTitleColor":"#23304a","textFontColor":"#5b6b82","secondTitleWeight":600,"textFontWeight":400,"modelMarginTop":"0px","modelMarginBottom":"32px","pTop":"0px","pBottom":"0px"},"variants":{"BASE_INFO":"BASE_INFO_10","JOB_INTENTION":"JOB_INTENTION_9","EDU_BACKGROUND":"EDU_BACKGROUND_10","SKILL_SPECIALTIES":"SKILL_SPECIALTIES_13","CAMPUS_EXPERIENCE":"CAMPUS_EXPERIENCE_9","INTERNSHIP_EXPERIENCE":"INTERNSHIP_EXPERIENCE_9","WORK_EXPERIENCE":"WORK_EXPERIENCE_9","PROJECT_EXPERIENCE":"PROJECT_EXPERIENCE_9","AWARDS":"AWARDS_9","HOBBIES":"HOBBIES_9","SELF_EVALUATION":"SELF_EVALUATION_9","WORKS_DISPLAY":"WORKS_DISPLAY_9"},"hidden":["RESUME_TITLE"]}', 1, 0, '2026-09-25 18:24:47', '2026-09-25 18:24:47', 1, 1, 1790331887000);
INSERT INTO `resume_template` (`id`, `code`, `name`, `description`, `cover`, `category`, `template_json`, `source`, `uid`, `create_time`, `update_time`, `status`, `ver`, `is_delete`) VALUES (2, 'sidebar', '侧栏简历', '亮蓝侧栏压白字，右侧橙棕章节线贯穿全宽，经历正文独占四分之三版面', '', 1, '{"layout":"leftRight","style":{"themeColor":"#c37530","leftWidth":"25%","rightWidth":"75%","leftThemeColor":"#4184ff","rightThemeColor":"#ffffff","firstTitleFontSize":"16px","secondTitleFontSize":"14px","textFontSize":"14px","secondTitleColor":"#23304a","textFontColor":"#4a4a4a","secondTitleWeight":600,"textFontWeight":400,"pLeftRight":"22px","pTop":"14px","pBottom":"0px","modelMarginTop":"0px","modelMarginBottom":"20px"},"variants":{"BASE_INFO":"BASE_INFO_11","JOB_INTENTION":"JOB_INTENTION_11","EDU_BACKGROUND":"EDU_BACKGROUND_13","SKILL_SPECIALTIES":"SKILL_SPECIALTIES_18","CAMPUS_EXPERIENCE":"CAMPUS_EXPERIENCE_11","INTERNSHIP_EXPERIENCE":"INTERNSHIP_EXPERIENCE_11","WORK_EXPERIENCE":"WORK_EXPERIENCE_11","PROJECT_EXPERIENCE":"PROJECT_EXPERIENCE_11","AWARDS":"AWARDS_11","HOBBIES":"HOBBIES_11","SELF_EVALUATION":"SELF_EVALUATION_11","WORKS_DISPLAY":"WORKS_DISPLAY_11"},"columns":{"left":["BASE_INFO","JOB_INTENTION"],"right":["EDU_BACKGROUND","SKILL_SPECIALTIES","CAMPUS_EXPERIENCE","INTERNSHIP_EXPERIENCE","WORK_EXPERIENCE","PROJECT_EXPERIENCE","AWARDS","HOBBIES","SELF_EVALUATION","WORKS_DISPLAY"]},"hidden":["RESUME_TITLE"]}', 1, 0, '2026-09-25 18:24:47', '2026-09-25 18:24:47', 1, 1, 1790331887000);
INSERT INTO `resume_template` (`id`, `code`, `name`, `description`, `cover`, `category`, `template_json`, `source`, `uid`, `create_time`, `update_time`, `status`, `ver`, `is_delete`) VALUES (3, 'timeline', '时间轴', '紫色分区标题，模块之间留白充足，适合项目经历较多的人', '', 1, '{"layout":"classical","style":{"themeColor":"#6d28d9","firstTitleFontSize":"21px","secondTitleColor":"#4c1d95","textFontColor":"#5b6b82","secondTitleWeight":600,"textFontWeight":400,"modelMarginBottom":"42px"},"variants":{"JOB_INTENTION":"JOB_INTENTION_8","EDU_BACKGROUND":"EDU_BACKGROUND_8","SKILL_SPECIALTIES":"SKILL_SPECIALTIES_10","CAMPUS_EXPERIENCE":"CAMPUS_EXPERIENCE_8","INTERNSHIP_EXPERIENCE":"INTERNSHIP_EXPERIENCE_8","WORK_EXPERIENCE":"WORK_EXPERIENCE_8","PROJECT_EXPERIENCE":"PROJECT_EXPERIENCE_8","AWARDS":"AWARDS_8","HOBBIES":"HOBBIES_8","SELF_EVALUATION":"SELF_EVALUATION_8","WORKS_DISPLAY":"WORKS_DISPLAY_8"}}', 1, 0, '2026-09-25 18:24:47', '2026-09-25 18:24:47', 1, 1, 1790331887000);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `uid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户ID',
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '昵称',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '密码',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `openid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'openid',
  `ch` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '渠道',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `status` tinyint NOT NULL COMMENT '状态',
  `ver` int NOT NULL COMMENT '版本号',
  `is_delete` bigint NOT NULL COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uniq_user_username_ch`(`username` ASC, `ch` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('2vnkLtrYyas', 1, '微信用户', '', '', '', '', 'oSkeB5EEri10mSWBN1vdfh2-Cnjo', 'wx', '2026-09-25 12:38:31', '2026-09-25 12:38:31', 1, 1, 1790311111337);

-- ----------------------------
-- Table structure for user_resume
-- ----------------------------
DROP TABLE IF EXISTS `user_resume`;
CREATE TABLE `user_resume`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `uid` bigint NOT NULL COMMENT '用户ID',
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '简历名称',
  `layout` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'classical' COMMENT '布局',
  `resume_json` json NULL COMMENT '简历JSON',
  `thumbnail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '缩略图地址，未生成时为空串',
  `template_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '模板编码',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `status` int NOT NULL DEFAULT 1 COMMENT '数据状态：1=正常 2=禁用',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `ver` int NOT NULL DEFAULT 0 COMMENT '版本号',
  `is_delete` bigint NOT NULL COMMENT '软删标记',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_resume_user`(`uid` ASC, `is_delete` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户简历表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_resume
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
