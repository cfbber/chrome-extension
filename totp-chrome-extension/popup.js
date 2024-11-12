
document.getElementById("generate").addEventListener("click", function() {
    const secret = document.getElementById("secret").value.trim();
    if (!secret) {
        document.getElementById("result").innerText = "请提供有效的密钥。";
        return;
    }
	var totp = new jsOTP.totp();
	const otpv = totp.getOtp(secret);  

		
    document.getElementById("result").innerText = `当前口令: ${otpv}`;
	
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: function (value) {
					//alert(otp)
					console.log(value)
                    const inputElement = document.querySelector('input#otp');
                    if (inputElement) {		
                          inputElement.value = value;
						  inputElement.setAttribute('value', value);
                        //console.log('输入框值已修改为'+ value);
						
						// 创建并触发事件
						const event = new Event('input', { bubbles: true });
						inputElement.dispatchEvent(event);
					  const button = Array.from(document.querySelectorAll('button[type="submit"]'))
									.find(btn => btn.textContent.includes('确'));; // 选择按钮
					

					  if (button) {
						button.click(); // 触发点击事件
					  }
					  
                    } else {
                        console.log('未找到 id 为 otp 的输入框');
                    }
                },
				args: [otpv]
            });
        });

});

document.addEventListener('DOMContentLoaded', function () {
    const secretInput = document.getElementById('secret');
    const saveButton = document.getElementById('generate');
    const displaySecret = document.getElementById('secret');

    // 从 cookie 获取密钥
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const savedSecret = getCookie('totpSecret');
    if (savedSecret) {
        secretInput.value = savedSecret;
        displaySecret.textContent = `已保存的密钥：${savedSecret}`;
    }

    // 保存密钥到 cookie
    saveButton.addEventListener('click', function () {
        const secret = secretInput.value;
        document.cookie = `totpSecret=${secret}; path=/; max-age=31536000`; // 1 年有效期
        displaySecret.textContent = `已保存的密钥：${secret}`;
		
		console.log('-sdfsd'+ secret);
		console.log(document.cookie);

    });
});

