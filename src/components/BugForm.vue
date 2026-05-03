<template>
  <div class="card">
    <h3 class="p-5 text-center">
      {{ edit ? "Edit Bug" : "New Bug" }}
    </h3>
    <div class="flex gap-2 mt-2">
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
    <div class="mt-2">
      <input v-model="form.summary" placeholder="Summary" />
    </div>
    <div class="mt-2">
      <textarea v-model="form.description" placeholder="Description"></textarea>
    </div>
    <div class="flex flex-col gap-2 mt-2">
      <input v-model="form.assignee" placeholder="Assignee" />
      <input v-model="form.reporter" placeholder="Reporter" />
    </div>
    <div class="flex gap-2 mt-3">
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
