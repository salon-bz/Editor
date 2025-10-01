const htmlEditor = ace.edit("html",{mode:"ace/mode/html",theme:"ace/theme/monokai"});
const cssEditor = ace.edit("css",{mode:"ace/mode/css",theme:"ace/theme/monokai"});
const jsEditor = ace.edit("js",{mode:"ace/mode/javascript",theme:"ace/theme/monokai"});

[htmlEditor, cssEditor, jsEditor].forEach(ed=>{
  ed.setOption("fontSize","14px");
  ed.setOption("fontFamily","monospace");
  ed.setOption("cursorStyle","ace");
  ed.setOption("highlightActiveLine",true);
  ed.setOption("showPrintMargin",false);
  ed.renderer.setOption("lineHeight",20);
});

function toggleMenu(){
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display==="flex" ? "none" : "flex";
}

function showTab(id){
  document.querySelectorAll('.editor').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}

function runCode(){
  const code = `
    <style>${cssEditor.getValue()}</style>
    ${htmlEditor.getValue()}
    <script>${jsEditor.getValue()}<\/script>
  `;
  const preview = document.getElementById("preview");
  preview.srcdoc = code;
}

async function downloadZip(){
  const zip = new JSZip();
  zip.file("index.html", htmlEditor.getValue());
  zip.file("style.css", cssEditor.getValue());
  zip.file("script.js", jsEditor.getValue());
  const blob = await zip.generateAsync({type:"blob"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "project.zip";
  a.click();
}

function openPreview(){
  const code = `
    <style>${cssEditor.getValue()}</style>
    ${htmlEditor.getValue()}
    <script>${jsEditor.getValue()}<\/script>
  `;
  const w = window.open();
  w.document.open();
  w.document.write(code);
  w.document.close();
}

function expandPreview(){
  const preview = document.getElementById("preview");
  if(preview.style.height==="100%"){
    preview.style.height="auto";
    document.querySelector(".preview-wrap").style.height="40%";
    document.querySelector(".editor-area").style.display="flex";
  }else{
    preview.style.height="100%";
    document.querySelector(".preview-wrap").style.height="100%";
    document.querySelector(".editor-area").style.display="none";
  }
}

[htmlEditor, cssEditor, jsEditor].forEach(editor=>{
  editor.session.on("change", ()=>{runCode();});
});

runCode();