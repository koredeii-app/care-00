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
let cityLinks = {};


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
  fetch("./data/shizuoka.json").then(r => r.json()),
  fetch("./data/niigata.json").then(r => r.json()),
  fetch("./data/okayama.json").then(r => r.json()),
  fetch("./data/kumamoto.json").then(r => r.json()),
  fetch("./data/kagoshima.json").then(r => r.json()),
  fetch("./data/ishikawa.json").then(r => r.json()),
  fetch("./data/hokkaido.json").then(r => r.json()),
  fetch("./data/aomori.json").then(r => r.json()),
  fetch("./data/miyagi.json").then(r => r.json()),
  fetch("./data/aichi.json").then(r => r.json()),
  fetch("./data/fukuoka.json").then(r => r.json()),
  fetch("./data/hiroshima.json").then(r => r.json()),
  fetch("./data/iwate.json").then(r => r.json()),
  fetch("./data/okinawa.json").then(r => r.json()),
  fetch("./data/tottori.json").then(r => r.json()),
  fetch("./data/akita.json").then(r => r.json()),
  fetch("./data/yamagata.json").then(r => r.json()),
  fetch("./data/citylinks.json").then(r => r.json())
]).then(([tokyo, osaka, kanagawa, saitama, chiba, shizuoka, niigata, okayama, kumamoto, kagoshima, ishikawa, hokkaido, aomori, miyagi, aichi, fukuoka, hiroshima, iwate, okinawa, tottori, akita, yamagata, links]) => {
  cityLinks = links;
  centers = [...tokyo, ...osaka, ...kanagawa, ...saitama, ...chiba, ...shizuoka, ...niigata, ...okayama, ...kumamoto, ...kagoshima, ...ishikawa, ...hokkaido, ...aomori, ...miyagi, ...aichi, ...fukuoka, ...hiroshima, ...iwate, ...okinawa, ...tottori, ...akita, ...yamagata];
  renderScreen("start");
});