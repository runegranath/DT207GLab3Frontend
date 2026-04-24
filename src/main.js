import "./style.css";

async function getJobs() {
  try {
    const response = await fetch("https://dt207glab3backend.onrender.com/jobs");
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

    // väntar på addJob innan vi gör något annat
    await addJob(newJob);
  });
}

async function addJob(newJob) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.innerText = "";

  try {
    // Fetch-anrop
    const response = await fetch(
      "https://dt207glab3backend.onrender.com/jobs",
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

    // Lägg till knappen i sista cellen
    row.querySelector("td:last-child")?.appendChild(deleteBtn);

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
