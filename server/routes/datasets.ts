import { Router, Request, Response } from "express";
import { dataTypeConfigs } from "../../src/generators/dataTypes.js";
import { generateMockData } from "../../src/components/DataGenerator.js";

const router = Router();

// GET /api/datasets — list all available data types
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

// GET /api/datasets/:type/schema — get field definitions
router.get("/:type/schema", (req: Request, res: Response) => {
  const { type } = req.params;
  const config = dataTypeConfigs[type];

  if (!config) {
    res.status(400).json({
      success: false,
      error: `Unknown data type: ${type}. Use GET /api/datasets to see available types.`,
    });
    return;
  }

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

// GET /api/datasets/:type?count=10&fields=name,ssn — generate mock data
router.get("/:type", (req: Request, res: Response) => {
  const { type } = req.params;
  const config = dataTypeConfigs[type];

  if (!config) {
    res.status(400).json({
      success: false,
      error: `Unknown data type: ${type}. Use GET /api/datasets to see available types.`,
    });
    return;
  }

  const parsed = parseInt(req.query.count as string);
  const count = Math.min(Math.max(Number.isNaN(parsed) ? 10 : parsed, 1), 1000);

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

  const data = generateMockData(type, count, fields);

  res.json({
    success: true,
    data,
    meta: {
      type,
      label: config.name,
      count: data.length,
      fields,
      generatedAt: new Date().toISOString(),
    },
  });
});

export default router;
