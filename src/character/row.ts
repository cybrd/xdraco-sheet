import { google } from "googleapis";

import { listRows, updateSheetRows } from "./services/sheet";
import { fetchSummary, fetchOther } from "./services/trade-item";

const main = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "/google-cred/xdraco-310a7c9c1a42.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  let rows = await listRows(sheets);
  const sheetData: any = [];

  while (rows.length) {
    const summaryData = await fetchSummary(rows.splice(0, 50));
    const otherData = await fetchOther(summaryData);
    const combinedData: any[] = [];

    summaryData.forEach((summary, i) => {
      const combined = (otherData[i] as any[]).reduce(
        (prev, curr) => ({ ...prev, ...curr }),
        {}
      );
      combinedData.push({
        ...summary,
        ...combined,
      });
    });

    combinedData.forEach((data) => {
      let value: any[] = [];

      if (data.skills) {
        value = [
          ...value,
          data.skills[0].skillLevel,
          data.skills[1].skillLevel,
          data.skills[2].skillLevel,
          data.skills[3].skillLevel,
          data.skills[4].skillLevel,
          data.skills[5].skillLevel,
          data.skills[6].skillLevel,
          data.skills[7].skillLevel,
          data.skills[8].skillLevel,
          data.skills[9].skillLevel,
          data.skills[10].skillLevel,
          data.skills[11].skillLevel,
          data.skills[12].skillLevel,
        ];
      } else {
        value = [...value, ...Array(12).join(".").split(".")];
      }

      if (data.training) {
        value = [
          ...value,
          data.training.consitutionLevel,
          data.training[0].forceLevel,
          data.training[1].forceLevel,
          data.training[2].forceLevel,
          data.training[3].forceLevel,
          data.training[4].forceLevel,
          data.training[5].forceLevel,
          data.training.collectLevel,
        ];
      } else {
        value = [...value, ...Array(8).join(".").split(".")];
      }

      sheetData.push(value);
    });
  }

  updateSheetRows(sheets, sheetData);
};
main();
