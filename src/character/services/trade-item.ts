import fetch from "node-fetch";

const uri = "https://webapi.mir4global.com/nft/character/";

export const fetchSummary = (rows: string[][]) => {
  return Promise.all(
    rows.map((row) => {
      console.log("Fetching Summary: ", row[0]);

      const query = new URLSearchParams({
        seq: row[0],
        languageCode: "en",
      });

      return fetch(uri + "summary?" + query)
        .then((res) => res.json())
        .then((res) => ({
          seq: row[0],
          transportID: res.data.character.transportID,
          class: res.data.character.class,
          equipItem: res.data.equipItem,
        }))
        .catch(() => {
          console.error("Error Fetch Summary #: ", row[0]);
          return {
            seq: row[0],
            equipItem: [],
          };
        });
    })
  );
};

export const fetchOther = (rows: any[]) => {
  return Promise.all(
    rows.map((row, i) => {
      if (!Object.keys(row.equipItem).length) {
        console.log("Skip Fetching Other: ", row.seq, row.transportID);
        return [];
      } else {
        console.log("Fetching Other: ", row.seq, row.transportID);
      }

      const types = ["skills", "training", "spirit", "magicstone", "codex"];

      return Promise.all(
        types.map((type) => {
          switch (type) {
            case "skills":
              return fetchSkills(row);

            case "training":
              return fetchTraining(row);

            case "spirit":
              return fetchSpirit(row);

            case "magicstone":
              return fetchMagicStone(row);

            case "codex":
              return fetchCodex(row);
          }
        })
      );
    })
  );
};

const fetchSkills = (row: any) => {
  const query = new URLSearchParams({
    transportID: row.transportID,
    class: row.class,
    languageCode: "en",
  });

  console.log("Fetching Skills: ", row.seq, row.transportID);
  return fetch(uri + "skills?" + query)
    .then((res) => res.json())
    .then((res) => ({ skills: res.data }))
    .catch((err) => {
      console.error("Error Fetch Skills #: ", row.seq);
      throw Error(err);
    });
};

const fetchTraining = (row: any) => {
  const query = new URLSearchParams({
    transportID: row.transportID,
    languageCode: "en",
  });

  console.log("Fetching Training: ", row.seq, row.transportID);
  return fetch(uri + "training?" + query)
    .then((res) => res.json())
    .then((res) => ({ training: res.data }))
    .catch((err) => {
      console.error("Error Fetch Training #: ", row.seq);
      throw Error(err);
    });
};

const fetchSpirit = (row: any) => {
  const query = new URLSearchParams({
    transportID: row.transportID,
    languageCode: "en",
  });

  console.log("Fetching Spirit: ", row.seq, row.transportID);
  return fetch(uri + "spirit?" + query)
    .then((res) => res.json())
    .then((res) => ({ spirit: res.data?.inven }))
    .catch((err) => {
      console.error("Error Fetch Spirit #: ", row.seq);
      throw Error(err);
    });
};

const fetchMagicStone = (row: any) => {
  const query = new URLSearchParams({
    transportID: row.transportID,
    languageCode: "en",
  });

  console.log("Fetching Magic Stone: ", row.seq, row.transportID);
  return fetch(uri + "inven?" + query)
    .then((res) => res.json())
    .then((res) => ({
      magicStone: res.data.filter(
        (x: any) =>
          Number(x.grade) >= 4 && x.itemName.indexOf("Magic Stone of") !== -1
      ),
    }))
    .catch((err) => {
      console.error("Error Fetch MagicStone #: ", row.seq);
      throw Error(err);
    });
};

const fetchCodex = (row: any) => {
  const query = new URLSearchParams({
    transportID: row.transportID,
    languageCode: "en",
  });

  console.log("Fetching Codex: ", row.seq, row.transportID);
  return fetch(uri + "codex?" + query)
    .then((res) => res.json())
    .then((res) => ({ codex: res.data }))
    .catch((err) => {
      console.error("Error Fetch Codex #: ", row.seq);
      throw Error(err);
    });
};
