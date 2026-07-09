export type Participant = {
  id: string;
  name: string;
  needCategory: "housing" | "food" | "mentoring" | "employment";
  lastContactDaysAgo: number | null;
  missedSessions: number;
  riskLevel: "low" | "medium" | "high";
  notes?: string;
};

export const demoParticipants: Participant[] = [
  {
    id: "p1",
    name: "Amara",
    needCategory: "housing",
    lastContactDaysAgo: 19,
    missedSessions: 2,
    riskLevel: "high",
    notes: "Rent support request is open and the last case note mentioned a possible move.",
  },
  {
    id: "p2",
    name: "Jay",
    needCategory: "mentoring",
    lastContactDaysAgo: 4,
    missedSessions: 0,
    riskLevel: "low",
    notes: "Mentor match is active and Jay completed the last milestone.",
  },
  {
    id: "p3",
    name: "Luis",
    needCategory: "food",
    lastContactDaysAgo: null,
    missedSessions: 1,
    riskLevel: "medium",
    notes: "Contact date is missing after pantry referral; confirm source data before reporting.",
  },
  {
    id: "p4",
    name: "Nia",
    needCategory: "housing",
    lastContactDaysAgo: 22,
    missedSessions: 3,
    riskLevel: "high",
    notes: "Housing navigator flagged urgent follow-up after three missed sessions.",
  },
];

export function calculateProgramMetrics(records: Participant[]) {
  const overdueRecords = detectFollowUpRisks(records);
  return {
    participantsServed: records.length,
    overdueFollowUps: records.filter((record) => (record.lastContactDaysAgo ?? 999) > 14).length,
    missingContactDates: records.filter((record) => record.lastContactDaysAgo === null).length,
    highPriorityCases: records.filter((record) => record.riskLevel === "high" || record.missedSessions >= 2).length,
    housingRequests: records.filter((record) => record.needCategory === "housing").length,
    actionQueueSize: overdueRecords.length,
    staffLoadIndex: Math.min(100, Math.round(records.length * 11 + overdueRecords.length * 9)),
    dataQualityScore: Math.max(0, Math.round(100 - records.filter((record) => record.lastContactDaysAgo === null).length * 14)),
  };
}

export function detectMissingData(records: Participant[]) {
  return records.filter((record) => record.lastContactDaysAgo === null).map((record) => record.id);
}

export function detectFollowUpRisks(records: Participant[]) {
  return records.filter((record) => (record.lastContactDaysAgo ?? 999) > 14 || record.missedSessions >= 2);
}

export function canExportReport(review: { approved: boolean; reviewerName?: string }) {
  return review.approved === true && Boolean(review.reviewerName?.trim());
}

export type ActionItem = {
  id: string;
  participantId: string;
  participantName: string;
  priority: "urgent" | "high" | "standard";
  title: string;
  owner: string;
  reason: string;
  dueLabel: string;
};

export function generateActionQueue(records: Participant[]): ActionItem[] {
  return [...records]
    .sort((a, b) => {
      const riskWeight = { high: 3, medium: 2, low: 1 };
      return (
        riskWeight[b.riskLevel] * 10 +
        b.missedSessions * 3 +
        (b.lastContactDaysAgo ?? 30) -
        (riskWeight[a.riskLevel] * 10 + a.missedSessions * 3 + (a.lastContactDaysAgo ?? 30))
      );
    })
    .filter((record) => record.riskLevel !== "low" || (record.lastContactDaysAgo ?? 0) > 10)
    .map((record, index) => {
      const missingContact = record.lastContactDaysAgo === null;
      const overdue = (record.lastContactDaysAgo ?? 999) > 14;
      const urgent = record.riskLevel === "high" || record.missedSessions >= 3 || missingContact;
      const title = missingContact
        ? "Verify missing contact date"
        : overdue
          ? `Complete ${record.needCategory} follow-up`
          : `Review ${record.needCategory} support plan`;

      return {
        id: `action-${record.id}`,
        participantId: record.id,
        participantName: record.name,
        priority: urgent ? "urgent" : record.riskLevel === "medium" ? "high" : "standard",
        title,
        owner: ["Case lead", "Program manager", "Data reviewer"][index % 3],
        reason: record.notes || `${record.name} needs a ${record.needCategory} support review.`,
        dueLabel: urgent ? "Today" : "This week",
      };
    });
}

export function summarizeNeeds(records: Participant[]) {
  const counts = records.reduce<Record<Participant["needCategory"], number>>(
    (acc, record) => {
      acc[record.needCategory] += 1;
      return acc;
    },
    { housing: 0, food: 0, mentoring: 0, employment: 0 },
  );

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([need, count]) => ({ need, count }));
}

export function generateWeeklyBrief(records: Participant[]) {
  const metrics = calculateProgramMetrics(records);
  const risks = detectFollowUpRisks(records);
  const missingIds = detectMissingData(records);
  const topNeeds = summarizeNeeds(records)
    .filter((item) => item.count > 0)
    .slice(0, 2)
    .map((item) => `${item.need} (${item.count})`)
    .join(" and ");

  const headline =
    risks.length > 0
      ? `${risks.length} participant records need staff follow-up before the next leadership update.`
      : "All participant records are inside the current follow-up window.";

  return {
    headline,
    wins: [
      `${metrics.participantsServed} participants are represented in the current operating view.`,
      topNeeds ? `The most visible service needs are ${topNeeds}.` : "No active service needs are currently tagged.",
      `${metrics.dataQualityScore}% data quality score after checking missing contact dates.`,
    ],
    risks: [
      `${metrics.overdueFollowUps} records are overdue or missing a contact date.`,
      `${metrics.highPriorityCases} cases are high priority or have repeated missed sessions.`,
      missingIds.length > 0
        ? `Missing contact dates must be verified for ${missingIds.join(", ")}.`
        : "No missing contact dates detected.",
    ],
    recommendedActions: generateActionQueue(records)
      .slice(0, 4)
      .map((item) => `${item.dueLabel}: ${item.title} for ${item.participantName}.`),
    limitations:
      "This brief is generated from local demo data. A staff reviewer must verify source records before board export.",
  };
}

export function generateBoardReport(records: Participant[], reviewerName: string) {
  const metrics = calculateProgramMetrics(records);
  const brief = generateWeeklyBrief(records);
  const needs = summarizeNeeds(records).filter((item) => item.count > 0);

  return {
    title: "Mission Control AI Weekly Board Report",
    reviewerName: reviewerName.trim(),
    generatedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
    metrics,
    executiveSummary: brief.headline,
    highlights: brief.wins,
    riskRegister: brief.risks,
    nextActions: brief.recommendedActions,
    needs,
    limitations: brief.limitations,
  };
}

export function serializeBoardReport(report: ReturnType<typeof generateBoardReport>) {
  return [
    `# ${report.title}`,
    "",
    `Reviewer: ${report.reviewerName}`,
    `Generated: ${report.generatedAt}`,
    "",
    "## Executive Summary",
    report.executiveSummary,
    "",
    "## Metrics",
    `- Participants served: ${report.metrics.participantsServed}`,
    `- Overdue follow-ups: ${report.metrics.overdueFollowUps}`,
    `- High-priority cases: ${report.metrics.highPriorityCases}`,
    `- Data quality score: ${report.metrics.dataQualityScore}%`,
    "",
    "## Highlights",
    ...report.highlights.map((item) => `- ${item}`),
    "",
    "## Risks",
    ...report.riskRegister.map((item) => `- ${item}`),
    "",
    "## Next Actions",
    ...report.nextActions.map((item) => `- ${item}`),
    "",
    "## Service Needs",
    ...report.needs.map((item) => `- ${item.need}: ${item.count}`),
    "",
    "## Limitations",
    report.limitations,
  ].join("\n");
}
