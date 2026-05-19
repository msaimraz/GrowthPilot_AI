import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  uploads: defineTable({
    filename: v.string(),
    fileType: v.string(), // "csv" | "pdf"
    content: v.string(),  // Parsed content as text
    size: v.number(),
    createdAt: v.number(),
  }),
  runs: defineTable({
    status: v.string(), // "queued" | "running" | "completed" | "failed"
    step: v.string(),   // "Observe" | "Reason" | "Decide" | "Act" | "Evaluate" | "None"
    activeAgent: v.string(), // e.g. "Intake", "Insight", "RootCause", "Strategy", "Execution", "Evaluation"
    logs: v.array(v.object({
      timestamp: v.number(),
      agent: v.string(),
      message: v.string(),
      type: v.string(), // "info" | "success" | "warn" | "error"
    })),
    uploadId: v.optional(v.id("uploads")),
    datasetName: v.string(), // e.g. "Shopify + Meta Ads Anomalies" or uploaded file name
    insights: v.optional(v.any()), // parsed key-value insight indicators (anomalies, trends)
    rootCauses: v.optional(v.any()), // root causes explained
    recommendations: v.optional(v.any()), // strategy options generated
    simulationLogs: v.optional(v.any()), // actions execution logs
    evaluationResult: v.optional(v.any()), // before vs after projected outcome
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
