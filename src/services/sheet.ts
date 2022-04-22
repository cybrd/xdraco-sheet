import { sheets_v4 } from "googleapis";

const spreadsheetId = "1w9CjEpyJYlRbfgWylc5O6Mjdze7lIvXdsag5uj51dns";

export const updateSheetDashboard = (
  sheets: sheets_v4.Sheets,
  values: any[]
) => {
  console.log("Sending " + values.length + " rows");

  const data: any[] = [];
  values.forEach((value, i) => {
    data.push({
      range: "Sheet1!A" + (i + 2),
      values: [Object.values(value)],
    });
  });

  return sheets.spreadsheets.values
    .batchUpdate({
      spreadsheetId,
      requestBody: {
        data,
        valueInputOption: "RAW",
      },
    })
    .then(() => {
      console.log("Sheet updated");
    });
};

export const listRows = (sheets: sheets_v4.Sheets) => {
  console.log("Fetching list");

  return new Promise<any[]>((resolve) => {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId,
        range: "Sheet1!A2:A",
      },
      (err, res) => {
        const rows = res?.data?.values;

        if (rows?.length) {
          resolve(rows);
        } else {
          console.log("No data found.");
          resolve([]);
        }
      }
    );
  });
};

export const updateSheetRows = (sheets: sheets_v4.Sheets, values: any[]) => {
  console.log("Updating " + values.length + " rows");

  const data: any[] = [];
  values.forEach((value, i) => {
    data.push({
      range: "Sheet1!G" + (i + 2),
      values: [Object.values(value)],
    });
  });

  sheets.spreadsheets.values
    .batchUpdate({
      spreadsheetId,
      requestBody: {
        data,
        valueInputOption: "RAW",
      },
    })
    .then(() => {
      console.log(`Cells updated.`);
    });
};

export const clearSheet = (sheets: sheets_v4.Sheets) => {
  return sheets.spreadsheets.values
    .clear({
      spreadsheetId,
      range: "Sheet1!A2:K",
    })
    .then(() => {
      console.log(`Sheet cleared`);
    });
};
