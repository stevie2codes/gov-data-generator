import { Router, Request, Response } from "express";
import { generateMockData } from "../../src/components/DataGenerator.js";
import { createSeededRng } from "../utils/seededRng.js";
import { ApiError, ErrorCodes } from "../middleware/errorHandler.js";
import { recordGeneration } from "../middleware/requestStats.js";

const router = Router();

// ─── Scenario definitions ─────────────────────────────────────────────────────
// Each scenario generates multiple related datasets with shared foreign keys.

interface ScenarioConfig {
  name: string;
  description: string;
  datasets: string[];
}

const scenarioConfigs: Record<string, ScenarioConfig> = {
  "municipal-finance": {
    name: "Municipal Finance",
    description:
      "Linked purchase orders, invoices, and contracts sharing vendors and PO numbers. " +
      "Invoices reference real PO numbers from the generated purchase orders.",
    datasets: ["contracts", "purchaseOrders", "invoices"],
  },
  "citizen-services": {
    name: "Citizen Services",
    description:
      "Citizens linked to their permits and business licenses by shared names and addresses. " +
      "Permits and licenses reference real citizen names from the generated citizens dataset.",
    datasets: ["citizens", "permits", "licenses"],
  },
};

// ─── Vendor pool (shared across finance scenario) ─────────────────────────────

const VENDOR_POOL = [
  "Acme Municipal Supply",
  "GovTech Solutions LLC",
  "Pinnacle Infrastructure Corp",
  "CivicWorks Consulting",
  "Metro Equipment Services",
  "Blue Ridge Construction",
  "DataStream Analytics",
  "Keystone Utilities Inc",
  "Public Works Partners",
  "Liberty Office Supplies",
  "FedPoint Engineering",
  "Coastal Environmental Group",
  "Summit Fleet Management",
  "Granite State IT Services",
  "Commonwealth Materials Co",
];

// ─── Scenario generators ──────────────────────────────────────────────────────

function generateMunicipalFinance(count: number, rng?: () => number) {
  const r = rng ?? Math.random;

  // Pick a shared vendor pool subset for this scenario
  const vendorCount = Math.min(count, VENDOR_POOL.length);
  const shuffled = [...VENDOR_POOL].sort(() => r() - 0.5);
  const vendors = shuffled.slice(0, vendorCount);

  // 1. Generate contracts with shared vendors
  const contracts = generateMockData("contracts", count, [], rng) as Record<string, unknown>[];
  contracts.forEach((c, i) => {
    c.vendor = vendors[i % vendors.length];
  });

  // 2. Generate purchase orders with shared vendors
  const purchaseOrders = generateMockData("purchaseOrders", count, [], rng) as Record<string, unknown>[];
  purchaseOrders.forEach((po, i) => {
    po.vendor = vendors[i % vendors.length];
  });

  // 3. Generate invoices linked to purchase orders
  const invoices = generateMockData("invoices", count, [], rng) as Record<string, unknown>[];
  invoices.forEach((inv, i) => {
    const linkedPO = purchaseOrders[i % purchaseOrders.length];
    inv.vendor = linkedPO.vendor;
    inv.poNumber = linkedPO.poNumber;
    inv.department = linkedPO.department;
  });

  recordGeneration("contracts", contracts.length);
  recordGeneration("purchaseOrders", purchaseOrders.length);
  recordGeneration("invoices", invoices.length);

  return { contracts, purchaseOrders, invoices };
}

function generateCitizenServices(count: number, rng?: () => number) {
  // 1. Generate citizens
  const citizens = generateMockData("citizens", count, [], rng) as Record<string, unknown>[];

  // 2. Generate permits linked to citizens
  const permits = generateMockData("permits", count, [], rng) as Record<string, unknown>[];
  permits.forEach((permit, i) => {
    const citizen = citizens[i % citizens.length];
    permit.applicantName = `${citizen.firstName} ${citizen.lastName}`;
    permit.propertyAddress = citizen.address;
  });

  // 3. Generate licenses linked to citizens
  const licenses = generateMockData("licenses", count, [], rng) as Record<string, unknown>[];
  licenses.forEach((lic, i) => {
    const citizen = citizens[i % citizens.length];
    lic.ownerName = `${citizen.firstName} ${citizen.lastName}`;
    lic.businessAddress = citizen.address;
  });

  recordGeneration("citizens", citizens.length);
  recordGeneration("permits", permits.length);
  recordGeneration("licenses", licenses.length);

  return { citizens, permits, licenses };
}

const scenarioGenerators: Record<
  string,
  (count: number, rng?: () => number) => Record<string, unknown>
> = {
  "municipal-finance": generateMunicipalFinance,
  "citizen-services": generateCitizenServices,
};

// ─── GET /api/scenarios — list available scenarios ────────────────────────────

router.get("/", (_req: Request, res: Response) => {
  const data = Object.entries(scenarioConfigs).map(([key, config]) => ({
    scenario: key,
    name: config.name,
    description: config.description,
    datasets: config.datasets,
  }));

  res.json({ success: true, data });
});

// ─── GET /api/scenarios/:name — generate a relational scenario ────────────────

router.get("/:name", (req: Request, res: Response) => {
  const { name } = req.params;

  const config = scenarioConfigs[name];
  if (!config) {
    throw new ApiError(
      400,
      ErrorCodes.UNKNOWN_SCENARIO,
      `Unknown scenario: "${name}".`,
      `Available scenarios: ${Object.keys(scenarioConfigs).join(", ")}`,
      { availableScenarios: Object.keys(scenarioConfigs) }
    );
  }

  const parsed = parseInt(req.query.count as string);
  const count = Math.min(Math.max(Number.isNaN(parsed) ? 10 : parsed, 1), 500);

  const seed = req.query.seed as string | undefined;
  const rng = seed ? createSeededRng(seed) : undefined;

  const generator = scenarioGenerators[name];
  const datasets = generator(count, rng);

  res.json({
    success: true,
    data: datasets,
    meta: {
      scenario: name,
      name: config.name,
      datasets: config.datasets,
      recordsPerDataset: count,
      generatedAt: new Date().toISOString(),
      ...(seed && { seed }),
    },
  });
});

export default router;
