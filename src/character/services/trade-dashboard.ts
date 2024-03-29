import fetch from "node-fetch";

const uri = "https://webapi.mir4global.com/nft/lists";

const params = {
  listType: "sale",
  sort: "latest",
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
      link: "https://www.xdraco.com/nft/trade/" + list.seq,
      seq: list.seq,
      characterName: list.characterName,
      class: className(list.class),
      lv: list.lv,
      price: list.price,
      powerScore: list.powerScore,
      MirageScore: list.MirageScore,
    });
  });

  return data;
};

const className = (value: number) => {
  switch (value) {
    case 1:
      return "Warrior";
    case 2:
      return "Sorcerer";
    case 3:
      return "Taoist";
    case 4:
      return "Arbalist";
    case 5:
      return "Lancer";
  }
};
