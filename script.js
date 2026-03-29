(function () {
  const clock = document.getElementById("clock");
  if (clock) {
    const tick = () => {
      clock.textContent = new Date().toLocaleString();
    };
    tick();
    setInterval(tick, 1000);
  }

  const cards = Array.from(document.querySelectorAll(".project-card[data-project]"));
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const closeBtn = document.getElementById("modal-close");
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  const slideCounter = document.getElementById("slide-counter");

  if (!cards.length || !modal || !track) {
    return;
  }

  const projects = {
    planetary: {
      title: "Planetary Gearbox (Full Project)",
      description:
        "Complete iteration path from first design to working prototype, including assembly and hardware refinement. Includes embedded test videos.",
      slides: [
        { type: "image", src: "assets/projects/planetary-assemble.jpg", alt: "Assembling first design" },
        { type: "image", src: "assets/projects/planetary-first-design.jpg", alt: "First design" },
        { type: "image", src: "assets/projects/planetary-proto.jpg", alt: "Working prototype" },
        { type: "image", src: "assets/projects/planetary-second-assembly.jpg", alt: "Second assembly" },
        { type: "image", src: "assets/projects/planetary-gears.jpg", alt: "Second gear set" },
        { type: "image", src: "assets/projects/planetary-solder-press.jpg", alt: "Solder press setup" },
        { type: "image", src: "assets/projects/planetary-closeup.jpg", alt: "Spindle key screw closeup" },
        { type: "embed", src: "https://www.youtube.com/embed/HjzXU1eCSeM", title: "Planetary First Test" },
        { type: "embed", src: "https://www.youtube.com/embed/hBZqQqcEPnk", title: "Planetary Solder Press" },
        { type: "embed", src: "https://www.youtube.com/embed/JYCKTkzZ9mQ", title: "Planetary Output Video" }
      ]
    },
    banking: {
      title: ".NET C# Banking App",
      description:
        "Final C# project using MVC patterns across client and API. Keeps software work isolated from the hardware tracks.",
      slides: [
        { type: "image", src: "assets/projects/banking-app.png", alt: "Banking app repository" }
      ]
    },
    "robotic-arm": {
      title: "Large Robotic Arm (Standalone Ongoing)",
      description:
        "New larger robotic arm project with dedicated CAD iteration renders. This replaces the prior small-arm card.",
      slides: [
        { type: "image", src: "assets/projects/robotic-arm-large-1.png", alt: "Large robotic arm render 1" },
        { type: "image", src: "assets/projects/robotic-arm-large-2.png", alt: "Large robotic arm render 2" },
        { type: "image", src: "assets/projects/robotic-arm-large-3.png", alt: "Large robotic arm render 3" },
        { type: "image", src: "assets/projects/robotic-arm-large-4.png", alt: "Large robotic arm render 4" }
      ]
    }
  };

  let activeSlides = [];
  let activeIndex = 0;
  let activeCard = null;

  function renderSlides(slides) {
    track.innerHTML = "";
    slides.forEach((slide, index) => {
      const wrap = document.createElement("div");
      wrap.className = "carousel-slide" + (index === 0 ? " active" : "");

      if (slide.type === "image") {
        const img = document.createElement("img");
        img.src = slide.src;
        img.alt = slide.alt || "Project slide";
        img.loading = "lazy";
        wrap.appendChild(img);
      } else if (slide.type === "video") {
        const video = document.createElement("video");
        video.src = slide.src;
        video.controls = true;
        video.preload = "metadata";
        wrap.appendChild(video);
      } else if (slide.type === "embed") {
        const iframe = document.createElement("iframe");
        iframe.src = slide.src;
        iframe.title = slide.title || "Embedded video";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
      }

      track.appendChild(wrap);
    });

    activeSlides = Array.from(track.querySelectorAll(".carousel-slide"));
    activeIndex = 0;
    updateCounter();
  }

  function updateCounter() {
    if (!slideCounter) return;
    slideCounter.textContent = `${activeIndex + 1} / ${Math.max(activeSlides.length, 1)}`;
  }

  function showSlide(nextIndex) {
    if (!activeSlides.length) return;
    activeSlides[activeIndex].classList.remove("active");
    activeIndex = (nextIndex + activeSlides.length) % activeSlides.length;
    activeSlides[activeIndex].classList.add("active");
    updateCounter();
  }

  function openProject(key, card) {
    const data = projects[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    renderSlides(data.slides);

    if (activeCard) activeCard.classList.remove("active");
    activeCard = card;
    if (activeCard) activeCard.classList.add("active");

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (activeCard) activeCard.classList.remove("active");
    activeCard = null;
    document.body.style.overflow = "";

    track.querySelectorAll("video").forEach((v) => v.pause());
    track.querySelectorAll("iframe").forEach((f) => {
      const src = f.src;
      f.src = src;
    });
  }

  cards.forEach((card) => {
    const key = card.dataset.project;
    card.addEventListener("click", () => openProject(key, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProject(key, card);
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", () => showSlide(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlide(activeIndex + 1));

  if (closeBtn) closeBtn.addEventListener("click", closeProject);
  modal.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement && e.target.dataset.close === "true") {
      closeProject();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeProject();
    if (e.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (e.key === "ArrowRight") showSlide(activeIndex + 1);
  });
})();
