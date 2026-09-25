<script lang="ts" setup>
/**
 * 本文件由 scripts/gen-material-renderer.js 自动生成，请勿手动修改。
 * 重新生成：pnpm gen:material
 */
import type { IMATERIALITEM } from '@/interface/material'
import ResumeTitle1 from '@/material/ResumeTitle/ResumeTitle1/index.vue'
import ResumeTitle2 from '@/material/ResumeTitle/ResumeTitle2/index.vue'
import BaseInfo1 from '@/material/BaseInfo/BaseInfo1/index.vue'
import BaseInfo3 from '@/material/BaseInfo/BaseInfo3/BaseInfo.vue'
import BaseInfo2 from '@/material/BaseInfo/BaseInfo2/BaseInfo.vue'
import BaseInfo4 from '@/material/BaseInfo/BaseInfo4/BaseInfo.vue'
import BaseInfo5 from '@/material/BaseInfo/BaseInfo5/BaseInfo.vue'
import BaseInfo6 from '@/material/BaseInfo/BaseInfo6/BaseInfo.vue'
import BaseInfo7 from '@/material/BaseInfo/BaseInfo7/BaseInfo.vue'
import BaseInfo8 from '@/material/BaseInfo/BaseInfo8/BaseInfo.vue'
import BaseInfo9 from '@/material/BaseInfo/BaseInfo9/BaseInfo.vue'
import BaseInfo10 from '@/material/BaseInfo/BaseInfo10/BaseInfo.vue'
import BaseInfo11 from '@/material/BaseInfo/BaseInfo11/BaseInfo.vue'
import JobIntention1 from '@/material/JobIntention/JobIntention1/index.vue'
import JobIntention2 from '@/material/JobIntention/JobIntention2/JobIntention.vue'
import JobIntention3 from '@/material/JobIntention/JobIntention3/JobIntention.vue'
import JobIntention4 from '@/material/JobIntention/JobIntention4/JobIntention.vue'
import JobIntention5 from '@/material/JobIntention/JobIntention5/JobIntention.vue'
import JobIntention6 from '@/material/JobIntention/JobIntention6/JobIntention.vue'
import JobIntention7 from '@/material/JobIntention/JobIntention7/JobIntention.vue'
import JobIntention8 from '@/material/JobIntention/JobIntention8/JobIntention.vue'
import JobIntention9 from '@/material/JobIntention/JobIntention9/JobIntention.vue'
import JobIntention10 from '@/material/JobIntention/JobIntention10/JobIntention.vue'
import JobIntention11 from '@/material/JobIntention/JobIntention11/JobIntention.vue'
import EduBackground1 from '@/material/EduBackground/EduBackground1/index.vue'
import EduBackground2 from '@/material/EduBackground/EduBackground2/EduBackground.vue'
import EduBackground3 from '@/material/EduBackground/EduBackground3/EduBackground.vue'
import EduBackground4 from '@/material/EduBackground/EduBackground4/EduBackground.vue'
import EduBackground5 from '@/material/EduBackground/EduBackground5/EduBackground.vue'
import EduBackground6 from '@/material/EduBackground/EduBackground6/EduBackground.vue'
import EduBackground7 from '@/material/EduBackground/EduBackground7/EduBackground.vue'
import EduBackground8 from '@/material/EduBackground/EduBackground8/EduBackground.vue'
import EduBackground9 from '@/material/EduBackground/EduBackground9/EduBackground.vue'
import EduBackground10 from '@/material/EduBackground/EduBackground10/EduBackground.vue'
import EduBackground11 from '@/material/EduBackground/EduBackground11/EduBackground.vue'
import EduBackground12 from '@/material/EduBackground/EduBackground12/EduBackground.vue'
import EduBackground13 from '@/material/EduBackground/EduBackground13/EduBackground.vue'
import SkillSpecialties1 from '@/material/SkillSpecialties/SkillSpecialties1/index.vue'
import SkillSpecialties3 from '@/material/SkillSpecialties/SkillSpecialties3/SkillSpecialties.vue'
import SkillSpecialties2 from '@/material/SkillSpecialties/SkillSpecialties2/SkillSpecialties.vue'
import SkillSpecialties4 from '@/material/SkillSpecialties/SkillSpecialties4/SkillSpecialties.vue'
import SkillSpecialties5 from '@/material/SkillSpecialties/SkillSpecialties5/SkillSpecialties.vue'
import SkillSpecialties6 from '@/material/SkillSpecialties/SkillSpecialties6/SkillSpecialties.vue'
import SkillSpecialties7 from '@/material/SkillSpecialties/SkillSpecialties7/SkillSpecialties.vue'
import SkillSpecialties8 from '@/material/SkillSpecialties/SkillSpecialties8/SkillSpecialties.vue'
import SkillSpecialties9 from '@/material/SkillSpecialties/SkillSpecialties9/SkillSpecialties.vue'
import SkillSpecialties10 from '@/material/SkillSpecialties/SkillSpecialties10/SkillSpecialties.vue'
import SkillSpecialties11 from '@/material/SkillSpecialties/SkillSpecialties11/SkillSpecialties.vue'
import SkillSpecialties12 from '@/material/SkillSpecialties/SkillSpecialties12/SkillSpecialties.vue'
import SkillSpecialties13 from '@/material/SkillSpecialties/SkillSpecialties13/SkillSpecialties.vue'
import SkillSpecialties14 from '@/material/SkillSpecialties/SkillSpecialties14/SkillSpecialties.vue'
import SkillSpecialties15 from '@/material/SkillSpecialties/SkillSpecialties15/SkillSpecialties.vue'
import SkillSpecialties16 from '@/material/SkillSpecialties/SkillSpecialties16/SkillSpecialties.vue'
import SkillSpecialties17 from '@/material/SkillSpecialties/SkillSpecialties17/SkillSpecialties.vue'
import SkillSpecialties18 from '@/material/SkillSpecialties/SkillSpecialties18/SkillSpecialties.vue'
import CampusExperience1 from '@/material/CampusExperience/CampusExperience1/index.vue'
import CampusExperience2 from '@/material/CampusExperience/CampusExperience2/CampusExperience.vue'
import CampusExperience3 from '@/material/CampusExperience/CampusExperience3/CampusExperience.vue'
import CampusExperience4 from '@/material/CampusExperience/CampusExperience4/CampusExperience.vue'
import CampusExperience5 from '@/material/CampusExperience/CampusExperience5/CampusExperience.vue'
import CampusExperience6 from '@/material/CampusExperience/CampusExperience6/CampusExperience.vue'
import CampusExperience7 from '@/material/CampusExperience/CampusExperience7/CampusExperience.vue'
import CampusExperience8 from '@/material/CampusExperience/CampusExperience8/CampusExperience.vue'
import CampusExperience9 from '@/material/CampusExperience/CampusExperience9/CampusExperience.vue'
import CampusExperience10 from '@/material/CampusExperience/CampusExperience10/CampusExperience.vue'
import CampusExperience11 from '@/material/CampusExperience/CampusExperience11/CampusExperience.vue'
import InternshipExperience1 from '@/material/InternshipExperience/InternshipExperience1/index.vue'
import InternshipExperience2 from '@/material/InternshipExperience/InternshipExperience2/InternshipExperience.vue'
import InternshipExperience3 from '@/material/InternshipExperience/InternshipExperience3/InternshipExperience.vue'
import InternshipExperience4 from '@/material/InternshipExperience/InternshipExperience4/InternshipExperience.vue'
import InternshipExperience5 from '@/material/InternshipExperience/InternshipExperience5/InternshipExperience.vue'
import InternshipExperience6 from '@/material/InternshipExperience/InternshipExperience6/InternshipExperience.vue'
import InternshipExperience7 from '@/material/InternshipExperience/InternshipExperience7/InternshipExperience.vue'
import InternshipExperience8 from '@/material/InternshipExperience/InternshipExperience8/InternshipExperience.vue'
import InternshipExperience9 from '@/material/InternshipExperience/InternshipExperience9/InternshipExperience.vue'
import InternshipExperience10 from '@/material/InternshipExperience/InternshipExperience10/InternshipExperience.vue'
import InternshipExperience11 from '@/material/InternshipExperience/InternshipExperience11/InternshipExperience.vue'
import WorkExperience1 from '@/material/WorkExperience/WorkExperience1/index.vue'
import WorkExperience2 from '@/material/WorkExperience/WorkExperience2/WorkExperience.vue'
import WorkExperience3 from '@/material/WorkExperience/WorkExperience3/WorkExperienceCom.vue'
import WorkExperience4 from '@/material/WorkExperience/WorkExperience4/WorkExperience.vue'
import WorkExperience5 from '@/material/WorkExperience/WorkExperience5/WorkExperience.vue'
import WorkExperience6 from '@/material/WorkExperience/WorkExperience6/WorkExperience.vue'
import WorkExperience7 from '@/material/WorkExperience/WorkExperience7/WorkExperience.vue'
import WorkExperience8 from '@/material/WorkExperience/WorkExperience8/WorkExperience.vue'
import WorkExperience9 from '@/material/WorkExperience/WorkExperience9/WorkExperience.vue'
import WorkExperience10 from '@/material/WorkExperience/WorkExperience10/WorkExperience.vue'
import WorkExperience11 from '@/material/WorkExperience/WorkExperience11/WorkExperience.vue'
import ProjectExperience1 from '@/material/ProjectExperience/ProjectExperience1/index.vue'
import ProjectExperience2 from '@/material/ProjectExperience/ProjectExperience2/ProjectExperience.vue'
import ProjectExperience3 from '@/material/ProjectExperience/ProjectExperience3/ProjectExperience.vue'
import ProjectExperience4 from '@/material/ProjectExperience/ProjectExperience4/ProjectExperience.vue'
import ProjectExperience5 from '@/material/ProjectExperience/ProjectExperience5/ProjectExperience.vue'
import ProjectExperience6 from '@/material/ProjectExperience/ProjectExperience6/ProjectExperience.vue'
import ProjectExperience7 from '@/material/ProjectExperience/ProjectExperience7/ProjectExperience.vue'
import ProjectExperience8 from '@/material/ProjectExperience/ProjectExperience8/ProjectExperience.vue'
import ProjectExperience9 from '@/material/ProjectExperience/ProjectExperience9/ProjectExperience.vue'
import ProjectExperience10 from '@/material/ProjectExperience/ProjectExperience10/ProjectExperience.vue'
import ProjectExperience11 from '@/material/ProjectExperience/ProjectExperience11/ProjectExperience.vue'
import Awards1 from '@/material/Awards/Awards1/index.vue'
import Awards2 from '@/material/Awards/Awards2/Awards.vue'
import Awards3 from '@/material/Awards/Awards3/Awards.vue'
import Awards4 from '@/material/Awards/Awards4/Awards.vue'
import Awards5 from '@/material/Awards/Awards5/Awards.vue'
import Awards6 from '@/material/Awards/Awards6/Awards.vue'
import Awards7 from '@/material/Awards/Awards7/Awards.vue'
import Awards8 from '@/material/Awards/Awards8/Awards.vue'
import Awards9 from '@/material/Awards/Awards9/Awards.vue'
import Awards10 from '@/material/Awards/Awards10/Awards.vue'
import Awards11 from '@/material/Awards/Awards11/Awards.vue'
import Hobbies1 from '@/material/Hobbies/Hobbies1/index.vue'
import Hobbies2 from '@/material/Hobbies/Hobbies2/Hobbies.vue'
import Hobbies3 from '@/material/Hobbies/Hobbies3/Hobbies.vue'
import Hobbies4 from '@/material/Hobbies/Hobbies4/Hobbies.vue'
import Hobbies5 from '@/material/Hobbies/Hobbies5/Hobbies.vue'
import Hobbies6 from '@/material/Hobbies/Hobbies6/Hobbies.vue'
import Hobbies7 from '@/material/Hobbies/Hobbies7/Hobbies.vue'
import Hobbies8 from '@/material/Hobbies/Hobbies8/Hobbies.vue'
import Hobbies9 from '@/material/Hobbies/Hobbies9/Hobbies.vue'
import Hobbies10 from '@/material/Hobbies/Hobbies10/Hobbies.vue'
import Hobbies11 from '@/material/Hobbies/Hobbies11/Hobbies.vue'
import SelfEvaluation1 from '@/material/SelfEvaluation/SelfEvaluation1/index.vue'
import SelfEvaluation2 from '@/material/SelfEvaluation/SelfEvaluation2/SelfEvaluation.vue'
import SelfEvaluation3 from '@/material/SelfEvaluation/SelfEvaluation3/SelfEvaluation.vue'
import SelfEvaluation4 from '@/material/SelfEvaluation/SelfEvaluation4/SelfEvaluation.vue'
import SelfEvaluation5 from '@/material/SelfEvaluation/SelfEvaluation5/SelfEvaluation.vue'
import SelfEvaluation6 from '@/material/SelfEvaluation/SelfEvaluation6/SelfEvaluation.vue'
import SelfEvaluation7 from '@/material/SelfEvaluation/SelfEvaluation7/SelfEvaluation.vue'
import SelfEvaluation8 from '@/material/SelfEvaluation/SelfEvaluation8/SelfEvaluation.vue'
import SelfEvaluation9 from '@/material/SelfEvaluation/SelfEvaluation9/SelfEvaluation.vue'
import SelfEvaluation10 from '@/material/SelfEvaluation/SelfEvaluation10/SelfEvaluation.vue'
import SelfEvaluation11 from '@/material/SelfEvaluation/SelfEvaluation11/SelfEvaluation.vue'
import WorksDisplay1 from '@/material/WorksDisplay/WorksDisplay1/index.vue'
import WorksDisplay2 from '@/material/WorksDisplay/WorksDisplay2/WorksDisplay.vue'
import WorksDisplay3 from '@/material/WorksDisplay/WorksDisplay3/WorksDisplay.vue'
import WorksDisplay4 from '@/material/WorksDisplay/WorksDisplay4/WorksDisplay.vue'
import WorksDisplay5 from '@/material/WorksDisplay/WorksDisplay5/WorksDisplay.vue'
import WorksDisplay6 from '@/material/WorksDisplay/WorksDisplay6/WorksDisplay.vue'
import WorksDisplay7 from '@/material/WorksDisplay/WorksDisplay7/WorksDisplay.vue'
import WorksDisplay8 from '@/material/WorksDisplay/WorksDisplay8/WorksDisplay.vue'
import WorksDisplay9 from '@/material/WorksDisplay/WorksDisplay9/WorksDisplay.vue'
import WorksDisplay10 from '@/material/WorksDisplay/WorksDisplay10/WorksDisplay.vue'
import WorksDisplay11 from '@/material/WorksDisplay/WorksDisplay11/WorksDisplay.vue'
import Custom1 from '@/material/Custom/Custom1/NameAbstract.vue'
import Custom2 from '@/material/Custom/Custom2/ResumeTitleWord.vue'
import Custom3 from '@/material/Custom/Custom3/NameAbstractAvatar.vue'

defineOptions({ name: 'CompatRenderer' })

defineProps<{
  item: IMATERIALITEM
}>()
</script>

<template>
  <ResumeTitle1 v-if="item.cptName === 'RESUME_TITLE_1'" :model-data="item.data" :model-style="item.style" />
  <ResumeTitle2 v-else-if="item.cptName === 'RESUME_TITLE_2'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo1 v-else-if="item.cptName === 'BASE_INFO_1'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo3 v-else-if="item.cptName === 'BASE_INFO_3'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo2 v-else-if="item.cptName === 'BASE_INFO_2'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo4 v-else-if="item.cptName === 'BASE_INFO_4'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo5 v-else-if="item.cptName === 'BASE_INFO_5'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo6 v-else-if="item.cptName === 'BASE_INFO_6'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo7 v-else-if="item.cptName === 'BASE_INFO_7'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo8 v-else-if="item.cptName === 'BASE_INFO_8'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo9 v-else-if="item.cptName === 'BASE_INFO_9'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo10 v-else-if="item.cptName === 'BASE_INFO_10'" :model-data="item.data" :model-style="item.style" />
  <BaseInfo11 v-else-if="item.cptName === 'BASE_INFO_11'" :model-data="item.data" :model-style="item.style" />
  <JobIntention1 v-else-if="item.cptName === 'JOB_INTENTION_1'" :model-data="item.data" :model-style="item.style" />
  <JobIntention2 v-else-if="item.cptName === 'JOB_INTENTION_2'" :model-data="item.data" :model-style="item.style" />
  <JobIntention3 v-else-if="item.cptName === 'JOB_INTENTION_3'" :model-data="item.data" :model-style="item.style" />
  <JobIntention4 v-else-if="item.cptName === 'JOB_INTENTION_4'" :model-data="item.data" :model-style="item.style" />
  <JobIntention5 v-else-if="item.cptName === 'JOB_INTENTION_5'" :model-data="item.data" :model-style="item.style" />
  <JobIntention6 v-else-if="item.cptName === 'JOB_INTENTION_6'" :model-data="item.data" :model-style="item.style" />
  <JobIntention7 v-else-if="item.cptName === 'JOB_INTENTION_7'" :model-data="item.data" :model-style="item.style" />
  <JobIntention8 v-else-if="item.cptName === 'JOB_INTENTION_8'" :model-data="item.data" :model-style="item.style" />
  <JobIntention9 v-else-if="item.cptName === 'JOB_INTENTION_9'" :model-data="item.data" :model-style="item.style" />
  <JobIntention10 v-else-if="item.cptName === 'JOB_INTENTION_10'" :model-data="item.data" :model-style="item.style" />
  <JobIntention11 v-else-if="item.cptName === 'JOB_INTENTION_11'" :model-data="item.data" :model-style="item.style" />
  <EduBackground1 v-else-if="item.cptName === 'EDU_BACKGROUND_1'" :model-data="item.data" :model-style="item.style" />
  <EduBackground2 v-else-if="item.cptName === 'EDU_BACKGROUND_2'" :model-data="item.data" :model-style="item.style" />
  <EduBackground3 v-else-if="item.cptName === 'EDU_BACKGROUND_3'" :model-data="item.data" :model-style="item.style" />
  <EduBackground4 v-else-if="item.cptName === 'EDU_BACKGROUND_4'" :model-data="item.data" :model-style="item.style" />
  <EduBackground5 v-else-if="item.cptName === 'EDU_BACKGROUND_5'" :model-data="item.data" :model-style="item.style" />
  <EduBackground6 v-else-if="item.cptName === 'EDU_BACKGROUND_6'" :model-data="item.data" :model-style="item.style" />
  <EduBackground7 v-else-if="item.cptName === 'EDU_BACKGROUND_7'" :model-data="item.data" :model-style="item.style" />
  <EduBackground8 v-else-if="item.cptName === 'EDU_BACKGROUND_8'" :model-data="item.data" :model-style="item.style" />
  <EduBackground9 v-else-if="item.cptName === 'EDU_BACKGROUND_9'" :model-data="item.data" :model-style="item.style" />
  <EduBackground10 v-else-if="item.cptName === 'EDU_BACKGROUND_10'" :model-data="item.data" :model-style="item.style" />
  <EduBackground11 v-else-if="item.cptName === 'EDU_BACKGROUND_11'" :model-data="item.data" :model-style="item.style" />
  <EduBackground12 v-else-if="item.cptName === 'EDU_BACKGROUND_12'" :model-data="item.data" :model-style="item.style" />
  <EduBackground13 v-else-if="item.cptName === 'EDU_BACKGROUND_13'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties1 v-else-if="item.cptName === 'SKILL_SPECIALTIES_1'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties3 v-else-if="item.cptName === 'SKILL_SPECIALTIES_3'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties2 v-else-if="item.cptName === 'SKILL_SPECIALTIES_2'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties4 v-else-if="item.cptName === 'SKILL_SPECIALTIES_4'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties5 v-else-if="item.cptName === 'SKILL_SPECIALTIES_5'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties6 v-else-if="item.cptName === 'SKILL_SPECIALTIES_6'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties7 v-else-if="item.cptName === 'SKILL_SPECIALTIES_7'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties8 v-else-if="item.cptName === 'SKILL_SPECIALTIES_8'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties9 v-else-if="item.cptName === 'SKILL_SPECIALTIES_9'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties10 v-else-if="item.cptName === 'SKILL_SPECIALTIES_10'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties11 v-else-if="item.cptName === 'SKILL_SPECIALTIES_11'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties12 v-else-if="item.cptName === 'SKILL_SPECIALTIES_12'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties13 v-else-if="item.cptName === 'SKILL_SPECIALTIES_13'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties14 v-else-if="item.cptName === 'SKILL_SPECIALTIES_14'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties15 v-else-if="item.cptName === 'SKILL_SPECIALTIES_15'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties16 v-else-if="item.cptName === 'SKILL_SPECIALTIES_16'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties17 v-else-if="item.cptName === 'SKILL_SPECIALTIES_17'" :model-data="item.data" :model-style="item.style" />
  <SkillSpecialties18 v-else-if="item.cptName === 'SKILL_SPECIALTIES_18'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience1 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience2 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_2'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience3 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_3'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience4 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_4'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience5 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_5'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience6 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_6'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience7 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_7'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience8 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_8'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience9 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_9'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience10 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_10'" :model-data="item.data" :model-style="item.style" />
  <CampusExperience11 v-else-if="item.cptName === 'CAMPUS_EXPERIENCE_11'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience1 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience2 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_2'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience3 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_3'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience4 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_4'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience5 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_5'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience6 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_6'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience7 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_7'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience8 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_8'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience9 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_9'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience10 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_10'" :model-data="item.data" :model-style="item.style" />
  <InternshipExperience11 v-else-if="item.cptName === 'INTERNSHIP_EXPERIENCE_11'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience1 v-else-if="item.cptName === 'WORK_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience2 v-else-if="item.cptName === 'WORK_EXPERIENCE_2'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience3 v-else-if="item.cptName === 'WORK_EXPERIENCE_3'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience4 v-else-if="item.cptName === 'WORK_EXPERIENCE_4'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience5 v-else-if="item.cptName === 'WORK_EXPERIENCE_5'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience6 v-else-if="item.cptName === 'WORK_EXPERIENCE_6'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience7 v-else-if="item.cptName === 'WORK_EXPERIENCE_7'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience8 v-else-if="item.cptName === 'WORK_EXPERIENCE_8'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience9 v-else-if="item.cptName === 'WORK_EXPERIENCE_9'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience10 v-else-if="item.cptName === 'WORK_EXPERIENCE_10'" :model-data="item.data" :model-style="item.style" />
  <WorkExperience11 v-else-if="item.cptName === 'WORK_EXPERIENCE_11'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience1 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_1'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience2 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_2'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience3 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_3'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience4 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_4'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience5 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_5'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience6 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_6'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience7 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_7'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience8 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_8'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience9 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_9'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience10 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_10'" :model-data="item.data" :model-style="item.style" />
  <ProjectExperience11 v-else-if="item.cptName === 'PROJECT_EXPERIENCE_11'" :model-data="item.data" :model-style="item.style" />
  <Awards1 v-else-if="item.cptName === 'AWARDS_1'" :model-data="item.data" :model-style="item.style" />
  <Awards2 v-else-if="item.cptName === 'AWARDS_2'" :model-data="item.data" :model-style="item.style" />
  <Awards3 v-else-if="item.cptName === 'AWARDS_3'" :model-data="item.data" :model-style="item.style" />
  <Awards4 v-else-if="item.cptName === 'AWARDS_4'" :model-data="item.data" :model-style="item.style" />
  <Awards5 v-else-if="item.cptName === 'AWARDS_5'" :model-data="item.data" :model-style="item.style" />
  <Awards6 v-else-if="item.cptName === 'AWARDS_6'" :model-data="item.data" :model-style="item.style" />
  <Awards7 v-else-if="item.cptName === 'AWARDS_7'" :model-data="item.data" :model-style="item.style" />
  <Awards8 v-else-if="item.cptName === 'AWARDS_8'" :model-data="item.data" :model-style="item.style" />
  <Awards9 v-else-if="item.cptName === 'AWARDS_9'" :model-data="item.data" :model-style="item.style" />
  <Awards10 v-else-if="item.cptName === 'AWARDS_10'" :model-data="item.data" :model-style="item.style" />
  <Awards11 v-else-if="item.cptName === 'AWARDS_11'" :model-data="item.data" :model-style="item.style" />
  <Hobbies1 v-else-if="item.cptName === 'HOBBIES_1'" :model-data="item.data" :model-style="item.style" />
  <Hobbies2 v-else-if="item.cptName === 'HOBBIES_2'" :model-data="item.data" :model-style="item.style" />
  <Hobbies3 v-else-if="item.cptName === 'HOBBIES_3'" :model-data="item.data" :model-style="item.style" />
  <Hobbies4 v-else-if="item.cptName === 'HOBBIES_4'" :model-data="item.data" :model-style="item.style" />
  <Hobbies5 v-else-if="item.cptName === 'HOBBIES_5'" :model-data="item.data" :model-style="item.style" />
  <Hobbies6 v-else-if="item.cptName === 'HOBBIES_6'" :model-data="item.data" :model-style="item.style" />
  <Hobbies7 v-else-if="item.cptName === 'HOBBIES_7'" :model-data="item.data" :model-style="item.style" />
  <Hobbies8 v-else-if="item.cptName === 'HOBBIES_8'" :model-data="item.data" :model-style="item.style" />
  <Hobbies9 v-else-if="item.cptName === 'HOBBIES_9'" :model-data="item.data" :model-style="item.style" />
  <Hobbies10 v-else-if="item.cptName === 'HOBBIES_10'" :model-data="item.data" :model-style="item.style" />
  <Hobbies11 v-else-if="item.cptName === 'HOBBIES_11'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation1 v-else-if="item.cptName === 'SELF_EVALUATION_1'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation2 v-else-if="item.cptName === 'SELF_EVALUATION_2'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation3 v-else-if="item.cptName === 'SELF_EVALUATION_3'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation4 v-else-if="item.cptName === 'SELF_EVALUATION_4'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation5 v-else-if="item.cptName === 'SELF_EVALUATION_5'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation6 v-else-if="item.cptName === 'SELF_EVALUATION_6'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation7 v-else-if="item.cptName === 'SELF_EVALUATION_7'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation8 v-else-if="item.cptName === 'SELF_EVALUATION_8'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation9 v-else-if="item.cptName === 'SELF_EVALUATION_9'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation10 v-else-if="item.cptName === 'SELF_EVALUATION_10'" :model-data="item.data" :model-style="item.style" />
  <SelfEvaluation11 v-else-if="item.cptName === 'SELF_EVALUATION_11'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay1 v-else-if="item.cptName === 'WORKS_DISPLAY_1'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay2 v-else-if="item.cptName === 'WORKS_DISPLAY_2'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay3 v-else-if="item.cptName === 'WORKS_DISPLAY_3'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay4 v-else-if="item.cptName === 'WORKS_DISPLAY_4'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay5 v-else-if="item.cptName === 'WORKS_DISPLAY_5'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay6 v-else-if="item.cptName === 'WORKS_DISPLAY_6'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay7 v-else-if="item.cptName === 'WORKS_DISPLAY_7'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay8 v-else-if="item.cptName === 'WORKS_DISPLAY_8'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay9 v-else-if="item.cptName === 'WORKS_DISPLAY_9'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay10 v-else-if="item.cptName === 'WORKS_DISPLAY_10'" :model-data="item.data" :model-style="item.style" />
  <WorksDisplay11 v-else-if="item.cptName === 'WORKS_DISPLAY_11'" :model-data="item.data" :model-style="item.style" />
  <Custom1 v-else-if="item.cptName === 'CUSTOM_1'" :model-data="item.data" :model-style="item.style" />
  <Custom2 v-else-if="item.cptName === 'CUSTOM_2'" :model-data="item.data" :model-style="item.style" />
  <Custom3 v-else-if="item.cptName === 'CUSTOM_3'" :model-data="item.data" :model-style="item.style" />
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
