import fetch from "node-fetch";

const uri = "https://webapi.mir4global.com/exd/tradeitem";

const params = {
  tradeUID: "640675",
  languageCode: "en",
};

export const fetchItems = async (rows: string[][]) => {
  return await Promise.all(
    rows.map((row, i) => {
      console.log("Fetching item: " + row[0]);

      params.tradeUID = row[0];
      const query = new URLSearchParams(params);

      return fetch(uri + "?" + query, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => ({
          itemID: res.data.item.itemID,
          itemUID: res.data.item.itemUID,
          optionName: res.data.item.addOptions[0].optionName,
          optionValue: Number(res.data.item.addOptions[0].optionValue),
          itemLink: "https://www.xdraco.com/exd/trade/" + row[0],
        }))
        .catch((err) => {
          console.error("Error Fetch #: " + i);
          throw Error(err);
        });
    })
  );
};
