import { reactive, computed, watch } from "vue";

const STORAGE_KEY = "bug_list_v1";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

const state = reactive({
  bugs: load(),
});

watch(
  () => state.bugs,
  (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
  { deep: true },
);

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function useBugs() {
  function addBug(payload) {
    const bug = {
      id: nextId(),
      type: payload.type || "Bug",
      summary: payload.summary || "",
      severity: payload.severity || "Medium",
      description: payload.description || "",
      attachments: payload.attachments || [],
      assignee: payload.assignee || null,
      reporter: payload.reporter || null,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    state.bugs.unshift(bug);
    return bug;
  }

  function updateBug(id, changes) {
    const idx = state.bugs.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    state.bugs[idx] = { ...state.bugs[idx], ...changes };
    return state.bugs[idx];
  }

  function removeBug(id) {
    const idx = state.bugs.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    state.bugs.splice(idx, 1);
    return true;
  }

  function addComment(id, author, text) {
    const bug = state.bugs.find((b) => b.id === id);
    if (!bug) return null;
    const comment = {
      id: nextId(),
      author,
      text,
      createdAt: new Date().toISOString(),
    };
    bug.comments.push(comment);
    return comment;
  }

  function addAttachment(id, name) {
    const bug = state.bugs.find((b) => b.id === id);
    if (!bug) return null;
    bug.attachments.push({ id: nextId(), name });
    return bug.attachments[bug.attachments.length - 1];
  }

  const count = computed(() => state.bugs.length);

  return {
    bugs: state.bugs,
    addBug,
    updateBug,
    removeBug,
    addComment,
    addAttachment,
    count,
  };
}
