<template>
  <div>
    <div class="header">
      <h2>Bug Tracker</h2>
    </div>

    <div class="two-col">
      <div>
        <div style="display:flex;justify-content:flex-start;align-items:center;gap:12px;margin-bottom:12px">
          <button class="btn" @click="showNew = !showNew">{{ showNew ? 'Close' : 'New Bug' }}</button>
        </div>

        <div v-if="showNew" class="card">
          <BugForm @save="create" @cancel="showNew = false" />
        </div>

        <div v-if="editing" style="margin-top:12px" class="card">
          <BugForm :modelValue="editing" @save="saveEdit" @cancel="editing = null" />
        </div>
      </div>

      <div>
        <div class="card">
          <div class="small muted">{{ bugs.length }} items</div>
        </div>
        <div style="margin-top: 12px" class="card">
          <div v-for="bug in bugs" :key="bug.id" class="list-item" @click="select(bug)">
            <div class="meta">
              <div class="pill">{{ bug.type }}</div>
              <div>
                <div><strong>{{ bug.summary }}</strong></div>
                <div class="small muted">Severity: {{ bug.severity }}</div>
              </div>
            </div>
            <div class="small muted">{{ new Date(bug.createdAt).toLocaleDateString() }}</div>
          </div>
        </div>

        <div style="margin-top:12px">
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
          <div v-else class="card" style="margin-top:8px">
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

const selected = ref(null);
const showNew = ref(false);
const editing = ref(null);

function select(b) {
  selected.value = b;
  showNew.value = false;
}

function create(payload) {
  const b = addBug(payload);
  selected.value = b;
  showNew.value = false;
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
