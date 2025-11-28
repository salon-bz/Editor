const htmlEditor = ace.edit("html", {
  mode: "ace/mode/html",
  theme: "ace/theme/monokai"
});
const cssEditor = ace.edit("css", {
  mode: "ace/mode/css",
  theme: "ace/theme/monokai"
});
const jsEditor = ace.edit("js", {
  mode: "ace/mode/javascript",
  theme: "ace/theme/monokai"
});

[htmlEditor, cssEditor, jsEditor].forEach(ed => {
  ed.setOptions({
    fontSize: "14px",
    fontFamily: "monospace",
    cursorStyle: "ace",
    highlightActiveLine: true,
    showPrintMargin: false
  });
  ed.renderer.setOption("lineHeight", 20);
});

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function showTab(id) {
  document.querySelectorAll('.editor').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));

  document.getElementById(id).classList.add('active');

  // FIX: event no existe en algunos navegadores
  const btn = [...document.querySelectorAll('.tabs button')]
    .find(b => b.textContent.toLowerCase().includes(id));
  if (btn) btn.classList.add('active');
}

function runCode() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>${jsEditor.getValue()}<\/script>`;

  document.getElementById("preview").srcdoc = html + css + js;
}

async function downloadZip() {
  const zip = new JSZip();
  zip.file("index.html", htmlEditor.getValue());
  zip.file("style.css", cssEditor.getValue());
  zip.file("script.js", jsEditor.getValue());

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "project.zip";
  a.click();
}

function openPreview() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js = `<script>${jsEditor.getValue()}<\/script>`;

  const win = window.open();
  win.document.write(html + css + js);
  win.document.close();
}

function expandPreview() {
  const preview = document.getElementById("preview");
  const wrap = document.querySelector(".preview-wrap");
  const editorArea = document.querySelector(".editor-area");

  const expanded = preview.classList.toggle("expanded");

  if (expanded) {
    wrap.style.height = "100%";
    editorArea.style.display = "none";
  } else {
    wrap.style.height = "40%";
    editorArea.style.display = "flex";
  }
}

// Auto-run on change
[htmlEditor, cssEditor, jsEditor].forEach(editor => {
  editor.session.on("change", runCode);
});

runCode();
