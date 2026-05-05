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
      <div class="small muted">
        <select v-model="editedBug.type" class="input">
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="enhancement">Enhancement</option>
        </select>
        •
        <select v-model="editedBug.severity" class="input">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
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
      <strong>Attachments</strong>
      <div v-if="bug.attachments.length === 0" class="muted">
        No attachments
      </div>
      <ul>
        <li v-for="a in bug.attachments" :key="a.id" class="attachment">
          {{ a.name }}
        </li>
      </ul>
      <div class="flex gap-2 mt-2 items-center">
        <input v-model="attachmentName" placeholder="Attachment name" />
        <button class="btn" @click="addAttachment">Add</button>
      </div>
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
const emit = defineEmits(["close", "save", "delete", "add-comment", "add-attachment"]);

const editedBug = ref({});
const commentAuthor = ref("");
const commentText = ref("");
const attachmentName = ref("");

onMounted(() => {
  editedBug.value = { ...props.bug };
});

function saveEdit() {
  emit("save", editedBug.value);
}

function addComment() {
  if (!commentText.value) return;
  emit("add-comment", {
    author: commentAuthor.value || "Anonymous",
    text: commentText.value,
  });
  commentText.value = "";
}

function addAttachment() {
  if (!attachmentName.value.trim()) return;
  emit("add-attachment", attachmentName.value.trim());
  attachmentName.value = "";
}
</script>
