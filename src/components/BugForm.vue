<template>
  <div class="card">
    <h3>{{ edit ? "Edit Bug" : "New Bug" }}</h3>
    <div style="display: flex; gap: 8px; margin-top: 8px">
      <select v-model="form.type">
        <option>Bug</option>
        <option>Task</option>
        <option>Improvement</option>
      </select>
      <select v-model="form.severity">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select>
    </div>
    <div style="margin-top: 8px">
      <input v-model="form.summary" placeholder="Summary" />
    </div>
    <div style="margin-top: 8px">
      <textarea v-model="form.description" placeholder="Description"></textarea>
    </div>
    <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center">
      <input v-model="form.assignee" placeholder="Assignee" />
      <input v-model="form.reporter" placeholder="Reporter" />
    </div>
    <div style="display: flex; gap: 8px; margin-top: 12px">
      <button class="btn" @click="submit">{{ edit ? "Save" : "Add" }}</button>
      <button class="btn secondary" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from "vue";
const props = defineProps({
  modelValue: { type: Object, default: null },
});
const emit = defineEmits(["save", "cancel"]);

const edit = !!props.modelValue;

const form = reactive({
  type: props.modelValue?.type || "Bug",
  summary: props.modelValue?.summary || "",
  severity: props.modelValue?.severity || "Medium",
  description: props.modelValue?.description || "",
  assignee: props.modelValue?.assignee || "",
  reporter: props.modelValue?.reporter || "",
});

function submit() {
  if (!form.summary.trim()) {
    alert("Summary is required");
    return;
  }
  emit("save", { ...form });
}
</script>
