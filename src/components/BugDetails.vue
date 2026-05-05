<template>
  <div class="card">
    <div>
      <h3>
        <input
          v-model="editedBug.summary"
          placeholder="Summary"
          class="input"
        />
      </h3>
      <div class="flex gap-2 mt-2">
        <div class="flex flex-col gap-1">
          <label class="small"><strong>Type</strong></label>
          <select v-model="editedBug.type" class="input">
            <option>Bug</option>
            <option>Task</option>
            <option>Improvement</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="small"><strong>Severity</strong></label>
          <select v-model="editedBug.severity" class="input">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="small"><strong>Platform</strong></label>
          <select v-model="editedBug.platform" class="input">
            <option v-for="p in platforms" :key="p">{{ p }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="small"><strong>Device</strong></label>
          <select v-model="editedBug.device" class="input">
            <option v-for="d in devices" :key="d">{{ d }}</option>
          </select>
        </div>
      </div>
      <div class="mt-2">
        <textarea
          v-model="editedBug.description"
          placeholder="Description"
          class="input"
          rows="4"
        />
      </div>

      <div class="mt-3">
        <strong>Assignee:</strong>
        <input
          v-model="editedBug.assignee"
          placeholder="Assignee"
          class="input"
        />
      </div>
      <div class="mt-2">
        <strong>Reporter:</strong>
        <input
          v-model="editedBug.reporter"
          placeholder="Reporter"
          class="input"
        />
      </div>
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
          <div v-else-if="a.mediaType === 'audio'" class="audio-thumb">
            <span>🎵</span>
            <div class="thumb-name">{{ a.name }}</div>
          </div>
          <div v-else class="audio-thumb">
            <span>📎</span>
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

    <div class="comments">
      <strong>Comments</strong>
      <div v-if="bug.comments.length === 0" class="muted">No comments yet</div>
      <div v-for="c in bug.comments" :key="c.id" class="comment">
        <div class="small">
          <strong>{{ c.author }}</strong> •
          <span class="muted">{{
            new Date(c.createdAt).toLocaleString()
          }}</span>
        </div>
        <div>{{ c.text }}</div>
      </div>
      <div class="flex gap-2 mt-2 items-center">
        <input v-model="commentAuthor" placeholder="Your name" />
        <input v-model="commentText" placeholder="Add a comment" />
        <button class="btn" @click="addComment">Comment</button>
      </div>
    </div>

    <div class="flex gap-2 mt-3">
      <button class="btn secondary" @click="$emit('close')">Close</button>
      <button class="btn" @click="saveEdit">Save</button>
      <button class="btn" @click="$emit('delete', bug.id)">Delete</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({ bug: { type: Object, required: true } });
const emit = defineEmits(["close", "save", "delete", "add-comment"]);

const platforms = ["Web", "iOS", "Android", "Desktop", "API"];
const devices = ["Any", "Phone", "Tablet", "Laptop", "Desktop"];

const editedBug = ref({});
const commentAuthor = ref("");
const commentText = ref("");
const fileInput = ref(null);
const attachments = ref([]);

onMounted(() => {
  editedBug.value = { type: "Bug", severity: "Medium", platform: "Web", device: "Any", ...props.bug };
  attachments.value = (props.bug.attachments || []).map((a) => ({ ...a }));
});

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
  const a = attachments.value[i];
  if (a.url?.startsWith("blob:")) URL.revokeObjectURL(a.url);
  attachments.value.splice(i, 1);
}

function openPreview(a) {
  if (a.url) window.open(a.url, "_blank");
}

function saveEdit() {
  emit("save", { ...editedBug.value, attachments: attachments.value });
}

function addComment() {
  if (!commentText.value) return;
  emit("add-comment", {
    author: commentAuthor.value || "Anonymous",
    text: commentText.value,
  });
  commentText.value = "";
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
