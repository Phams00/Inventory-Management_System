
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL belum diatur.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const companies = [
  {
    name: "PT Nusantara Manufacturing",
    code: "NUSA",
  },
  {
    name: "PT Garuda Industrial Components",
    code: "GARUDA",
  },
];

const categories = [
  { name: "Metal Raw Materials", description: "Bahan baku logam" },
  { name: "Plastic & Polymer", description: "Bahan baku plastik dan polimer" },
  { name: "Electronic Components", description: "Komponen elektronik" },
  { name: "Electrical Materials", description: "Material kelistrikan" },
  { name: "Packaging Materials", description: "Material pengemasan" },
  { name: "Work In Process", description: "Barang dalam proses produksi" },
  { name: "MRO Supplies", description: "Perlengkapan maintenance dan repair" },
  { name: "Finished Products", description: "Produk jadi" },
];

const units = [
  { code: "PCS", name: "Pieces", symbol: "pcs" },
  { code: "KG", name: "Kilogram", symbol: "kg" },
  { code: "GRAM", name: "Gram", symbol: "g" },
  { code: "LITER", name: "Liter", symbol: "L" },
  { code: "METER", name: "Meter", symbol: "m" },
  { code: "CM", name: "Centimeter", symbol: "cm" },
  { code: "ROLL", name: "Roll", symbol: "roll" },
  { code: "BOX", name: "Box", symbol: "box" },
  { code: "SET", name: "Set", symbol: "set" },
  { code: "SHEET", name: "Sheet", symbol: "sheet" },
  { code: "CAN", name: "Can", symbol: "can" },
  { code: "PAIR", name: "Pair", symbol: "pair" },
];

type SeedItemType =
  | "RAW_MATERIAL"
  | "WORK_IN_PROCESS"
  | "MRO"
  | "FINISHED_GOOD";

type SeedItem = {
  sku: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  itemType: SeedItemType;
};

const items: SeedItem[] = [
  // RAW MATERIALS - METALS
  { sku: "RM-STEEL-001", name: "Carbon Steel Plate", description: "Pelat baja karbon untuk komponen mesin", category: "Metal Raw Materials", unit: "KG", itemType: "RAW_MATERIAL" },
  { sku: "RM-STEEL-002", name: "Stainless Steel 304", description: "Baja tahan karat grade 304", category: "Metal Raw Materials", unit: "KG", itemType: "RAW_MATERIAL" },
  { sku: "RM-ALU-001", name: "Aluminium Sheet", description: "Lembaran aluminium industri", category: "Metal Raw Materials", unit: "SHEET", itemType: "RAW_MATERIAL" },
  { sku: "RM-COPPER-001", name: "Copper Rod", description: "Batang tembaga untuk konduktor", category: "Metal Raw Materials", unit: "KG", itemType: "RAW_MATERIAL" },
  { sku: "RM-IRON-001", name: "Cast Iron Bar", description: "Batang besi cor", category: "Metal Raw Materials", unit: "KG", itemType: "RAW_MATERIAL" },
  { sku: "RM-BRASS-001", name: "Brass Sheet", description: "Lembaran kuningan", category: "Metal Raw Materials", unit: "SHEET", itemType: "RAW_MATERIAL" },

  // RAW MATERIALS - PLASTICS
  { sku: "RM-ABS-001", name: "ABS Resin", description: "Resin ABS untuk injection molding", category: "Plastic & Polymer", unit: "KG", itemType: "RAW_MATERIAL" },
  { sku: "RM-PP-001", name: "Polypropylene Resin", description: "Biji plastik polypropylene", category: "Plastic & Polymer", unit: "KG", itemType: "RAW_MATERIAL" },
  { sku: "RM-PVC-001", name: "PVC Compound", description: "Material PVC untuk isolasi kabel", category: "Plastic & Polymer", unit: "KG", itemType: "RAW_MATERIAL" },
  { sku: "RM-SILICONE-001", name: "Industrial Silicone", description: "Silikon untuk kebutuhan manufaktur", category: "Plastic & Polymer", unit: "CAN", itemType: "RAW_MATERIAL" },

  // RAW MATERIALS - ELECTRONICS
  { sku: "RM-PCB-001", name: "Printed Circuit Board", description: "PCB kosong untuk perakitan elektronik", category: "Electronic Components", unit: "PCS", itemType: "RAW_MATERIAL" },
  { sku: "RM-RES-001", name: "Resistor 10K Ohm", description: "Resistor elektronik 10 kilo-ohm", category: "Electronic Components", unit: "PCS", itemType: "RAW_MATERIAL" },
  { sku: "RM-CAP-001", name: "Capacitor 100uF", description: "Kapasitor elektronik 100 mikrofarad", category: "Electronic Components", unit: "PCS", itemType: "RAW_MATERIAL" },
  { sku: "RM-IC-001", name: "Microcontroller IC", description: "Integrated circuit untuk kontrol elektronik", category: "Electronic Components", unit: "PCS", itemType: "RAW_MATERIAL" },
  { sku: "RM-LED-001", name: "LED Indicator", description: "Lampu indikator LED", category: "Electronic Components", unit: "PCS", itemType: "RAW_MATERIAL" },
  { sku: "RM-DIODE-001", name: "Rectifier Diode", description: "Dioda penyearah", category: "Electronic Components", unit: "PCS", itemType: "RAW_MATERIAL" },

  // ELECTRICAL MATERIALS
  { sku: "RM-CABLE-001", name: "Copper Electrical Cable", description: "Kabel tembaga untuk instalasi listrik", category: "Electrical Materials", unit: "METER", itemType: "RAW_MATERIAL" },
  { sku: "RM-WIRE-001", name: "Insulated Copper Wire", description: "Kawat tembaga berisolasi", category: "Electrical Materials", unit: "ROLL", itemType: "RAW_MATERIAL" },
  { sku: "RM-CONNECTOR-001", name: "Industrial Connector", description: "Konektor listrik industri", category: "Electrical Materials", unit: "PCS", itemType: "RAW_MATERIAL" },
  { sku: "RM-SWITCH-001", name: "Toggle Switch", description: "Sakelar listrik", category: "Electrical Materials", unit: "PCS", itemType: "RAW_MATERIAL" },

  // PACKAGING
  { sku: "PKG-BOX-001", name: "Corrugated Carton Box", description: "Kardus bergelombang untuk pengiriman", category: "Packaging Materials", unit: "PCS", itemType: "RAW_MATERIAL" },
  { sku: "PKG-FOAM-001", name: "Protective Foam", description: "Busa pelindung produk", category: "Packaging Materials", unit: "SHEET", itemType: "RAW_MATERIAL" },
  { sku: "PKG-WRAP-001", name: "Stretch Film", description: "Plastik pembungkus pallet", category: "Packaging Materials", unit: "ROLL", itemType: "RAW_MATERIAL" },
  { sku: "PKG-LABEL-001", name: "Product Label", description: "Label identifikasi produk", category: "Packaging Materials", unit: "PCS", itemType: "RAW_MATERIAL" },

  // WORK IN PROCESS
  { sku: "WIP-PCB-001", name: "Assembled PCB", description: "PCB yang telah melalui proses assembly", category: "Work In Process", unit: "PCS", itemType: "WORK_IN_PROCESS" },
  { sku: "WIP-CTRL-001", name: "Controller Board", description: "Papan kontrol dalam proses produksi", category: "Work In Process", unit: "PCS", itemType: "WORK_IN_PROCESS" },
  { sku: "WIP-MOTOR-001", name: "Motor Assembly", description: "Unit motor dalam proses perakitan", category: "Work In Process", unit: "SET", itemType: "WORK_IN_PROCESS" },
  { sku: "WIP-PANEL-001", name: "Electrical Panel Assembly", description: "Panel listrik setengah jadi", category: "Work In Process", unit: "PCS", itemType: "WORK_IN_PROCESS" },
  { sku: "WIP-CASE-001", name: "Plastic Housing Assembly", description: "Casing plastik dalam proses perakitan", category: "Work In Process", unit: "PCS", itemType: "WORK_IN_PROCESS" },
  { sku: "WIP-SENSOR-001", name: "Sensor Module", description: "Modul sensor dalam proses produksi", category: "Work In Process", unit: "PCS", itemType: "WORK_IN_PROCESS" },

  // MRO
  { sku: "MRO-OIL-001", name: "Hydraulic Oil", description: "Oli hidrolik untuk mesin produksi", category: "MRO Supplies", unit: "LITER", itemType: "MRO" },
  { sku: "MRO-GREASE-001", name: "Industrial Grease", description: "Gemuk pelumas mesin", category: "MRO Supplies", unit: "KG", itemType: "MRO" },
  { sku: "MRO-BEARING-001", name: "Ball Bearing", description: "Bantalan bola untuk mesin", category: "MRO Supplies", unit: "PCS", itemType: "MRO" },
  { sku: "MRO-FILTER-001", name: "Air Filter", description: "Filter udara mesin industri", category: "MRO Supplies", unit: "PCS", itemType: "MRO" },
  { sku: "MRO-BOLT-001", name: "Hex Bolt M10", description: "Baut hexagonal ukuran M10", category: "MRO Supplies", unit: "PCS", itemType: "MRO" },
  { sku: "MRO-GLOVE-001", name: "Industrial Safety Gloves", description: "Sarung tangan keselamatan kerja", category: "MRO Supplies", unit: "PAIR", itemType: "MRO" },
  { sku: "MRO-COOLANT-001", name: "Machine Coolant", description: "Cairan pendingin mesin", category: "MRO Supplies", unit: "LITER", itemType: "MRO" },
  { sku: "MRO-DRILL-001", name: "Drill Bit", description: "Mata bor untuk perawatan mesin", category: "MRO Supplies", unit: "PCS", itemType: "MRO" },

  // FINISHED GOODS
  { sku: "FG-CONTROL-001", name: "Industrial Control Unit", description: "Unit kontrol elektronik siap jual", category: "Finished Products", unit: "PCS", itemType: "FINISHED_GOOD" },
  { sku: "FG-POWER-001", name: "Power Supply Module", description: "Modul catu daya siap jual", category: "Finished Products", unit: "PCS", itemType: "FINISHED_GOOD" },
  { sku: "FG-SENSOR-001", name: "Industrial Sensor Unit", description: "Unit sensor industri siap jual", category: "Finished Products", unit: "PCS", itemType: "FINISHED_GOOD" },
  { sku: "FG-PANEL-001", name: "Electrical Control Panel", description: "Panel kontrol listrik siap jual", category: "Finished Products", unit: "PCS", itemType: "FINISHED_GOOD" },
];

async function main() {
  console.log("Starting IMS industrial seed...");

  for (const companyData of companies) {
    const company = await prisma.company.upsert({
      where: { code: companyData.code },
      update: { name: companyData.name },
      create: companyData,
    });

    console.log(`Company ready: ${company.name}`);

    const categoryIds = new Map<string, string>();

    for (const categoryData of categories) {
      const category = await prisma.itemCategory.upsert({
        where: {
          companyId_name: {
            companyId: company.id,
            name: categoryData.name,
          },
        },
        update: { description: categoryData.description },
        create: {
          companyId: company.id,
          ...categoryData,
        },
      });

      categoryIds.set(category.name, category.id);
    }

    const unitIds = new Map<string, string>();

    for (const unitData of units) {
      const unit = await prisma.unitOfMeasure.upsert({
        where: {
          companyId_code: {
            companyId: company.id,
            code: unitData.code,
          },
        },
        update: {
          name: unitData.name,
          symbol: unitData.symbol,
        },
        create: {
          companyId: company.id,
          ...unitData,
        },
      });

      unitIds.set(unit.code, unit.id);
    }

    for (const item of items) {
      const categoryId = categoryIds.get(item.category);
      const unitId = unitIds.get(item.unit);

      if (!categoryId || !unitId) {
        throw new Error(`Kategori atau satuan tidak ditemukan untuk SKU ${item.sku}`);
      }

      const sku = `${company.code}-${item.sku}`;

      await prisma.item.upsert({
        where: {
          companyId_sku: {
            companyId: company.id,
            sku,
          },
        },
        update: {
          name: item.name,
          description: item.description,
          itemType: item.itemType,
          categoryId,
          unitId,
        },
        create: {
          companyId: company.id,
          categoryId,
          unitId,
          sku,
          name: item.name,
          description: item.description,
          itemType: item.itemType,
        },
      });
    }

    console.log(`Master data ready: ${company.code} (${items.length} items)`);
  }

  console.log("IMS industrial seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
