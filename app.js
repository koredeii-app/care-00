const app =
  document.getElementById("app");

const historyStack = [];

let selectedCenter = null;

let savedRegion = {};

let selectedConcern = null;

let savedFormValues = {};

let centers = [];

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
          "regionSelect",

        concern:
          "forgetfulness"
      },

      {
        text:
          "介護がしんどい",

        description:
          "疲れや不安がある",

        color:
          "#8d6e63",

        next:
          "regionSelect",

        concern:
          "caregiving"
      },

      {
        text:
          "親だけの暮らしが心配",

        description:
          "転倒・生活・食事など",

        color:
          "#5e35b1",

        next:
          "regionSelect",

        concern:
          "living_alone"
      },

      {
        text:
          "まだ相談するほどか迷う",

        description:
          "大げさか不安",

        color:
          "#78909c",

        next:
          "regionSelect",

        concern:
          "unsure"
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
  選択した悩みに応じたメッセージ・プレフィックス
*/
const concernIntros = {
  forgetfulness: "認知症の疑いがある場合も、まず電話で話せます",
  caregiving:    "すでに介護している方からの相談も歓迎されています",
  living_alone:  "見守りや生活支援の相談もできます",
  unsure:        "「まだ早いかな」という段階が、一番相談しやすい時期です"
};

const concernPrefixes = {
  forgetfulness: "認知症の様な感じがするので、どうすればいいか相談をしたいです。",
  caregiving:    "介護で疲れているので、何か支援が無いか相談したいです。",
  living_alone:  "親の生活が心配で、何か見守りや支援が無いか相談したいです。",
  unsure:        "まだ大変な状態ではないけれど、今後に備えて相談したいです。"
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
"https://www.city.osaka.lg.jp/fukushi/page/0000370522.html",

  "八王子市":
"https://www.city.hachioji.tokyo.jp/kurashi/welfare/004/005/chikihoukatsushien/p018114.html",

  "町田市":
"https://www.city.machida.tokyo.jp/iryo/old/shiminnokatae/mijikanasodan/koureisha_shien_center.html",

  "府中市":
"https://www.city.fuchu.tokyo.jp/shisetu/fukushi/chikihoukatu/index.html",

  "調布市":
"https://www.city.chofu.lg.jp/060030/p033040.html",

  "西東京市":
"https://www.city.nishitokyo.lg.jp/kenko_hukusi/koreisyasien/chiikihoukatu.html",

  "小平市":
"https://www.city.kodaira.tokyo.jp/kurashi/002/002598.html",

  "三鷹市":
"https://www.city.mitaka.lg.jp/c_service/000/000934.html",

  "日野市":
"https://www.city.hino.lg.jp/shisetsu/fukushi/houkatsu/index.html",

  "東村山市":
"https://www.city.higashimurayama.tokyo.jp/kenko/korei/koreisodan/hokatsu/hokatuse.html",

  "立川市":
"https://www.city.tachikawa.lg.jp/koreifukushi/kenko/fukushi/koresha/center.html",

  "多摩市":
"https://www.city.tama.lg.jp/kenkofukushi/1008237/koureisha/soudan/1002951.html",

  "国分寺市":
"https://www.city.kokubunji.tokyo.jp/kurashi/1011604/1011688/1026548.html",

  "武蔵野市":
"https://www.city.musashino.lg.jp/shisetsu_annai/hoken_fukushi/zaitakukaigo_chiikihokatsu_shiencenter/index.html",

  "青梅市":
"https://www.city.ome.tokyo.jp/soshiki/30/587.html",

  "清瀬市":
"https://www.city.kiyose.lg.jp/kenkouiryouhukusi/koureisien/1014148.html",

  "東久留米市":
"https://www.city.higashikurume.lg.jp/kurashi/zei/kaigo/1012303.html",

  "昭島市":
"https://www.city.akishima.lg.jp/kenko/korei/1003087.html",

  "東大和市":
"https://www.city.higashiyamato.lg.jp/kenkofukushi/koureisha/1002925/1002928.html",

  "国立市":
"https://www.city.kunitachi.tokyo.jp/soshiki/Dept03/Div03/Sec03/gyomu/0148/1576460952988.html",

  "横浜市鶴見区":
"https://www.city.yokohama.lg.jp/tsurumi/kenko-iryo-fukushi/fukushi_kaigo/koreisha_kaigo/hoken-igai/sodan.html",

  "横浜市神奈川区":
"https://www.city.yokohama.lg.jp/kanagawa/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/tiikikeapuraza.html",

  "横浜市西区":
"https://www.city.yokohama.lg.jp/nishi/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/careplaza_shoukai.html",

  "横浜市中区":
"https://www.city.yokohama.lg.jp/naka/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/shisetsu/cp/nakacpsyoukai.html",

  "横浜市南区":
"https://www.city.yokohama.lg.jp/minami/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/shisetsu/cp/chiikikeapuraza.html",

  "横浜市港南区":
"https://www.city.yokohama.lg.jp/konan/kenko-iryo-fukushi/fukushi_kaigo/koreisha_kaigo/kaigo-hoken/siencenter.html",

  "横浜市保土ケ谷区":
"https://www.city.yokohama.lg.jp/hodogaya/kenko-iryo-fukushi/fukushi_kaigo/koreisha_kaigo/kaigo-yobou/koreisha/sodankikan/soudan-01.html",

  "横浜市旭区":
"https://www.city.yokohama.lg.jp/asahi/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/asahicp-shoukai.html",

  "横浜市磯子区":
"https://www.city.yokohama.lg.jp/isogo/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/keapurazasyoukai.html",

  "横浜市金沢区":
"https://www.city.yokohama.lg.jp/kanazawa/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/shisetsu/cp/carepla-Introduction.html",

  "横浜市港北区":
"https://www.city.yokohama.lg.jp/kohoku/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/careplaza.html",

  "横浜市緑区":
"https://www.city.yokohama.lg.jp/midori/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/shisetsu/cp/cp-shokai.html",

  "横浜市青葉区":
"https://www.city.yokohama.lg.jp/aoba/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/aobakucpsyoukai.html",

  "横浜市都筑区":
"https://www.city.yokohama.lg.jp/tsuzuki/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/cpnew.html",

  "横浜市戸塚区":
"https://www.city.yokohama.lg.jp/totsuka/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/shisetsu/cp/careplaza_totsuka.html",

  "横浜市栄区":
"https://www.city.yokohama.lg.jp/sakae/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/shoukai.html",

  "横浜市泉区":
"https://www.city.yokohama.lg.jp/izumi/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/cp-shoukai.html",

  "横浜市瀬谷区":
"https://www.city.yokohama.lg.jp/seya/kenko-iryo-fukushi/fukushi_kaigo/chiikifukushi/fukushi-shisetsu/cp/tiikicareplaza.html",

  "川崎市川崎区":
"https://www.city.kawasaki.jp/shisei/category/288-10-10-4-2-0-0-0-0-0.html",

  "川崎市幸区":
"https://www.city.kawasaki.jp/shisei/category/288-10-10-5-2-0-0-0-0-0.html",

  "川崎市中原区":
"https://www.city.kawasaki.jp/shisei/category/288-10-10-1-2-0-0-0-0-0.html",

  "川崎市高津区":
"https://www.city.kawasaki.jp/shisei/category/288-10-10-7-2-0-0-0-0-0.html",

  "川崎市宮前区":
"https://www.city.kawasaki.jp/shisei/category/288-10-10-3-2-0-0-0-0-0.html",

  "川崎市多摩区":
"https://www.city.kawasaki.jp/shisei/category/288-10-10-2-2-0-0-0-0-0.html",

  "川崎市麻生区":
"https://www.city.kawasaki.jp/shisei/category/288-10-10-8-2-0-0-0-0-0.html",

  "相模原市緑区":
"https://www.city.sagamihara.kanagawa.jp/kosodate/fukushi/1026635/korei_shien/1006373.html",

  "相模原市中央区":
"https://www.city.sagamihara.kanagawa.jp/kosodate/fukushi/1026635/korei_shien/1006373.html",

  "相模原市南区":
"https://www.city.sagamihara.kanagawa.jp/kosodate/fukushi/1026635/korei_shien/1006373.html",

  "さいたま市西区":
"https://www.city.saitama.lg.jp/008/019/002/001/index.html",

  "さいたま市北区":
"https://www.city.saitama.lg.jp/008/019/002/002/index.html",

  "さいたま市大宮区":
"https://www.city.saitama.lg.jp/008/019/002/003/index.html",

  "さいたま市見沼区":
"https://www.city.saitama.lg.jp/008/019/002/004/index.html",

  "さいたま市中央区":
"https://www.city.saitama.lg.jp/008/019/002/005/index.html",

  "さいたま市桜区":
"https://www.city.saitama.lg.jp/008/019/002/006/index.html",

  "さいたま市浦和区":
"https://www.city.saitama.lg.jp/urawa/001/002/007/p083061.html",

  "さいたま市南区":
"https://www.city.saitama.lg.jp/008/019/002/008/index.html",

  "さいたま市緑区":
"https://www.city.saitama.lg.jp/008/019/002/009/index.html",

  "さいたま市岩槻区":
"https://www.city.saitama.lg.jp/008/019/002/010/index.html",

  "千葉市中央区":
"https://www.city.chiba.jp/hokenfukushi/kenkofukushi/hokatsucare/anshincarecenter.html",

  "千葉市花見川区":
"https://www.city.chiba.jp/hokenfukushi/kenkofukushi/hokatsucare/anshincarecenter.html",

  "千葉市稲毛区":
"https://www.city.chiba.jp/hokenfukushi/kenkofukushi/hokatsucare/anshincarecenter.html",

  "千葉市若葉区":
"https://www.city.chiba.jp/hokenfukushi/kenkofukushi/hokatsucare/anshincarecenter.html",

  "千葉市緑区":
"https://www.city.chiba.jp/hokenfukushi/kenkofukushi/hokatsucare/anshincarecenter.html",

  "千葉市美浜区":
"https://www.city.chiba.jp/hokenfukushi/kenkofukushi/hokatsucare/anshincarecenter.html",

  "船橋市":
"https://www.city.funabashi.lg.jp/kenkou/koureisha/001/p004493.html",

  "川口市":
"https://www.city.kawaguchi.lg.jp/soshiki/01070/040/chiikihoukatsu/30775.html"

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

  if (screenKey !== "centerInfo") {
    card.className = "card";
  }

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
    トップ画面のみ説明文を表示
  */
  if (screenKey === "start") {

    const notice =
      document.createElement("p");

    notice.className = "notice";

    notice.innerHTML =
      "「まだ相談するほどか分からない」<br>" +
      "「何を聞けばいいか分からない」<br>" +
      "そんな段階でも利用できます。";

    notice.style.marginBottom =
      "24px";

    card.appendChild(notice);

  }

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

        if (option.concern) {
          selectedConcern = option.concern;
          savedFormValues = {};
        }

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

    savedRegion = {
      prefecture: prefectureSelect.value,
      city: citySelect.value
    };

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
    前回の選択状態を復元
  */
  if (savedRegion.prefecture) {

    prefectureSelect.value =
      savedRegion.prefecture;

    prefectureSelect.onchange();

    if (savedRegion.city) {

      citySelect.value =
        savedRegion.city;

      citySelect.onchange();

    }

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
    プルダウン生成ヘルパー
  */
  function createSelect(placeholder, options) {

    const sel =
      document.createElement("select");

    sel.className = "select";

    const ph =
      document.createElement("option");

    ph.value = "";
    ph.textContent = placeholder;
    sel.appendChild(ph);

    options.forEach(opt => {

      const o =
        document.createElement("option");

      o.value = opt;
      o.textContent = opt;
      sel.appendChild(o);

    });

    return sel;

  }

  /*
    担当地域
  */
  const areaLabel =
    document.createElement("div");

  areaLabel.textContent =
    selectedCenter.area;

  areaLabel.style.fontSize =
    "15px";

  areaLabel.style.color =
    "#78909c";

  areaLabel.style.marginBottom =
    "12px";

  card.appendChild(areaLabel);

  /*
    悩みに応じたひとこと（案2）
  */
  if (selectedConcern && concernIntros[selectedConcern]) {

    const introMsg =
      document.createElement("div");

    introMsg.textContent =
      concernIntros[selectedConcern];

    introMsg.style.fontSize =
      "13px";

    introMsg.style.color =
      "#ffffff";

    introMsg.style.background =
      "#78909c";

    introMsg.style.borderRadius =
      "8px";

    introMsg.style.padding =
      "8px 12px";

    introMsg.style.marginBottom =
      "20px";

    card.appendChild(introMsg);

  }

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

  /*
    準備ヘッダー
  */
  const prepHeader =
    document.createElement("div");

  prepHeader.textContent =
    "電話で伝える内容を準備しましょう";

  prepHeader.style.fontSize =
    "16px";

  prepHeader.style.fontWeight =
    "bold";

  prepHeader.style.marginBottom =
    "16px";

  prepHeader.style.color =
    "#37474f";

  /*
    プルダウン
  */
  const ageSelect = createSelect(
    "年齢を選択",
    ["50代", "60代", "70代", "80代", "90代以上"]
  );

  const genderSelect = createSelect(
    "性別を選択",
    ["男性", "女性"]
  );

  const sinceSelect = createSelect(
    "いつ頃から",
    [
      "数日位前から",
      "1〜2カ月位前から",
      "半年位前から",
      "1年位前から",
      "1年以上前から"
    ]
  );

  const relationshipSelect = createSelect(
    "対象者との関係",
    ["娘", "息子", "きょうだい", "親", "親戚", "知人", "近隣者"]
  );

  const livingSelect = createSelect(
    "住まい",
    ["同居", "一人暮らし","私以外の人と同居"]
  );

  const careManagerSelect = createSelect(
    "ケアマネージャー",
    ["無し", "担当者がいる"]
  );

  /*
    症状チェック項目
  */
  const checkItems = [
    {
      label: "会話がかみ合わない。言動がおかしい。",
      sentence: "会話がかみ合わない・言動がおかしい"
    },
    {
      label: "物忘れが多い。",
      sentence: "物忘れが多い"
    },
    {
      label: "食事が不定期になっている。",
      sentence: "食事が不定期になっている"
    },
    {
      label: "暴言・暴行がある。",
      sentence: "暴言・暴行がある"
    },
    {
      label: "お金の管理ができていない。",
      sentence: "お金の管理ができていない"
    }
  ];

  const checkboxRefs = [];

  const checkContainer =
    document.createElement("div");

  checkContainer.style.marginBottom =
    "20px";

  const checkLabel =
    document.createElement("div");

  checkLabel.textContent =
    "気になる症状（複数選択可）";

  checkLabel.style.fontSize =
    "15px";

  checkLabel.style.fontWeight =
    "bold";

  checkLabel.style.marginBottom =
    "12px";

  checkLabel.style.color =
    "#37474f";

  checkContainer.appendChild(checkLabel);

  checkItems.forEach(item => {

    const label =
      document.createElement("label");

    label.style.display = "flex";
    label.style.alignItems = "flex-start";
    label.style.gap = "12px";
    label.style.marginBottom = "14px";
    label.style.cursor = "pointer";
    label.style.fontSize = "15px";
    label.style.lineHeight = "1.6";

    const checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.style.marginTop = "3px";
    checkbox.style.width = "20px";
    checkbox.style.height = "20px";
    checkbox.style.flexShrink = "0";
    checkbox.style.cursor = "pointer";
    checkbox.style.accentColor = "#546e7a";

    checkboxRefs.push({
      checkbox,
      sentence: item.sentence
    });

    const text =
      document.createElement("span");

    text.textContent = item.label;

    label.appendChild(checkbox);
    label.appendChild(text);
    checkContainer.appendChild(label);

  });

  /*
    文章表示ボックス
  */
  const sentenceBox =
    document.createElement("div");

  sentenceBox.style.background = "#f5f7f8";
  sentenceBox.style.border = "1px solid #cfd8dc";
  sentenceBox.style.borderRadius = "12px";
  sentenceBox.style.padding = "16px";
  sentenceBox.style.fontSize = "15px";
  sentenceBox.style.lineHeight = "1.9";
  sentenceBox.style.marginBottom = "24px";
  sentenceBox.style.color = "#37474f";
  sentenceBox.style.whiteSpace = "pre-line";
  sentenceBox.textContent =
    "（情報を選択すると、ここに文章が表示されます）";

  /*
    電話ボタン
  */
  const callButton =
    document.createElement("button");

  callButton.className = "button";
  callButton.textContent = "📞 相談する";
  callButton.style.fontSize = "22px";
  callButton.disabled = true;
  callButton.style.background = "#b0bec5";
  callButton.style.cursor = "not-allowed";

  /*
    文章生成
  */
  function buildSentence() {

    const prefix =
      selectedConcern ? (concernPrefixes[selectedConcern] || "") : "";

    const age = ageSelect.value;
    const gender = genderSelect.value;
    const since = sinceSelect.value;
    const relationship = relationshipSelect.value;
    const living = livingSelect.value;
    const careManager = careManagerSelect.value;

    const symptoms =
      checkboxRefs
        .filter(r => r.checkbox.checked)
        .map(r => r.sentence);

    if (
      !age && !gender && !since && !relationship &&
      !living && !careManager && symptoms.length === 0
    ) {
      return prefix
        ? prefix + "\n（詳細情報を選択すると追加されます）"
        : "（情報を選択すると、ここに文章が表示されます）";
    }

    let s = prefix ? prefix + "\n対象者は" : "対象者は";

    if (age || gender) {
      s += "、" + age + gender + "で";
    }

    if (since || symptoms.length > 0) {
      s += "、";
      if (since) s += since;
      if (symptoms.length > 0) {
        s += symptoms.join("、");
      }
    }

    s += "、状態です。";

    if (living) {
      s += "住まいは" + living + "です。";
    }

    if (careManager === "無し") {
      s += "ケアマネージャーはいません。";
    } else if (careManager === "担当者がいる") {
      s += "ケアマネージャーの担当者がいます。";
    }

    if (relationship) {
      s += "私は対象者の" + relationship + "です。";
    }

    return s;

  }

  /*
    更新処理
  */
  function update() {

    savedFormValues = {
      age:          ageSelect.value,
      gender:       genderSelect.value,
      since:        sinceSelect.value,
      relationship: relationshipSelect.value,
      living:       livingSelect.value,
      careManager:  careManagerSelect.value,
      symptoms:     checkboxRefs.filter(r => r.checkbox.checked).map(r => r.sentence)
    };

    sentenceBox.textContent = buildSentence();

    const allSelected =
      !!ageSelect.value &&
      !!genderSelect.value &&
      !!sinceSelect.value &&
      !!relationshipSelect.value &&
      !!livingSelect.value &&
      !!careManagerSelect.value;

    callButton.disabled = !allSelected;

    callButton.style.background =
      allSelected ? "#2e7d32" : "#b0bec5";

    callButton.style.cursor =
      allSelected ? "pointer" : "not-allowed";

  }

  /*
    イベント設定
  */
  ageSelect.onchange = update;
  genderSelect.onchange = update;
  sinceSelect.onchange = update;
  relationshipSelect.onchange = update;
  livingSelect.onchange = update;
  careManagerSelect.onchange = update;
  checkboxRefs.forEach(r => {
    r.checkbox.onchange = update;
  });

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

  /*
    リンク
  */
  const link =
    document.createElement("a");

  const listUrl = cityLinks[selectedCenter.city] || "";
  const centerHost = (() => { try { return new URL(selectedCenter.url).hostname; } catch (e) { return ""; } })();
  const listHost   = (() => { try { return new URL(listUrl).hostname; } catch (e) { return ""; } })();
  const isExternal = centerHost !== listHost;

  link.href = selectedCenter.url;
  link.target = "_blank";
  link.textContent =
    selectedCenter.name + " について確認してみる" +
    (isExternal ? "（外部サイト）" : "");
  link.className = "button";
  link.style.display = "block";
  link.style.width = "100%";
  link.style.boxSizing = "border-box";
  link.style.textAlign = "center";
  link.style.textDecoration = "none";
  link.style.color = "white";
  link.style.background = "#78909c";
  link.style.marginTop = "16px";

  /*
    補足案内
  */
  const fallbackNotice =
    document.createElement("p");

  fallbackNotice.textContent =
    "※ページが見つからない場合は、公式の一覧をご確認ください。";

  fallbackNotice.style.fontSize = "13px";
  fallbackNotice.style.lineHeight = "1.7";
  fallbackNotice.style.marginTop = "20px";
  fallbackNotice.style.color = "#666";

  const fallbackLink =
    document.createElement("a");

  fallbackLink.href =
    cityLinks[selectedCenter.city] || "#";

  fallbackLink.target = "_blank";
  fallbackLink.textContent = "公式の一覧を確認する";
  fallbackLink.style.display = "block";
  fallbackLink.style.marginTop = "10px";

  /*
    配置
  */
  card.appendChild(tel);
  card.appendChild(prepHeader);
  card.appendChild(ageSelect);
  card.appendChild(genderSelect);
  card.appendChild(sinceSelect);
  card.appendChild(relationshipSelect);
  card.appendChild(livingSelect);
  card.appendChild(careManagerSelect);
  card.appendChild(checkContainer);
  card.appendChild(sentenceBox);
  card.appendChild(callButton);
  card.appendChild(link);
  card.appendChild(fallbackNotice);
  card.appendChild(fallbackLink);

  /*
    保存値を復元（card.appendChild後に実行）
  */
  if (savedFormValues.age)          ageSelect.value          = savedFormValues.age;
  if (savedFormValues.gender)       genderSelect.value       = savedFormValues.gender;
  if (savedFormValues.since)        sinceSelect.value        = savedFormValues.since;
  if (savedFormValues.relationship) relationshipSelect.value = savedFormValues.relationship;
  if (savedFormValues.living)       livingSelect.value       = savedFormValues.living;
  if (savedFormValues.careManager)  careManagerSelect.value  = savedFormValues.careManager;
  if (savedFormValues.symptoms) {
    savedFormValues.symptoms.forEach(s => {
      const ref = checkboxRefs.find(r => r.sentence === s);
      if (ref) ref.checkbox.checked = true;
    });
  }

  /*
    悩みに応じた事前入力（案1）— 保存値がない項目のみ適用
  */
  if (selectedConcern === "forgetfulness") {
    const already = savedFormValues.symptoms && savedFormValues.symptoms.includes("物忘れが多い");
    if (!already) {
      const cb = checkboxRefs.find(r => r.sentence === "物忘れが多い");
      if (cb) cb.checkbox.checked = true;
    }
  } else if (selectedConcern === "caregiving") {
    if (!savedFormValues.careManager)  careManagerSelect.value  = "無し";
  } else if (selectedConcern === "living_alone") {
    if (!savedFormValues.living) livingSelect.value = "一人暮らし";
  }

  update();

}

/*
  初期表示
*/
Promise.all([
  fetch("./data/tokyo.json").then(r => r.json()),
  fetch("./data/osaka.json").then(r => r.json()),
  fetch("./data/kanagawa.json").then(r => r.json()),
  fetch("./data/saitama.json").then(r => r.json()),
  fetch("./data/chiba.json").then(r => r.json()),
  fetch("./data/funabashi.json").then(r => r.json()),
  fetch("./data/kawaguchi.json").then(r => r.json())
]).then(([tokyo, osaka, kanagawa, saitama, chiba, funabashi, kawaguchi]) => {
  centers = [...tokyo, ...osaka, ...kanagawa, ...saitama, ...chiba, ...funabashi, ...kawaguchi];
  renderScreen("start");
});