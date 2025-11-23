(async function () {
  try {
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "adminpass" }),
    });
    const t = await res.text();
    console.log("STATUS", res.status);
    console.log(t);
  } catch (e) {
    console.error(e);
  }
})();
