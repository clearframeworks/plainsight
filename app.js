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
const filters = [...document.querySelectorAll(".filter")];

let currentFindings = [];
let activeFilter = "all";

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
}

scanButton.addEventListener("click", scan);

sampleButton.addEventListener("click", () => {
  input.value = sampleText;
  scan();
});

clearButton.addEventListener("click", () => {
  input.value = "";
  currentFindings = [];
  renderSummary([], "");
  renderResults();
  input.focus();
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    renderResults();
  });
});

renderResults();
