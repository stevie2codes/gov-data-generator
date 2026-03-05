import { Router, Request, Response } from "express";
import { dataTypeConfigs } from "../../src/generators/dataTypes.js";
import { generateMockData, convertToCSV } from "../../src/components/DataGenerator.js";
import { ApiError, ErrorCodes } from "../middleware/errorHandler.js";
import { createSeededRng } from "../utils/seededRng.js";
import { parsePaginationParams, paginateData } from "../utils/queryHelpers.js";
import { parseSortParam, applySort } from "../utils/sorting.js";
import { parseFilterParams, applyFilters } from "../utils/filtering.js";
import { recordGeneration } from "../middleware/requestStats.js";

const router = Router();

const availableTypes = () => Object.keys(dataTypeConfigs).join(", ");

function lookupConfig(type: string) {
  const config = dataTypeConfigs[type];
  if (!config) {
    throw new ApiError(
      400,
      ErrorCodes.UNKNOWN_TYPE,
      `Unknown data type: "${type}".`,
      `Use GET /api/datasets to see available types.`,
      { availableTypes: Object.keys(dataTypeConfigs) }
    );
  }
  return config;
}

// ─── GET /api/datasets — list all available data types ──────────────────────────

router.get("/", (_req: Request, res: Response) => {
  const data = Object.entries(dataTypeConfigs).map(([key, config]) => ({
    type: key,
    label: config.name,
    category: config.category,
    description: config.description,
    fieldCount: config.fields.length,
  }));

  res.json({ success: true, data });
});

// ─── GET /api/datasets/:type/schema — get field definitions ─────────────────────

router.get("/:type/schema", (req: Request, res: Response) => {
  const { type } = req.params;
  const config = lookupConfig(type);

  res.json({
    success: true,
    data: {
      type,
      label: config.name,
      category: config.category,
      description: config.description,
      fields: config.fields.map((f) => ({ key: f, label: f })),
    },
  });
});

// ─── GET /api/datasets/:type — generate mock data ──────────────────────────────
// Pipeline: generate → filter → sort → paginate → format

router.get("/:type", (req: Request, res: Response) => {
  const { type } = req.params;
  const config = lookupConfig(type);

  // Count
  const parsed = parseInt(req.query.count as string);
  const count = Math.min(Math.max(Number.isNaN(parsed) ? 10 : parsed, 1), 1000);

  // Fields
  let fields: string[];
  if (req.query.fields) {
    const requested = (req.query.fields as string).split(",").map((f) => f.trim());
    fields = requested.filter((f) => config.fields.includes(f));
    if (fields.length === 0) {
      fields = config.fields;
    }
  } else {
    fields = config.fields;
  }

  // Format validation
  const format = ((req.query.format as string) || "json").toLowerCase();
  if (format !== "json" && format !== "csv") {
    throw new ApiError(
      400,
      ErrorCodes.INVALID_PARAM,
      `Unsupported format: "${format}".`,
      "Valid formats: json, csv"
    );
  }

  // Seeded RNG
  const seed = req.query.seed as string | undefined;
  const rng = seed ? createSeededRng(seed) : undefined;

  // Generate
  const rawData = generateMockData(type, count, fields, rng);

  // Filter
  const filters = parseFilterParams(req.query as Record<string, unknown>);
  let processed: Record<string, unknown>[] = filters.length > 0
    ? applyFilters(rawData, filters)
    : rawData;

  // Sort
  if (req.query.sort) {
    const sortFields = parseSortParam(req.query.sort as string);
    processed = applySort(processed, sortFields);
  }

  // Paginate
  const paginationParams = parsePaginationParams(req.query as Record<string, unknown>);
  let responseData = processed;
  let paginationMeta: ReturnType<typeof paginateData>["meta"] | undefined;

  if (paginationParams.isPaginated) {
    const result = paginateData(processed, paginationParams);
    responseData = result.items;
    paginationMeta = result.meta;
  }

  // Track stats
  recordGeneration(type, rawData.length);

  // Format: CSV
  if (format === "csv") {
    const csv = convertToCSV(responseData as Record<string, unknown>[]);
    const timestamp = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${type}-${timestamp}.csv"`);
    res.send(csv);
    return;
  }

  // Format: JSON (default)
  res.json({
    success: true,
    data: responseData,
    meta: {
      type,
      label: config.name,
      count: responseData.length,
      totalGenerated: rawData.length,
      fields,
      generatedAt: new Date().toISOString(),
      ...(seed && { seed }),
      ...(filters.length > 0 && { filters: filters.map((f) => `${f.field}=${f.value}`) }),
      ...(paginationMeta && { pagination: paginationMeta }),
    },
  });
});

export default router;
