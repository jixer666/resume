<script lang="ts" setup>
import { textToNumber } from '@/utils/common'

/**
 * 技能熟练度进度条。
 *
 * 替代 resume-design 的 `<el-slider disabled>`：Element Plus 在小程序端不可用，
 * 且禁用态滑块的 tooltip 在触屏上没有交互入口，所以直接画成静态进度条。
 */
defineOptions({ name: 'SkillSlider' })

const props = withDefaults(defineProps<{
  /** 熟练度文案：了解 / 一般 / 熟悉 / 精通 */
  proficiency?: string
  /** 进度条填充色，默认取主题色 */
  color?: string
  /** 进度条圆角，部分皮肤用直角 */
  radius?: string
}>(), {
  proficiency: '',
  color: '#409eff',
  radius: '0',
})

const percent = computed(() => textToNumber(props.proficiency))
</script>

<template>
  <view class="skill-slider">
    <view
      class="skill-slider__runway"
      :style="{ borderRadius: props.radius }"
    >
      <view
        class="skill-slider__bar"
        :style="{
          width: `${percent}%`,
          backgroundColor: props.color,
          borderRadius: props.radius,
        }"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.skill-slider {
  display: flex;
  align-items: center;
  height: 6px;

  &__runway {
    width: 100%;
    height: 6px;
    background-color: #ebeef5;
    overflow: hidden;
    box-sizing: border-box;
  }

  &__bar {
    height: 100%;
    opacity: 0.7;
    transition: width 0.3s;
  }
}
</style>
