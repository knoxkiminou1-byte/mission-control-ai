import { useMemo, useState } from "react";
import missionVisual from "./assets/mission-control-visual.png";
import "./styles.css";
import {
  Participant,
  calculateProgramMetrics,
  canExportReport,
  demoParticipants,
  generateActionQueue,
  generateBoardReport,
  generateWeeklyBrief,
  serializeBoardReport,
  summarizeNeeds,
} from "./lib/mission";

type NeedCategory = Participant["needCategory"];
type RiskLevel = Participant["riskLevel"];

const needLabels: Record<NeedCategory, string> = {
  housing: "Housing",
  food: "Food",
  mentoring: "Mentoring",
  employment: "Employment",
};

const riskLabels: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const seedForm = {
  name: "Talia",
  needCategory: "employment" as NeedCategory,
  lastContactDaysAgo: "16",
  missedSessions: "1",
  riskLevel: "medium" as RiskLevel,
  notes: "Needs a warm handoff to the workforce partner and a resume workshop reminder.",
};

function Icon({ name }: { name: "pulse" | "shield" | "spark" | "download" | "copy" | "plus" }) {
  const paths = {
    pulse: "M4 13h4l2-7 4 14 3-9h3",
    shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z",
    spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
    download: "M12 4v10m0 0l-4-4m4 4l4-4M5 20h14",
    copy: "M8 8h10v10H8z M5 5h10",
    plus: "M12 5v14M5 12h14",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d={paths[name]} />
    </svg>
  );
}

function StatOrb({ label, value, tone, detail }: { label: string; value: string | number; tone: string; detail: string }) {
  return (
    <article className={`stat-orb ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function useClipboard() {
  const [copied, setCopied] = useState("");

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  return { copied, copy };
}

function downloadText(filename: string, value: string) {
  const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(href);
}

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(demoParticipants);
  const [form, setForm] = useState(seedForm);
  const [reviewApproved, setReviewApproved] = useState(false);
  const [reviewerName, setReviewerName] = useState("Jordan Davis");
  const [selectedParticipant, setSelectedParticipant] = useState(demoParticipants[0].id);
  const { copied, copy } = useClipboard();

  const metrics = useMemo(() => calculateProgramMetrics(participants), [participants]);
  const actionQueue = useMemo(() => generateActionQueue(participants), [participants]);
  const brief = useMemo(() => generateWeeklyBrief(participants), [participants]);
  const needs = useMemo(() => summarizeNeeds(participants), [participants]);
  const exportReady = canExportReport({ approved: reviewApproved, reviewerName });
  const report = useMemo(() => generateBoardReport(participants, reviewerName), [participants, reviewerName]);
  const reportMarkdown = useMemo(() => serializeBoardReport(report), [report]);

  const selected = participants.find((participant) => participant.id === selectedParticipant) ?? participants[0];

  function addParticipant() {
    const name = form.name.trim();
    if (!name) return;

    const nextParticipant: Participant = {
      id: `p-${Date.now()}`,
      name,
      needCategory: form.needCategory,
      lastContactDaysAgo: form.lastContactDaysAgo === "" ? null : Number(form.lastContactDaysAgo),
      missedSessions: Number(form.missedSessions || 0),
      riskLevel: form.riskLevel,
      notes: form.notes.trim(),
    };

    setParticipants((current) => [nextParticipant, ...current]);
    setSelectedParticipant(nextParticipant.id);
    setReviewApproved(false);
    setForm({ ...seedForm, name: "" });
  }

  function updateSelectedRisk(riskLevel: RiskLevel) {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === selected.id ? { ...participant, riskLevel } : participant,
      ),
    );
    setReviewApproved(false);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Mission Control navigation">
        <a href="#top" className="brand">
          <span className="brand-bubbles">
            <i />
            <i />
            <i />
          </span>
          <span>
            Mission Control
            <small>AI for Nonprofits</small>
          </span>
        </a>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#brief">Weekly Brief</a>
          <a href="#review">Human Review</a>
          <a href="#report">Board Report</a>
        </nav>

        <section className="quick-panel">
          <p>Live demo mode</p>
          <strong>{metrics.participantsServed} records</strong>
          <span>{metrics.actionQueueSize} staff actions queued</span>
        </section>
      </aside>

      <section className="workspace" id="top">
        <header className="hero">
          <div className="hero-copy">
            <p className="system-status"><span /> All systems operational</p>
            <h1>Nonprofit command center that actually generates the weekly package.</h1>
            <p>
              Add records, surface follow-up risks, generate a source-grounded weekly brief,
              review it, and export a board-ready report from one polished workspace.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#dashboard"><Icon name="pulse" /> Open command center</a>
              <button type="button" onClick={() => copy("brief", brief.headline)}>
                <Icon name="copy" /> {copied === "brief" ? "Copied" : "Copy headline"}
              </button>
            </div>
          </div>

          <div className="hero-visual" aria-label="Mission Control AI product visual">
            <img src={missionVisual} alt="" />
            <div className="glass-readout">
              <span>Impact score</span>
              <strong>{metrics.dataQualityScore}</strong>
              <small>Data quality locked to review gate</small>
            </div>
          </div>
        </header>

        <section className="orb-row" aria-label="Program metrics">
          <StatOrb label="Participants" value={metrics.participantsServed} tone="blue" detail="served this cycle" />
          <StatOrb label="Follow-ups" value={metrics.overdueFollowUps} tone="violet" detail="overdue or missing" />
          <StatOrb label="High Priority" value={metrics.highPriorityCases} tone="red" detail="staff review needed" />
          <StatOrb label="Data Quality" value={`${metrics.dataQualityScore}%`} tone="gold" detail="contact date completeness" />
          <StatOrb label="Staff Load" value={`${metrics.staffLoadIndex}%`} tone="green" detail="local demo index" />
        </section>

        <section className="dashboard-grid" id="dashboard">
          <article className="panel span-7">
            <div className="panel-heading">
              <div>
                <p className="section-label">Participant Console</p>
                <h2>Add a record and watch the system update.</h2>
              </div>
              <button type="button" onClick={() => setParticipants(demoParticipants)}>Reset demo</button>
            </div>

            <div className="record-form">
              <label>
                Name
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label>
                Need
                <select
                  value={form.needCategory}
                  onChange={(event) => setForm({ ...form, needCategory: event.target.value as NeedCategory })}
                >
                  {Object.entries(needLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
              <label>
                Last contact
                <input
                  inputMode="numeric"
                  value={form.lastContactDaysAgo}
                  onChange={(event) => setForm({ ...form, lastContactDaysAgo: event.target.value.replace(/\D/g, "") })}
                  placeholder="days ago"
                />
              </label>
              <label>
                Missed
                <input
                  inputMode="numeric"
                  value={form.missedSessions}
                  onChange={(event) => setForm({ ...form, missedSessions: event.target.value.replace(/\D/g, "") })}
                />
              </label>
              <label>
                Risk
                <select value={form.riskLevel} onChange={(event) => setForm({ ...form, riskLevel: event.target.value as RiskLevel })}>
                  {Object.entries(riskLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
              <label className="span-form">
                Staff note
                <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
              </label>
              <button type="button" className="add-button" onClick={addParticipant}><Icon name="plus" /> Add to dashboard</button>
            </div>
          </article>

          <article className="panel span-5 selected-card">
            <p className="section-label">Selected Record</p>
            <select aria-label="Selected participant" value={selected.id} onChange={(event) => setSelectedParticipant(event.target.value)}>
              {participants.map((participant) => (
                <option value={participant.id} key={participant.id}>{participant.name}</option>
              ))}
            </select>
            <h2>{selected.name}</h2>
            <dl>
              <div><dt>Need</dt><dd>{needLabels[selected.needCategory]}</dd></div>
              <div><dt>Last contact</dt><dd>{selected.lastContactDaysAgo === null ? "Missing" : `${selected.lastContactDaysAgo} days`}</dd></div>
              <div><dt>Missed sessions</dt><dd>{selected.missedSessions}</dd></div>
            </dl>
            <div className="risk-switch" aria-label="Risk level">
              {(["low", "medium", "high"] as RiskLevel[]).map((risk) => (
                <button
                  key={risk}
                  type="button"
                  className={selected.riskLevel === risk ? "active" : ""}
                  onClick={() => updateSelectedRisk(risk)}
                >
                  {riskLabels[risk]}
                </button>
              ))}
            </div>
            <p>{selected.notes}</p>
          </article>

          <article className="panel span-7">
            <div className="panel-heading">
              <div>
                <p className="section-label">Action Queue</p>
                <h2>Ranked staff follow-ups.</h2>
              </div>
              <span className="count-pill">{actionQueue.length} actions</span>
            </div>
            <div className="action-list">
              {actionQueue.map((item) => (
                <article className={`action-item ${item.priority}`} key={item.id}>
                  <span>{item.dueLabel}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.participantName} - {item.reason}</p>
                  </div>
                  <small>{item.owner}</small>
                </article>
              ))}
            </div>
          </article>

          <article className="panel span-5">
            <p className="section-label">Service Need Mix</p>
            <div className="need-chart">
              {needs.map((item) => (
                <div key={item.need}>
                  <span>{needLabels[item.need as NeedCategory]}</span>
                  <strong>{item.count}</strong>
                  <meter min={0} max={Math.max(metrics.participantsServed, 1)} value={item.count} />
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="brief-grid" id="brief">
          <article className="panel brief-panel">
            <div className="panel-heading">
              <div>
                <p className="section-label">Generated Weekly Brief</p>
                <h2>{brief.headline}</h2>
              </div>
              <button type="button" onClick={() => copy("weekly-brief", [brief.headline, ...brief.wins, ...brief.risks].join("\n"))}>
                <Icon name="copy" /> {copied === "weekly-brief" ? "Copied" : "Copy brief"}
              </button>
            </div>
            <div className="brief-columns">
              <section>
                <h3>Wins</h3>
                {brief.wins.map((item) => <p key={item}>{item}</p>)}
              </section>
              <section>
                <h3>Risks</h3>
                {brief.risks.map((item) => <p key={item}>{item}</p>)}
              </section>
              <section>
                <h3>Recommended actions</h3>
                {brief.recommendedActions.map((item) => <p key={item}>{item}</p>)}
              </section>
            </div>
            <footer><Icon name="shield" /> {brief.limitations}</footer>
          </article>
        </section>

        <section className="review-report-grid">
          <article className="panel review-panel" id="review">
            <p className="section-label">Human Review Gate</p>
            <h2>Exports stay locked until a person signs the package.</h2>
            <label>
              Reviewer name
              <input value={reviewerName} onChange={(event) => setReviewerName(event.target.value)} />
            </label>
            <label className="check-row">
              <input type="checkbox" checked={reviewApproved} onChange={(event) => setReviewApproved(event.target.checked)} />
              I reviewed the metrics, missing data, AI brief, and limitations.
            </label>
            <div className={exportReady ? "gate ready" : "gate"}>
              <Icon name={exportReady ? "spark" : "shield"} />
              <strong>{exportReady ? "Board export unlocked" : "Board export locked"}</strong>
              <span>{exportReady ? "Ready for download." : "Approval and reviewer identity required."}</span>
            </div>
          </article>

          <article className="panel report-panel" id="report">
            <div className="panel-heading">
              <div>
                <p className="section-label">Board Report</p>
                <h2>Markdown package generated from current data.</h2>
              </div>
              <button
                type="button"
                disabled={!exportReady}
                onClick={() => downloadText("mission-control-board-report.md", reportMarkdown)}
              >
                <Icon name="download" /> Download
              </button>
            </div>
            <textarea readOnly value={reportMarkdown} aria-label="Generated board report" />
          </article>
        </section>
      </section>
    </main>
  );
}
