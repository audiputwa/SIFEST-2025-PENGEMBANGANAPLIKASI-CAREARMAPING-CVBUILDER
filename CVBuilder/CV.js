// Toggle mobile nav menu
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    navLinks.classList.toggle("open");
});

navToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navToggle.click();
    }
});

// Main CV Builder Functionality
const { jsPDF } = window.jspdf;
const svForm = document.getElementById("svForm");
const cvPreview = document.getElementById("cvPreview");
const photoInput = document.getElementById("photo");
const downloadBtn = document.getElementById("downloadBtn");

function escapeHtml(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

function generateCVHtml(photoHTML, fullName, email, phone, careerChoice, education, skills, experience) {
    return `
        <div class="cv-header">
            ${photoHTML}
            <div class="cv-name">${escapeHtml(fullName).toUpperCase()}</div>
        </div>

        <div class="cv-section">
            <h3>Kontak</h3>
            <p>Email: ${escapeHtml(email)}<br/>
            Telepon: ${escapeHtml(phone)}</p>
        </div>

        <div class="cv-section">
            <h3>Pilihan Karir</h3>
            <p>${escapeHtml(careerChoice)}</p>
        </div>

        <div class="cv-section">
            <h3>Pendidikan</h3>
            <p>${escapeHtml(education).replace(/\n/g, "<br/>")}</p>
        </div>

        <div class="cv-section">
            <h3>Keahlian</h3>
            <p>${escapeHtml(skills).replace(/,/g, ", ").replace(/\n/g, "<br/>")}</p>
        </div>

        <div class="cv-section">
            <h3>Pengalaman Kerja</h3>
            <p>${escapeHtml(experience).replace(/\n/g, "<br/>")}</p>
        </div>
    `;
}

svForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = svForm.fullName.value.trim();
    const email = svForm.email.value.trim();
    const phone = svForm.phone.value.trim();
    const careerChoice = svForm.careerChoice.value;
    const education = svForm.education.value.trim();
    const skills = svForm.skills.value.trim();
    const experience = svForm.experience.value.trim();

    if (photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const photoHTML = `<img src="${e.target.result}" alt="Foto ${escapeHtml(fullName)}" class="cv-photo" />`;
            cvPreview.innerHTML = generateCVHtml(
                photoHTML,
                fullName,
                email,
                phone,
                careerChoice,
                education,
                skills,
                experience
            );
            cvPreview.hidden = false;
            downloadBtn.style.display = "block";
            cvPreview.scrollIntoView({ behavior: "smooth" });
        };

        reader.readAsDataURL(file);
    } else {
        const photoHTML = "";
        cvPreview.innerHTML = generateCVHtml(
            photoHTML,
            fullName,
            email,
            phone,
            careerChoice,
            education,
            skills,
            experience
        );
        cvPreview.hidden = false;
        downloadBtn.style.display = "block";
        cvPreview.scrollIntoView({ behavior: "smooth" });
    }
});

// Download PDF with improved error handling
downloadBtn.addEventListener("click", async () => {
    try {
        if (cvPreview.hidden) {
            alert("Silakan buat CV terlebih dahulu sebelum download");
            return;
        }

        // Check if jsPDF is available
        if (!window.jspdf) {
            throw new Error("jsPDF library tidak dimuat dengan benar");
        }

        const { jsPDF } = window.jspdf;
        
        const pdf = new jsPDF({
            unit: "pt",
            format: "a4",
        });

        // First try with html plugin
        await pdf.html(cvPreview, {
            margin: [40, 40, 40, 40],
            autoPaging: "text",
            width: 555,
            windowWidth: cvPreview.scrollWidth,
            callback: (pdf) => {
                pdf.save(
                    "CV_" + 
                    (svForm.fullName.value.trim().replace(/\s+/g, "_") || "Unnamed") + 
                    ".pdf"
                );
            }
        });
    } catch (error) {
        console.error("Error saat generate PDF dengan html plugin:", error);
        
        // Fallback to html2canvas if available
        if (window.html2canvas) {
            try {
                alert("Menggunakan metode alternatif untuk generate PDF...");
                const canvas = await html2canvas(cvPreview);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm'
                });
                
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("CV_" + (svForm.fullName.value.trim().replace(/\s+/g, "_") || "Unnamed") + ".pdf");
            } catch (canvasError) {
                console.error("Error saat generate PDF dengan html2canvas:", canvasError);
                alert("Gagal membuat PDF. Silakan coba lagi atau gunakan browser lain.");
            }
        } else {
            alert("Gagal membuat PDF. Silakan coba lagi atau gunakan browser lain.");
        }
    }
});