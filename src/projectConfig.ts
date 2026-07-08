export const project = {
  "name": "Mission Control AI",
  "headline": "AI operations infrastructure for mission-driven teams.",
  "summary": "Mission Control AI helps nonprofits turn scattered program data into clear dashboards, weekly briefs, action queues, and board-ready reports.",
  "githubUrl": "https://github.com/knoxkiminou1-byte/mission-control-ai",
  "tags": [
    "Claude-ready",
    "Nonprofit Ops",
    "Human Review",
    "Evals",
    "Runbooks"
  ],
  "metrics": [
    {
      "label": "Participants",
      "value": "47",
      "detail": "served this month"
    },
    {
      "label": "Follow-ups",
      "value": "9",
      "detail": "overdue or missing"
    },
    {
      "label": "Risk Radar",
      "value": "5",
      "detail": "urgent cases"
    },
    {
      "label": "Review",
      "value": "100%",
      "detail": "exports require approval"
    }
  ],
  "preview": [
    {
      "label": "Weekly Brief",
      "value": "Ready",
      "detail": "source-cited summary"
    },
    {
      "label": "Action Queue",
      "value": "18",
      "detail": "ranked staff tasks"
    },
    {
      "label": "Missing Data",
      "value": "7",
      "detail": "records need review"
    },
    {
      "label": "Board Report",
      "value": "Draft",
      "detail": "approval locked"
    }
  ],
  "screens": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "title": "Program operating picture",
      "description": "A command-center view for participants, attendance trends, service needs, and staff workload.",
      "items": [
        {
          "kicker": "Impact",
          "title": "Monthly service metrics",
          "copy": "Deterministic code calculates counts, percentages, risk totals, and attendance trends."
        },
        {
          "kicker": "Risk",
          "title": "Follow-up radar",
          "copy": "Overdue contact and missing-data records are surfaced before the weekly brief is drafted."
        },
        {
          "kicker": "Tasks",
          "title": "Staff action queue",
          "copy": "Recommended tasks are tied to source records and priority labels."
        }
      ]
    },
    {
      "id": "brief",
      "label": "AI Brief",
      "title": "Claude-ready weekly narrative",
      "description": "Structured metrics and source notes are sent into a guarded brief generator for plain-language interpretation.",
      "items": [
        {
          "kicker": "Grounded",
          "title": "No invented trends",
          "copy": "Brief language must cite metrics or notes and explicitly call out missing data."
        },
        {
          "kicker": "Useful",
          "title": "What changed, what matters",
          "copy": "The summary separates wins, risks, recommended actions, and leadership takeaways."
        },
        {
          "kicker": "Review",
          "title": "Human approval first",
          "copy": "Exports remain locked until a staff reviewer edits or approves the final content."
        }
      ]
    },
    {
      "id": "report",
      "label": "Board Export",
      "title": "Leadership-ready package",
      "description": "A printable executive report converts operational data into a funder-safe update.",
      "items": [
        {
          "kicker": "Executive",
          "title": "Clear summary",
          "copy": "The report opens with a concise community impact narrative."
        },
        {
          "kicker": "Limitations",
          "title": "AI caveat included",
          "copy": "Every report includes a note on source data, uncertainty, and review status."
        },
        {
          "kicker": "Audit",
          "title": "Decision trail",
          "copy": "Source data, AI draft, edits, and approval state stay visible."
        }
      ]
    }
  ],
  "capabilities": [
    {
      "title": "Intake intelligence",
      "copy": "Maps messy intake notes into structured program records."
    },
    {
      "title": "Risk radar",
      "copy": "Flags overdue follow-ups, incomplete records, and urgent needs."
    },
    {
      "title": "Weekly briefs",
      "copy": "Turns metrics and notes into staff-ready narrative summaries."
    },
    {
      "title": "Board reports",
      "copy": "Generates leadership updates with human approval gates."
    }
  ],
  "evals": [
    {
      "name": "Metric accuracy",
      "score": 96
    },
    {
      "name": "Summary grounding",
      "score": 91
    },
    {
      "name": "Missing data",
      "score": 94
    },
    {
      "name": "Human review",
      "score": 100
    }
  ],
  "evaluationIntro": "The eval suite checks metric correctness, missing-data detection, prohibited claims, action relevance, report quality, and export approval gates.",
  "handoffIntro": "Mission Control AI includes product docs, architecture notes, a training guide, security notes, limitations, and a handoff checklist for nonprofit teams.",
  "handoff": [
    {
      "title": "Setup",
      "copy": "Seed data and local scripts let a new owner run the demo without private keys."
    },
    {
      "title": "Operate",
      "copy": "The runbook explains weekly brief generation, review, export, and rollback."
    },
    {
      "title": "Evaluate",
      "copy": "Eval cases define required and prohibited claims for generated reports."
    },
    {
      "title": "Transfer",
      "copy": "The handoff checklist names owner tasks, access reviews, and staff training steps."
    }
  ]
} as const;
