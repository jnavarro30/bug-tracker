<template>
  <div>
    <div class="header">
      <h2>Bug Tracker</h2>
    </div>

    <div class="two-col" :class="{ editing: editing }">
      <div v-if="editing">
        <div style="margin-top: 12px" class="card">
          <BugForm
            :modelValue="editing"
            @save="saveEdit"
            @cancel="editing = null"
          />
        </div>
      </div>

      <div class="bug-list-col">
        <div class="card">
          <div class="small muted">{{ bugs.length }} items</div>
        </div>
        <div style="margin-top: 12px" class="card">
          <div
            v-for="bug in bugs"
            :key="bug.id"
            class="list-item"
            @click="select(bug)"
          >
            <div class="meta">
              <div class="pill">{{ bug.type }}</div>
              <div>
                <div>
                  <strong>{{ bug.summary }}</strong>
                </div>
                <div class="small muted">Severity: {{ bug.severity }}</div>
              </div>
            </div>
            <div class="small muted">
              {{ new Date(bug.createdAt).toLocaleDateString() }}
            </div>
          </div>
        </div>

        <div style="margin-top: 12px">
          <div v-if="selected">
            <BugDetails
              :bug="selected"
              @close="selected = null"
              @edit="startEdit"
              @delete="del"
              @add-comment="onAddComment"
              @add-attachment="onAddAttachment"
            />
          </div>
          <div v-else class="card" style="margin-top: 8px">
            <div class="muted">Select a bug to view details.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BugForm from "./BugForm.vue";
import BugDetails from "./BugDetails.vue";
import { useBugs } from "../composables/useBugs";

const { bugs, addBug, updateBug, removeBug, addComment, addAttachment } =
  useBugs();

import { useDrawer } from "../composables/useDrawer";
const { showDrawer } = useDrawer();
const selected = ref(null);
const editing = ref(null);

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
  updateBug(editing.value.id, payload);
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
