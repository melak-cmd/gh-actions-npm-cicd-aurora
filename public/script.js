document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("objects-list");
  const refreshBtn = document.getElementById("refresh-btn");

  const modal = document.getElementById("item-modal");
  const closeModal = document.getElementById("close-modal");
  const modalName = document.getElementById("modal-name");
  const modalId = document.getElementById("modal-id");
  const modalData = document.getElementById("modal-data");

  // Pretty formatter for objects
  function renderObjectData(data) {
    if (!data || typeof data !== "object") return "<em>No data</em>";

    return Object.entries(data)
      .map(([key, value]) => {
        return `
          <div class="data-row">
            <span class="data-key">${key}:</span>
            <span class="data-value">${value}</span>
          </div>
        `;
      })
      .join("");
  }

  async function fetchObjects() {
    const res = await fetch("/api/objects");
    const objects = await res.json();

    listEl.innerHTML = "";

    objects.forEach(obj => {
      const li = document.createElement("li");

      // Background color from data.color (if exists)
      if (obj.data && obj.data.color) {
        li.style.backgroundColor = obj.data.color;
      }

      li.innerHTML = `
        <div class="object-id">ID: ${obj.id}</div>
        <div class="object-name">${obj.name}</div>
        <div class="object-data">
          ${renderObjectData(obj.data)}
        </div>
      `;

      li.addEventListener("click", () => {
        modal.style.display = "block";

        modalName.textContent = obj.name;
        modalId.textContent = `ID: ${obj.id}`;
        modalData.innerHTML = renderObjectData(obj.data);

        // Modal background color
        const modalBox = modal.querySelector(".modal-content");
        modalBox.style.backgroundColor = obj.data?.color || "#fff";
      });

      listEl.appendChild(li);
    });
  }

  refreshBtn.addEventListener("click", fetchObjects);
  
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Initial load
  fetchObjects();
});
