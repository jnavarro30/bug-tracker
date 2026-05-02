<template>
  <div class="container">
    <div class="header">
      <button
        class="hamburger left"
        :aria-expanded="showDrawer"
        @click="showDrawer = !showDrawer"
        title="Toggle new bug"
      >
        &#9776;
      </button>
      <h1>Simple Bug Tracker</h1>
    </div>

    <div>
      <div class="left-drawer" :class="{ open: showDrawer }">
        <div style="padding: 12px">
          <h3 style="margin: 0 0 8px 0">New Bug</h3>
          <BugForm @save="create" @cancel="showDrawer = false" />
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
