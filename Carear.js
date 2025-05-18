// Toggle mobile nav menu
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('open');
    });

    navToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navToggle.click();
      }
    });

    // Career card selection logic
    (function() {
      const cards = document.querySelectorAll('.career-card');
      const descPanel = document.getElementById('career-desc');

      const descriptions = {
        webdeveloper: `Web Developer bertugas membangun dan memelihara situs web yang responsif dan interaktif. Teknologi umum yang digunakan meliputi HTML, CSS, JavaScript, dan framework modern seperti React, Vue, dan Angular. Profesi ini membutuhkan kreativitas dan logika programming yang kuat.`,
        appsdeveloper: `Apps Developer fokus pada pembuatan aplikasi mobile yang berjalan di platform Android dan iOS. Mereka menggunakan bahasa pemrograman seperti Java, Kotlin, Swift, dan framework seperti Flutter atau React Native untuk menghasilkan aplikasi yang user-friendly dan stabil.`,
        softwaredeveloper: `Software Developer mengembangkan perangkat lunak untuk berbagai keperluan mulai dari aplikasi desktop hingga sistem backend. Mereka mahir dalam bahasa pemrograman seperti Java, Python, C++, dan memahami prinsip desain perangkat lunak serta pengujian.`,
        desaingrafis: `Desain Grafis menciptakan karya visual menggunakan software desain seperti Adobe Photoshop, Illustrator, dan lain-lain. Profesi ini sangat mengandalkan kreativitas dan pemahaman tentang teori warna, tipografi, dan komunikasi visual.`,
        digitalmarketing: `Digital Marketing merancang dan menjalankan strategi pemasaran secara online menggunakan SEO, SEM, email marketing, content creation, dan social media. Tujuannya meningkatkan visibilitas serta penjualan produk atau layanan.`,
        gamedeveloper: `Game Developer merancang dan membuat game interaktif, menggunakan bahasa pemrograman khusus dan perangkat lunak game engine seperti Unity atau Unreal Engine. Profesi ini menggabungkan pemrograman, desain, dan narasi visual untuk pengalaman bermain yang seru.`,
      };

      function clearActive() {
        cards.forEach(card => {
          card.classList.remove('active');
          card.setAttribute('aria-selected', 'false');
        });
      }

      function setActive(card) {
        clearActive();
        card.classList.add('active');
        card.setAttribute('aria-selected', 'true');
        const career = card.dataset.career;
        descPanel.textContent = descriptions[career] || '';
      }

      cards.forEach(card => {
        card.addEventListener('click', () => {
          setActive(card);
        });
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActive(card);
            card.focus();
          }
        });
      });
    })();