import fetch from "node-fetch";

const uri = "https://webapi.mir4global.com/exd/lists";

const params = {
  listType: "explorer",
  class: "0",
  itemType: "0",
  grade: "0",
  tier: "0",
  enhance: "-1",
  minPrice: "0",
  maxPrice: "0",
  sort: "latest",
  uniqueFlag: "0",
  searchType: "3",
  EXDSearchId: "0",
  page: "1",
  languageCode: "en",
};

export const fetchDashboard = async (page: number) => {
  params.page = String(page);
  const query = new URLSearchParams(params);
  const results = await fetch(uri + "?" + query).then((res) => res.json());

  const data: any[] = [];
  results.data.lists.forEach((list: any) => {
    data.push({
      tradeUID: list.tradeUID,
      itemID: list.item.itemID,
      price: Number(list.price),
      powerScore: list.item.powerScore,
      itemName: list.item.itemName,
      grade: list.item.grade,
    });
  });

  return data;
};
