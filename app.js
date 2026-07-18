const clauses = [
  {
    id: "arbitration",
    label: "Binding arbitration or jury waiver",
    level: "high",
    patterns: [
      /\bbinding arbitration\b/gi,
      /\bwaive (your )?right to (a )?jury trial\b/gi,
      /\bjury trial waiver\b/gi,
      /\bclass action waiver\b/gi
    ],
    why: "This can move a dispute out of court and limit how you can challenge the other side.",
    questions: [
      "What rights am I giving up if there is a dispute?",
      "Can I opt out, and how long do I have to do it?",
      "Who pays the arbitration costs?"
    ]
  },
  {
    id: "auto-renewal",
    label: "Automatic renewal",
    level: "medium",
    patterns: [
      /\bautomatically renews?\b/gi,
      /\bauto[- ]renew(al|s)?\b/gi,
      /\brenews? for successive\b/gi
    ],
    why: "You may be locked into another term unless you cancel in a narrow window.",
    questions: [
      "When is the cancellation deadline?",
      "What exact notice method counts?",
      "Will I get a reminder before renewal?"
    ]
  },
  {
    id: "termination-fee",
    label: "Early exit cost",
    level: "high",
    patterns: [
      /\bearly termination fee\b/gi,
      /\bliquidated damages\b/gi,
      /\btermination charge\b/gi,
      /\bremaining balance (is|shall be) due\b/gi
    ],
    why: "Leaving early may trigger a large bill even if you stop receiving the service.",
    questions: [
      "What would it cost to leave after 30 days?",
      "Are there exceptions for hardship, job loss, sale, or unsafe conditions?",
      "Is the fee capped?"
    ]
  },
  {
    id: "personal-guarantee",
    label: "Personal guarantee",
    level: "high",
    patterns: [
      /\bpersonal guarantee\b/gi,
      /\bpersonally guarantee\b/gi,
      /\bindividually liable\b/gi,
      /\bjointly and severally liable\b/gi
    ],
    why: "You may be putting your own money or property behind someone else's obligation.",
    questions: [
      "Exactly whose assets are exposed?",
      "When does the guarantee end?",
      "Can the guarantee be limited to a dollar amount or time period?"
    ]
  },
  {
    id: "unilateral-change",
    label: "One-sided change power",
    level: "medium",
    patterns: [
      /\bmay change (these|the) terms\b/gi,
      /\bat (our|its) sole discretion\b/gi,
      /\bwithout prior notice\b/gi,
      /\bwe reserve the right to modify\b/gi
    ],
    why: "The other side may be able to change the deal after you agree.",
    questions: [
      "What can change without my signature?",
      "Will I be notified before the change applies?",
      "Can I cancel without penalty if the terms change?"
    ]
  },
  {
    id: "noncompete",
    label: "Work restriction",
    level: "high",
    patterns: [
      /\bnon[- ]compete\b/gi,
      /\bnon[- ]solicit\b/gi,
      /\bnot compete\b/gi,
      /\brestrictive covenant\b/gi
    ],
    why: "This may limit where you can work, who you can serve, or how you earn money later.",
    questions: [
      "How long does the restriction last?",
      "What location and work does it cover?",
      "What happens if I leave or get fired?"
    ]
  },
  {
    id: "indemnity",
    label: "Indemnity or hold harmless",
    level: "medium",
    patterns: [
      /\bindemnif(y|ication)\b/gi,
      /\bhold harmless\b/gi,
      /\bdefend and indemnify\b/gi
    ],
    why: "You may have to pay for claims, losses, or lawyer costs caused by a broad set of events.",
    questions: [
      "What claims would I have to pay for?",
      "Does this include the other side's mistakes?",
      "Is there an insurance requirement or dollar cap?"
    ]
  },
  {
    id: "fees",
    label: "Extra fees and collection costs",
    level: "watch",
    patterns: [
      /\blate fee\b/gi,
      /\bcollection costs\b/gi,
      /\battorneys'? fees\b/gi,
      /\bprocessing fee\b/gi,
      /\badministrative fee\b/gi
    ],
    why: "Small missed steps can turn into added charges.",
    questions: [
      "What fees can be charged besides the main price?",
      "When do fees begin?",
      "Can fees stack?"
    ]
  },
  {
    id: "as-is",
    label: "As-is or no warranty",
    level: "watch",
    patterns: [
      /\bas[- ]is\b/gi,
      /\bwith all faults\b/gi,
      /\bno warranties\b/gi,
      /\bdisclaims? all warranties\b/gi
    ],
    why: "You may have fewer remedies if the thing is broken, unsafe, or not what you expected.",
    questions: [
      "What condition is guaranteed in writing?",
      "What happens if a hidden problem appears?",
      "Can important promises be added before signing?"
    ]
  },
  {
    id: "data-sharing",
    label: "Broad data sharing",
    level: "watch",
    patterns: [
      /\bshare (your|personal) (data|information)\b/gi,
      /\bsell (your|personal) (data|information)\b/gi,
      /\bthird[- ]party partners\b/gi,
      /\bfor marketing purposes\b/gi
    ],
    why: "Your information may travel beyond the service you thought you were using.",
    questions: [
      "Who receives my information?",
      "Can I opt out?",
      "What is still shared if I close the account?"
    ]
  }
];

const sampleText = `Residential service agreement

This agreement automatically renews for successive one-year terms unless written notice is received 45 days before the renewal date.

Any dispute shall be resolved by binding arbitration. Customer waives the right to a jury trial and agrees not to join a class action.

Cancellation before the end of the term requires payment of the remaining balance due plus collection costs and attorneys' fees.

The company may change these terms at its sole discretion without prior notice.`;

const input = document.querySelector("#documentText");
const results = document.querySelector("#results");
const summary = document.querySelector("#summary");
const scanButton = document.querySelector("#scanButton");
const sampleButton = document.querySelector("#sampleButton");
const clearButton = document.querySelector("#clearButton");
const openFileButton = document.querySelector("#openFileButton");
const fileInput = document.querySelector("#fileInput");
const fileStatus = document.querySelector("#fileStatus");
const downloadReportButton = document.querySelector("#downloadReportButton");
const downloadMarkdownButton = document.querySelector("#downloadMarkdownButton");
const inputPane = document.querySelector(".input-pane");
const filters = [...document.querySelectorAll(".filter")];

let currentFindings = [];
let activeFilter = "all";
let lastScan = null;
let loadedFileName = "";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function labelForLevel(level) {
  if (level === "high") return "Hard to undo";
  if (level === "medium") return "Ask first";
  return "Read closely";
}

function snippetAround(text, index, length) {
  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + length + 110);
  const prefix = start > 0 ? "... " : "";
  const suffix = end < text.length ? " ..." : "";
  return prefix + text.slice(start, end).replace(/\s+/g, " ").trim() + suffix;
}

function findClauses(text) {
  const findings = [];

  for (const clause of clauses) {
    const hits = [];
    for (const pattern of clause.patterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        hits.push({
          term: match[0],
          index: match.index,
          snippet: snippetAround(text, match.index, match[0].length)
        });
        if (hits.length >= 4) break;
      }
      if (hits.length >= 4) break;
    }

    if (hits.length) {
      findings.push({ ...clause, hits });
    }
  }

  return findings.sort((a, b) => {
    const weight = { high: 0, medium: 1, watch: 2 };
    return weight[a.level] - weight[b.level] || a.label.localeCompare(b.label);
  });
}

function renderSummary(findings, text) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const high = findings.filter((finding) => finding.level === "high").length;
  const medium = findings.filter((finding) => finding.level === "medium").length;
  const watch = findings.filter((finding) => finding.level === "watch").length;

  const label = words ? `${words.toLocaleString()} words checked` : "No document checked yet.";
  const value = findings.length
    ? `${findings.length} pause point${findings.length === 1 ? "" : "s"} found`
    : words
      ? "No listed traps found"
      : "Paste text and run the check.";

  summary.innerHTML = `
    <p class="summary-label">${escapeHtml(label)}</p>
    <p class="summary-value">${escapeHtml(value)}</p>
    ${words ? `<p class="fine-print">${high} hard to undo | ${medium} ask first | ${watch} read closely</p>` : ""}
  `;
}

function renderResults() {
  const visible = activeFilter === "all"
    ? currentFindings
    : currentFindings.filter((finding) => finding.level === activeFilter);

  if (!input.value.trim()) {
    results.innerHTML = `<div class="empty">Paste a document to start.</div>`;
    return;
  }

  if (!currentFindings.length) {
    results.innerHTML = `
      <div class="empty">
        No listed trap clauses were found. That does not mean the document is safe or complete. Read the full agreement and ask for help when the stakes are high.
      </div>
    `;
    return;
  }

  if (!visible.length) {
    results.innerHTML = `<div class="empty">No results in this filter.</div>`;
    return;
  }

  results.innerHTML = visible.map((finding) => `
    <article class="finding ${finding.level}">
      <div class="finding-head">
        <h3>${escapeHtml(finding.label)}</h3>
        <span class="level">${escapeHtml(labelForLevel(finding.level))}</span>
      </div>
      <p>${escapeHtml(finding.why)}</p>
      <div class="snippet">${escapeHtml(finding.hits[0].snippet)}</div>
      <ul>
        ${finding.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function scan() {
  const text = input.value;
  currentFindings = findClauses(text);
  renderSummary(currentFindings, text);
  renderResults();
  lastScan = text.trim()
    ? {
        text,
        findings: currentFindings,
        words: text.trim().split(/\s+/).length,
        fileName: loadedFileName,
        when: new Date()
      }
    : null;
  updateExportButtons();
}

function updateExportButtons() {
  downloadReportButton.disabled = !lastScan;
  downloadMarkdownButton.disabled = !lastScan;
}

// ---- Open a file (everything stays on this device) ----

function setFileStatus(message, isError) {
  fileStatus.textContent = message || "";
  fileStatus.classList.toggle("error", Boolean(isError));
}

function decodeXmlEntities(value) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (match, num) => String.fromCodePoint(parseInt(num, 10)))
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function docxXmlToText(xml) {
  const prepared = xml
    .replace(/<w:tab[^>]*\/>/g, "<w:t>\t</w:t>")
    .replace(/<w:br[^>]*\/>/g, "<w:t>\n</w:t>");

  return prepared
    .split(/<\/w:p>/)
    .map((paragraph) => {
      const texts = [];
      const textRun = /<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g;
      let match;
      while ((match = textRun.exec(paragraph)) !== null) {
        texts.push(match[1]);
      }
      return decodeXmlEntities(texts.join(""));
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findDocxDocumentEntry(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const stop = Math.max(0, bytes.length - 65558);

  let eocd = -1;
  for (let i = bytes.length - 22; i >= stop; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip archive");

  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();

  for (let i = 0; i < count; i++) {
    if (view.getUint32(offset, true) !== 0x02014b50) break;
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));

    if (name === "word/document.xml") {
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      return { method, data: bytes.slice(start, start + compressedSize) };
    }

    offset += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error("word/document.xml not found");
}

async function extractDocx(file) {
  const entry = findDocxDocumentEntry(await file.arrayBuffer());
  let xmlBytes;

  if (entry.method === 0) {
    xmlBytes = entry.data;
  } else if (entry.method === 8) {
    if (typeof DecompressionStream === "undefined") {
      throw new Error("this browser cannot unpack Word files");
    }
    const stream = new Blob([entry.data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    xmlBytes = new Uint8Array(await new Response(stream).arrayBuffer());
  } else {
    throw new Error("unsupported compression");
  }

  return docxXmlToText(new TextDecoder().decode(xmlBytes));
}

async function extractPdf(file) {
  const pdfjs = await import("./vendor/pdfjs/pdf.min.js");
  pdfjs.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.min.js";

  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      let pageText = "";
      for (const item of content.items) {
        pageText += item.str;
        pageText += item.hasEOL ? "\n" : " ";
      }
      pages.push(pageText.trim());
    }
  } finally {
    await doc.destroy();
  }
  return pages.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return extractPdf(file);
  if (name.endsWith(".docx")) return extractDocx(file);
  return (await file.text()).trim();
}

async function openDocumentFile(file) {
  if (!file) return;
  setFileStatus(`Reading ${file.name} on this device...`);

  let text = "";
  try {
    text = await extractTextFromFile(file);
  } catch (error) {
    setFileStatus("Could not read that file. Try a PDF, Word (.docx), or text file — or paste the text instead.", true);
    return;
  }

  if (!text) {
    setFileStatus("No text found in that file. A scanned or image-only PDF has no text to read — paste the text instead.", true);
    return;
  }

  loadedFileName = file.name;
  input.value = text;
  scan();
  setFileStatus(`${file.name} — read on this device. Nothing was uploaded.`);
}

// ---- Download the report (built and saved on this device) ----

function reportStamp(when) {
  const pad = (part) => String(part).padStart(2, "0");
  return `${when.getFullYear()}-${pad(when.getMonth() + 1)}-${pad(when.getDate())}`;
}

function downloadBlob(content, type, filename) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function reportCounts(findings) {
  return {
    high: findings.filter((finding) => finding.level === "high").length,
    medium: findings.filter((finding) => finding.level === "medium").length,
    watch: findings.filter((finding) => finding.level === "watch").length
  };
}

function buildMarkdownReport(scanData) {
  const counts = reportCounts(scanData.findings);
  const source = scanData.fileName ? `Document: ${scanData.fileName}` : "Document: pasted text";
  const lines = [
    "# Plainsight report",
    "",
    `${source}`,
    `Checked: ${reportStamp(scanData.when)} | ${scanData.words.toLocaleString()} words`,
    `Pause points: ${scanData.findings.length} (${counts.high} hard to undo, ${counts.medium} ask first, ${counts.watch} read closely)`,
    ""
  ];

  if (!scanData.findings.length) {
    lines.push("No listed trap clauses were found. That does not mean the document is safe or complete. Read the full agreement and ask for help when the stakes are high.");
  }

  for (const finding of scanData.findings) {
    lines.push(`## ${finding.label} — ${labelForLevel(finding.level)}`, "", finding.why, "", `> ${finding.hits[0].snippet}`, "", "Questions to ask:");
    for (const question of finding.questions) {
      lines.push(`- ${question}`);
    }
    lines.push("");
  }

  lines.push("---", "", "Plainsight is not legal advice. It helps you spot questions worth asking.", "This report was built and saved on your device. Nothing was uploaded.");
  return lines.join("\n");
}

function buildHtmlReport(scanData) {
  const counts = reportCounts(scanData.findings);
  const source = scanData.fileName ? escapeHtml(scanData.fileName) : "pasted text";
  const levelColor = { high: "#a43b36", medium: "#c47b27", watch: "#315f8c" };

  const findingsHtml = scanData.findings.length
    ? scanData.findings.map((finding) => `
      <section style="border:1px solid #d8dee3;border-left:6px solid ${levelColor[finding.level]};border-radius:8px;padding:16px;margin:0 0 14px;">
        <p style="margin:0 0 2px;font-size:0.78rem;font-weight:800;text-transform:uppercase;color:#66737d;">${escapeHtml(labelForLevel(finding.level))}</p>
        <h2 style="margin:0 0 8px;font-size:1.05rem;">${escapeHtml(finding.label)}</h2>
        <p style="margin:0 0 10px;">${escapeHtml(finding.why)}</p>
        <blockquote style="margin:0 0 10px;padding:10px;background:#f6f3ed;border-radius:6px;font-family:ui-monospace,Consolas,monospace;font-size:0.84rem;">${escapeHtml(finding.hits[0].snippet)}</blockquote>
        <p style="margin:0 0 4px;font-weight:700;">Questions to ask:</p>
        <ul style="margin:0;padding-left:20px;">${finding.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ul>
      </section>`).join("")
    : `<p style="border:1px dashed #d8dee3;border-radius:8px;padding:16px;color:#66737d;">No listed trap clauses were found. That does not mean the document is safe or complete. Read the full agreement and ask for help when the stakes are high.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Plainsight report</title>
</head>
<body style="margin:0;padding:28px;background:#f6f3ed;color:#172026;font-family:Inter,ui-sans-serif,system-ui,sans-serif;line-height:1.5;">
<main style="max-width:720px;margin:0 auto;background:#fff;border:1px solid #d8dee3;border-radius:8px;padding:28px;">
  <p style="margin:0 0 4px;font-size:0.78rem;font-weight:700;text-transform:uppercase;color:#66737d;">Plainsight report</p>
  <h1 style="margin:0 0 6px;font-size:1.7rem;">Read it before you sign.</h1>
  <p style="margin:0 0 2px;color:#66737d;">Document: ${source}</p>
  <p style="margin:0 0 18px;color:#66737d;">Checked ${escapeHtml(reportStamp(scanData.when))} | ${scanData.words.toLocaleString()} words | ${scanData.findings.length} pause point${scanData.findings.length === 1 ? "" : "s"} (${counts.high} hard to undo, ${counts.medium} ask first, ${counts.watch} read closely)</p>
  ${findingsHtml}
  <hr style="border:none;border-top:1px solid #d8dee3;margin:18px 0;">
  <p style="margin:0 0 6px;color:#66737d;font-size:0.9rem;">Plainsight is not legal advice. It helps you spot questions worth asking.</p>
  <p style="margin:0;color:#66737d;font-size:0.9rem;">This report was built and saved on your device. Nothing was uploaded. To keep a PDF copy, print this page and choose "Save as PDF".</p>
</main>
</body>
</html>`;
}

scanButton.addEventListener("click", scan);

sampleButton.addEventListener("click", () => {
  loadedFileName = "";
  setFileStatus("");
  input.value = sampleText;
  scan();
});

clearButton.addEventListener("click", () => {
  input.value = "";
  currentFindings = [];
  lastScan = null;
  loadedFileName = "";
  setFileStatus("");
  updateExportButtons();
  renderSummary([], "");
  renderResults();
  input.focus();
});

openFileButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  openDocumentFile(fileInput.files[0]);
  fileInput.value = "";
});

["dragover", "dragenter"].forEach((type) => {
  inputPane.addEventListener(type, (event) => {
    event.preventDefault();
    inputPane.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((type) => {
  inputPane.addEventListener(type, (event) => {
    event.preventDefault();
    inputPane.classList.remove("dragover");
  });
});

inputPane.addEventListener("drop", (event) => {
  openDocumentFile(event.dataTransfer.files[0]);
});

downloadReportButton.addEventListener("click", () => {
  if (!lastScan) return;
  downloadBlob(buildHtmlReport(lastScan), "text/html", `plainsight-report-${reportStamp(lastScan.when)}.html`);
});

downloadMarkdownButton.addEventListener("click", () => {
  if (!lastScan) return;
  downloadBlob(buildMarkdownReport(lastScan), "text/markdown", `plainsight-report-${reportStamp(lastScan.when)}.md`);
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    renderResults();
  });
});

renderResults();
