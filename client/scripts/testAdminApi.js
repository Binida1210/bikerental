(async function () {
  try {
    const auth = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "adminpass" }),
    });
    const authJson = await auth.json();
    const token = authJson.token;
    console.log("token length", token?.length || "none");
    const endpoints = [
      "/admin/posts",
      "/admin/reports",
      "/admin/users",
      "/admin/stations",
    ];
    for (const ep of endpoints) {
      const res = await fetch("http://localhost:4000" + ep, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(ep, "->", res.status);
      const txt = await res.text();
      console.log(txt.slice(0, 400));
    }

    // Try an update to a report (if exists) to make sure PUTs work
    const testReportId = 4;
    console.log(
      "\nAttempting to update report",
      testReportId,
      "-> status: closed"
    );
    const put = await fetch(
      "http://localhost:4000/admin/reports/" + testReportId,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "closed" }),
      }
    );
    console.log("PUT ->", put.status);
    console.log(await put.text());
  } catch (e) {
    console.error(e);
  }
})();
