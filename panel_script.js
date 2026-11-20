
  (function () {
    "use strict";
    var OWNER = "jimmybbk", REPO = "sofund", BRANCH = "main";
    var API = "https://api.github.com";
    var TOKEN_KEY = "zf_panel_token";
    var token = "";
    var posts = [];
    var postsSha = "";

    var $ = function (id) { return document.getElementById(id); };
    function setStatus(id, msg, cls) {
      var el = $(id); el.textContent = msg; el.className = "status" + (cls ? " " + cls : "");
    }

    function b64encode(str) {
      var bytes = new TextEncoder().encode(str), bin = "", i;
      for (i = 0; i < bytes.length; i += 0x8000) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      }
      return btoa(bin);
    }
    function b64decode(b64) {
      var bin = atob(b64.replace(/\s/g, ""));
      var bytes = new Uint8Array(bin.length), i;
      for (i = 0; i < bin.length; i++) { bytes[i] = bin.charCodeAt(i); }
      return new TextDecoder().decode(bytes);
    }

    function gh(path, method, body) {
      return fetch(API + path, {
        method: method || "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Accept": "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
      }).then(function (r) {
        if (!r.ok) {
          return r.json().catch(function () { return {}; }).then(function (e) {
            var msg = (e && e.message) ? e.message : ("HTTP " + r.status);
            if (r.status === 401) { msg = "Token rejected (401). Check the token is correct and not expired."; }
            if (r.status === 403) { msg = "Access denied (403). The token needs Contents: Read and write on the sofund repository."; }
            throw new Error(msg);
          });
        }
        return r.json();
      });
    }
    function getJson(path) {
      return gh(path).then(function (data) {
        var text = data.encoding === "base64" ? b64decode(data.content) : data.content;
        return { sha: data.sha, text: text };
      });
    }
    function putFile(path, message, content, sha) {
      return gh(path, "PUT", { message: message, content: b64encode(content), sha: sha || undefined, branch: BRANCH });
    }
    function deleteFile(path, sha, message) {
      return gh(path, "DELETE", { message: message, sha: sha, branch: BRANCH });
    }

    function slugify(t) {
      return t.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9\s-]/g, "")
        .trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60);
    }
    function contentToHtml(t) {
      var lines = t.replace(/\r/g, "").split("\n");
      var out = [], ul = null, buf = [];
      function inline(s) { return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
      function closeAll() {
        if (buf.length) { out.push("<p>" + buf.map(inline).join(" ") + "</p>"); buf = []; }
        if (ul) { out.push("<ul>" + ul.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</ul>"); ul = null; }
      }
      lines.forEach(function (raw) {
        var line = raw.trim();
        if (!line) { closeAll(); return; }
        if (line.indexOf("## ") === 0) { closeAll(); out.push("<h2>" + inline(line.slice(3)) + "</h2>"); return; }
        if (line.indexOf("### ") === 0) { closeAll(); out.push("<h3>" + inline(line.slice(4)) + "</h3>"); return; }
        if (line.indexOf("- ") === 0) { if (buf.length) closeAll(); if (!ul) ul = []; ul.push(line.slice(2)); return; }
        buf.push(line);
      });
      closeAll();
      return out.join("\n");
    }
    function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function cardHtml(p) {
      return '          <a class="blog-card" href="/blog/' + p.slug + '/">\n' +
        '            <img src="' + (p.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&h=450&q=75") + '"\n' +
        '                 alt="" loading="lazy" decoding="async">\n' +
        '            <div class="blog-card-body">\n' +
        '              <span class="blog-card-date">' + esc(p.meta || p.date) + '</span>\n' +
        '              <h2 class="blog-card-title">' + esc(p.title) + '</h2>\n' +
        '              <p class="blog-card-excerpt">' + esc(p.excerpt || "") + '</p>\n' +
        '              <span class="blog-card-more">Read the article &rarr;</span>\n' +
        '            </div>\n' +
        '          </a>';
    }
    function postPageHtml(p, contentHtml) {
      return '<!DOCTYPE html>\n<html lang="en-AU">\n<head>\n' +
'  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'  <title>' + esc(p.title) + ' | Zap Funds</title>\n' +
'  <meta name="description" content="' + esc(p.excerpt || p.title) + '">\n' +
'  <link rel="canonical" href="https://zapfunds.com.au/blog/' + p.slug + '/">\n' +
'  <meta property="og:title" content="' + esc(p.title) + '">\n' +
'  <meta property="og:description" content="' + esc(p.excerpt || p.title) + '">\n' +
'  <meta property="og:type" content="article">\n' +
'  <meta property="og:url" content="https://zapfunds.com.au/blog/' + p.slug + '/">\n' +
'  <meta property="og:image" content="https://zapfunds.com.au/og-image.png">\n' +
'  <meta property="og:site_name" content="Zap Funds">\n  <meta property="og:locale" content="en_AU">\n' +
'  <meta name="twitter:card" content="summary_large_image">\n' +
'  <meta name="twitter:title" content="' + esc(p.title) + '">\n' +
'  <meta name="twitter:image" content="https://zapfunds.com.au/og-image.png">\n' +
'  <meta name="robots" content="index, follow, max-image-preview:large">\n  <meta name="theme-color" content="#0B0B0E">\n' +
'  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">\n' +
'  <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png">\n' +
'  <link rel="preconnect" href="https://api.fontshare.com">\n' +
'  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">\n' +
'  <link rel="stylesheet" href="/styles.css?v=39">\n' +
'  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "BlogPosting",\n' +
'    "headline": "' + esc(p.title).replace(/"/g, "") + '",\n    "image": "https://zapfunds.com.au/og-image.png",\n' +
'    "datePublished": "' + p.dateISO + '",\n    "author": { "@type": "Person", "name": "Wayne Clothier" },\n' +
'    "publisher": { "@type": "Organization", "name": "Zap Funds" },\n' +
'    "mainEntityOfPage": "https://zapfunds.com.au/blog/' + p.slug + '/"\n  }\n  