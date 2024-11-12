document.getElementById("submitAnswer").addEventListener("click", () => {
  const answerInput = document.getElementById("answerInput").value.trim();

  // 检查输入是否为空
  if (!answerInput) {
    alert("请输入至少一行答案！");
    return;
  }

  // 获取单选或多选的选择值
  const answerType = document.querySelector('input[name="answerType"]:checked').value;

  // 解析多行输入，格式为 "m-n aaa"
  const answers = answerInput.split("\n").map(line => {
    const [range, answer] = line.trim().split(" ");
    if (!range || !answer) return null;

    const [start, end] = range.split("-").map(Number);
    if (isNaN(start) || isNaN(end) || answer.length !== (end - start + 1)) return null;

    return { start, end, answer };
  }).filter(Boolean); // 过滤无效行

  if (answers.length === 0) {
    alert("输入格式错误，请检查并重新输入！");
    return;
  }

  // 将解析后的答案和选择的答题类型发送给内容脚本
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: autoAnswerQuestions,
      args: [answers, answerType]
    });
  });
});

function autoAnswerQuestions(answers, answerType) {
  answers.forEach(({ start, end, answer }) => {
    const questionElements = document.querySelectorAll(".Question");

    // 确保处理题目范围内的所有题目
    for (let questionNumber = start; questionNumber <= end; questionNumber++) {
      const questionElement = Array.from(questionElements).find(q =>
        q.querySelector(".SubTitle") && q.querySelector(".SubTitle").textContent.trim().startsWith(questionNumber + "、")
      );

      if (questionElement) {
        const options = Array.from(questionElement.querySelectorAll(".SubOption"));

        // 选择答案
        const answerChar = answer[questionNumber - start]; // 对应的答案字母
        const optionIndex = "ABCD".indexOf(answerChar);

        if (optionIndex !== -1 && optionIndex < options.length) {
          const option = options[optionIndex];
          const optionInput = option.querySelector("input[type='radio']");

            const mouseEvent = new MouseEvent('click', {
              bubbles: true,       // 事件是否冒泡
              cancelable: true,    // 是否可以取消事件
              view: window,        // 窗口对象
              button: 0            // 按钮类型，0 代表左键
            });

          if (answerType === 'single') {
            // 单选逻辑：选择正确的单选答案
            if (optionInput) {
              option.style.backgroundColor = "lightgray";  // 改为绿色
//              optionInput.checked = true;
//              option.dispatchEvent(new MouseEvent("click", {
//                bubbles: true,
//                cancelable: true,
//                view: window
//              }));
            console.log(optionInput.parentElement);

            optionInput.parentElement.dispatchEvent(mouseEvent);
            }
          } else if (answerType === 'multiple') {
            // 多选逻辑：选择正确的多选答案
            const optionInputCheckbox = option.querySelector("input[type='checkbox']");

            if (optionInputCheckbox) {
              option.style.backgroundColor = "green";  // 改为绿色
              optionInputCheckbox.checked = true;
              option.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window
              }));
            }
          }
        }
      }
    }
  });
}
