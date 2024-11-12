function autoAnswerMultipleChoice(answers) {
  answers.forEach(({ start, end, answer }) => {
    const questionElements = document.querySelectorAll(".Question");

    for (let questionNumber = start; questionNumber <= end; questionNumber++) {
      const questionElement = Array.from(questionElements).find(q =>
        q.querySelector(".SubTitle") && q.querySelector(".SubTitle").textContent.trim().startsWith(questionNumber + "、")
      );

      if (questionElement) {
        const options = Array.from(questionElement.querySelectorAll(".SubOption.SubCheckBox"));

        options.forEach(option => {
          const optionInput = option.querySelector("input[type='checkbox']");
          const optionTitle = option.querySelector("input[type='checkbox']").title; // 获取选项的 title（如 A、B、C、D）

          if (optionInput && answer.includes(optionTitle.charAt(0))) {
            option.style.backgroundColor = "green"; // 正确选项背景为绿色
            optionInput.checked = true;  // 勾选该选项
            option.dispatchEvent(new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window
            }));
          }
        });
      }
    }
  });
}
