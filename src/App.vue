<template>
  <div class="container">
    <button
      class="hamburger left"
      :aria-expanded="showDrawer"
      @click="showDrawer = !showDrawer"
      title="Toggle new bug"
    >
      <img
        v-if="!showDrawer"
        src="./assets/bug-open.svg"
        alt="bug"
        width="20"
        height="20"
      />
      <img
        v-else
        src="./assets/bug-close.svg"
        alt="bug"
        width="20"
        height="20"
      />
    </button>
    <div class="header">
      <h1>Simple Bug Tracker</h1>
    </div>

    <div>
      <div class="left-drawer" :class="{ open: showDrawer }">
        <div class="p-3">
          <BugForm :key="showDrawer" @save="create" @cancel="showDrawer = false" />
        </div>
      </div>

      <BugList />
    </div>
  </div>
</template>

<script setup>
import BugList from "./components/BugList.vue";
import BugForm from "./components/BugForm.vue";
import { useDrawer } from "./composables/useDrawer";
import { useBugs } from "./composables/useBugs";

const { showDrawer } = useDrawer();
const { addBug } = useBugs();

function create(payload) {
  addBug(payload);
  showDrawer.value = false;
}
</script>
