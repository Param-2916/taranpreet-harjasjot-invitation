(() => {
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = CONFIG,
    RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SIDE = location.hash.slice(1) === "bride" ? "bride" : "default";
  let lang = "en";
  try {
    lang = localStorage.getItem("lang") || "en";
  } catch (e) {}
  const T = () => I18N[lang];
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

  function letters(txt, base = 0) {
    // letter by letter (English) / word by word (Punjabi)
    const parts = lang === "pa" ? txt.split(" ") : [...txt];
    return (
      '<span class="w">' +
      parts
        .map((p, i) =>
          p === " "
            ? " "
            : `<span class="l" style="--i:${base + i}">${esc(p)}</span>`,
        )
        .join(lang === "pa" ? " " : "") +
      "</span>"
    );
  }
  const names = () => {
    const n = C.couple[lang];
    return (
      letters(n[0]) +
      `<span class="amp">&amp;</span>` +
      letters(n[1], n[0].length + 3)
    );
  };
  const fmtDate = (id) => T().dates[id];

  function render() {
    const t = T();
    document.documentElement.lang = lang === "pa" ? "pa" : "en";
    document.body.classList.toggle("pa", lang === "pa");
    $$("[data-i18n]").forEach((e) => (e.textContent = t[e.dataset.i18n]));
    $$("[data-lang-toggle]").forEach((e) => (e.textContent = t.lang));
    $("#mus").setAttribute("aria-label", t.sound);
    const gate = $("#gate");
    if (gate) gate.setAttribute("aria-label", t.gate);
    $("#sc").setAttribute("aria-label", t.scratch);
    const coupleNames = C.couple[lang].join(" & ");
    ["gNames", "hNames", "eNames"].forEach((id) => {
      const el = $("#" + id);
      if (el) {
        el.innerHTML = names();
        el.setAttribute("aria-label", coupleNames);
      }
    });
    ["gDate", "hDate", "eDate"].forEach((id) => {
      const el = $("#" + id);
      if (el) el.textContent = fmtDate("anand");
    });
    $$(".names").forEach((n) => n.classList.remove("in"));
    requestAnimationFrame(() =>
      $$(".names").forEach((n) => {
        if (
          n.id === "gNames" ||
          (n.id !== "hNames" && visible(n)) ||
          (n.id === "hNames" && document.body.classList.contains("go"))
        )
          n.classList.add("in");
      }),
    );
    const c = C.card;
    $("#verse").innerHTML = c.verse.map(esc).join("<br>");
    $("#quote").innerHTML = c.quote.map(esc).join("<br>");
    const L = (a, cls = "cs") =>
      a.map((x) => `<p class="${cls}">${esc(x)}</p>`).join("");
    const nm = (a) =>
      `<p class="cn big2">${letters(a[0])}</p><p class="cs">${esc(a[1])}</p>`;
    const eventSchedule = (e) =>
      e.schedule
        ? e.schedule
            .map(
              (s) =>
                `<p class="cs">${esc(s[0].toUpperCase())} ........ ${esc(s[1])}</p>`,
            )
            .join("")
        : "";
    const translatedSchedule = (e) => {
      if (!e.schedule) return "";
      const offset = e.id === "lunch" ? 2 : 0,
        schedule =
          lang === "pa" && t.sched
            ? t.sched.slice(offset, offset + e.schedule.length)
            : e.schedule;
      return `<ul>${e.schedule
        .map((item, i) => {
          const [name, time] = schedule[i] || item;
          return `<li><span>${esc(name)}</span><span>${esc(time)}</span></li>`;
        })
        .join("")}</ul>`;
    };
    $("#cardBody").innerHTML =
      `<img class="mono" src="${C.assets.monogram}" alt="" width="1536" height="1024" loading="lazy">` +
      `<p class="cn">${esc(c.host[0])}</p><p class="cn" style="font-size:22px">${esc(c.host[1])}</p>` +
      `<div class="div in"><b></b></div>` +
      `<p class="cs">${esc(c.p1[0])}</p><p class="cs b">${esc(c.p1[1])}</p><p class="cs">${esc(c.p1[2])}</p>` +
      nm(c.bride) +
      `<p class="cs b">WITH</p>` +
      nm(c.groom) +
      `<p class="cn" style="font-size:24px;margin-top:18px">On Friday, 22nd January, 2027</p><p class="cs">6:30 PM ONWARDS</p><p class="cs">FOLLOWED BY COCKTAIL &amp; DINNER</p><p class="cs">VENUE:</p><p class="cs b">${esc(C.events[0].venue)}</p><p class="cs">${esc(C.events[0].addr)}</p>` +
      `<div class="div in"><b></b></div>` +
      `<p class="cn" style="font-size:24px;margin-top:18px">On Sunday, 24th January, 2027</p>` +
      eventSchedule(C.events[1]) +
      `<p class="cs">AT</p><p class="cs b">${esc(C.events[1].venue)}</p><p class="cs">${esc(C.events[1].addr)}</p>` +
      `<div class="div in"><b></b></div><p class="cs b">LUNCH &amp; DOLI</p>` +
      eventSchedule(C.events[2]) +
      `<p class="cs">VENUE:</p><p class="cs b">${esc(C.events[2].venue)}</p><p class="cs">${esc(C.events[2].addr)}</p>`;
    $("#events").innerHTML = C.events
      .map(
        (
          e,
          i,
        ) => `<article class="ev" data-i="${i}"><h4>${t[e.id]}</h4><p class="t">${fmtDate(e.id)} · ${t.times[e.id]}</p>
    <p class="v">${esc(e.venue)}</p><p>${esc(e.addr)}</p>
    ${e.note ? `<p>${t.note}</p>` : ""}
    ${translatedSchedule(e)}
    ${e.etiquette ? `<p class="et">${t.etiq}</p>` : ""}
    <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.map)}">${t.dir}</a>
    <a class="btn" target="_blank" rel="noopener" href="${gcal(e)}">${t.cal} · ${t.g}</a><button class="btn" data-ics="${i}">${t.cal} · ${t.icsl}</button>
    </article>`,
      )
      .join("");
    $$("[data-ics]").forEach(
      (b) => (b.onclick = () => ics(C.events[b.dataset.ics])),
    );
    $("#rsvp").innerHTML =
      C.rsvp.names.map((n) => `<p>${n}</p>`).join("") +
      `<p>M : ${C.rsvp.phones.map((p) => `<a href="tel:+91${p}">${p}</a>`).join(", ")}</p>`;
    $("#comp").innerHTML = C.card.compliments.map(esc).join("<br>");
    const url = shareUrl();
    $("#bWa").href =
      "https://wa.me/?text=" + encodeURIComponent(t.shareMsg + "\n" + url);
    observe();
    updateCountdown();
  }
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  };
  const shareUrl = () =>
    (C.siteUrl || location.href.split("#")[0]) +
    (SIDE === "bride" ? "#bride" : "");

  /* calendar */
  const stamp = (d, t) => d.replace(/-/g, "") + "T" + t.replace(":", "") + "00";
  function gcal(e) {
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: `${C.couple.en.join(" & ")} · ${I18N.en[e.id]}`,
      dates: `${stamp(e.date, e.time)}/${stamp(e.date, e.end)}`,
      ctz: "Asia/Kolkata",
      location: `${e.venue}, ${e.addr}`,
    });
    return "https://calendar.google.com/calendar/render?" + q;
  }
  function ics(e) {
    const s = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Invitation//EN",
      "BEGIN:VEVENT",
      "UID:" + e.id + "@invitation",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""),
      `DTSTART;TZID=Asia/Kolkata:${stamp(e.date, e.time)}`,
      `DTEND;TZID=Asia/Kolkata:${stamp(e.date, e.end)}`,
      `SUMMARY:${C.couple.en.join(" & ")} - ${I18N.en[e.id]}`,
      `LOCATION:${e.venue}\\, ${e.addr}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([s], { type: "text/calendar" }));
    a.href = url;
    a.download = e.id + ".ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  /* reveal + thread + mandala */
  let io;
  function observe() {
    io && io.disconnect();
    io = new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          if (x.isIntersecting) {
            if (
              x.target.id === "hNames" &&
              !document.body.classList.contains("go")
            )
              return;
            x.target.classList.add("in");
            if (x.target.matches(".names,.cn")) x.target.classList.add("in");
          }
        }),
      { threshold: 0.2 },
    );
    $$(".rv,.ev,.boxes,.names,.cn,.div").forEach((e) => io.observe(e));
    $$(".rv").forEach((e, i) =>
      e.style.setProperty("--d", (i % 3) * 0.12 + "s"),
    );
  }

  /* countdown */
  const target = Date.parse(C.ceremony.start),
    until = Date.parse(C.ceremony.nowUntil);
  let countdownInterval = null,
    countdownEndTimeout = null;
  function updateCountdown() {
    const now = Date.now(),
      box = $("#cdBoxes"),
      msg = $("#cdMsg"),
      t = T();
    if (now >= target) {
      if (countdownInterval !== null) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      box.hidden = true;
      msg.textContent = now >= until ? t.done : t.now;
      if (now < until && countdownEndTimeout === null) {
        countdownEndTimeout = setTimeout(
          updateCountdown,
          until - now,
        );
      } else if (now >= until && countdownEndTimeout !== null) {
        clearTimeout(countdownEndTimeout);
        countdownEndTimeout = null;
      }
      return;
    }

    if (countdownEndTimeout !== null) {
      clearTimeout(countdownEndTimeout);
      countdownEndTimeout = null;
    }
    box.hidden = false;
    msg.textContent = "";
    const seconds = Math.ceil((target - now) / 1000),
      v = [
        Math.floor(seconds / 86400),
        Math.floor((seconds % 86400) / 3600),
        Math.floor((seconds % 3600) / 60),
        seconds % 60,
      ],
      k = ["d", "h", "m", "s"];
    if (!box.children.length || box.dataset.l !== lang) {
      box.dataset.l = lang;
      box.innerHTML = k
        .map(
          (x, i) =>
            `<div class="box" style="--i:${i}"><b></b><small>${t[x]}</small></div>`,
        )
        .join("");
      observe();
    }
    $$(".box b", box).forEach(
      (b, i) => (b.textContent = String(v[i]).padStart(2, "0")),
    );
    if (countdownInterval === null) {
      countdownInterval = setInterval(updateCountdown, 1000);
    }
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateCountdown();
  });

  /* audio */
  const audio = new Audio(C.assets.song);
  audio.loop = true;
  audio.volume = 0.5;
  let wanted = false,
    gateOpened = false;
  const musicButton = $("#mus");
  const setMus = () => {
    const playing = !audio.paused && !audio.ended;
    musicButton.textContent = playing ? "❚❚" : "♪";
    musicButton.setAttribute("aria-pressed", String(playing));
  };
  const playMusic = () =>
    audio
      .play()
      .then(() => {
        wanted = true;
        musicButton.hidden = false;
        setMus();
      })
      .catch(() => {
        wanted = false;
        setMus();
        if (!audio.error) musicButton.hidden = false;
      });
  audio.addEventListener("playing", () => {
    if (gateOpened) musicButton.hidden = false;
    setMus();
  });
  audio.addEventListener("pause", setMus);
  audio.addEventListener("error", () => {
    wanted = false;
    musicButton.hidden = true;
    setMus();
  });
  audio.addEventListener("canplay", () => {
    if (gateOpened) musicButton.hidden = false;
  });
  setMus();
  musicButton.onclick = () => {
    if (wanted || !audio.paused) {
      wanted = false;
      audio.pause();
    } else {
      playMusic();
    }
    setMus();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) audio.pause();
    else if (wanted) playMusic();
  });

  /* gate */
  $("#openBtn").onclick = () => {
    const g = $("#gate");
    gateOpened = true;
    g.classList.add("open");
    document.body.classList.add("go");
    playMusic();
    if (!RM) petals.burst();
    setTimeout(
      () => {
        g.remove();
        document.body.classList.remove("locked");
        $("header.top").removeAttribute("inert");
        $("main").removeAttribute("inert");
        $(".top [data-lang-toggle]").focus();
        $$("#hero .names").forEach((n) => n.classList.add("in"));
        updateCountdown();
      },
      RM ? 50 : 2200,
    );
  };
  $("#gate").addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const controls = $$("button:not([disabled])", $("#gate")),
      first = controls[0],
      last = controls[controls.length - 1];
    if (!first || !last) return;
    if (!$("#gate").contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  $$("[data-lang-toggle]").forEach(
    (b) =>
      (b.onclick = () => {
        lang = lang === "en" ? "pa" : "en";
        try {
          localStorage.setItem("lang", lang);
        } catch (e) {}
        render();
      }),
  );

  /* share */
  const toast = (m) => {
    const t = $("#toast");
    t.textContent = m;
    t.classList.add("on");
    setTimeout(() => t.classList.remove("on"), 2000);
  };
  $("#bShare").onclick = () =>
    navigator.share
      ? navigator
          .share({ title: document.title, text: T().shareMsg, url: shareUrl() })
          .catch(() => {})
      : $("#bWa").click();
  $("#bCopy").onclick = () =>
    (navigator.clipboard
      ? navigator.clipboard.writeText(shareUrl())
      : Promise.reject()
    )
      .then(() => toast(T().copied))
      .catch(() => prompt("", shareUrl()));

  /* scroll effects */
  let sy = scrollY,
    vel = 0;
  addEventListener(
    "scroll",
    () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      vel += scrollY - sy;
      sy = scrollY;
      const tl = $(".tl");
      if (tl) {
        const r = tl.getBoundingClientRect();
        $("#fill").style.height =
          Math.max(0, Math.min(r.height, innerHeight * 0.6 - r.top)) + "px";
      }
      if (!RM)
        $$(".mandala").forEach((m) =>
          m.style.setProperty("--rot", scrollY * 0.03 + "deg"),
        );
    },
    { passive: true },
  );

  /* petals: one canvas, flower follows section, 3 depth layers */
  const FL = {
    hero: ["#E8B9B5", "#C5A46D", "#F6EBDD"],
    bless: ["#C5A46D", "#E8B9B5", "#A87935"],
    inv: ["#F6EBDD", "#E8B9B5", "#C5A46D"],
    cd: ["#E8B9B5", "#C5A46D", "#F6EBDD"],
    fn: ["#C5A46D", "#E8B9B5", "#A87935"],
    end: ["#E8B9B5", "#C5A46D", "#F6EBDD"],
  };
  const petals = (() => {
    const cv = $("#petals"),
      cx = cv.getContext("2d");
    let W,
      H,
      P = [],
      cur = "hero",
      run = !RM;
    const size = () => {
      W = cv.width = innerWidth;
      H = cv.height = innerHeight;
    };
    size();
    addEventListener("resize", size);
    const mk = (top = false) => {
      const z = Math.random() < 0.4 ? 0 : Math.random() < 0.6 ? 1 : 2,
        f = FL[cur];
      return {
        x: Math.random() * W,
        y: top ? -20 : Math.random() * H,
        z,
        s: [4, 7, 12][z] * (0.7 + Math.random() * 0.6),
        vy: [0.3, 0.7, 1.3][z] * (0.7 + Math.random() * 0.6),
        ph: Math.random() * 6.28,
        fs: 0.01 + Math.random() * 0.02,
        r: Math.random() * 6.28,
        c: f[(Math.random() * f.length) | 0],
        a: [0.45, 0.7, 0.9][z],
        g: cur === "end" && Math.random() < 0.4,
        leaf: cur === "fn" && Math.random() < 0.5,
      };
    };
    const sec = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) cur = e.target.dataset.flower;
        }),
      { threshold: 0.5 },
    );
    $$("[data-flower]").forEach((s) => sec.observe(s));
    function frame() {
      if (!run) return;
      cx.clearRect(0, 0, W, H);
      const v = Math.max(-40, Math.min(40, vel));
      vel *= 0.9;
      while (P.length < (W < 600 ? 28 : 55)) P.push(mk());
      P = P.filter((p) => {
        p.ph += p.fs * 6;
        p.y += p.vy - v * [0.05, 0.12, 0.25][p.z];
        p.x += Math.sin(p.ph) * 0.5 + v * [0.04, 0.1, 0.2][p.z] * 0.3;
        p.r += 0.01;
        if (p.y > H + 20 || p.y < -60) return false;
        cx.save();
        cx.translate(p.x, p.y);
        cx.rotate(p.r);
        cx.scale(1, Math.cos(p.ph));
        cx.globalAlpha = p.a;
        if (p.z === 0) cx.filter = "blur(1px)";
        cx.fillStyle = p.g ? "#C5A46D" : p.leaf ? "#B5C6A8" : p.c;
        cx.beginPath();
        p.g
          ? cx.rect(-p.s / 3, -p.s / 3, p.s / 1.5, p.s / 1.5)
          : cx.ellipse(0, 0, p.s * 0.6, p.s, 0, 0, 6.28);
        cx.fill();
        cx.restore();
        return true;
      });
      requestAnimationFrame(frame);
    }
    document.addEventListener("visibilitychange", () => {
      run = !RM && !document.hidden;
      if (run) requestAnimationFrame(frame);
    });
    if (!RM) requestAnimationFrame(frame);
    return {
      burst() {
        for (let i = 0; i < 70; i++)
          (P.push(mk(true)), (P[P.length - 1].y = -Math.random() * H * 0.8));
      },
    };
  })();

  /* scratch card */
  (() => {
    const cv = $("#sc"),
      cx = cv.getContext("2d", { willReadFrequently: true }),
      box = $("#scratch"),
      surface = cv.parentElement;
    let done = false,
      drawing = false,
      lastPoint = null,
      resizeFrame = null;
    const drawCoating = () => {
      if (done) return;
      const rect = surface.getBoundingClientRect(),
        dpr = window.devicePixelRatio || 1,
        width = rect.width,
        height = rect.height;
      if (!width || !height) return;

      const pixelWidth = Math.round(width * dpr),
        pixelHeight = Math.round(height * dpr);
      if (cv.width !== pixelWidth || cv.height !== pixelHeight) {
        cv.width = pixelWidth;
        cv.height = pixelHeight;
      }
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.globalCompositeOperation = "source-over";
      cx.clearRect(0, 0, width, height);
      const gradient = cx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#C5A46D");
      gradient.addColorStop(0.5, "#E9DAB4");
      gradient.addColorStop(1, "#C5A46D");
      cx.fillStyle = gradient;
      cx.fillRect(0, 0, width, height);
      cx.strokeStyle = "rgba(255,255,255,.35)";
      cx.lineWidth = 1;
      for (let x = -height; x < width; x += 14) {
        cx.beginPath();
        cx.moveTo(x, height);
        cx.lineTo(x + height, 0);
        cx.stroke();
      }
    };
    const scheduleResize = () => {
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        drawCoating();
      });
    };
    const reveal = () => {
      if (done) return;
      done = true;
      cv.classList.add("revealing");
      cv.style.pointerEvents = "none";
      cv.setAttribute("aria-hidden", "true");
      cv.tabIndex = -1;
      box.classList.add("started");
      if (!RM) petals.burst();
    };
    const pointFromEvent = (e) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const scratch = (point) => {
      if (done) return;
      cx.globalCompositeOperation = "destination-out";
      cx.lineCap = "round";
      cx.lineJoin = "round";
      cx.lineWidth = 56;
      if (lastPoint) {
        cx.beginPath();
        cx.moveTo(lastPoint.x, lastPoint.y);
        cx.lineTo(point.x, point.y);
        cx.stroke();
      } else {
        cx.beginPath();
        cx.arc(point.x, point.y, 28, 0, Math.PI * 2);
        cx.fill();
      }
      lastPoint = point;
      box.classList.add("started");
    };
    const check = () => {
      const pixels = cx.getImageData(0, 0, cv.width, cv.height).data,
        stride = Math.max(16, Math.floor((cv.width * cv.height) / 10000));
      let erased = 0,
        sampled = 0;
      for (let i = 3; i < pixels.length; i += stride * 4) {
        sampled++;
        if (pixels[i] < 128) erased++;
      }
      if (sampled && erased / sampled >= 0.45) reveal();
    };
    cv.addEventListener("pointerdown", (e) => {
      if (done || !e.isPrimary || (e.pointerType === "mouse" && e.button !== 0))
        return;
      e.preventDefault();
      drawing = true;
      cv.setPointerCapture(e.pointerId);
      lastPoint = null;
      scratch(pointFromEvent(e));
    });
    cv.addEventListener("pointermove", (e) => {
      if (drawing) {
        e.preventDefault();
        scratch(pointFromEvent(e));
      }
    });
    const up = () => {
      if (drawing) {
        drawing = false;
        lastPoint = null;
        check();
      }
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        reveal();
      }
    });
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(scheduleResize).observe(surface);
    }
    addEventListener("resize", scheduleResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleResize);
    }
    scheduleResize();
  })();

  render();
  if (location.hash === "#bride")
    document.title = C.couple.en.join(" & ") + " · Wedding Invitation";
  addEventListener("hashchange", () => {
    if (location.hash === "#bride" || location.hash === "") location.reload();
  });
})();
