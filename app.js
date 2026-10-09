(function () {
  var nav = document.querySelector(".nav");
  var menuBtn = document.querySelector(".menu-btn");
  var mobile = document.querySelector(".mobile-nav");
  var sticky = document.querySelector(".sticky");

  function onScroll() {
    if (nav) nav.classList.toggle("is-solid", window.scrollY > 12);
    if (!sticky) return;
    var book = document.getElementById("book");
    var past = window.scrollY > window.innerHeight * 0.7;
    var box = book && book.getBoundingClientRect();
    var near = box ? box.top < window.innerHeight * 0.85 : false;
    sticky.classList.toggle("is-on", past && !near && window.innerWidth < 1024);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  if (menuBtn && mobile) {
    menuBtn.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobile.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  document.querySelectorAll("[data-filter]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var id = chip.getAttribute("data-filter");
      document.querySelectorAll("[data-filter]").forEach(function (c) {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      document.querySelectorAll(".work-card").forEach(function (card) {
        var show = id === "all" || card.getAttribute("data-cat") === id;
        card.hidden = !show;
      });
    });
  });

  document.querySelectorAll(".work-card").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", card.classList.contains("is-open") ? "true" : "false");
    });
  });

  var nodes = document.querySelectorAll("[data-reveal]");
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (n) { io.observe(n); });
    setTimeout(function () { nodes.forEach(function (n) { n.classList.add("is-in"); }); }, 1800);
  } else {
    nodes.forEach(function (n) { n.classList.add("is-in"); });
  }

  var form = document.getElementById("brief");
  if (!form) return;
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var email = String(data.get("email") || "").trim();
    var phone = String(data.get("phone") || "").trim();
    var reason = String(data.get("reason") || "").trim();
    var message = String(data.get("message") || "").trim();
    function fail(text) {
      status.className = "alert";
      status.textContent = text;
    }
    if (name.length < 2) return fail("Please add your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("A real email helps him write back.");
    if (message.length < 12) return fail("Give a little more context — a few sentences is enough.");
    try {
      var prev = JSON.parse(localStorage.getItem("pk-enquiries") || "[]");
      prev.unshift({ name: name, email: email, phone: phone, reason: reason, message: message, at: new Date().toISOString() });
      localStorage.setItem("pk-enquiries", JSON.stringify(prev.slice(0, 20)));
    } catch (err) {}
    var subject = encodeURIComponent("Business training brief — " + name);
    var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\nReason: " + reason + "\n\n" + message);
    status.className = "ok";
    status.textContent = "Opening your mail app with the brief.";
    form.reset();
    window.location.href = "mailto:praveensk.biz@gmail.com?subject=" + subject + "&body=" + body;
  });
})();
