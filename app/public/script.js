function showForm(formId) {
  const forms = document.querySelectorAll(".form");
  forms.forEach((form) => form.classList.remove("active"));

  const activeForm = document.getElementById(formId);
  if (activeForm) {
    activeForm.classList.add("active");
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const userName = document.getElementById("registerUserName").value;
  const fullName = document.getElementById("registerFullName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const data = {
    userName,
    fullName,
    email,
    password,
  };

  try {
    const response = await fetch("http://localhost:8000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    document.getElementById("message").innerText =
      "Registration successful: " + JSON.stringify(result);
    console.log("Registration successful:", result);
  } catch (error) {
    console.error("Error during registration:", error);
    document.getElementById("message").innerText =
      "Registration failed! Please try again.";
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const userName = document.getElementById("loginUserName").value;
  const password = document.getElementById("loginPassword").value;

  try {
    // Mengirim permintaan POST ke backend untuk login
    const response = await fetch("http://localhost:8000/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });

    // Mengecek respons dari server
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    // Memeriksa apakah login berhasil
    if (result.success) {
      console.log("Login successful:", result);
      alert("Login berhasil!");

      // Tampilkan form reset password setelah login berhasil
      showForm("resetForm");
    } else {
      // Jika login gagal
      alert(result.message || "Login gagal. Periksa kredensial Anda.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed. Please try again.");
  }
}
