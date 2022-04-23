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
          data.skills.filter((x: any) => Number(x.skillLevel) >= 8).length,
          Number(data.skills[0].skillLevel),
          Number(data.skills[1].skillLevel),
          Number(data.skills[2].skillLevel),
          Number(data.skills[3].skillLevel),
          Number(data.skills[4].skillLevel),
          Number(data.skills[5].skillLevel),
          Number(data.skills[6].skillLevel),
          Number(data.skills[7].skillLevel),
          Number(data.skills[8].skillLevel),
          Number(data.skills[9].skillLevel),
          Number(data.skills[10].skillLevel),
          Number(data.skills[11].skillLevel),
          Number(data.skills[12].skillLevel),
        ];
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
      }

      if (data.spirit) {
        value = [
          ...value,
          data.spirit.filter((x: any) => x.grade === 5).length,
          data.spirit.filter((x: any) => x.grade === 4).length,
          data.spirit.filter((x: any) => x.petName === "Golden Bird Suparna")
            .length,
          data.spirit.filter((x: any) => x.petName === "Absolute Beauty Whaley")
            .length,
          data.spirit.filter(
            (x: any) => x.petName === "White Peacock Crystaglass"
          ).length,
          data.spirit.filter((x: any) => x.petName === "Gem Mania Shaoshao")
            .length,
          data.spirit.filter((x: any) => x.petName === "Assassin Nyanja")
            .length,
          data.spirit.filter((x: any) => x.petName === "Thunder Beast Baratan")
            .length,
          data.spirit.filter((x: any) => x.petName === "Glowing Gem Sparkler")
            .length,
          data.spirit.filter((x: any) => x.petName === "Fire Devil Flamehorn")
            .length,
          data.spirit.filter((x: any) => x.petName === "Soul Harvester Reaper")
            .length,
          data.spirit.filter((x: any) => x.petName === "Flame Hellborn Biyoho")
            .length,
          data.spirit.filter((x: any) => x.petName === "Leocrat Khun").length,
          data.spirit.filter((x: any) => x.petName === "Brutal Lionheart Koiga")
            .length,
          data.spirit.filter((x: any) => x.petName === "Lucky Cat Luckster")
            .length,
          data.spirit.filter((x: any) => x.petName === "Radiance Dragon Mir")
            .length,
        ];
      }

      if (data.magicStone) {
        value = [
          ...value,
          data.magicStone.filter((x: any) => Number(x.grade) === 5).length,
          data.magicStone.filter((x: any) => Number(x.grade) === 4).length,
          data.magicStone.filter(
            (x: any) => x.itemName.indexOf("Destruction") !== -1
          ).length,
        ];
      }

      if (data.codex) {
        value = [
          ...value,
          Number(data.codex[1].completed),
          Number(data.codex[2].completed),
          Number(data.codex[3].completed),
        ];
      }

      sheetData.push(value);
    });
  }

  updateSheetRows(sheets, sheetData);
};
main();
