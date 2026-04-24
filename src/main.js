import "./style.css";

async function getJobs() {
  try {
    const response = await fetch(`https://dt207glab3backend.onrender.com/jobs`); // ");
    const jobs = await response.json();
    displayJobs(jobs);
  } catch (error) {
    console.error("Kunde inte hämta jobb:", error);
  }
}

const jobForm = document.getElementById("jobForm");

if (jobForm) {
  jobForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Hindrar sidan från att laddas om

    // Samla in datan från formuläret
    const newJob = {
      companyname: document.getElementById("companyname").value,
      jobtitle: document.getElementById("jobtitle").value,
      location: document.getElementById("location").value,
      fictive: document.getElementById("fictive").checked,
    };
    if (window.editingId) {
      // Uppdatera jobb om det finns ett jobbID här
      await updateJob(window.editingId, newJob);
    } else {
      // väntar på addJob innan vi gör något annat
      await addJob(newJob);
    }
  });
}

async function addJob(newJob) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.innerText = "";

  try {
    // Fetch-anrop
    const response = await fetch(
      `https://dt207glab3backend.onrender.com/jobs`, 
      {
        // Skicka data som JSON
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      },
    );

    if (response.ok) {
      // Gå tillbaka till startsidan eller uppdatera listan
      window.location.href = "index.html";
    } else {
      errorDiv.innerText = "Något gick fel, kunde inte lägga till jobb...";
    }
  } catch (error) {
    console.error("Kunde inte lägga till jobb:", error);
  }
}

const myJobs = getJobs();

function displayJobs(jobs) {
  const tableBody = document.getElementById("jobBody");

  // Om tabellkroppen inte finns, avbryt
  if (!tableBody) return;

  jobBody.innerHTML = "";

  jobs.forEach((job) => {
    const row = document.createElement("tr");

    // Fyll med objektdata
    row.innerHTML = `
            <td>${job.companyname}</td>
            <td>${job.jobtitle}</td>
            <td>${job.location}</td>
            <td>${job.fictive ? "Ja" : "Nej"}</td>

            <td></td> 
        `;

    // Skapa radera-knapp
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Radera";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      deleteJob(job._id); // _id för mongoDB
    });

    // Redigera-knapp
    const editBtn = document.createElement("button");
    editBtn.textContent = "Ändra";
    editBtn.className = "edit-btn";

    editBtn.addEventListener("click", () => {
      editJob(job._id);
    });

    // Lägg till knappar i sista cellen
    row.querySelector("td:last-child")?.appendChild(deleteBtn);
    row.querySelector("td:last-child")?.appendChild(editBtn);

    // Lägg till raden i tabellen
    tableBody.appendChild(row);
  });
}

async function deleteJob(id) {
  // Bekräfta radering
  if (confirm("Vill du verkligen radera?")) {
    // Skicka DELETE-förfrågan
    await fetch(`https://dt207glab3backend.onrender.com/jobs/${id}`, {
      method: "DELETE",
    });

    // Uppdatera listan efter radering
    getJobs();
  }
}

// Navigera till add.html med ID i query string för redigering vid klick på ändra-knappen
function editJob(id) {
  window.location.href = `add.html?edit=${id}`;
}

// Förbered formuläret för redigering
async function prepareEdit(id) {
  try {
    // Hämta det specifika jobbet
    const response = await fetch(`https://dt207glab3backend.onrender.com/jobs/${id}`);

    // vid felaktigt svar
    if (!response.ok) throw new Error("Kunde inte hämta jobb");

    const job = await response.json();

    // Fyll i formulärfälten
    document.getElementById("companyname").value = job.companyname;
    document.getElementById("jobtitle").value = job.jobtitle;
    document.getElementById("location").value = job.location;
    document.getElementById("fictive").checked = job.fictive;

    // id får en global variabel
    window.editingId = id;

    const submitBtn = document.querySelector("#jobForm button");
    if (submitBtn) {
      submitBtn.textContent = "Uppdatera jobb"; // Ändra knapptexten för att visa att det är en uppdatering
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateJob(id, updatedJobData) {
  try {
    await fetch(`https://dt207glab3backend.onrender.com/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJobData), // skickar in nya värden från formuläret
    });

    // Rensa globala variabler med null och återställ formuläret
    window.editingId = null;
    jobForm.reset();
    document.querySelector("#jobForm button").textContent = "Spara jobb";

    window.location.href = "index.html"; // redirect till index
  } catch (error) {
    console.error("Kunde inte spara ändringar:", error);
  }
}

function init() {
  const urlParams = new URLSearchParams(window.location.search); // Hämta ID från query string
  const editId = urlParams.get("edit");

  // har vi ett editID i query string och ett formulär på så förbered redigering
  if (editId && document.getElementById("jobForm")) {
    prepareEdit(editId);
  }
}

init();
