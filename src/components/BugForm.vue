<template>
  <div class="card">
    <h3 class="p-5 text-center">
      {{ edit ? "Edit Bug" : "New Bug" }}
    </h3>
    <div class="flex gap-2 mt-2">
      <div class="flex flex-col gap-1">
        <label class="small"><strong>Type</strong></label>
        <select v-model="form.type">
          <option>Bug</option>
          <option>Task</option>
          <option>Improvement</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="small"><strong>Severity</strong></label>
        <select v-model="form.severity">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>
    </div>
    <div class="flex gap-2 mt-2">
      <div class="flex flex-col gap-1">
        <label class="small"><strong>Platform</strong></label>
        <select v-model="form.platform">
          <option v-for="p in platforms" :key="p">{{ p }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="small"><strong>Device</strong></label>
        <select v-model="form.device">
          <option v-for="d in devices" :key="d">{{ d }}</option>
        </select>
      </div>
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

    <div class="mt-3">
      <label class="small"><strong>Attachments</strong></label>
      <div class="thumbnails">
        <div
          v-for="(a, i) in attachments"
          :key="i"
          class="thumbnail"
          :title="a.name"
          @click="openPreview(a)"
        >
          <img v-if="a.mediaType === 'image'" :src="a.url" :alt="a.name" />
          <video v-else-if="a.mediaType === 'video'" :src="a.url" />
          <div v-else class="audio-thumb">
            <span>🎵</span>
            <div class="thumb-name">{{ a.name }}</div>
          </div>
          <button class="thumb-remove" @click.stop="removeAttachment(i)">✕</button>
        </div>
        <button class="thumb-add btn" @click="fileInput.click()">+ Add</button>
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*,audio/*"
        multiple
        style="display: none"
        @change="handleFiles"
      />
    </div>

    <div class="flex gap-2 mt-3">
      <button class="btn" @click="submit">{{ edit ? "Save" : "Add" }}</button>
      <button class="btn secondary" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
const props = defineProps({
  modelValue: { type: Object, default: null },
});
const emit = defineEmits(["save", "cancel"]);

const edit = !!props.modelValue;
const platforms = ["Web", "iOS", "Android", "Desktop", "API"];
const devices = ["Any", "Phone", "Tablet", "Laptop", "Desktop"];

const form = reactive({
  type: props.modelValue?.type || "Bug",
  severity: props.modelValue?.severity || "Medium",
  platform: props.modelValue?.platform || "Web",
  device: props.modelValue?.device || "Any",
  summary: props.modelValue?.summary || "",
  description: props.modelValue?.description || "",
  assignee: props.modelValue?.assignee || "",
  reporter: props.modelValue?.reporter || "",
});

const fileInput = ref(null);
const attachments = ref([]);

function handleFiles(e) {
  Array.from(e.target.files).forEach((file) => {
    const mediaType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "audio";
    attachments.value.push({ name: file.name, mediaType, url: URL.createObjectURL(file) });
  });
  e.target.value = "";
}

function removeAttachment(i) {
  URL.revokeObjectURL(attachments.value[i].url);
  attachments.value.splice(i, 1);
}

function openPreview(a) {
  window.open(a.url, "_blank");
}

function submit() {
  if (!form.summary.trim()) {
    alert("Summary is required");
    return;
  }
  emit("save", { ...form, attachments: attachments.value.map(({ name, mediaType, url }) => ({ name, mediaType, url })) });
}
</script>

<style scoped>
.thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  align-items: flex-start;
}

.thumbnail {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border, #ddd);
  flex-shrink: 0;
}

.thumbnail img,
.thumbnail video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.audio-thumb {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  font-size: 20px;
  gap: 2px;
}

.thumb-name {
  font-size: 8px;
  text-align: center;
  overflow: hidden;
  max-width: 56px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.thumb-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border: none;
  font-size: 9px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.thumb-add {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}
</style>
