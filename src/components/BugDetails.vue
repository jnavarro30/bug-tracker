<template>
  <div class="card">
    <h3>{{ bug.summary }}</h3>
    <div class="small muted">
      Type: {{ bug.type }} • Severity: {{ bug.severity }}
    </div>
    <div class="mt-2">{{ bug.description || "No description" }}</div>

    <div class="mt-3">
      <strong>Assignee:</strong>
      <span class="muted">{{ bug.assignee || "Unassigned" }}</span>
    </div>
    <div class="mt-2">
      <strong>Reporter:</strong>
      <span class="muted">{{ bug.reporter || "Unknown" }}</span>
    </div>

    <div class="mt-3">
      <strong>Attachments</strong>
      <div v-if="bug.attachments.length === 0" class="muted">
        No attachments
      </div>
      <ul class="list-none">
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
      <button class="btn" @click="$emit('edit', bug)">Edit</button>
      <button class="btn" @click="$emit('delete', bug.id)">Delete</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({ bug: { type: Object, required: true } });
const emit = defineEmits(["close", "edit", "delete"]);

const attachmentName = ref("");
const commentAuthor = ref("");
const commentText = ref("");

function addAttachment() {
  if (!attachmentName.value.trim()) return;
  emit("add-attachment", attachmentName.value.trim());
  attachmentName.value = "";
}

function addComment() {
  if (!commentAuthor.value.trim() || !commentText.value.trim()) {
    alert("Name and comment required");
    return;
  }
  emit("add-comment", {
    author: commentAuthor.value.trim(),
    text: commentText.value.trim(),
  });
  commentAuthor.value = "";
  commentText.value = "";
}
</script>
