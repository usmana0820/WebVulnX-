(() => {
  const stats = {
    total: 24,
    vulns: 38,
    high: 12,
    medium: 18,
    low: 8,
  };

  const topVulns = [
    { name: "SQL Injection", count: 12 },
    { name: "Cross-Site Scripting (XSS)", count: 10 },
    { name: "Security Misconfiguration", count: 8 },
    { name: "Sensitive Data Exposure", count: 5 },
    { name: "Others", count: 3 },
  ];

  const recentScans = [
    { url: "example.com", time: "Today, 10:30 AM", risk: "high" },
    { url: "testsite.com", time: "Today, 09:15 AM", risk: "medium" },
    { url: "myapp.com", time: "Yesterday, 4:42 PM", risk: "low" },
    { url: "demo-shop.local", time: "Yesterday, 1:05 PM", risk: "high" },
  ];

  const DEMO_PROFILES = {
    "vuln-demo.example.com": {
      risk: "high",
      findings: [
        {
          title: "SQL Injection",
          severity: "high",
          detail: "Parameter `id` on /login.php appears injectable (error-based).",
          fix: "Use parameterized queries / prepared statements.",
        },
        {
          title: "Cross-Site Scripting (XSS)",
          severity: "high",
          detail: "Reflected XSS found in search field without output encoding.",
          fix: "Encode output and enforce Content-Security-Policy.",
        },
        {
          title: "Security Misconfiguration",
          severity: "medium",
          detail: "Server discloses version banner and directory listing enabled.",
          fix: "Disable directory listing and hide server headers.",
        },
        {
          title: "Missing Security Headers",
          severity: "low",
          detail: "HSTS and X-Frame-Options headers are not present.",
          fix: "Add HSTS, X-Frame-Options, and X-Content-Type-Options.",
        },
      ],
    },
    "testsite.com": {
      risk: "medium",
      findings: [
        {
          title: "Security Misconfiguration",
          severity: "medium",
          detail: "Debug mode enabled in production configuration.",
          fix: "Disable debug flags and harden environment configs.",
        },
        {
          title: "Sensitive Data Exposure",
          severity: "medium",
          detail: "Session cookie missing Secure / HttpOnly flags.",
          fix: "Set Secure, HttpOnly, and SameSite on cookies.",
        },
        {
          title: "Missing Security Headers",
          severity: "low",
          detail: "CSP header not configured.",
          fix: "Define a strict Content-Security-Policy.",
        },
      ],
    },
    "myapp.com": {
      risk: "low",
      findings: [
        {
          title: "Missing Security Headers",
          severity: "low",
          detail: "X-Content-Type-Options header not set.",
          fix: "Add nosniff and related security headers.",
        },
        {
          title: "Outdated JS Library",
          severity: "low",
          detail: "Minor outdated frontend dependency detected.",
          fix: "Update libraries to the latest patched versions.",
        },
      ],
    },
  };

  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("toastBody");
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 2800 }) : null;

  let severityChart;
  let scanRunning = false;
  let lastDemoResult = null;
  let timers = [];

  const processModalEl = document.getElementById("scanProcessModal");
  const processModal = processModalEl
    ? new bootstrap.Modal(processModalEl)
    : null;

  function showToast(message) {
    if (!toast || !toastBody) return;
    toastBody.textContent = message;
    toast.show();
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function updateStats() {
    document.getElementById("statTotal").textContent = stats.total;
    document.getElementById("statVulns").textContent = stats.vulns;
    document.getElementById("statHigh").textContent = stats.high;
    document.getElementById("statMedium").textContent = stats.medium;
    document.getElementById("statLow").textContent = stats.low;

    const totalRisk = stats.high + stats.medium + stats.low || 1;
    document.getElementById("pctHigh").textContent =
      Math.round((stats.high / totalRisk) * 100) + "%";
    document.getElementById("pctMedium").textContent =
      Math.round((stats.medium / totalRisk) * 100) + "%";
    document.getElementById("pctLow").textContent =
      Math.round((stats.low / totalRisk) * 100) + "%";
  }

  function renderTopVulns() {
    const list = document.getElementById("topVulns");
    if (!list) return;
    const max = Math.max(...topVulns.map((v) => v.count), 1);
    list.innerHTML = topVulns
      .map(
        (v) => `
      <li>
        <div class="d-flex justify-content-between mb-1">
          <span>${v.name}</span>
          <strong>${v.count}</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${Math.round((v.count / max) * 100)}%"></div>
        </div>
      </li>`
      )
      .join("");
  }

  function renderRecentScans() {
    const list = document.getElementById("recentScans");
    if (!list) return;
    list.innerHTML = recentScans
      .map(
        (s) => `
      <li>
        <div>
          <div class="scan-url">${s.url}</div>
          <div class="scan-time">${s.time}</div>
        </div>
        <span class="badge-risk ${s.risk}">${capitalize(s.risk)}</span>
      </li>`
      )
      .join("");
  }

  function initChart() {
    const canvas = document.getElementById("severityChart");
    if (!canvas || typeof Chart === "undefined") return;

    if (severityChart) severityChart.destroy();

    severityChart = new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            data: [stats.high, stats.medium, stats.low],
            backgroundColor: ["#d32f2f", "#ef6c00", "#2e7d32"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx) {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const pct = Math.round((ctx.raw / total) * 100);
                return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
              },
            },
          },
        },
        animation: { animateRotate: true, duration: 800 },
      },
    });
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function hostFromUrl(url) {
    try {
      return new URL(url).hostname || url;
    } catch {
      return url.replace(/^https?:\/\//, "").split("/")[0] || url;
    }
  }

  function formatNow() {
    return new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function clock() {
    const d = new Date();
    return d.toLocaleTimeString("en-GB", { hour12: false });
  }

  function getProfile(host) {
    if (DEMO_PROFILES[host]) return DEMO_PROFILES[host];
    if (host.includes("demo") || host.includes("vuln") || host.includes("shop")) {
      return DEMO_PROFILES["vuln-demo.example.com"];
    }
    if (host.includes("test")) return DEMO_PROFILES["testsite.com"];
    return DEMO_PROFILES["myapp.com"];
  }

  function setProgress(pct, phase) {
    document.getElementById("scanProgressBar").style.width = pct + "%";
    document.getElementById("scanPercentText").textContent = pct + "%";
    if (phase) document.getElementById("scanPhaseText").textContent = phase;
  }

  function logLine(text, type = "info") {
    const consoleEl = document.getElementById("scanConsole");
    if (!consoleEl) return;
    const line = document.createElement("div");
    line.className = `console-line ${type}`;
    line.innerHTML = `<span class="ts">[${clock()}]</span>${text}`;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function resetProcessUI(target) {
    document.getElementById("scanTargetLabel").textContent = `Target: ${target}`;
    document.getElementById("scanConsole").innerHTML = "";
    document.getElementById("findingsBody").innerHTML =
      '<p class="text-muted small mb-0 p-3">Findings will appear as the dummy scan detects issues.</p>';
    document.getElementById("findingsCount").textContent = "Waiting…";
    document.getElementById("resultSummary").classList.add("d-none");
    document.getElementById("consoleLive").classList.remove("off");
    document.getElementById("consoleLive").innerHTML =
      '<span class="pulse"></span> LIVE';

    setProgress(0, "Initializing…");

    document.querySelectorAll(".process-step").forEach((el) => {
      el.classList.remove("active", "done");
      const icon = el.querySelector(".status-icon");
      icon.className = "bi bi-circle status-icon";
    });

    document.querySelectorAll("#workflowSteps .step").forEach((el) => {
      el.classList.remove("active", "done");
    });

    ["closeProcessBtn", "closeDemoFooter", "rerunDemoBtn", "viewDemoReportBtn"].forEach(
      (id) => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = true;
      }
    );
  }

  function setProcessStep(index, state) {
    const el = document.querySelector(`.process-step[data-process="${index}"]`);
    const flow = document.querySelector(`#workflowSteps .step[data-step="${index}"]`);
    if (!el) return;

    el.classList.remove("active", "done");
    if (flow) flow.classList.remove("active", "done");

    const icon = el.querySelector(".status-icon");
    if (state === "active") {
      el.classList.add("active");
      if (flow) flow.classList.add("active");
      icon.className = "bi bi-arrow-repeat status-icon";
    } else if (state === "done") {
      el.classList.add("done");
      if (flow) flow.classList.add("done");
      icon.className = "bi bi-check-circle-fill status-icon";
    }
  }

  function addFinding(finding, index) {
    const body = document.getElementById("findingsBody");
    if (index === 0) body.innerHTML = "";

    const item = document.createElement("div");
    item.className = "finding-item";
    item.innerHTML = `
      <div class="finding-top">
        <strong>${finding.title}</strong>
        <span class="badge-risk ${finding.severity}">${capitalize(finding.severity)}</span>
      </div>
      <p>${finding.detail}</p>
      <div class="fix"><i class="bi bi-shield-check me-1"></i>Fix: ${finding.fix}</div>
    `;
    body.appendChild(item);
    document.getElementById("findingsCount").textContent = `${index + 1} found`;
  }

  function fillReportTable(findings, host) {
    const tbody = document.querySelector("#reportModal tbody");
    if (!tbody) return;
    tbody.innerHTML = findings
      .map(
        (f) => `
      <tr>
        <td>${host}</td>
        <td>${f.title}</td>
        <td><span class="badge-risk ${f.severity}">${capitalize(f.severity)}</span></td>
        <td>${f.fix}</td>
      </tr>`
      )
      .join("");
  }

  function applyDashboardResult(host, profile) {
    const counts = { high: 0, medium: 0, low: 0 };
    profile.findings.forEach((f) => {
      counts[f.severity] += 1;
    });

    stats.total += 1;
    stats.vulns += profile.findings.length;
    stats.high += counts.high;
    stats.medium += counts.medium;
    stats.low += counts.low;

    profile.findings.forEach((f) => {
      if (f.title.includes("SQL")) topVulns[0].count += 1;
      else if (f.title.includes("XSS") || f.title.includes("Scripting")) topVulns[1].count += 1;
      else if (f.title.includes("Misconfiguration")) topVulns[2].count += 1;
      else if (f.title.includes("Sensitive")) topVulns[3].count += 1;
      else topVulns[4].count += 1;
    });

    recentScans.unshift({
      url: host,
      time: `Today, ${formatNow()}`,
      risk: profile.risk,
    });
    if (recentScans.length > 5) recentScans.pop();

    updateStats();
    initChart();
    renderTopVulns();
    renderRecentScans();
    fillReportTable(profile.findings, host);
  }

  function finishScan(host, profile) {
    scanRunning = false;

    document.getElementById("consoleLive").classList.add("off");
    document.getElementById("consoleLive").innerHTML =
      '<span class="pulse"></span> DONE';

    const high = profile.findings.filter((f) => f.severity === "high").length;
    const medium = profile.findings.filter((f) => f.severity === "medium").length;
    const low = profile.findings.filter((f) => f.severity === "low").length;

    const summary = document.getElementById("resultSummary");
    summary.classList.remove("d-none");
    document.getElementById("resultTitle").textContent = "Dummy Scan Complete";
    document.getElementById(
      "resultSubtitle"
    ).textContent = `Report prepared for ${host} · Overall risk: ${capitalize(profile.risk)}`;

    document.getElementById("resultStats").innerHTML = `
      <div class="col-3"><div class="result-stat"><span>Findings</span><strong>${profile.findings.length}</strong></div></div>
      <div class="col-3"><div class="result-stat"><span>High</span><strong class="text-danger">${high}</strong></div></div>
      <div class="col-3"><div class="result-stat"><span>Medium</span><strong class="text-warning-custom">${medium}</strong></div></div>
      <div class="col-3"><div class="result-stat"><span>Low</span><strong class="text-success-custom">${low}</strong></div></div>
    `;

    ["closeProcessBtn", "closeDemoFooter", "rerunDemoBtn", "viewDemoReportBtn"].forEach(
      (id) => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = false;
      }
    );

    applyDashboardResult(host, profile);
    lastDemoResult = { host, profile };
    showToast(`Demo scan finished for ${host}`);
  }

  function runDummyScan(rawUrl, scanType = "full") {
    if (scanRunning) {
      showToast("A demo scan is already running");
      return;
    }

    const url = rawUrl?.trim() || "https://vuln-demo.example.com";
    const host = hostFromUrl(url);
    const profile = getProfile(host);

    clearTimers();
    scanRunning = true;
    resetProcessUI(url);
    processModal?.show();

    // Scroll workflow into view on page
    document.getElementById("workflowSteps")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });

    const deep = document.getElementById("deepScan")?.checked !== false;

    // Timeline of dummy process
    const timeline = [
      {
        at: 200,
        run() {
          setProcessStep(0, "active");
          setProgress(5, "1/5 Automated Scan");
          logLine("WebVulnX dummy engine started", "ok");
          logLine(`Target locked: ${url}`, "info");
          logLine(`Scan profile: ${scanType.toUpperCase()}`, "tool");
        },
      },
      {
        at: 900,
        run() {
          setProgress(12, "1/5 Automated Scan");
          logLine("DNS resolve OK · connecting to host…", "info");
        },
      },
      {
        at: 1600,
        run() {
          setProgress(20, "1/5 Automated Scan");
          logLine("Crawling pages: /, /login, /search, /api/users", "info");
          logLine(`Discovered 14 endpoints${deep ? " (deep crawl on)" : ""}`, "ok");
        },
      },
      {
        at: 2400,
        run() {
          setProcessStep(0, "done");
          setProcessStep(1, "active");
          setProgress(28, "2/5 Integrated Tools");
          logLine("Launching integrated scanners…", "tool");
        },
      },
      {
        at: 3100,
        run() {
          setProgress(38, "2/5 Integrated Tools");
          logLine("OWASP ZAP → spider + passive scan", "tool");
        },
      },
      {
        at: 3800,
        run() {
          setProgress(48, "2/5 Integrated Tools");
          logLine("SQLMap → testing injectable parameters", "tool");
          logLine("Nmap → open ports & service fingerprint", "tool");
        },
      },
      {
        at: 4500,
        run() {
          setProcessStep(1, "done");
          setProcessStep(2, "active");
          setProgress(55, "3/5 Vulnerability Detection");
          logLine("Analyzing responses for SQLi / XSS patterns…", "warn");
        },
      },
    ];

    // Detection events per finding
    profile.findings.forEach((finding, i) => {
      timeline.push({
        at: 5200 + i * 1100,
        run() {
          const pct = 55 + Math.round(((i + 1) / profile.findings.length) * 20);
          setProgress(Math.min(pct, 75), "3/5 Vulnerability Detection");
          const level = finding.severity === "high" ? "err" : finding.severity === "medium" ? "warn" : "info";
          logLine(`DETECTED · ${finding.title} [${finding.severity.toUpperCase()}]`, level);
          logLine(`  ↳ ${finding.detail}`, "info");
          addFinding(finding, i);
        },
      });
    });

    const afterDetect = 5200 + profile.findings.length * 1100;

    timeline.push(
      {
        at: afterDetect + 400,
        run() {
          setProcessStep(2, "done");
          setProcessStep(3, "active");
          setProgress(82, "4/5 Risk Classification");
          logLine("Classifying findings by severity…", "info");
        },
      },
      {
        at: afterDetect + 1200,
        run() {
          const high = profile.findings.filter((f) => f.severity === "high").length;
          const medium = profile.findings.filter((f) => f.severity === "medium").length;
          const low = profile.findings.filter((f) => f.severity === "low").length;
          setProgress(90, "4/5 Risk Classification");
          logLine(
            `Risk score → High:${high}  Medium:${medium}  Low:${low}`,
            "warn"
          );
          logLine(`Overall risk level: ${profile.risk.toUpperCase()}`, "ok");
        },
      },
      {
        at: afterDetect + 2000,
        run() {
          setProcessStep(3, "done");
          setProcessStep(4, "active");
          setProgress(95, "5/5 Reports & Recommendations");
          logLine("Preparing mitigation recommendations…", "info");
        },
      },
      {
        at: afterDetect + 2800,
        run() {
          profile.findings.forEach((f) => {
            logLine(`Recommendation ready · ${f.title}`, "ok");
          });
          setProgress(100, "Complete");
          setProcessStep(4, "done");
          logLine("Dummy report package generated successfully", "ok");
          finishScan(host, profile);
        },
      }
    );

    timeline.forEach((item) => later(item.run, item.at));
  }

  // Sidebar
  sidebarToggle?.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      item.classList.add("active");
      const page = item.dataset.page;

      if (page === "about") {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (page === "dashboard") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (page === "scan") {
        document.getElementById("demoScan")?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      if (page === "reports") {
        if (lastDemoResult) {
          fillReportTable(lastDemoResult.profile.findings, lastDemoResult.host);
        }
        new bootstrap.Modal(document.getElementById("reportModal")).show();
        return;
      }
      if (page) {
        showToast(`${capitalize(page)} — coming soon in WebVulnX`);
      }
    });
  });

  document.getElementById("refreshBtn")?.addEventListener("click", () => {
    updateStats();
    initChart();
    renderTopVulns();
    renderRecentScans();
    showToast("Dashboard data refreshed");
  });

  // Demo banner controls
  document.querySelectorAll(".preset-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.getElementById("demoUrl").value = chip.dataset.url;
    });
  });

  document.getElementById("startDemoBtn")?.addEventListener("click", () => {
    runDummyScan(document.getElementById("demoUrl").value, "full");
  });

  document.getElementById("openDemoBtn")?.addEventListener("click", () => {
    document.getElementById("demoScan")?.scrollIntoView({ behavior: "smooth" });
    later(() => runDummyScan(document.getElementById("demoUrl").value, "full"), 350);
  });

  // Form launch
  document.getElementById("scanForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = document.getElementById("targetUrl").value.trim();
    const type = document.getElementById("scanType").value;
    const modal = bootstrap.Modal.getInstance(document.getElementById("newScanModal"));
    modal?.hide();
    later(() => runDummyScan(url, type), 300);
  });

  document.getElementById("rerunDemoBtn")?.addEventListener("click", () => {
    const url =
      document.getElementById("demoUrl").value ||
      document.getElementById("targetUrl").value ||
      "https://vuln-demo.example.com";
    runDummyScan(url, "full");
  });

  document.getElementById("viewDemoReportBtn")?.addEventListener("click", () => {
    processModal?.hide();
    later(() => {
      new bootstrap.Modal(document.getElementById("reportModal")).show();
    }, 250);
  });

  processModalEl?.addEventListener("hidden.bs.modal", () => {
    if (scanRunning) {
      clearTimers();
      scanRunning = false;
    }
  });

  document.getElementById("exportBtn")?.addEventListener("click", () => {
    showToast("Report export queued (demo)");
  });

  // Init
  updateStats();
  renderTopVulns();
  renderRecentScans();
  initChart();
})();
