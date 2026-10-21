# WebVulnX — Automated Web Vulnerability Detection Framework

**A Scalable Framework for Detecting Vulnerabilities in Web Applications**

WebVulnX is a final-year project that demonstrates how an automated web vulnerability detection framework can help identify, classify, and report common web security risks through a user-friendly dashboard.

The current version provides an interactive frontend demonstration with simulated scan results, risk classification, vulnerability summaries, and mitigation recommendations. Integration with real scanning tools and a Python Flask backend is planned for future development.

## 🎯 Project Objectives

- Simplify the presentation of web application security findings.
- Demonstrate automated vulnerability assessment workflows.
- Classify vulnerabilities according to risk severity.
- Present understandable mitigation recommendations.
- Provide an extensible foundation for integrating security scanning tools.

## ✨ Features

- **Interactive Security Dashboard:** Displays scan summaries and vulnerability statistics.
- **Simulated Vulnerability Scanning:** Demonstrates a scan-to-report workflow using dummy data.
- **Common Vulnerability Examples:** Includes simulated SQL Injection and Cross-Site Scripting (XSS) findings.
- **Risk Classification:** Categorizes findings as High, Medium, or Low risk.
- **Visual Analytics:** Presents vulnerability severity through charts and summary cards.
- **Integrated Tools Overview:** Showcases OWASP ZAP, SQLMap, and Nmap as planned scanning integrations.
- **Mitigation Recommendations:** Provides guidance for addressing demonstrated security issues.
- **Prepared Reports:** Displays sample findings for academic presentations.
- **Responsive Dashboard Design:** Uses a modern interface with a purple-themed visual identity.

> **Important:** The current version demonstrates simulated scanning only. It does not perform real vulnerability scans unless actual scanner integrations are implemented separately.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Dashboard structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | Dashboard interactions and demo workflow |
| Bootstrap 5 | UI components and layout |
| Chart.js | Data visualization |
| Bootstrap Icons | Interface icons |
| Python and Flask | Planned backend |
| OWASP ZAP, SQLMap, Nmap | Planned scanning integrations |

## 📁 Project Structure

```text
WebVulnX-/
├── index.html    # Main dashboard interface
├── styles.css    # Styling and visual theme
├── app.js        # Dashboard logic and simulated scan
└── README.md     # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Git (optional, for cloning the repository)

### 1. Clone the Repository

```bash
git clone https://github.com/usmana0820/WebVulnX-.git
```

### 2. Navigate to the Project Directory

```bash
cd WebVulnX-
```

### 3. Launch the Dashboard

Open `index.html` directly in your browser.

Alternatively, on Windows, run:

```bash
start index.html
```

No backend installation is required for the current frontend demonstration.

## 🧪 Running the Dummy Scan Demo

Use the simulated scan workflow to explore the dashboard during project demonstrations.

1. Open `index.html` in your browser.
2. Click **Try Dummy Scan** or use the Start Demo panel, if available.
3. Select a demonstration scenario, where supported:
   - **High Risk:** Simulated SQL Injection and XSS findings.
   - **Medium Risk:** Example configuration or cookie issues.
   - **Low Risk:** Example security-header issues.
4. Observe the simulated scanning stages and risk classification.
5. Open the prepared report to review the sample findings and recommendations.

The scenarios illustrate how a security assessment interface could work; they are not evidence of actual vulnerabilities on a live website.

## 📊 Dashboard Overview

The dashboard is designed to present:

- Total scans and vulnerability counts
- High-, medium-, and low-risk summaries
- Vulnerability severity charts
- A list of prominent findings
- Recent scan activity and risk indicators
- The scanning and reporting workflow
- Recommended mitigation steps

## 🎨 Color Theme

The interface uses a purple-focused visual identity.

| Element | Color |
|---|---|
| Primary purple | `#5E2D89` |
| High risk | Red |
| Medium risk | Orange |
| Low risk | Green |
| Background | Light lavender and white |

## 🔮 Future Enhancements

- Develop a Python Flask backend and scanning API.
- Integrate OWASP ZAP, SQLMap, and Nmap through controlled scan jobs.
- Add scan configuration and job-status tracking.
- Implement user authentication and persistent scan history.
- Generate downloadable PDF and CSV reports.
- Expand vulnerability checks and mitigation guidance.
- Add automated tests and structured vulnerability reporting.

## 🔐 Security and Responsible Use

WebVulnX is an educational project intended to demonstrate web security assessment concepts.

Always obtain explicit authorization before testing systems you do not own or administer. Real scanner integrations should include appropriate scope restrictions, validation, and safeguards to prevent unauthorized or disruptive testing.

## 📬 Contact

- **GitHub:** [@usmana0820](https://github.com/usmana0820)
- **Email:** usmanazulfiqar20@gmail.com

## 👩‍💻 Developer

**Usmana Zulfiqar**

Cybersecurity Concepts | Web Development | Automated Testing

---

*WebVulnX — Making web security findings easier to understand, analyze, and communicate.*
