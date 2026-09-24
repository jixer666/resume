<script setup lang="ts">
import type { IAwardsData, IBaseInfoData, ICampusExperienceData, ICustomData, IEduBackgroundData, IExperienceData, IHobbiesData, IJobIntentionData, IMaterialItem, IResumeTitleData, ISelfEvaluationData, ISkillSpecialtiesData, IWorksDisplayData } from '@/schema/types'
import { isEmptyModelData } from '@/schema/modelData'
import { MODULE_INDEX_KEY } from './context'
import Awards1 from '../Awards/Awards1/index.vue'
import BaseInfo1 from '../BaseInfo/BaseInfo1/index.vue'
import BaseInfo2 from '../BaseInfo/BaseInfo2/index.vue'
import BaseInfo3 from '../BaseInfo/BaseInfo3/index.vue'
import BaseInfo4 from '../BaseInfo/BaseInfo4/index.vue'
import CampusExperience1 from '../CampusExperience/CampusExperience1/index.vue'
import Custom1 from '../Custom/Custom1/index.vue'
import EduBackground1 from '../EduBackground/EduBackground1/index.vue'
import EduBackground2 from '../EduBackground/EduBackground2/index.vue'
import Hobbies1 from '../Hobbies/Hobbies1/index.vue'
import InternshipExperience1 from '../InternshipExperience/InternshipExperience1/index.vue'
import JobIntention1 from '../JobIntention/JobIntention1/index.vue'
import ProjectExperience1 from '../ProjectExperience/ProjectExperience1/index.vue'
import ResumeTitle1 from '../ResumeTitle/ResumeTitle1/index.vue'
import ResumeTitle2 from '../ResumeTitle/ResumeTitle2/index.vue'
import SelfEvaluation1 from '../SelfEvaluation/SelfEvaluation1/index.vue'
import SkillSpecialties1 from '../SkillSpecialties/SkillSpecialties1/index.vue'
import SkillSpecialties2 from '../SkillSpecialties/SkillSpecialties2/index.vue'
import WorkExperience1 from '../WorkExperience/WorkExperience1/index.vue'
import WorkExperience2 from '../WorkExperience/WorkExperience2/index.vue'
import WorksDisplay1 from '../WorksDisplay/WorksDisplay1/index.vue'

/**
 * 单个模块的渲染器：按 cptName 分支渲染对应物料组件。
 *
 * 小程序端编译器不支持 <component :is> 动态组件（自定义组件标签必须静态），
 * 所以用 v-if/v-else-if 穷举分支。物料 props 统一为 modelData + modelStyle，
 * 新增物料 = 新建组件 + 在这里 import 并加一个分支。
 * data 是 IModelData 联合类型，分支上用 as 断言成该物料的具体数据类型。
 *
 * 编号样式需要模块在 COMPONENTS 中的下标，而 props 无法穿过物料组件透传给 SectionTitle，
 * 所以在这里 provide 一个只读的下标 computed。
 */
const props = defineProps<{ item: IMaterialItem, index: number }>()

/** 模块未开启、或没有填写任何内容时都不渲染，避免预览/导出出现空标题 */
const visible = computed(() => props.item.show && !isEmptyModelData(props.item.data))
provide(MODULE_INDEX_KEY, computed(() => props.index))
</script>

<template>
  <template v-if="visible">
    <ResumeTitle1 v-if="props.item.cptName === 'RESUME_TITLE_1'" :model-data="props.item.data as IResumeTitleData" :model-style="props.item.style" />
    <ResumeTitle2 v-else-if="props.item.cptName === 'RESUME_TITLE_2'" :model-data="props.item.data as IResumeTitleData" :model-style="props.item.style" />
    <BaseInfo1 v-else-if="props.item.cptName === 'BASE_INFO_1'" :model-data="props.item.data as IBaseInfoData" :model-style="props.item.style" />
    <BaseInfo2 v-else-if="props.item.cptName === 'BASE_INFO_2'" :model-data="props.item.data as IBaseInfoData" :model-style="props.item.style" />
    <BaseInfo3 v-else-if="props.item.cptName === 'BASE_INFO_3'" :model-data="props.item.data as IBaseInfoData" :model-style="props.item.style" />
    <BaseInfo4 v-else-if="props.item.cptName === 'BASE_INFO_4'" :model-data="props.item.data as IBaseInfoData" :model-style="props.item.style" />
    <JobIntention1 v-else-if="props.item.cptName === 'JOB_INTENTION_1'" :model-data="props.item.data as IJobIntentionData" :model-style="props.item.style" />
    <EduBackground1 v-else-if="props.item.cptName === 'EDU_BACKGROUND_1'" :model-data="props.item.data as IEduBackgroundData" :model-style="props.item.style" />
    <EduBackground2 v-else-if="props.item.cptName === 'EDU_BACKGROUND_2'" :model-data="props.item.data as IEduBackgroundData" :model-style="props.item.style" />
    <WorkExperience1 v-else-if="props.item.cptName === 'WORK_EXPERIENCE_1'" :model-data="props.item.data as IExperienceData" :model-style="props.item.style" />
    <WorkExperience2 v-else-if="props.item.cptName === 'WORK_EXPERIENCE_2'" :model-data="props.item.data as IExperienceData" :model-style="props.item.style" />
    <ProjectExperience1 v-else-if="props.item.cptName === 'PROJECT_EXPERIENCE_1'" :model-data="props.item.data as IExperienceData" :model-style="props.item.style" />
    <InternshipExperience1 v-else-if="props.item.cptName === 'INTERNSHIP_EXPERIENCE_1'" :model-data="props.item.data as IExperienceData" :model-style="props.item.style" />
    <CampusExperience1 v-else-if="props.item.cptName === 'CAMPUS_EXPERIENCE_1'" :model-data="props.item.data as ICampusExperienceData" :model-style="props.item.style" />
    <SkillSpecialties1 v-else-if="props.item.cptName === 'SKILL_SPECIALTIES_1'" :model-data="props.item.data as ISkillSpecialtiesData" :model-style="props.item.style" />
    <SkillSpecialties2 v-else-if="props.item.cptName === 'SKILL_SPECIALTIES_2'" :model-data="props.item.data as ISkillSpecialtiesData" :model-style="props.item.style" />
    <Awards1 v-else-if="props.item.cptName === 'AWARDS_1'" :model-data="props.item.data as IAwardsData" :model-style="props.item.style" />
    <Hobbies1 v-else-if="props.item.cptName === 'HOBBIES_1'" :model-data="props.item.data as IHobbiesData" :model-style="props.item.style" />
    <SelfEvaluation1 v-else-if="props.item.cptName === 'SELF_EVALUATION_1'" :model-data="props.item.data as ISelfEvaluationData" :model-style="props.item.style" />
    <WorksDisplay1 v-else-if="props.item.cptName === 'WORKS_DISPLAY_1'" :model-data="props.item.data as IWorksDisplayData" :model-style="props.item.style" />
    <Custom1 v-else-if="props.item.cptName === 'CUSTOM_1'" :model-data="props.item.data as ICustomData" :model-style="props.item.style" />
  </template>
</template>
