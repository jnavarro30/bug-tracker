<template>
  <div>
    <div class="header">
      <h2>Bug Tracker</h2>
    </div>

    <div class="two-col" :class="{ editing: editing }">
      <div v-if="editing">
        <div class="mt-3 card">
          <BugForm
            :modelValue="editing"
            @save="saveEdit"
            @cancel="editing = null"
          />
        </div>
      </div>

      <div class="bug-list-col">
        <div class="card">
          <div class="filter-row">
            <input v-model="search" placeholder="Search items..." />
            <select v-model="filterField">
              <option value="">All</option>
              <option value="type">Type</option>
              <option value="severity">Severity</option>
              <option value="platform">Platform</option>
              <option value="device">Device</option>
            </select>
            <select v-if="filterField" v-model="filterValue">
              <option value="">Any</option>
              <option v-for="opt in filterOptions" :key="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="small muted mt-2">{{ filteredBugs.length }} items</div>
        </div>
        <div class="mt-3 card">
          <div
            v-for="bug in filteredBugs"
            :key="bug.id"
            class="list-item"
            @click="select(bug)"
          >
            <div class="meta">
              <div class="pill">{{ bug.type }}</div>
              <div>
                <div>
                  <strong>{{ bug.title }}</strong>
                </div>
                <div class="small muted">Severity: {{ bug.severity }}</div>
              </div>
            </div>
            <div class="small muted">
              {{ bug.description }}
            </div>
            <div class="small muted">
              {{ new Date(bug.createdAt).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="toast">{{ toast }}</div>

    <!-- Modal Backdrop -->
    <div v-if="selected" class="modal-backdrop" @click="selected = null"></div>

    <!-- Modal -->
    <div v-if="selected" class="modal">
      <BugDetails
        :bug="selected"
        @close="selected = null"
        @save="saveEdit"
        @cancel="cancelEdit"
        @delete="del"
        @add-comment="onAddComment"
        @add-attachment="onAddAttachment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import BugForm from "./BugForm.vue";
import BugDetails from "./BugDetails.vue";
import { useBugs } from "../composables/useBugs";

const { bugs, addBug, updateBug, removeBug, addComment, addAttachment } =
  useBugs();

import { useDrawer } from "../composables/useDrawer";
const { showDrawer } = useDrawer();
const selected = ref(null);
const editing = ref(null);
const search = ref("");
const toast = ref("");
const filterField = ref("");
const filterValue = ref("");

const FILTER_OPTIONS = {
  type: ["Bug", "Task", "Improvement"],
  severity: ["Low", "Medium", "High", "Critical"],
  platform: ["Any", "Companion", "IHH", "ETHH"],
  device: ["Any", "iOS", "Android", "Chrome", "LG TV", "Sony TV"],
};

const filterOptions = computed(() => FILTER_OPTIONS[filterField.value] ?? []);

watch(filterField, () => { filterValue.value = ""; });

const filteredBugs = computed(() => {
  let list = bugs;
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter((b) =>
      [b.title, b.description, b.type, b.severity]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (filterField.value && filterValue.value) {
    list = list.filter((b) => b[filterField.value] === filterValue.value);
  }
  return list;
});

function select(b) {
  selected.value = b;
  // close drawer when selecting a bug
  showDrawer.value = false;
}

function openDrawer() {
  showDrawer.value = true;
}

function startEdit(b) {
  editing.value = { ...b };
}

function saveEdit(payload) {
  if (editing.value) {
    updateBug(editing.value.id, payload);
    editing.value = null;
    selected.value = { ...payload };
  } else if (selected.value) {
    updateBug(selected.value.id, payload);
    selected.value = { ...selected.value, ...payload };
  }
  showToast("Details saved successfully");
}

function showToast(msg) {
  toast.value = msg;
  setTimeout(() => (toast.value = ""), 3000);
}

function cancelEdit() {
  editing.value = null;
}

function del(id) {
  if (!confirm("Delete this bug?")) return;
  removeBug(id);
  if (selected.value?.id === id) selected.value = null;
}

function onAddComment({ author, text }) {
  if (!selected.value) return;
  addComment(selected.value.id, author, text);
}

function onAddAttachment(name) {
  if (!selected.value) return;
  addAttachment(selected.value.id, name);
}
</script>

<style scoped>
.filter-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-row input {
  flex: 1;
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #323232;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 1000;
  pointer-events: none;
  animation: fadein 0.2s ease;
}

@keyframes fadein {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
