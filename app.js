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
      },

      {
        text:
          "家族に迷惑をかけたくない",

        description:
          "お金や病気のことで心配をかけたくない",

        color:
          "#1565c0",

        next:
          "regionSelect",

        concern:
          "family_burden"
      },

      {
        text:
          "自分１人だけだから、今後が心配",

        description:
          "病気やケガなど、今後のことがどうすればいいか分からない",

        color:
          "#2e7d32",

        next:
          "regionSelect",

        concern:
          "solo_future"
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
  unsure:        "「まだ早いかな」という段階が、一番相談しやすい時期です",
  family_burden: "一人で抱え込まず、まず話してみることから始められます",
  solo_future:   "将来への備えについて、具体的な選択肢を一緒に考えられます"
};

const concernPrefixes = {
  forgetfulness: "認知症の様な感じがするので、どうすればいいか相談をしたいです。",
  caregiving:    "介護で疲れているので、何か支援が無いか相談したいです。",
  living_alone:  "親の生活が心配で、何か見守りや支援が無いか相談したいです。",
  unsure:        "まだ大変な状態ではないけれど、今後に備えて相談したいです。",
  family_burden: "家族に心配をかけたくないのですが、今後の事で相談したいです。",
  solo_future:   "今後の事で相談したいです。"
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

    const isSoloFuture =
      screenKey === "regionSelect" && selectedConcern === "solo_future";

    description.textContent =
      isSoloFuture
        ? "何を聞けばいいか分からなくても大丈夫です。"
        : screen.description;

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
    地域（検索ボックス＋リスト）
  */
  const areaWrapper = document.createElement("div");
  areaWrapper.className = "area-list-wrapper";
  areaWrapper.style.display = "none";

  const areaSearch = document.createElement("input");
  areaSearch.type = "text";
  areaSearch.className = "area-search";
  areaSearch.placeholder = "地域を検索";

  const areaList = document.createElement("div");
  areaList.className = "area-list";

  areaWrapper.appendChild(areaSearch);
  areaWrapper.appendChild(areaList);

  let currentAreas = [];

  function renderAreaItems(areas) {
    areaList.innerHTML = "";
    areas.forEach(area => {
      const item = document.createElement("div");
      item.className = "area-item";
      item.textContent = area;
      item.onclick = () => {
        const found = centers.find(c =>
          c.prefecture === prefectureSelect.value &&
          c.city === citySelect.value &&
          c.area === area
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
      areaList.appendChild(item);
    });
  }

  function buildAreaList(areas) {
    currentAreas = areas;
    areaSearch.value = "";
    renderAreaItems(areas);
    areaWrapper.style.display = areas.length > 0 ? "block" : "none";
  }

  areaSearch.oninput = () => {
    const q = areaSearch.value;
    renderAreaItems(q ? currentAreas.filter(a => a.includes(q)) : currentAreas);
  };

  /*
    初期表示
  */
  prefectureSelect.innerHTML =
    `<option value="">都道府県を選択</option>`;

  citySelect.innerHTML =
    `<option value="">市区町村を選択</option>`;

  /*
    都道府県一覧
  */
  const prefectureOrder = [
    "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
    "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
    "新潟県","富山県","石川県","福井県","山梨県","長野県",
    "岐阜県","静岡県","愛知県","三重県",
    "滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
    "鳥取県","島根県","岡山県","広島県","山口県",
    "徳島県","香川県","愛媛県","高知県",
    "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
  ];
  const coveredPrefectures = new Set(centers.map(c => c.prefecture));
  const prefectures = prefectureOrder.filter(p => coveredPrefectures.has(p));

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

    areaWrapper.style.display = "none";
    areaList.innerHTML = "";
    areaSearch.value = "";

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

    buildAreaList(areas);

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

  card.appendChild(areaWrapper);

  const areaHint = document.createElement("p");
  areaHint.textContent =
    "該当地域が見つからない場合、その近くの地域を選択して検索してみてください。";
  areaHint.style.fontSize = "13px";
  areaHint.style.color = "#90a4ae";
  areaHint.style.lineHeight = "1.6";
  areaHint.style.marginTop = "8px";
  card.appendChild(areaHint);

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
    必須ラベル付きプルダウンラッパー
  */
  function wrapRequired(selectEl, labelText) {

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "4px";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "4px";
    row.style.marginBottom = "2px";

    const mark = document.createElement("span");
    mark.textContent = "※";
    mark.style.color = "#c62828";
    mark.style.fontWeight = "bold";
    mark.style.fontSize = "13px";

    const lbl = document.createElement("span");
    lbl.textContent = labelText;
    lbl.style.fontSize = "13px";
    lbl.style.fontWeight = "bold";
    lbl.style.color = "#546e7a";

    row.appendChild(mark);
    row.appendChild(lbl);
    wrapper.appendChild(row);
    wrapper.appendChild(selectEl);

    return wrapper;

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
  const callPrompt =
    document.createElement("div");

  callPrompt.textContent =
    "今すぐ相談したい方は、下の電話番号を押してください";

  callPrompt.style.fontSize = "14px";
  callPrompt.style.fontWeight = "bold";
  callPrompt.style.color = "#1565c0";
  callPrompt.style.marginBottom = "10px";

  const phoneSection =
    document.createElement("div");

  phoneSection.style.marginBottom =
    "28px";

  const phoneEntries =
    selectedCenter.phones ||
    [{ label: "電話番号", number: selectedCenter.tel }];

  phoneEntries.forEach((p, i) => {

    const row =
      document.createElement("div");

    const telLink =
      document.createElement("a");

    telLink.href = "tel:" + p.number;
    telLink.textContent =
      p.label + " : " + p.number;

    telLink.style.fontSize = "20px";
    telLink.style.fontWeight = "bold";
    telLink.style.color = "#0277bd";
    telLink.style.textDecoration = "none";
    telLink.style.display = "inline-block";
    telLink.style.padding = "6px 0";

    row.appendChild(telLink);

    if (i < phoneEntries.length - 1) {
      row.style.marginBottom = "4px";
    }

    phoneSection.appendChild(row);

  });

  const prepSeparator =
    document.createElement("div");

  prepSeparator.textContent =
    "▼ 事前に整理したい方はこちら";

  prepSeparator.style.fontSize = "17px";
  prepSeparator.style.color = "#78909c";
  prepSeparator.style.textAlign = "center";
  prepSeparator.style.padding = "12px 0";
  prepSeparator.style.marginBottom = "16px";
  prepSeparator.style.borderTop = "1px solid #eceff1";
  prepSeparator.style.borderBottom = "1px solid #eceff1";

  /*
    プルダウン
  */
  const ageSelect = createSelect(
    "対象者の年齢を選択",
    ["50代", "60代", "70代", "80代", "90代以上"]
  );

  const genderSelect = createSelect(
    "対象者の性別を選択",
    ["男性", "女性"]
  );

  const sinceSelect = createSelect(
    "いつ頃からですか？",
    [
      "数日位前から",
      "1〜2カ月位前から",
      "半年位前から",
      "1年位前から",
      "1年以上前から"
    ]
  );

  const relationshipSelect = createSelect(
    "対象者との関係は？",
    ["本人", "娘", "息子", "きょうだい", "親", "親戚", "知人", "近隣者"]
  );

  const livingSelect = createSelect(
    "住まいの状況は？",
    ["同居", "一人暮らし","私以外の人と同居"]
  );

  const careManagerSelect = createSelect(
    "ケアマネージャーはいますか？",
    ["なし", "担当者がいる"]
  );

  const careAssessmentSelect = createSelect(
    "介護認定はありますか？",
    ["なし", "要支援1", "要支援2", "要介護1", "要介護2", "要介護3", "要介護4", "要介護5"]
  );

  /*
    症状チェック項目
  */
  const checkItems = [
    {
      label: "会話がかみ合わない。言動がおかしい。",
      sentence: "会話がかみ合わない、言動がおかしい"
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
    },
    {
      label: "色々と不安になっている。",
      sentence: "色々と不安になっている"
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
    病歴テキストボックス
  */
  function createMedicalInput(labelText) {

    const wrapper =
      document.createElement("div");

    wrapper.style.marginBottom = "16px";

    const lbl =
      document.createElement("div");

    lbl.textContent = labelText;
    lbl.style.fontSize = "14px";
    lbl.style.fontWeight = "bold";
    lbl.style.color = "#37474f";
    lbl.style.marginBottom = "6px";

    const input =
      document.createElement("input");

    input.type = "text";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.style.padding = "10px 12px";
    input.style.fontSize = "15px";
    input.style.border = "1px solid #cfd8dc";
    input.style.borderRadius = "8px";
    input.style.color = "#37474f";
    input.style.background = "#fafafa";

    wrapper.appendChild(lbl);
    wrapper.appendChild(input);

    return { wrapper, input };

  }

  const pastIllness =
    createMedicalInput("以前かかって完治した病気");

  const ongoingIllness =
    createMedicalInput("治療を継続している病気");

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
    const careAssessment = careAssessmentSelect.value;

    const symptoms =
      checkboxRefs
        .filter(r => r.checkbox.checked)
        .map(r => r.sentence);

    if (
      !age && !gender && !since && !relationship &&
      !living && !careManager && !careAssessment && symptoms.length === 0
    ) {
      return prefix
        ? prefix + "\n（詳細情報を選択すると追加されます）"
        : "（情報を選択すると、ここに文章が表示されます）";
    }

    const isSelf =
      selectedConcern === "family_burden" ||
      selectedConcern === "solo_future";

    let s = prefix ? prefix + "\n" : "";

    if (!isSelf) s += "対象者は";

    if (age || gender) {
      s += (isSelf ? "" : "、") + age + gender + "で";
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

    if (careManager === "なし") {
      s += "ケアマネージャーはいません。";
    } else if (careManager === "担当者がいる") {
      s += "ケアマネージャーの担当者がいます。";
    }

    if (careAssessment === "なし") {
      s += "介護認定はありません。";
    } else if (careAssessment) {
      s += "介護認定は" + careAssessment + "です。";
    }

    if (relationship && relationship !== "本人") {
      s += "私は対象者の" + relationship + "です。";
    }

    const pastIllnessVal = pastIllness.input.value.trim();
    const ongoingIllnessVal = ongoingIllness.input.value.trim();
    if (pastIllnessVal) {
      s += "\n以前かかって完治した病気は" + pastIllnessVal + "です。";
    }
    if (ongoingIllnessVal) {
      s += "\n現在治療中の病気は" + ongoingIllnessVal + "です。";
    }

    return s;

  }

  /*
    更新処理
  */
  function update() {

    savedFormValues = {
      age:            ageSelect.value,
      gender:         genderSelect.value,
      since:          sinceSelect.value,
      relationship:   relationshipSelect.value,
      living:         livingSelect.value,
      careManager:    careManagerSelect.value,
      careAssessment: careAssessmentSelect.value,
      symptoms:       checkboxRefs.filter(r => r.checkbox.checked).map(r => r.sentence),
      pastIllness:    pastIllness.input.value.trim(),
      ongoingIllness: ongoingIllness.input.value.trim()
    };

    sentenceBox.textContent = buildSentence();

    const allSelected =
      !!ageSelect.value &&
      !!genderSelect.value &&
      !!sinceSelect.value &&
      !!relationshipSelect.value &&
      !!livingSelect.value &&
      !!careManagerSelect.value &&
      !!careAssessmentSelect.value;

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
  careAssessmentSelect.onchange = update;
  checkboxRefs.forEach(r => {
    r.checkbox.onchange = update;
  });
  pastIllness.input.oninput = update;
  ongoingIllness.input.oninput = update;

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

  link.target = "_blank";
  link.rel = "noopener noreferrer";
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

  fallbackLink.target = "_blank";
  fallbackLink.rel = "noopener noreferrer";
  fallbackLink.textContent = "公式の一覧を確認する";
  fallbackLink.style.display = "block";
  fallbackLink.style.marginTop = "10px";

  /*
    配置
  */
  const requiredNote = document.createElement("p");
  requiredNote.innerHTML =
    '<span style="color:#c62828;font-weight:bold;">※</span> は必須項目です。すべて入力すると「相談する」ボタンが有効になります。';
  requiredNote.style.fontSize = "13px";
  requiredNote.style.color = "#78909c";
  requiredNote.style.lineHeight = "1.6";
  requiredNote.style.marginBottom = "16px";

  card.appendChild(callPrompt);
  card.appendChild(phoneSection);
  card.appendChild(prepSeparator);
  card.appendChild(requiredNote);
  card.appendChild(wrapRequired(ageSelect,          "対象者の年齢"));
  card.appendChild(wrapRequired(genderSelect,       "対象者の性別"));
  card.appendChild(wrapRequired(sinceSelect,        "いつ頃から"));
  card.appendChild(wrapRequired(relationshipSelect, "対象者との関係"));
  card.appendChild(wrapRequired(livingSelect,       "住まいの状況"));
  card.appendChild(wrapRequired(careManagerSelect,  "ケアマネージャー"));
  card.appendChild(wrapRequired(careAssessmentSelect, "介護認定"));
  card.appendChild(checkContainer);
  card.appendChild(pastIllness.wrapper);
  card.appendChild(ongoingIllness.wrapper);
  card.appendChild(sentenceBox);
  card.appendChild(callButton);
  if (selectedCenter.url) {
    link.href = selectedCenter.url;
    card.appendChild(link);
  }

  if (cityLinks[selectedCenter.city]) {
    fallbackLink.href = cityLinks[selectedCenter.city];
    card.appendChild(fallbackNotice);
    card.appendChild(fallbackLink);
  }

  /*
    保存値を復元（card.appendChild後に実行）
  */
  if (savedFormValues.age)          ageSelect.value          = savedFormValues.age;
  if (savedFormValues.gender)       genderSelect.value       = savedFormValues.gender;
  if (savedFormValues.since)        sinceSelect.value        = savedFormValues.since;
  if (savedFormValues.relationship) relationshipSelect.value = savedFormValues.relationship;
  if (savedFormValues.living)       livingSelect.value       = savedFormValues.living;
  if (savedFormValues.careManager)    careManagerSelect.value    = savedFormValues.careManager;
  if (savedFormValues.careAssessment) careAssessmentSelect.value = savedFormValues.careAssessment;
  if (savedFormValues.pastIllness)    pastIllness.input.value    = savedFormValues.pastIllness;
  if (savedFormValues.ongoingIllness) ongoingIllness.input.value = savedFormValues.ongoingIllness;
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
    if (!savedFormValues.careManager)  careManagerSelect.value  = "なし";
  } else if (selectedConcern === "living_alone") {
    if (!savedFormValues.living) livingSelect.value = "一人暮らし";
  } else if (
    selectedConcern === "family_burden" ||
    selectedConcern === "solo_future"
  ) {
    if (!savedFormValues.living)       livingSelect.value       = "一人暮らし";
    if (!savedFormValues.relationship) relationshipSelect.value = "本人";
  }

  update();

}

/*
  初期表示
*/
app.innerHTML = `
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px;">
    <div style="width:44px;height:44px;border:4px solid #eceff1;border-top-color:#546e7a;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
    <div style="color:#90a4ae;font-size:14px;">読み込み中...</div>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
`;

Promise.all([
  fetch("https://koredeii-app.github.io/care-data/data/tokyo.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/osaka.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/kanagawa.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/saitama.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/chiba.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/shizuoka.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/niigata.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/okayama.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/kumamoto.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/kagoshima.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/ishikawa.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/hokkaido.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/aomori.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/miyagi.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/aichi.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/fukuoka.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/hiroshima.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/iwate.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/okinawa.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/tottori.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/akita.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/yamagata.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/fukui.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/shimane.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/hyogo.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/kagawa.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/nagasaki.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/ehime.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/oita.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/miyazaki.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/tokushima.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/kochi.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/saga.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/toyama.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/nagano.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/yamanashi.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/yamaguchi.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/fukushima.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/ibaraki.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/tochigi.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/gunma.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/gifu.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/mie.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/shiga.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/kyoto.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/nara.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/wakayama.json").then(r => r.json()),
  fetch("https://koredeii-app.github.io/care-data/data/citylinks.json").then(r => r.json())
]).then(([tokyo, osaka, kanagawa, saitama, chiba, shizuoka, niigata, okayama, kumamoto, kagoshima, ishikawa, hokkaido, aomori, miyagi, aichi, fukuoka, hiroshima, iwate, okinawa, tottori, akita, yamagata, fukui, shimane, hyogo, kagawa, nagasaki, ehime, oita, miyazaki, tokushima, kochi, saga, toyama, nagano, yamanashi, yamaguchi, fukushima, ibaraki, tochigi, gunma, gifu, mie, shiga, kyoto, nara, wakayama, links]) => {
  cityLinks = links;
  centers = [...tokyo, ...osaka, ...kanagawa, ...saitama, ...chiba, ...shizuoka, ...niigata, ...okayama, ...kumamoto, ...kagoshima, ...ishikawa, ...hokkaido, ...aomori, ...miyagi, ...aichi, ...fukuoka, ...hiroshima, ...iwate, ...okinawa, ...tottori, ...akita, ...yamagata, ...fukui, ...shimane, ...hyogo, ...kagawa, ...nagasaki, ...ehime, ...oita, ...miyazaki, ...tokushima, ...kochi, ...saga, ...toyama, ...nagano, ...yamanashi, ...yamaguchi, ...fukushima, ...ibaraki, ...tochigi, ...gunma, ...gifu, ...mie, ...shiga, ...kyoto, ...nara, ...wakayama];
  centers.forEach(c => {
    if (!c.area && (c.name || "").includes("基幹")) c.area = "基幹型";
  });
  renderScreen("start");

  // Android バックボタン対応（Capacitor 環境のみ）
  if (window.Capacitor) {
    window.Capacitor.Plugins.App.addListener("backButton", () => {
      if (historyStack.length > 0) {
        const previous = historyStack.pop();
        renderScreen(previous);
      } else {
        window.Capacitor.Plugins.App.exitApp();
      }
    });
  }
});