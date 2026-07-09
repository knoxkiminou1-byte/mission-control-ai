import { describe, expect, it } from "vitest";
import {
  calculateProgramMetrics,
  canExportReport,
  demoParticipants,
  detectFollowUpRisks,
  detectMissingData,
  generateActionQueue,
  generateBoardReport,
  generateWeeklyBrief,
  serializeBoardReport,
} from "./mission";

describe("Mission Control AI logic", () => {
  it("calculates deterministic metrics from participant records", () => {
    expect(calculateProgramMetrics(demoParticipants)).toMatchObject({
      participantsServed: 4,
      overdueFollowUps: 3,
      missingContactDates: 1,
      highPriorityCases: 2,
      housingRequests: 2,
    });
  });

  it("detects missing contact dates", () => {
    expect(detectMissingData(demoParticipants)).toEqual(["p3"]);
  });

  it("detects overdue or high-risk follow-ups", () => {
    expect(detectFollowUpRisks(demoParticipants).map((record) => record.id)).toEqual(["p1", "p3", "p4"]);
  });

  it("blocks export without human approval and reviewer identity", () => {
    expect(canExportReport({ approved: false, reviewerName: "Maya" })).toBe(false);
    expect(canExportReport({ approved: true })).toBe(false);
    expect(canExportReport({ approved: true, reviewerName: "Maya" })).toBe(true);
  });

  it("generates a prioritized action queue", () => {
    const queue = generateActionQueue(demoParticipants);
    expect(queue[0]).toMatchObject({ participantName: "Nia", priority: "urgent" });
    expect(queue.map((item) => item.participantName)).toContain("Luis");
  });

  it("generates and serializes a board report", () => {
    const brief = generateWeeklyBrief(demoParticipants);
    const report = generateBoardReport(demoParticipants, "Maya");
    expect(brief.recommendedActions.length).toBeGreaterThan(0);
    expect(serializeBoardReport(report)).toContain("# Mission Control AI Weekly Board Report");
  });
});
