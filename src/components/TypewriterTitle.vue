<script setup lang="ts">
import Typed from 'typed.js'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    strings: string[]
    typeSpeed?: number
    backSpeed?: number
    backDelay?: number
    startDelay?: number
    loop?: boolean
    cursorChar?: string
  }>(),
  {
    typeSpeed: 95,
    backSpeed: 55,
    backDelay: 1600,
    startDelay: 200,
    loop: true,
    cursorChar: '_',
  },
)

const textRef = ref<HTMLElement | null>(null)
let typed: Typed | null = null

const staticText = computed(() => props.strings[0] ?? '')

const shouldReduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const destroyTyped = () => {
  if (typed) {
    typed.destroy()
    typed = null
  }
}

const startTyped = () => {
  if (!textRef.value) {
    return
  }

  destroyTyped()

  if (props.strings.length === 0 || shouldReduceMotion()) {
    textRef.value.textContent = staticText.value
    return
  }

  typed = new Typed(textRef.value, {
    strings: props.strings,
    typeSpeed: props.typeSpeed,
    backSpeed: props.backSpeed,
    backDelay: props.backDelay,
    startDelay: props.startDelay,
    loop: props.loop,
    cursorChar: props.cursorChar,
    smartBackspace: true,
  })
}

onMounted(startTyped)

watch(
  () => [
    props.strings.join('||'),
    props.typeSpeed,
    props.backSpeed,
    props.backDelay,
    props.startDelay,
    props.loop,
    props.cursorChar,
  ],
  () => {
    startTyped()
  },
)

onBeforeUnmount(() => {
  destroyTyped()
})
</script>

<template>
  <h1 class="typewriter-title">
    <span ref="textRef" />
  </h1>
</template>

<style scoped>
.typewriter-title {
  margin: 0;
  font-family: var(--font-title);
  font-size: clamp(2.25rem, 5vw, 4.2rem);
  line-height: 1.04;
  letter-spacing: 0.02em;
  color: var(--color-text-primary);
  text-shadow:
    0 0 1px rgb(255 255 255 / 0.75),
    0 0 22px rgb(126 207 255 / 0.3);
  text-transform: uppercase;
  text-wrap: balance;
}
</style>
