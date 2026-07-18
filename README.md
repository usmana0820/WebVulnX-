# WebVulnX

**A Scalable Automated Framework for Detecting Vulnerabilities in Web Applications**

WebVulnX is a final-year project dashboard that demonstrates how an automated vulnerability detection framework can scan web applications, detect common security flaws (such as SQL Injection and XSS), classify risk severity, and present clear mitigation recommendations through a user-friendly interface.

---

## Project Idea

### 1. Introduction

Web applications are widely used in almost every sector, including education, healthcare, banking, and e-commerce. Due to rapid development and frequent updates, many web applications are deployed with security flaws that can be exploited by attackers. Manual vulnerability assessment is time-consuming and requires expert knowledge, which is not always available. Therefore, there is a strong need for an automated and scalable solution that can efficiently detect common web application vulnerabilities. This project focuses on providing an automated framework that simplifies vulnerability detection and helps developers and security teams identify risks at an early stage.

### 2. Problem Statement

Many organizations rely on manual or single-tool-based security testing, which is inefficient and error-prone. Existing vulnerability scanning tools often produce complex technical outputs that are difficult for non-security professionals to understand. Additionally, these tools are usually operated separately, making the overall assessment process time-consuming and unstructured. Small development teams and students often lack the resources and expertise to perform comprehensive security testing. As a result, web applications remain vulnerable to common attacks such as SQL Injection and Cross-Site Scripting (XSS).

### 3. Proposed Solution

The proposed solution is a scalable automated framework that integrates multiple open-source vulnerability scanning tools into a single system. The framework will automatically scan web applications, detect common vulnerabilities, and classify them based on risk severity. A user-friendly dashboard will present scan results in an easy-to-understand format along with recommended mitigation steps. The system is designed to be scalable, allowing future integration of additional tools and security checks. This framework will reduce manual effort, improve accuracy, and make web security testing accessible to both technical and non-technical users.

---

## Features

- Automated scanning workflow (demo)
- SQL Injection detection (demo findings)
- XSS detection (demo findings)
- Risk classification: **High / Medium / Low**
- Integrated tools presentation: OWASP ZAP, SQLMap, Nmap
- User-friendly Bootstrap dashboard
- Mitigation recommendations in reports
- Live **dummy scan process** for presentations

---

## Technologies

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| Charts | Chart.js |
| Icons | Bootstrap Icons |
| Planned backend | Python, Flask |
| Planned scanners | OWASP ZAP, SQLMap, Nmap |

---

## Project Structure

```
.
├── index.html      # Dashboard UI
├── styles.css      # Purple theme & layout
├── app.js          # Dashboard logic + dummy scan demo
└── README.md       # Project documentation
```

---

## How to Run

1. Open the project folder.
2. Double-click `index.html`, or run:

```powershell
start index.html
```

No server install is required for the current frontend demo.

---

## Dummy Scan Demo (for presentations)

Use this when showing supervisors or classmates how the scan → detect → report flow works.

### Steps

1. Open `index.html` in a browser.
2. Click **Try Dummy Scan** (top right), or use the **Start Demo** panel.
3. Optionally pick a preset:
   - **High-risk site** — SQL Injection + XSS findings
   - **Medium-risk site** — misconfiguration / cookie issues
   - **Low-risk site** — minor header issues
4. Watch the live process:
   1. Automated Scan  
   2. Integrated Tools  
   3. Vulnerability Detection  
   4. Risk Classification  
   5. Reports & Recommendations  
5. Open **View Prepared Report** to show the final findings table.

> **Note:** This is a **safe dummy process** for demonstration only. It does not attack or scan real websites.

---

## Dashboard Overview

The dashboard includes:

- Summary cards: Total Scans, Vulnerabilities, High / Medium / Low risk
- Donut chart: vulnerabilities by severity
- Top vulnerabilities list
- Recent scans with risk badges
- Detection workflow steps

---

## Color Theme

Inspired by the WebVulnX project poster:

- Primary purple: `#5E2D89`
- High risk: red
- Medium risk: orange
- Low risk: green
- Background: light lavender / white panels

---

## Future Work

- Connect the dashboard to a real Flask backend
- Integrate actual OWASP ZAP / SQLMap / Nmap scan jobs
- User authentication and scan history storage
- PDF/CSV report export
- Additional vulnerability checks and tool plugins

---

## Disclaimer

WebVulnX’s current UI includes a **simulated scan demo** for academic presentation. Always obtain proper authorization before performing any real security testing on a system you do not own.
