import { test, expect } from "@playwright/test";
import { todayInTz } from "../utils/date";
import { MicrosoftExcelSheetPage } from "../models/pages/MicrosoftExcelSheetPage";

test("verify a cell with the TODAY() formula outputs the expected date", async ({ page }, info) => {
  const cfg: any = info.project.use;
  const excelSheet = new MicrosoftExcelSheetPage(page);

  excelSheet.goto(page, cfg.sheetUrl);
  const value = await excelSheet.getCellText(page, "A1");

  expect(value).toBe(todayInTz(cfg.workbookTz));
});
