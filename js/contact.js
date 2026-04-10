(function () {
  "use strict";

  var SITE = window.SITE || {};
  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.hidden = !msg;
    statusEl.classList.toggle("form-status--error", !!isError);
  }

  form.addEventListener("submit", function (e) {
    var endpoint = (SITE.formEndpoint || "").trim();

    if (endpoint) {
      e.preventDefault();
      setStatus("");
      if (submitBtn) submitBtn.disabled = true;

      var fd = new FormData(form);
      fetch(endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus(
              "Thanks. We received your message and will reply within one business day."
            );
          } else {
            return res.json().then(function (data) {
              var err =
                (data && data.error) ||
                "Something went wrong. Please email us directly.";
              throw new Error(err);
            });
          }
        })
        .catch(function () {
          setStatus("We could not send the form. Please email us directly.", true);
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
      return;
    }

    /* No form endpoint: open mailto with fields */
    e.preventDefault();
    var name = (form.querySelector('[name="name"]') || {}).value || "";
    var company = (form.querySelector('[name="company"]') || {}).value || "";
    var email = (form.querySelector('[name="email"]') || {}).value || "";
    var message = (form.querySelector('[name="message"]') || {}).value || "";
    var to = SITE.email || "";
    if (!to) {
      setStatus("Set SITE.email in js/site-config.js.", true);
      return;
    }
    var subject = encodeURIComponent("MARSYNC website inquiry");
    var body = encodeURIComponent(
      "Name: " +
        name +
        "\nCompany: " +
        company +
        "\nEmail: " +
        email +
        "\n\n" +
        message
    );
    window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
  });
})();
