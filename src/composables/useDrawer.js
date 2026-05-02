import { ref } from "vue";

const showDrawer = ref(false);

export function useDrawer() {
  return { showDrawer };
}
