const app =
  document.getElementById("app");

const historyStack = [];

let selectedCenter = null;

/*
  画面データ
*/
const screens = {

  /*
    トップ
  */
  start: {

    question:
      "少し前から、こんな事を感じている。",

    options: [

      {
        text:
          "親の物忘れが増えた",

        description:
          "同じ話を繰り返すなど",

        color:
          "#546e7a",

        next:
          "regionSelect"
      },

      {
        text:
          "介護がしんどい",

        description:
          "疲れや不安がある",

        color:
          "#8d6e63",

        next:
          "regionSelect"
      },

      {
        text:
          "親だけの暮らしが心配",

        description:
          "転倒・生活・食事など",

        color:
          "#5e35b1",

        next:
          "regionSelect"
      },

      {
        text:
          "まだ相談するほどか迷う",

        description:
          "大げさか不安",

        color:
          "#78909c",

        next:
          "regionSelect"
      }

    ]

  },

  /*
    地域選択
  */
  regionSelect: {

    question:
      "地域を選択してください",

    description:
      "何を聞けばいいか分からなくても大丈夫です。\n本人がいなくても相談できます。"

  },

  /*
    センター情報・確認チェック
  */
  centerInfo: {

    question: ""

  }

};

/*
  市区町村一覧ページ
*/
const cityLinks = {

  "世田谷区":
"https://www.city.setagaya.lg.jp/fukushikenkou/koureikaigo/category/11767.html",

  "練馬区":
"https://www.city.nerima.tokyo.jp/shisetsu/koreikaigo/chiikihokatsushisho/index.html",

  "板橋区":
"https://www.city.itabashi.tokyo.jp/kenko/kourei/soudan/1016108/index.html",

  "北区":
"https://www.city.kita.lg.jp/city-information/facilities/1015898/1018422/index.html",

  "杉並区":
"https://www.city.suginami.tokyo.jp/kusei/gaiyou/shisetsu/genre/hoken/kourei/houkatsu/index.html",

  "中野区":
"https://www.city.tokyo-nakano.lg.jp/shisetsu/kenko/chiikihoukatsusien/index.html",

  "豊島区":
"https://www.city.toshima.lg.jp/shisetsu/fukushi/index.html",

  "新宿区":
"https://www.city.shinjuku.lg.jp/fukushi/file05_03_00002.html",

  "足立区":
"https://www.city.adachi.tokyo.jp/shisetsu/fukushi/index.html",

  "荒川区":
"https://www.city.arakawa.tokyo.jp/shisetsuannai/fukushikanren/chiikihoukatsushien/index.html",

  "文京区":
"https://www.city.bunkyo.lg.jp/b017/p003149/index.html",

  "墨田区":
"https://www.city.sumida.lg.jp/sisetu_info/hukusisisetu/zaitakukaigosien/index.html",

  "江東区":
"https://www.city.koto.lg.jp/shisetsuannai/kenkou/koreshashisetsu/chiikihokatsu/index.html",

  "台東区":
"https://www.city.taito.lg.jp/kenkohukusi/korei/koreishasodan/chiikihokatsujien.html",

  "品川区":
"https://www.city.shinagawa.tokyo.jp/PC/shisetsu/shisetsu-kenkouhukushi/shisetsu-kenkouhukushi-koureisya/hpg000000166.html",

  "大田区":
"https://www.city.ota.tokyo.jp/shisetsu/fukushi/kourei/houkatsu_c/index.html",

  "江戸川区":
"https://www.city.edogawa.tokyo.jp/e040/kuseijoho/gaiyo/shisetsuguide/bunya/kenkofukushi/jukunensha/shiencenter.html",

  "葛飾区":
"https://www.city.katsushika.lg.jp/institution/1030223/1006835/index.html",

  "港区":
"https://www.city.minato.tokyo.jp/shisetsu/fukushi/k-sodan/index.html",

  "目黒区":
"https://www.city.meguro.tokyo.jp/shisetsu/genre/hokenfukushi/hokenfukushi/index.html",

  "千代田区":
"https://www.city.chiyoda.lg.jp/koho/kurashi/hoken/kaigo/hokatsu.html",

  "中央区":
"https://www.city.chuo.lg.jp/sisetugaido/fukushijinken/otosiyori/madogutiotosiyori.html",

  "渋谷区":
"https://www.city.shibuya.tokyo.jp/shisetsu/iryo-fukushi-shisetsu/chiiki-center/",

  "大阪市北区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市都島区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市福島区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市此花区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市中央区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市西区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市港区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市大正区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市天王寺区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市浪速区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市西淀川区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市淀川区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市東淀川区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市東成区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市生野区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市旭区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市城東区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市鶴見区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市阿倍野区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市住之江区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市住吉区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市東住吉区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市平野区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "大阪市西成区":
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html"

};

/*
  画面表示
*/
function renderScreen(screenKey) {

  const screen =
    screens[screenKey];

  app.innerHTML = "";

  window.scrollTo(0, 0);

  const card =
    document.createElement("div");

  card.className =
    "card";

  /*
    タイトル
  */
  const question =
    document.createElement("div");

  question.className =
    "question";

  question.textContent =
    screenKey === "centerInfo" && selectedCenter
      ? selectedCenter.name
      : screen.question;

  card.appendChild(question);

  /*
    説明
  */
  if (screen.description) {

    const description =
      document.createElement("p");

    description.textContent =
      screen.description;

    description.style.whiteSpace =
      "pre-line";

    description.style.lineHeight =
      "1.8";

    description.style.marginBottom =
      "24px";

    card.appendChild(description);

  }

  /*
    地域選択
  */
  if (screenKey === "regionSelect") {

    renderRegionSelect(card);

  }

  if (screenKey === "centerInfo") {

    renderCenterInfo(card);

  }

  /*
    通常ボタン
  */
  if (screen.options) {

    screen.options.forEach(option => {

      const button =
        document.createElement("button");

      button.className =
        "button";

      button.style.background =
        option.color;

      button.style.display =
        "flex";

      button.style.alignItems =
        "center";

      button.style.textAlign =
        "left";

      button.style.gap =
        "16px";

      /*
        右側
      */
      const right =
        document.createElement("div");

      /*
        タイトル
      */
      const title =
        document.createElement("div");

      title.textContent =
        option.text;

      title.style.fontSize =
        "18px";

      title.style.fontWeight =
        "bold";

      /*
        説明
      */
      const small =
        document.createElement("div");

      small.textContent =
        option.description;

      small.style.fontSize =
        "13px";

      small.style.marginTop =
        "4px";

      small.style.opacity =
        "0.9";

      right.appendChild(title);

      right.appendChild(small);

      button.appendChild(right);

      /*
        クリック
      */
      button.onclick = () => {

        historyStack.push(screenKey);

        renderScreen(option.next);

      };

      card.appendChild(button);

    });

  }

  /*
    戻る
  */
  if (historyStack.length > 0) {

    const backButton =
      document.createElement("button");

    backButton.textContent =
      "戻る";

    backButton.className =
      "button back-button";

    backButton.onclick = () => {

      const previous =
        historyStack.pop();

      renderScreen(previous);

    };

    card.appendChild(backButton);

  }

  app.appendChild(card);

}

/*
  地域選択表示
*/
function renderRegionSelect(card) {

  /*
    都道府県
  */
  const prefectureSelect =
    document.createElement("select");

  prefectureSelect.className =
    "select";

  /*
    市区町村
  */
  const citySelect =
    document.createElement("select");

  citySelect.className =
    "select";

  /*
    地域
  */
  const areaSelect =
    document.createElement("select");

  areaSelect.className =
    "select";

  /*
    初期表示
  */
  prefectureSelect.innerHTML =
    `<option value="">都道府県を選択</option>`;

  citySelect.innerHTML =
    `<option value="">市区町村を選択</option>`;

  areaSelect.innerHTML =
    `<option value="">地域を選択</option>`;

  /*
    都道府県一覧
  */
  const prefectures = [
    ...new Set(
      centers.map(c => c.prefecture)
    )
  ];

  prefectures.forEach(prefecture => {

    const option =
      document.createElement("option");

    option.value =
      prefecture;

    option.textContent =
      prefecture;

    prefectureSelect.appendChild(option);

  });

  /*
    都道府県変更
  */
  prefectureSelect.onchange = () => {

    citySelect.innerHTML =
      `<option value="">市区町村を選択</option>`;

    areaSelect.innerHTML =
      `<option value="">地域を選択</option>`;

    const cities = [
      ...new Set(
        centers
          .filter(c =>
            c.prefecture === prefectureSelect.value
          )
          .map(c => c.city)
      )
    ];

    cities.forEach(city => {

      const option =
        document.createElement("option");

      option.value =
        city;

      option.textContent =
        city;

      citySelect.appendChild(option);

    });

  };

  /*
    市区町村変更
  */
  citySelect.onchange = () => {

    areaSelect.innerHTML =
      `<option value="">地域を選択</option>`;

    const areas = [
      ...new Set(
        centers
          .filter(c =>
            c.prefecture === prefectureSelect.value &&
            c.city === citySelect.value
          )
          .map(c => c.area)
      )
    ];

    areas.forEach(area => {

      const option =
        document.createElement("option");

      option.value =
        area;

      option.textContent =
        area;

      areaSelect.appendChild(option);

    });

  };

  /*
    地域変更 → センター情報画面へ遷移
  */
  areaSelect.onchange = () => {

    const found =
      centers.find(c =>
        c.prefecture === prefectureSelect.value &&
        c.city === citySelect.value &&
        c.area === areaSelect.value
      );

    if (!found) return;

    selectedCenter = found;

    historyStack.push("regionSelect");

    renderScreen("centerInfo");

  };

  /*
    都道府県が1つだけの場合は自動選択して区一覧を表示
  */
  if (prefectures.length === 1) {

    prefectureSelect.value =
      prefectures[0];

    const autoCities = [
      ...new Set(
        centers
          .filter(c => c.prefecture === prefectures[0])
          .map(c => c.city)
      )
    ];

    autoCities.forEach(city => {

      const option =
        document.createElement("option");

      option.value = city;

      option.textContent = city;

      citySelect.appendChild(option);

    });

  }

  /*
    配置
  */
  card.appendChild(prefectureSelect);

  card.appendChild(citySelect);

  card.appendChild(areaSelect);

}
/*
  センター情報・確認チェック表示
*/
function renderCenterInfo(card) {

  if (!selectedCenter) return;

  /*
    電話番号
  */
  const tel =
    document.createElement("div");

  tel.textContent =
    "電話番号 : " + selectedCenter.tel;

  tel.style.fontSize =
    "18px";

  tel.style.color =
    "#546e7a";

  tel.style.marginBottom =
    "28px";

  card.appendChild(tel);

  /*
    チェックリスト見出し
  */
  const checkHeader =
    document.createElement("div");

  checkHeader.textContent =
    "電話前に確認しましょう";

  checkHeader.style.fontSize =
    "16px";

  checkHeader.style.fontWeight =
    "bold";

  checkHeader.style.marginBottom =
    "16px";

  checkHeader.style.color =
    "#37474f";

  card.appendChild(checkHeader);

  /*
    チェック項目
  */
  const checkItems = [
    "相談したい内容がある（物忘れ・介護の疲れ・一人暮らしの心配など）",
    "対象者の名前・年齢を把握している",
    "対象者の生活の様子がわかる（一人暮らし・同居など）",
    "自分の名前・折り返し先の連絡先を用意した"
  ];

  const checkboxes = [];

  const checkList =
    document.createElement("div");

  checkList.style.marginBottom =
    "28px";

  /*
    電話ボタン（先に作成してチェック変化時に参照）
  */
  const callButton =
    document.createElement("button");

  callButton.className =
    "button";

  callButton.textContent =
    "電話をかける";

  callButton.disabled = true;

  callButton.style.background =
    "#b0bec5";

  callButton.style.cursor =
    "not-allowed";

  checkItems.forEach(item => {

    const label =
      document.createElement("label");

    label.style.display =
      "flex";

    label.style.alignItems =
      "flex-start";

    label.style.gap =
      "12px";

    label.style.marginBottom =
      "16px";

    label.style.cursor =
      "pointer";

    label.style.fontSize =
      "15px";

    label.style.lineHeight =
      "1.6";

    const checkbox =
      document.createElement("input");

    checkbox.type =
      "checkbox";

    checkbox.style.marginTop =
      "3px";

    checkbox.style.width =
      "20px";

    checkbox.style.height =
      "20px";

    checkbox.style.flexShrink =
      "0";

    checkbox.style.cursor =
      "pointer";

    checkbox.style.accentColor =
      "#546e7a";

    checkbox.onchange = () => {

      const allChecked =
        checkboxes.every(cb => cb.checked);

      callButton.disabled = !allChecked;

      callButton.style.background =
        allChecked ? "#546e7a" : "#b0bec5";

      callButton.style.cursor =
        allChecked ? "pointer" : "not-allowed";

    };

    checkboxes.push(checkbox);

    const text =
      document.createElement("span");

    text.textContent = item;

    label.appendChild(checkbox);
    label.appendChild(text);
    checkList.appendChild(label);

  });

  card.appendChild(checkList);

  /*
    電話ボタン動作
  */
  callButton.onclick = () => {

    if (callButton.disabled) return;

    const ok = confirm(
      selectedCenter.tel + " に電話しますか？"
    );

    if (ok) {

      window.location.href =
        "tel:" + selectedCenter.tel;

    }

  };

  card.appendChild(callButton);

  /*
    リンク
  */
  const link =
    document.createElement("a");

  link.href =
    selectedCenter.url;

  link.target =
    "_blank";

  link.textContent =
    selectedCenter.name + " について確認してみる";

  link.className =
    "button";

  link.style.display =
    "block";

  link.style.width =
    "100%";

  link.style.boxSizing =
    "border-box";

  link.style.textAlign =
    "center";

  link.style.textDecoration =
    "none";

  link.style.color =
    "white";

  link.style.background =
    "#78909c";

  link.style.marginTop =
    "16px";

  card.appendChild(link);

  /*
    補足案内
  */
  const fallbackNotice =
    document.createElement("p");

  fallbackNotice.textContent =
    "※ページが見つからない場合は、公式の一覧をご確認ください。";

  fallbackNotice.style.fontSize =
    "13px";

  fallbackNotice.style.lineHeight =
    "1.7";

  fallbackNotice.style.marginTop =
    "20px";

  fallbackNotice.style.color =
    "#666";

  const fallbackLink =
    document.createElement("a");

  fallbackLink.href =
    cityLinks[selectedCenter.city] || "#";

  fallbackLink.target =
    "_blank";

  fallbackLink.textContent =
    "公式の一覧を確認する";

  fallbackLink.style.display =
    "block";

  fallbackLink.style.marginTop =
    "10px";

  card.appendChild(fallbackNotice);
  card.appendChild(fallbackLink);

}

/*
  初期表示
*/
renderScreen("start");