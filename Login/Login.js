 const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");

    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      links.classList.toggle("open");
    });