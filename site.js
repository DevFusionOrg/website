(function () {
  const site = window.DEVFUSION_SITE || {};

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });
  }

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const targetPage = link.getAttribute("href");
    if (targetPage === currentPage) {
      link.classList.add("active");
    }
  });

  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(year);
  });

  initTypingHeadings();

  const homeStats = document.getElementById("home-stats");
  if (homeStats) {
    homeStats.innerHTML = site.stats
      .map(
        (item) => `
          <div class="stat-card">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
          </div>
        `,
      )
      .join("");
  }

  const serviceCards = document.getElementById("service-cards");
  if (serviceCards) {
    serviceCards.innerHTML = site.services
      .map(
        (item) => `
          <article class="info-card reveal-card">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </article>
        `,
      )
      .join("");
  }

  const featuredProjects = document.getElementById("featured-projects");
  if (featuredProjects) {
    featuredProjects.innerHTML = site.projects.map(renderProjectCard).join("");
  }

  const aboutMetrics = document.getElementById("about-metrics");
  if (aboutMetrics) {
    aboutMetrics.innerHTML = [
      { value: "2", label: "team members" },
      { value: "3", label: "current projects" },
      { value: "AI/ML", label: "core focus" },
      { value: "Hackathon + Product", label: "build style" },
    ]
      .map(
        (item) => `
          <article class="stat-card stat-card-wide">
            <strong>${item.value}</strong>
            <span>${item.label}</span>
          </article>
        `,
      )
      .join("");
  }

  const memberStories = document.getElementById("member-stories");
  if (memberStories) {
    memberStories.innerHTML = site.members
      .map(
        (member) => `
          <article class="member-story js-story" id="member-${getMemberAnchor(member)}">
            <div class="member-story-media">
              <img src="${member.image}" alt="${member.name} portrait" class="member-photo-scroll js-story-photo" />
            </div>
            <div class="member-story-copy">
              <div class="member-headline">
                <p class="eyebrow">${member.role}</p>
                <h3>${member.name}</h3>
                <p>${member.bio}</p>
              </div>

              <div class="member-meta">
                <a href="mailto:${member.email}">${member.email}</a>
                <a href="tel:${member.phone ? member.phone.replace(/\s+/g, "") : ""}">${member.phone || ""}</a>
                <a href="${member.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="${member.github}" target="_blank" rel="noreferrer">GitHub</a>
                ${member.portfolio ? `<a href="${member.portfolio}" target="_blank" rel="noreferrer">Portfolio</a>` : "<span>Portfolio coming soon</span>"}
              </div>

              <div class="story-block">
                <h4>Experience highlights</h4>
                <ul class="feature-list">
                  ${member.highlights.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>

              <div class="story-block">
                <h4>Skill stack</h4>
                <div class="skill-chip-row">
                  ${member.skills.map((skill) => renderSkillChip(skill)).join("")}
                </div>
              </div>

              <div class="story-block story-row">
                <div>
                  <h4>Achievements</h4>
                  <ul class="feature-list">
                    ${member.achievements.map((item) => `<li>${item}</li>`).join("")}
                  </ul>
                </div>
                <div>
                  <h4>Coursework</h4>
                  <ul class="feature-list">
                    ${member.coursework.map((item) => `<li>${item}</li>`).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        `,
      )
      .join("");

    if (window.location.hash) {
      window.setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const header = document.querySelector(".site-header");
          const headerOffset = header ? header.offsetHeight + 24 : 0;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      }, 120);
    }
  }

  const projectGrid = document.getElementById("project-grid");
  const projectFilters = document.getElementById("project-filters");
  if (projectGrid && projectFilters) {
    const categories = ["All", ...new Set(site.projects.map((project) => project.category))];
    let activeCategory = "All";

    const renderFilters = () => {
      projectFilters.innerHTML = categories
        .map(
          (category) => `
            <button class="filter-button ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">
              ${category}
            </button>
          `,
        )
        .join("");

      projectFilters.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          activeCategory = button.dataset.category || "All";
          renderFilters();
          renderProjects();
        });
      });
    };

    const renderProjects = () => {
      const filtered = activeCategory === "All" ? site.projects : site.projects.filter((project) => project.category === activeCategory);
      projectGrid.innerHTML = filtered.map(renderProjectCard).join("");
    };

    renderFilters();
    renderProjects();
  }

  const contactLinks = document.getElementById("contact-links");
  if (contactLinks) {
    contactLinks.innerHTML = `
      <a href="mailto:dushyantrajotia@gmail.com">Dushyant: dushyantrajotia@gmail.com</a>
      <a href="mailto:manulsahu3@gmail.com">Manul: manulsahu3@gmail.com</a>
      <a href="https://www.linkedin.com/in/dushyantrajotia/" target="_blank" rel="noreferrer">Dushyant LinkedIn</a>
      <a href="https://www.linkedin.com/in/manul-sahu-764986354/" target="_blank" rel="noreferrer">Manul LinkedIn</a>
      <a href="projects.html">Project gallery</a>
    `;
  }

  const faqGrid = document.getElementById("faq-grid");
  if (faqGrid) {
    faqGrid.innerHTML = (site.faqs || [])
      .map(
        (item) => `
          <article class="info-card reveal-card">
            <h3>${item.question}</h3>
            <p>${item.answer}</p>
          </article>
        `,
      )
      .join("");
  }

  document.querySelectorAll(".js-mailto-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const subject = `${form.dataset.formTitle || "DevFusion inquiry"}: ${formData.get("name") || "New message"}`;
      const body = [
        `Name: ${formData.get("name") || ""}`,
        `Email: ${formData.get("email") || ""}`,
        `Project type: ${formData.get("projectType") || ""}`,
        `Budget: ${formData.get("budget") || ""}`,
        `Timeline: ${formData.get("timeline") || ""}`,
        "",
        String(formData.get("message") || ""),
      ].join("\n");

      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });

  const stories = document.querySelectorAll(".js-story");
  if (stories.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.22 },
    );

    stories.forEach((story) => observer.observe(story));
  }

  function renderProjectCard(project) {
    return `
      <article class="project-card reveal-card">
        <div class="project-topline">
          <span>${project.category}</span>
          <span>${project.apkUrl ? "Android APK ready" : "APK link on request"}</span>
        </div>
        <h3>${project.name}</h3>
        <p>${project.about}</p>
        <ul class="feature-list">
          ${project.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <div class="project-links">
          <a href="${project.repoUrl}" target="_blank" rel="noreferrer">GitHub repo</a>
          ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noreferrer">Live demo</a>` : `<span>Live demo coming soon</span>`}
          ${project.apkUrl ? `<a href="${project.apkUrl}" target="_blank" rel="noreferrer">Download APK</a>` : `<span>APK link pending</span>`}
        </div>
      </article>
    `;
  }

  function renderSkillChip(skillName) {
    const item = (site.tech || []).find((tech) => tech.name === skillName);
    if (!item) {
      return `<span class="skill-chip skill-teal"><strong class="skill-icon">${skillName.slice(0, 1)}</strong><em>${skillName}</em></span>`;
    }

    return `<span class="skill-chip skill-${item.tone || "teal"}"><strong class="skill-icon">${item.icon || item.symbol}</strong><em>${item.name}</em></span>`;
  }

  function initTypingHeadings() {
    const headings = document.querySelectorAll(".js-typing-heading");
    if (headings.length === 0) {
      return;
    }

    headings.forEach((heading) => {
      const raw = heading.dataset.typingLines || heading.textContent || "";
      const lines = raw
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        return;
      }

      heading.innerHTML = "";
      const lineNode = document.createElement("span");
      lineNode.className = "typing-line is-active";
      lineNode.textContent = "";
      heading.appendChild(lineNode);

      runTypingLoop(lineNode, lines);
    });
  }

  async function runTypingLoop(lineNode, lines) {
    while (true) {
      for (let i = 0; i < lines.length; i += 1) {
        await typeCharacters(lineNode, lines[i], 44);
        await delay(700);
        await deleteCharacters(lineNode, 22);
        await delay(180);
      }
    }
  }

  function typeCharacters(node, text, speed) {
    return new Promise((resolve) => {
      let index = 0;
      const timer = window.setInterval(() => {
        node.textContent = text.slice(0, index + 1);
        index += 1;

        if (index >= text.length) {
          window.clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  function delay(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function getMemberAnchor(member) {
    if (member.anchor) {
      return member.anchor;
    }

    return String(member.name || "member")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function deleteCharacters(node, speed) {
    return new Promise((resolve) => {
      const timer = window.setInterval(() => {
        node.textContent = node.textContent.slice(0, -1);

        if (node.textContent.length === 0) {
          window.clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }
})();