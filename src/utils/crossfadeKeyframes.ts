// Builds the crossfade keyframes for however many images are set. With five
// images this reproduces the original 40s cycle (fade in 5%, hold to 20%, out by 25%).
export const crossfadeKeyframes = (count: number) => {
  const step = 100 / count
  return `@keyframes coming-soon-image-cycle {
  0% { opacity: 0; transform: scale(1); }
  ${step / 4}% { opacity: 1; }
  ${step}% { opacity: 1; transform: scale(1.1); }
  ${Math.min(step * 1.25, 100)}%, 100% { opacity: 0; transform: scale(1.12); }
}`
}
