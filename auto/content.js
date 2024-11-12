function autoAnswerQuestions(answers) {
  answers.forEach(({ question, answer }) => {
    // 查找问题对应的题目块
    const questionElements = document.querySelectorAll(".Question");

    questionElements.forEach((questionElement) => {
      const subtitle = questionElement.querySelector(".SubTitle");
      if (subtitle && subtitle.textContent.trim().startsWith(question + "、")) {
        const options = questionElement.querySelectorAll(".SubOption input[type='radio']");

        options.forEach(option => {
          // 检查选项的 title 属性是否包含正确答案
          if (option.getAttribute("title").startsWith(answer)) {
            option.click();  // 自动选择正确答案
          }
        });
      }
    });
  });
}
