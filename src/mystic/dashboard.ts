import { google } from "googleapis";

import { fetchDashboard } from "./services/trade-dashboard";
import { clearSheet, updateSheetDashboard } from "./services/sheet";

const main = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "/google-cred/xdraco-310a7c9c1a42.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  await clearSheet(sheets);

  let data: any[] = [];
  let newData: any[] = [];
  let page = 1;
  do {
    console.log("Fetching page " + page);
    newData = await fetchDashboard(page);
    data = [...data, ...newData];
    page++;
  } while (newData.length && page <= 5);

  if (data.length) {
    updateSheetDashboard(sheets, data);
  }
};
main();
