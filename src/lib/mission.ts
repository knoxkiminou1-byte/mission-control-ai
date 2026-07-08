export type Participant = {
  id: string;
  name: string;
  needCategory: "housing" | "food" | "mentoring" | "employment";
  lastContactDaysAgo: number | null;
  missedSessions: number;
  riskLevel: "low" | "medium" | "high";
};

export const demoParticipants: Participant[] = [
  { id: "p1", name: "Amara", needCategory: "housing", lastContactDaysAgo: 19, missedSessions: 2, riskLevel: "high" },
  { id: "p2", name: "Jay", needCategory: "mentoring", lastContactDaysAgo: 4, missedSessions: 0, riskLevel: "low" },
  { id: "p3", name: "Luis", needCategory: "food", lastContactDaysAgo: null, missedSessions: 1, riskLevel: "medium" },
  { id: "p4", name: "Nia", needCategory: "housing", lastContactDaysAgo: 22, missedSessions: 3, riskLevel: "high" },
];

export function calculateProgramMetrics(records: Participant[]) {
  return {
    participantsServed: records.length,
    overdueFollowUps: records.filter((record) => (record.lastContactDaysAgo ?? 999) > 14).length,
    missingContactDates: records.filter((record) => record.lastContactDaysAgo === null).length,
    highPriorityCases: records.filter((record) => record.riskLevel === "high" || record.missedSessions >= 2).length,
    housingRequests: records.filter((record) => record.needCategory === "housing").length,
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
