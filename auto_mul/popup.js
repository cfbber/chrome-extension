document.getElementById("submitAnswer").addEventListener("click", () => {
  const answerInput = document.getElementById("answerInput").value.trim();

  if (!answerInput) {
    alert("请输入答案！");
    return;
  }

  const answers = parseAnswers(answerInput); // 解析答案输入
  console.log("解析后的答案：", JSON.stringify(answers, null, 2)); // 使用 JSON.stringify 输出答案

  // 获取当前活动的标签页
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("未找到活动标签页");
      return;
    }

    // 执行脚本来处理多选题
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: autoAnswerMultipleChoice,
      args: [answers] // 传递答案
    }).catch(error => console.error("执行脚本时出错：", error));
  });
});

// 解析多选题答案格式，如 1-5 AB,ABD,ABC,BCD,ACD
function parseAnswers(answerString) {
  const lines = answerString.split("\n").map(line => line.trim()); // 按行拆分并去掉多余空格
  const answers = {};

  lines.forEach(line => {
    if (line) {
      const [rangePart, options] = line.split(" "); // 分割题号范围和答案部分
      const [start, end] = rangePart.split("-").map(Number); // 解析题号范围

      const optionsArr = options.split(","); // 将多个答案拆分成数组

      // 给每个题号分配对应的答案
      for (let i = start; i <= end; i++) {
        answers[i] = optionsArr[i - start]; // 根据题号分配对应的答案
      }
    }
  });

  return answers;
}


// 自动处理多选题的函数
function autoAnswerMultipleChoice(answers) {
  // 获取所有包含 .SubOption.SubCheckBox 的 div 元素
  const questions = document.querySelectorAll(".Question");

  // 遍历每个 .Question 元素，检查它是否包含 .SubOption.SubCheckBox
  questions.forEach(question => {
    // 检查这个问题是否包含多选框的子元素
    if (question.querySelector(".SubOption.SubCheckBox")) {
      // 获取该题的所有选项
      const options = question.querySelectorAll(".SubOption.SubCheckBox");

      // 获取该题的题号
      const questionNumber = parseInt(question.querySelector(".SubTitle").textContent.trim().split("、")[0]);

      // 获取该题的正确答案
      const correctOptionKeys = answers[questionNumber] || "";

      console.log(questionNumber + ":" + correctOptionKeys);

      // 遍历每个选项，根据是否正确来改变颜色

      options.forEach(option => {
        const inputElement = option.querySelector("input");
        const optionTitle = inputElement.title.trim();
        const optionLetter = optionTitle.charAt(0);
        // 判断是否为正确选项
            if (correctOptionKeys.includes(optionLetter)) {
          option.style.backgroundColor = "lightgreen"; // 正确选项变绿色
//          inputElement.checked = true; // 模拟选择该选项
        } else {
          option.style.backgroundColor = ""; // 其他选项恢复原状
//          inputElement.checked = false; // 确保其他选项不被选中
        }
      });
    }
  });
}
