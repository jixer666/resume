<script lang="ts" setup>
/**
 * 本文件由 scripts/gen-material-renderer.js 自动生成，请勿手动修改。
 * 重新生成：pnpm gen:material
 */
import type { IMATERIALITEM } from '@/interface/material'
import ResumeTitle1 from '@/material/ResumeTitle/ResumeTitle1/index.vue'
import BaseInfo1 from '@/material/BaseInfo/BaseInfo1/index.vue'
import BaseInfo2 from '@/material/BaseInfo/BaseInfo2/index.vue'
import BaseInfo3 from '@/material/BaseInfo/BaseInfo3/index.vue'
import JobIntention1 from '@/material/JobIntention/JobIntention1/index.vue'
import JobIntention2 from '@/material/JobIntention/JobIntention2/index.vue'
import EduBackground1 from '@/material/EduBackground/EduBackground1/index.vue'
import SkillSpecialties1 from '@/material/SkillSpecialties/SkillSpecialties1/index.vue'
import CampusExperience1 from '@/material/CampusExperience/CampusExperience1/index.vue'
import CampusExperience2 from '@/material/CampusExperience/CampusExperience2/index.vue'
import InternshipExperience1 from '@/material/InternshipExperience/InternshipExperience1/index.vue'
import WorkExperience1 from '@/material/WorkExperience/WorkExperience1/index.vue'
import WorkExperience2 from '@/material/WorkExperience/WorkExperience2/index.vue'
import ProjectExperience1 from '@/material/ProjectExperience/ProjectExperience1/index.vue'
import ProjectExperience2 from '@/material/ProjectExperience/ProjectExperience2/index.vue'
import Awards1 from '@/material/Awards/Awards1/index.vue'
import Hobbies1 from '@/material/Hobbies/Hobbies1/index.vue'
import SelfEvaluation1 from '@/material/SelfEvaluation/SelfEvaluation1/index.vue'
import WorksDisplay1 from '@/material/WorksDisplay/WorksDisplay1/index.vue'

defineOptions({ name: 'CompatRenderer' })

defineProps<{
  item: IMATERIALITEM
}>()
</script>

<template>
  <ResumeTitle1 v-if="item.cptName === 'RESUME_TITLE_1'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo1 v-else-if="item.cptName === 'BASE_INFO_1'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo2 v-else-if="item.cptName === 'BASE_INFO_2'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo3 v-else-if="item.cptName === 'BASE_INFO_3'" :model-data="item.data" :model-style="item.style" />
  <JobIntention1 v-else-if="item.cptName === 'JOB_INTENTION_1'" :model-data="item.data" :model-style="item.style" />
  <JobIntention2 v-else-if="item.cptName === 'JOB_INTENTION_2'" :model-data="item.data" :model-style="item.style" />
  <EduBackground1 v-else-if="item.cptName === 'EDU_BACKGROUND_1'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties1 v-else-if="item.cptName === 'SKILL_SPECIALTIES_1'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience1 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience2 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_2'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience1 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience1 v-else-if="item.cptName === 'WORK_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience2 v-else-if="item.cptName === 'WORK_EXPERIENCE_2'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience1 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience2 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_2'" :model-data="item.data" :model-style="item.style" />
  <Awards1 v-else-if="item.cptName === 'AWARDS_1'" :model-data="item.data" :model-style="item.style" />
  <Hobbies1 v-else-if="item.cptName === 'HOBBIES_1'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation1 v-else-if="item.cptName === 'SELF_EVALUATION_1'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay1 v-else-if="item.cptName === 'WORKS_DISPLAY_1'" :model-data="item.data" :model-style="item.style" />
  <view v-else class="compat-fallback">
    <text class="compat-fallback__text">
      {{ item.cptTitle || item.cptName }} 暂未适配小程序
    </text>
  </view>
</template>

<style scoped lang="scss">
.compat-fallback {
  padding: 12px 40px;
  color: #b0b0b0;
  font-size: 12px;
}
</style>
