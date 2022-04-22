import { google } from "googleapis";

import { listRows, updateSheetRows } from "./services/sheet";
import { fetchItems } from "./services/trade-item";

const main = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "/google-cred/xdraco-310a7c9c1a42.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  const rows = await listRows(sheets);

  const rowsData = await fetchItems(rows);
  updateSheetRows(sheets, rowsData);
};
main();
