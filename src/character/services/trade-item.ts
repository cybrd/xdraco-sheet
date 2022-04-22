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

      return fetch(uri + "summary?" + query, {
        method: "GET",
      })
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

      const types = [
        "skills",
        "training",
        // "spirit",
        // "codex",
        // "magicstone",
      ];

      return Promise.all(
        types.map((type) => {
          switch (type) {
            case "skills":
              return fetchSkills(row);

            case "training":
              return fetchTraining(row);

            case "spirit":
              return fetchSpirit(row);
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
  return fetch(uri + "skills?" + query, {
    method: "GET",
  })
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
  return fetch(uri + "training?" + query, {
    method: "GET",
  })
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
  return fetch(uri + "spirit?" + query, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => ({ spirit: res.data }))
    .catch((err) => {
      console.error("Error Fetch Spirit #: ", row.seq);
      throw Error(err);
    });
};
