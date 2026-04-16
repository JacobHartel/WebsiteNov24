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
        { type: "image", src: "assets/projects/planetary-assemble.jpg", alt: "Assembling first design", width: 1521, height: 1568 },
        { type: "image", src: "assets/projects/planetary-first-design.jpg", alt: "First design", width: 1612, height: 2149 },
        { type: "image", src: "assets/projects/planetary-proto.jpg", alt: "Working prototype", width: 1492, height: 1989 },
        { type: "image", src: "assets/projects/planetary-second-assembly.jpg", alt: "Second assembly", width: 1743, height: 1398 },
        { type: "image", src: "assets/projects/planetary-gears.jpg", alt: "Second gear set", width: 1963, height: 2596 },
        { type: "image", src: "assets/projects/planetary-solder-press.jpg", alt: "Solder press setup", width: 1609, height: 2145 },
        { type: "image", src: "assets/projects/planetary-closeup.jpg", alt: "Spindle key screw closeup", width: 1435, height: 1913 },
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
        { type: "image", src: "assets/projects/banking-app.png", alt: "Banking app repository", width: 2545, height: 1000 }
      ]
    },
    "robotic-arm": {
      title: "Large Robotic Arm (Standalone Ongoing)",
      description:
        "New larger robotic arm project with dedicated CAD iteration renders. This replaces the prior small-arm card.",
      slides: [
        { type: "image", src: "assets/projects/robotic-arm-large-1.jpg", alt: "Large robotic arm render 1", width: 1000, height: 1031 },
        { type: "image", src: "assets/projects/robotic-arm-large-2.jpg", alt: "Large robotic arm render 2", width: 1447, height: 1006 },
        { type: "image", src: "assets/projects/robotic-arm-large-3.jpg", alt: "Large robotic arm render 3", width: 1584, height: 1135 },
        { type: "image", src: "assets/projects/robotic-arm-large-4.jpg", alt: "Large robotic arm render 4", width: 1130, height: 961 }
      ]
    }
  };

  let activeSlides = [];
  let activeIndex = 0;
  let activeCard = null;

  function loadSlideMedia(slideEl) {
    if (!slideEl) return;
    const lazyMedia = slideEl.querySelector("img[data-src], video[data-src], iframe[data-src]");
    if (!lazyMedia) return;
    lazyMedia.src = lazyMedia.dataset.src;
    lazyMedia.removeAttribute("data-src");
  }

  function warmAdjacentSlides(index) {
    if (!activeSlides.length) return;
    const prevIndex = (index - 1 + activeSlides.length) % activeSlides.length;
    const nextIndex = (index + 1) % activeSlides.length;
    loadSlideMedia(activeSlides[prevIndex]);
    loadSlideMedia(activeSlides[nextIndex]);
  }

  function renderSlides(slides) {
    track.innerHTML = "";
    slides.forEach((slide, index) => {
      const wrap = document.createElement("div");
      wrap.className = "carousel-slide" + (index === 0 ? " active" : "");

      if (slide.type === "image") {
        const img = document.createElement("img");
        img.alt = slide.alt || "Project slide";
        img.loading = "lazy";
        img.decoding = "async";
        if (index === 0) {
          img.src = slide.src;
          img.fetchPriority = "high";
        } else {
          img.dataset.src = slide.src;
          img.fetchPriority = "low";
        }
        if (slide.width) img.width = slide.width;
        if (slide.height) img.height = slide.height;
        wrap.appendChild(img);
      } else if (slide.type === "video") {
        const video = document.createElement("video");
        if (index === 0) {
          video.src = slide.src;
        } else {
          video.dataset.src = slide.src;
        }
        video.controls = true;
        video.preload = "metadata";
        wrap.appendChild(video);
      } else if (slide.type === "embed") {
        const iframe = document.createElement("iframe");
        if (index === 0) {
          iframe.src = slide.src;
        } else {
          iframe.dataset.src = slide.src;
        }
        iframe.title = slide.title || "Embedded video";
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
      }

      track.appendChild(wrap);
    });

    activeSlides = Array.from(track.querySelectorAll(".carousel-slide"));
    activeIndex = 0;
    loadSlideMedia(activeSlides[activeIndex]);
    warmAdjacentSlides(activeIndex);
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
    loadSlideMedia(activeSlides[activeIndex]);
    warmAdjacentSlides(activeIndex);
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
