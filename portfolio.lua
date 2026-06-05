--[[
  portfolio.lua
  Semua logika portfolio dalam Lua (Fengari runtime)
  Menggantikan script.js + wave-dots.js
]]

local document = js.global.document
local window   = js.global

-- ══════════════════════════════════════════════
-- 1. REVEAL ON SCROLL (IntersectionObserver)
-- ══════════════════════════════════════════════
local reveals = document:querySelectorAll(".reveal")

local observer = js.new(
  js.global.IntersectionObserver,
  function(entries)
    entries:forEach(function(entry)
      if entry.isIntersecting then
        entry.target.classList:add("is-visible")
        observer:unobserve(entry.target)
      end
    end)
  end,
  js.global.JSON:parse('{"threshold": 0.16}')
)

reveals:forEach(function(el)
  observer:observe(el)
end)

-- ══════════════════════════════════════════════
-- 2. PAGE SWITCHER (active state)
-- ══════════════════════════════════════════════
local switcherButtons = document:querySelectorAll(".page-switcher button")

switcherButtons:forEach(function(button)
  button:addEventListener("click", function()
    switcherButtons:forEach(function(item)
      item.classList:remove("is-active")
    end)
    button.classList:add("is-active")
  end)
end)

-- ══════════════════════════════════════════════
-- 3. ICON DOCK VISIBILITY (scroll-based)
-- ══════════════════════════════════════════════
local iconDock     = document:querySelector(".icon-dock")
local introSection = document:querySelector("#intro")
local footer       = document:querySelector(".site-footer")

local function updateDockVisibility()
  if not iconDock or not introSection or not footer then return end
  local start    = introSection.offsetTop - window.innerHeight * 0.45
  local endPos   = footer.offsetTop - window.innerHeight * 0.62
  local shouldShow = window.scrollY >= start and window.scrollY < endPos
  iconDock.classList:toggle("is-visible", shouldShow)
end

window:addEventListener("scroll", updateDockVisibility,
  js.global.JSON:parse('{"passive": true}'))
window:addEventListener("resize", updateDockVisibility)
updateDockVisibility()

-- ══════════════════════════════════════════════
-- 4. LANGUAGE TOGGLE (ID / EN)
-- ══════════════════════════════════════════════
local languageToggle      = document:querySelector(".language-toggle")
local translatableElements = document:querySelectorAll("[data-id][data-en]")
local currentLanguage = "id"

local function setLanguage(lang)
  currentLanguage = lang
  document.documentElement.lang = lang

  translatableElements:forEach(function(el)
    el.textContent = el.dataset[lang]
  end)

  if languageToggle then
    languageToggle.textContent = string.upper(lang)
    languageToggle:setAttribute("aria-label",
      lang == "id" and "Switch to English" or "Ganti ke Bahasa Indonesia")
  end
end

if languageToggle then
  languageToggle:addEventListener("click", function()
    if currentLanguage == "id" then
      setLanguage("en")
    else
      setLanguage("id")
    end
  end)
end

setLanguage(currentLanguage)

-- ══════════════════════════════════════════════
-- 5. WAVE DOTS ANIMATION (Canvas)
-- ══════════════════════════════════════════════
local box = document:querySelector(".footer-wave")

if box then
  local canvas = document:createElement("canvas")
  canvas:setAttribute("aria-hidden", "true")
  canvas.style.position      = "absolute"
  canvas.style.top           = "0"
  canvas.style.left          = "0"
  canvas.style.width         = "100%"
  canvas.style.height        = "100%"
  canvas.style.pointerEvents = "none"
  box:prepend(canvas)

  local ctx = canvas:getContext("2d")
  local W, H, dpr = 0, 0, 1
  local t = 0
  local G    = 12
  local R    = 1.3
  local ROWS = 18

  local function resize()
    dpr = math.min(window.devicePixelRatio or 1, 2)
    W = box.clientWidth
    H = box.clientHeight
    canvas.width  = W * dpr
    canvas.height = H * dpr
    ctx:setTransform(dpr, 0, 0, dpr, 0, 0)
  end

  resize()
  window:addEventListener("resize", resize,
    js.global.JSON:parse('{"passive": true}'))

  local function draw()
    t = t + 0.0008
    ctx:clearRect(0, 0, W, H)
    local cols = math.floor(W / G + 2)
    local by   = H * 0.3

    for r = 0, ROWS - 1 do
      local rp = r / ROWS
      local yb = by + r * G * (1 - rp * 0.55)
      local fa = math.min(1, (r + 1) / 4)
      local ro = math.sin(t * 25 + r * 0.35) * 8

      for c = 0, cols - 1 do
        local px = c * G - G
        local dy = 22 * math.sin(px * 0.018 + t * 60 + r * 0.12)
                 + 14 * math.sin(px * 0.028 + t * 78 + 0.7 + r * 0.12)
                 +  8 * math.sin(px * 0.042 + t * 96 + 1.4 + r * 0.12)
        local py = yb + dy + ro

        if py >= -10 then
          ctx.globalAlpha = 0.6 * (1 - rp * 0.55) * fa
          ctx:beginPath()
          ctx:arc(px, py, R, 0, 6.2832)
          ctx:fill()
        end
      end
    end

    window:requestAnimationFrame(draw)
  end

  window:requestAnimationFrame(draw)
end
