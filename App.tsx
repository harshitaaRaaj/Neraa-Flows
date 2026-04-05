import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ============================================================
   INJECT GLOBAL FONTS + CSS
============================================================ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Nunito:wght@400;600;700;800;900&display=swap');

*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{font-family:'Nunito',sans-serif;background:#f7f8fa;color:#2d2d2d;height:100%;overflow:hidden}
#root{height:100%}

:root{
  --food:#ff4757;--food-light:#fff0f1;
  --grocery:#2ed573;--grocery-dark:#0a9e52;--grocery-light:#eafff4;
  --ride:#1e90ff;--ride-light:#e8f4ff;
  --dark:#1a1a2e;--text:#2d2d2d;--muted:#888;
  --border:#f0f0f0;--white:#ffffff;
  --card-shadow:0 2px 16px rgba(0,0,0,.08);
  --radius:16px;--radius-sm:10px;
}

.app-shell{max-width:430px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;background:#f7f8fa;position:relative;overflow:hidden}
.app-content{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:80px;scroll-behavior:smooth}
.app-content::-webkit-scrollbar{display:none}

.section-header{padding:20px 16px 12px;background:#fff;position:sticky;top:0;z-index:10;border-bottom:1px solid var(--border)}
.header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.location-row{display:flex;align-items:center;gap:6px;cursor:pointer}
.location-label{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.location-name{font-size:15px;font-weight:800;color:var(--text);display:flex;align-items:center;gap:4px}
.header-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;cursor:pointer}

.search-bar{display:flex;align-items:center;background:#f2f3f5;border-radius:12px;padding:10px 14px;gap:10px;cursor:text}
.search-bar input{border:none;background:transparent;font-family:'Nunito',sans-serif;font-size:14px;font-weight:600;color:var(--text);width:100%;outline:none}
.search-bar input::placeholder{color:#bbb}

.category-scroll{display:flex;gap:10px;overflow-x:auto;padding:16px 16px 4px;scrollbar-width:none}
.category-scroll::-webkit-scrollbar{display:none}
.cat-chip{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;flex-shrink:0}
.cat-icon{width:58px;height:58px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .2s}
.cat-chip:active .cat-icon{transform:scale(.92)}
.cat-label{font-size:11px;font-weight:700;color:var(--text);text-align:center;white-space:nowrap}

.promo-banner{margin:8px 16px 0;border-radius:var(--radius);overflow:hidden;position:relative;height:130px}
.promo-banner img{width:100%;height:100%;object-fit:cover}
.banner-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.55) 0%,transparent 70%);display:flex;flex-direction:column;justify-content:center;padding:20px}
.banner-tag{font-size:10px;font-weight:800;background:var(--food);color:#fff;padding:2px 8px;border-radius:20px;width:fit-content;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
.banner-title{font-size:20px;font-weight:900;color:#fff;line-height:1.1}
.banner-sub{font-size:12px;color:rgba(255,255,255,.8);margin-top:4px}

.sec-title{font-size:17px;font-weight:800;color:var(--text);padding:16px 16px 8px;display:flex;align-items:center;justify-content:space-between}
.sec-title a{font-size:13px;font-weight:700;color:var(--food);text-decoration:none}

.filter-row{display:flex;gap:8px;overflow-x:auto;padding:8px 16px;scrollbar-width:none}
.filter-row::-webkit-scrollbar{display:none}
.filter-chip{display:flex;align-items:center;gap:4px;padding:6px 12px;border-radius:20px;border:1.5px solid var(--border);background:#fff;font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;color:var(--text);cursor:pointer;white-space:nowrap;transition:all .15s;flex-shrink:0}
.filter-chip.active{background:var(--food);border-color:var(--food);color:#fff}

.restaurant-list{padding:0 16px;display:flex;flex-direction:column;gap:14px}
.restaurant-card{background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:var(--card-shadow);cursor:pointer;transition:transform .15s}
.restaurant-card:active{transform:scale(.98)}
.restaurant-img{width:100%;height:160px;object-fit:cover;background:#eee}
.restaurant-img-wrap{position:relative}
.discount-badge{position:absolute;bottom:8px;left:8px;background:var(--food);color:#fff;font-size:11px;font-weight:800;padding:3px 8px;border-radius:6px}
.veg-badge{position:absolute;top:8px;right:8px;width:20px;height:20px;border:2px solid;border-radius:4px;display:flex;align-items:center;justify-content:center}
.veg-badge.veg{border-color:#2ed573}.veg-badge.veg::after{content:'';width:8px;height:8px;background:#2ed573;border-radius:50%}
.veg-badge.nonveg{border-color:#ff4757}.veg-badge.nonveg::after{content:'';width:8px;height:8px;background:#ff4757;border-radius:50%}
.restaurant-info{padding:12px 14px}
.restaurant-name{font-size:15px;font-weight:800;margin-bottom:4px}
.restaurant-meta{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);font-weight:600}
.restaurant-meta .rating{display:flex;align-items:center;gap:3px;background:#2ed573;color:#fff;padding:2px 6px;border-radius:6px;font-size:12px;font-weight:800}
.restaurant-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.tag-chip{font-size:11px;font-weight:600;color:var(--muted);background:#f5f5f5;padding:2px 8px;border-radius:20px}

.menu-page{position:fixed;inset:0;z-index:50;background:#f7f8fa;max-width:430px;margin:0 auto;overflow-y:auto;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.menu-hero{position:relative;height:220px}
.menu-hero img{width:100%;height:100%;object-fit:cover}
.menu-hero-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.7) 0%,transparent 60%)}
.back-btn{position:absolute;top:16px;left:16px;width:36px;height:36px;border-radius:50%;background:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)}
.menu-hero-info{position:absolute;bottom:16px;left:16px;right:16px;color:#fff}
.menu-hero-info h2{font-size:22px;font-weight:900}
.menu-hero-info p{font-size:12px;opacity:.85;margin-top:2px}
.menu-stats{display:flex;gap:0;background:#fff;border-bottom:1px solid var(--border)}
.stat-box{flex:1;padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:2px;border-right:1px solid var(--border)}
.stat-box:last-child{border-right:none}
.stat-val{font-size:16px;font-weight:900;color:var(--text)}
.stat-label{font-size:10px;font-weight:600;color:var(--muted)}
.menu-category-tabs{display:flex;gap:0;overflow-x:auto;background:#fff;border-bottom:2px solid var(--border);padding:0 8px;scrollbar-width:none}
.menu-category-tabs::-webkit-scrollbar{display:none}
.menu-tab{padding:12px 14px;font-size:13px;font-weight:700;color:var(--muted);white-space:nowrap;cursor:pointer;border:none;background:none;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s}
.menu-tab.active{color:var(--food);border-bottom-color:var(--food)}
.menu-items{padding:8px 0 100px}
.menu-section-title{font-size:14px;font-weight:800;color:var(--text);padding:12px 16px 6px;text-transform:uppercase;letter-spacing:.3px;background:#f7f8fa}
.menu-item{background:#fff;margin:0 0 1px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;border-bottom:1px solid var(--border)}
.menu-item-info{flex:1}
.menu-item-name{font-size:14px;font-weight:800;margin-bottom:4px}
.menu-item-desc{font-size:12px;color:var(--muted);line-height:1.4;margin-bottom:6px}
.menu-item-price{font-size:15px;font-weight:900;color:var(--text)}
.menu-item-img-wrap{position:relative;flex-shrink:0}
.menu-item-img{width:90px;height:90px;border-radius:12px;object-fit:cover;background:#eee}
.add-btn{position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);background:#fff;border:1.5px solid var(--food);color:var(--food);font-weight:800;font-size:13px;padding:4px 18px;border-radius:8px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(255,71,87,.2);transition:all .15s}
.add-btn:active{background:var(--food);color:#fff}
.qty-ctrl{position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);display:flex;align-items:center;background:var(--food);border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(255,71,87,.3)}
.qty-btn{background:none;border:none;color:#fff;font-size:16px;font-weight:900;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.qty-val{color:#fff;font-weight:800;font-size:13px;min-width:22px;text-align:center}

.grocery-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:8px 16px}
.grocery-card{background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:var(--card-shadow);cursor:pointer;transition:transform .15s}
.grocery-card:active{transform:scale(.97)}
.grocery-img{width:100%;height:120px;object-fit:contain;background:#f9f9f9;padding:10px}
.grocery-info{padding:10px 12px 12px}
.grocery-name{font-size:13px;font-weight:700;margin-bottom:2px}
.grocery-weight{font-size:11px;color:var(--muted);margin-bottom:6px}
.grocery-price-row{display:flex;align-items:center;justify-content:space-between}
.grocery-price{font-size:14px;font-weight:900}
.grocery-mrp{font-size:11px;color:var(--muted);text-decoration:line-through}
.grocery-discount{font-size:11px;font-weight:700;color:var(--grocery-dark)}
.grocery-add-btn{background:none;border:1.5px solid var(--grocery-dark);color:var(--grocery-dark);font-weight:800;font-size:12px;padding:4px 12px;border-radius:8px;cursor:pointer;transition:all .15s}
.grocery-qty-ctrl{display:flex;align-items:center;background:var(--grocery-dark);border-radius:8px;overflow:hidden}
.grocery-qty-ctrl .qty-btn{color:#fff}
.grocery-qty-ctrl .qty-val{color:#fff;font-size:12px}

.delivery-banner{margin:8px 16px;background:linear-gradient(135deg,#1e3c72,#2a5298);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;gap:12px;color:#fff}
.delivery-banner-text h4{font-size:14px;font-weight:800}
.delivery-banner-text p{font-size:12px;opacity:.8}

.gps-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--ride);background:var(--ride-light);padding:2px 8px;border-radius:20px}

.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid var(--border);display:flex;z-index:40;padding-bottom:env(safe-area-inset-bottom);box-shadow:0 -4px 20px rgba(0,0,0,.06)}
.nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 0;cursor:pointer;border:none;background:none;transition:all .2s}
.nav-icon{font-size:22px;position:relative}
.nav-badge{position:absolute;top:-4px;right:-8px;background:var(--food);color:#fff;font-size:9px;font-weight:900;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.nav-label{font-size:10px;font-weight:700;color:var(--muted)}
.nav-tab.food.active .nav-label{color:var(--food)}
.nav-tab.grocery.active .nav-label{color:var(--grocery-dark)}
.nav-tab.ride.active .nav-label{color:var(--ride)}

.floating-cart{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:35;width:calc(100% - 32px);max-width:398px}
.floating-cart-btn{width:100%;padding:14px 20px;background:linear-gradient(135deg,#ff4757,#ff2442);color:#fff;border:none;border-radius:14px;font-family:'Nunito',sans-serif;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 8px 24px rgba(255,71,87,.45);animation:slideUp .3s ease}
.floating-cart-left{display:flex;align-items:center;gap:10px}
.floating-cart-count{background:rgba(255,255,255,.2);padding:4px 8px;border-radius:8px;font-size:12px;font-weight:800}
.floating-cart-text{font-size:14px;font-weight:800}
.floating-cart-price{font-size:16px;font-weight:900}

@keyframes bounceIn{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-4px)}}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(4px,-4px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,71,87,.4)}50%{box-shadow:0 0 0 8px rgba(255,71,87,0)}}

/* ── AUTH CSS ── */
.nf-root{position:fixed;inset:0;z-index:200;font-family:'Nunito',sans-serif;overflow:hidden;display:flex;align-items:flex-end;justify-content:center}
.nf-bg-base{position:absolute;inset:0;background:linear-gradient(160deg,#050010 0%,#0d0520 20%,#100830 45%,#060215 70%,#000008 100%)}
.nf-bg-scenery{position:absolute;inset:0;background:radial-gradient(ellipse 120% 60% at 50% 100%,#1a0a3a 0%,transparent 60%),radial-gradient(ellipse 80% 40% at 20% 80%,#0d1a3a 0%,transparent 50%),radial-gradient(ellipse 60% 30% at 80% 75%,#0a1520 0%,transparent 50%)}
.nf-bg-scenery::before{content:'';position:absolute;bottom:0;left:0;right:0;height:45%;background:linear-gradient(180deg,transparent 0%,#0a041a 30%,#06020f 100%);clip-path:polygon(0% 100%,0% 70%,8% 55%,14% 62%,20% 42%,28% 58%,36% 35%,42% 50%,50% 28%,58% 48%,64% 32%,72% 52%,80% 38%,88% 55%,94% 45%,100% 60%,100% 100%)}
.nf-bg-scenery::after{content:'';position:absolute;inset:0;background-image:radial-gradient(1px 1px at 15% 8%,rgba(255,255,255,.8) 0%,transparent 100%),radial-gradient(1px 1px at 72% 5%,rgba(255,255,255,.6) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 45% 12%,rgba(255,255,255,.9) 0%,transparent 100%),radial-gradient(1px 1px at 88% 18%,rgba(255,255,255,.5) 0%,transparent 100%),radial-gradient(1px 1px at 30% 22%,rgba(200,160,255,.7) 0%,transparent 100%),radial-gradient(1px 1px at 60% 9%,rgba(255,255,255,.7) 0%,transparent 100%),radial-gradient(1px 1px at 5% 30%,rgba(255,255,255,.4) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 92% 35%,rgba(0,245,255,.5) 0%,transparent 100%),radial-gradient(1px 1px at 55% 3%,rgba(255,255,255,.8) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 38% 16%,rgba(200,160,255,.6) 0%,transparent 100%)}
.nf-bg-fog{position:absolute;inset:0;background:radial-gradient(ellipse 100% 30% at 50% 85%,rgba(110,64,255,.12) 0%,transparent 70%),radial-gradient(ellipse 60% 20% at 20% 90%,rgba(0,245,255,.06) 0%,transparent 60%);animation:fogDrift 12s ease-in-out infinite alternate}
@keyframes fogDrift{from{transform:translateX(-10px) scaleX(1)}to{transform:translateX(10px) scaleX(1.05)}}
.nf-bg-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,transparent 40%,rgba(0,0,0,.7) 100%)}
.nf-hexgrid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(6,1fr);gap:20px;padding:20px;pointer-events:none}
.nf-hex{width:50px;height:58px;background:rgba(110,64,255,.04);clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);border:1px solid rgba(110,64,255,.08);animation:hexPulse 6s ease-in-out infinite}
@keyframes hexPulse{0%,100%{opacity:.3}50%{opacity:.8}}
.nf-particle{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(110,64,255,.8) 0%,rgba(0,245,255,.4) 100%);animation:particleDrift linear infinite;pointer-events:none}
@keyframes particleDrift{0%{transform:translateY(0) scale(1);opacity:0}10%{opacity:1}90%{opacity:.6}100%{transform:translateY(-120vh) scale(.5);opacity:0}}
.nf-gojo-wrap{position:absolute;bottom:0;right:-10px;width:260px;height:520px;z-index:2;filter:drop-shadow(0 0 40px rgba(110,64,255,.4)) drop-shadow(0 0 80px rgba(0,245,255,.15));animation:gojoFloat 5s ease-in-out infinite;pointer-events:none}
.nf-gojo{width:100%;height:100%}
@keyframes gojoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.nf-landing{position:relative;z-index:10;width:100%;max-width:430px;padding:0 28px 60px;display:flex;flex-direction:column}
.nf-brand-pill{display:inline-flex;align-items:center;background:rgba(110,64,255,.2);border:1px solid rgba(110,64,255,.5);color:#c8a8ff;padding:5px 14px;border-radius:20px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;width:fit-content;margin-bottom:20px;backdrop-filter:blur(8px)}
.nf-headline{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
.nf-headline-sub{font-size:13px;font-weight:700;color:rgba(200,168,255,.7);letter-spacing:1px;text-transform:uppercase}
.nf-headline-main{font-family:'Cinzel',serif;font-size:clamp(32px,9vw,42px);font-weight:900;line-height:1;background:linear-gradient(135deg,#fff 0%,#c8a8ff 40%,#00f5ff 80%,#6e40ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 20px rgba(110,64,255,.5))}
.nf-headline-tag{font-size:15px;font-weight:800;color:rgba(255,255,255,.9);line-height:1.3;text-shadow:0 0 20px rgba(0,245,255,.3)}
.nf-tagline{font-size:13px;line-height:1.6;color:rgba(255,255,255,.5);margin-bottom:20px}
.nf-infinity-ring{position:relative;width:80px;height:80px;margin-bottom:28px}
.nf-ring{position:absolute;border-radius:50%;border:1.5px solid;top:50%;left:50%;animation:ringPulse 3s ease-in-out infinite}
.nf-ring-1{width:40px;height:40px;margin:-20px 0 0 -20px;border-color:rgba(0,245,255,.8);animation-delay:0s}
.nf-ring-2{width:65px;height:65px;margin:-32px 0 0 -32px;border-color:rgba(110,64,255,.5);animation-delay:.5s}
.nf-ring-3{width:80px;height:80px;margin:-40px 0 0 -40px;border-color:rgba(110,64,255,.2);animation-delay:1s}
@keyframes ringPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.5}}
.nf-cta{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:18px 0;background:linear-gradient(135deg,#6e40ff 0%,#4020c0 50%,#00b4cc 100%);border:none;border-radius:16px;font-family:'Nunito',sans-serif;font-size:17px;font-weight:900;color:#fff;cursor:pointer;box-shadow:0 8px 32px rgba(110,64,255,.5),0 0 60px rgba(0,245,255,.15);position:relative;overflow:hidden;transition:transform .2s;margin-bottom:14px}
.nf-cta::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 60%)}
.nf-cta:active{transform:scale(.97)}
.nf-cta-arrow{font-size:20px}
.nf-footer-note{font-size:11px;color:rgba(255,255,255,.3);text-align:center}
.nf-auth-wrap{position:relative;z-index:10;width:100%;max-width:430px;padding:20px 16px 40px;display:flex;flex-direction:column}
.nf-back-btn{background:none;border:none;color:rgba(200,168,255,.7);font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;width:fit-content;padding:6px 0}
.nf-auth-card{background:rgba(10,5,25,.85);backdrop-filter:blur(24px) saturate(180%);border:1px solid rgba(110,64,255,.3);border-radius:24px;padding:28px 24px;position:relative;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08)}
.nf-card-glow-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#6e40ff,#00f5ff,#6e40ff,transparent);animation:glowSlide 4s linear infinite}
@keyframes glowSlide{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
.nf-auth-logo{font-size:32px;text-align:center;margin-bottom:10px;filter:drop-shadow(0 0 12px rgba(0,245,255,.6))}
.nf-auth-title{font-family:'Cinzel',serif;font-size:20px;font-weight:700;text-align:center;margin-bottom:6px;background:linear-gradient(135deg,#fff,#c8a8ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.nf-auth-sub{font-size:13px;color:rgba(255,255,255,.45);text-align:center;margin-bottom:22px;line-height:1.5}
.nf-form{display:flex;flex-direction:column;gap:12px}
.nf-input-group{display:flex;align-items:center;background:rgba(255,255,255,.06);border:1.5px solid rgba(110,64,255,.35);border-radius:14px;overflow:hidden;transition:border-color .2s}
.nf-input-group:focus-within{border-color:#6e40ff;box-shadow:0 0 0 3px rgba(110,64,255,.15)}
.nf-input-prefix{padding:0 12px;font-size:13px;font-weight:700;color:rgba(255,255,255,.6);border-right:1px solid rgba(110,64,255,.25);white-space:nowrap}
.nf-input{flex:1;padding:14px;background:transparent;border:none;font-family:'Nunito',sans-serif;font-size:15px;font-weight:700;color:#fff;outline:none;letter-spacing:1px}
.nf-input::placeholder{color:rgba(255,255,255,.25);letter-spacing:0}
.nf-primary-btn{width:100%;padding:15px;background:linear-gradient(135deg,#6e40ff,#4020c0);border:none;border-radius:14px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:900;color:#fff;cursor:pointer;box-shadow:0 6px 24px rgba(110,64,255,.45);transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
.nf-primary-btn:active{transform:scale(.97)}
.nf-primary-btn:disabled{opacity:.5;cursor:default}
.nf-divider{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.25);font-size:12px;font-weight:600}
.nf-divider::before,.nf-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.1)}
.nf-social-row{display:flex;gap:8px}
.nf-social-btn{flex:1;padding:11px 8px;display:flex;flex-direction:column;align-items:center;gap:5px;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.12);border-radius:12px;cursor:pointer;transition:all .15s;color:rgba(255,255,255,.7);font-family:'Nunito',sans-serif;font-size:10px;font-weight:700}
.nf-social-btn:hover{background:rgba(110,64,255,.15);border-color:rgba(110,64,255,.5);color:#fff}
.nf-otp-row{display:flex;gap:8px;justify-content:center}
.nf-otp-box{width:44px;height:52px;background:rgba(255,255,255,.05);border:1.5px solid rgba(110,64,255,.35);border-radius:12px;text-align:center;font-family:'Cinzel',serif;font-size:20px;font-weight:700;color:#fff;outline:none;transition:all .15s;caret-color:#6e40ff}
.nf-otp-box:focus{border-color:#6e40ff;box-shadow:0 0 0 3px rgba(110,64,255,.2);background:rgba(110,64,255,.1)}
.nf-otp-filled{border-color:#00f5ff;background:rgba(0,245,255,.08);color:#00f5ff}
.nf-otp-hint{text-align:center;font-size:11px;color:rgba(255,255,255,.3);padding:4px 0}
.nf-otp-hint strong{color:rgba(0,245,255,.7)}
.nf-resend-row{text-align:center}
.nf-timer{font-size:12px;color:rgba(255,255,255,.3);font-weight:700}
.nf-resend-btn{background:none;border:none;cursor:pointer;color:#6e40ff;font-family:'Nunito',sans-serif;font-size:13px;font-weight:800}
.nf-spinner{display:inline-block;width:18px;height:18px;border-radius:50%;border:2.5px solid rgba(255,255,255,.2);border-top-color:#fff;animation:spin .7s linear infinite}
.nf-shake{animation:shake .5s cubic-bezier(.36,.07,.19,.97) both}
@keyframes shake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-6px)}40%,60%{transform:translateX(6px)}}
`;

// Inject CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
}

/* ============================================================
   DATA
============================================================ */
const RESTAURANTS = [
  { id:1, name:"Biryani Blues", cuisine:"North Indian, Biryani", rating:4.5, ratingCount:"2.3k", deliveryTime:"25-35", deliveryFee:30, minOrder:149, distance:"1.2 km", discount:"50% OFF up to ₹100", img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=200&fit=crop", isVeg:false, isOpen:true, lat:25.612, lng:85.143 },
  { id:2, name:"The Pizza Company", cuisine:"Italian, Fast Food", rating:4.3, ratingCount:"1.8k", deliveryTime:"20-30", deliveryFee:0, minOrder:199, distance:"0.8 km", discount:"Free Delivery", img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=200&fit=crop", isVeg:false, isOpen:true, lat:25.614, lng:85.141 },
  { id:3, name:"Green Bowl", cuisine:"Healthy, Salads, Vegan", rating:4.6, ratingCount:"987", deliveryTime:"15-25", deliveryFee:20, minOrder:99, distance:"0.5 km", discount:"₹60 OFF on ₹299", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop", isVeg:true, isOpen:true, lat:25.610, lng:85.145 },
  { id:4, name:"Burger Factory", cuisine:"American, Burgers", rating:4.2, ratingCount:"3.1k", deliveryTime:"20-35", deliveryFee:25, minOrder:149, distance:"1.5 km", discount:"Buy 1 Get 1", img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=200&fit=crop", isVeg:false, isOpen:true, lat:25.615, lng:85.139 },
  { id:5, name:"Spice Route", cuisine:"South Indian, Thali", rating:4.7, ratingCount:"4.2k", deliveryTime:"30-45", deliveryFee:0, minOrder:199, distance:"2.0 km", discount:"20% OFF", img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=200&fit=crop", isVeg:true, isOpen:true, lat:25.609, lng:85.142 },
  { id:6, name:"Chinese Wok", cuisine:"Chinese, Thai", rating:4.1, ratingCount:"1.2k", deliveryTime:"25-40", deliveryFee:30, minOrder:149, distance:"1.8 km", discount:"Flat ₹50 OFF", img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=200&fit=crop", isVeg:false, isOpen:false, lat:25.613, lng:85.147 },
];

const MENU_DATA = {
  1:{ categories:["Recommended","Biryani","Starters","Breads","Beverages"], items:[
    {id:101,name:"Chicken Biryani",category:"Biryani",desc:"Aromatic basmati rice with tender chicken",price:280,img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop",isVeg:false,isBestseller:true},
    {id:102,name:"Mutton Biryani",category:"Biryani",desc:"Slow cooked mutton dum biryani",price:360,img:"https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=200&h=200&fit=crop",isVeg:false,isBestseller:false},
    {id:103,name:"Veg Biryani",category:"Biryani",desc:"Fresh veggies in fragrant basmati rice",price:220,img:"https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:104,name:"Chicken Seekh Kebab",category:"Starters",desc:"Minced chicken on skewer, mint chutney",price:240,img:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=200&fit=crop",isVeg:false,isBestseller:false},
    {id:105,name:"Paneer Tikka",category:"Starters",desc:"Marinated paneer grilled in tandoor",price:220,img:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:106,name:"Butter Naan",category:"Breads",desc:"Soft naan brushed with butter",price:45,img:"https://images.unsplash.com/photo-1594491990076-25c6f46e7b2a?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
    {id:107,name:"Mango Lassi",category:"Beverages",desc:"Chilled mango yogurt drink",price:90,img:"https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
  ]},
  2:{ categories:["Recommended","Pizzas","Pastas","Beverages"], items:[
    {id:201,name:"Margherita Pizza",category:"Pizzas",desc:"Classic tomato mozzarella basil",price:299,img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:202,name:"Pepperoni Pizza",category:"Pizzas",desc:"Loaded pepperoni and cheese",price:399,img:"https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop",isVeg:false,isBestseller:true},
    {id:203,name:"BBQ Chicken Pizza",category:"Pizzas",desc:"Smoky BBQ sauce grilled chicken",price:429,img:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",isVeg:false,isBestseller:false},
    {id:204,name:"Pasta Arrabbiata",category:"Pastas",desc:"Penne in spicy tomato sauce",price:249,img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
    {id:205,name:"Coke 500ml",category:"Beverages",desc:"Chilled Coca-Cola",price:60,img:"https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
  ]},
  3:{ categories:["Recommended","Salads","Bowls","Drinks"], items:[
    {id:301,name:"Caesar Salad",category:"Salads",desc:"Romaine, croutons, parmesan, caesar dressing",price:219,img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:302,name:"Quinoa Bowl",category:"Bowls",desc:"Quinoa roasted veggies tahini dressing",price:279,img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:303,name:"Green Smoothie",category:"Drinks",desc:"Spinach banana almond milk blend",price:149,img:"https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
  ]},
  4:{ categories:["Recommended","Burgers","Sides","Beverages"], items:[
    {id:401,name:"Classic Chicken Burger",category:"Burgers",desc:"Crispy fried chicken lettuce mayo",price:199,img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",isVeg:false,isBestseller:true},
    {id:402,name:"Double Beef Smash Burger",category:"Burgers",desc:"Two smash patties cheddar pickles",price:299,img:"https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop",isVeg:false,isBestseller:true},
    {id:403,name:"Veggie Burger",category:"Burgers",desc:"Crispy aloo tikki fresh veggies",price:149,img:"https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
    {id:404,name:"Loaded Fries",category:"Sides",desc:"Crispy fries cheese sauce jalapeños",price:129,img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:405,name:"Chocolate Shake",category:"Beverages",desc:"Thick creamy chocolate milkshake",price:149,img:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
  ]},
  5:{ categories:["Recommended","Dosas","Idli & Vada","Thali"], items:[
    {id:501,name:"Masala Dosa",category:"Dosas",desc:"Crispy dosa spiced potato sambar chutney",price:149,img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:502,name:"Rava Dosa",category:"Dosas",desc:"Instant crispy rava dosa with onions",price:139,img:"https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&h=200&fit=crop",isVeg:true,isBestseller:false},
    {id:503,name:"Idli Sambar (3 pcs)",category:"Idli & Vada",desc:"Soft steamed idlis sambar coconut chutney",price:99,img:"https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:504,name:"South Indian Thali",category:"Thali",desc:"Rice 2 curries rasam sambar papad dessert",price:249,img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
  ]},
  6:{ categories:["Recommended","Momos","Noodles"], items:[
    {id:601,name:"Veg Steamed Momos (8 pcs)",category:"Momos",desc:"Steamed dumplings spicy chutney",price:120,img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop",isVeg:true,isBestseller:true},
    {id:602,name:"Hakka Noodles",category:"Noodles",desc:"Tossed noodles veggies dark sauce",price:160,img:"https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200&h=200&fit=crop",isVeg:false,isBestseller:false},
  ]},
};

const GROCERY_CATEGORIES = [
  {id:"all",label:"All",emoji:"🛒"},{id:"fruits",label:"Fruits",emoji:"🍎"},
  {id:"vegetables",label:"Veggies",emoji:"🥦"},{id:"dairy",label:"Dairy",emoji:"🥛"},
  {id:"snacks",label:"Snacks",emoji:"🍿"},{id:"beverages",label:"Drinks",emoji:"🧃"},
  {id:"bakery",label:"Bakery",emoji:"🍞"},{id:"personal",label:"Personal",emoji:"🧴"},
];

const GROCERY_ITEMS = [
  {id:1001,name:"Amul Full Cream Milk",category:"dairy",weight:"1 Litre",price:68,mrp:70,img:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop",discount:3},
  {id:1002,name:"Farm Fresh Eggs",category:"dairy",weight:"6 pcs",price:65,mrp:72,img:"https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop",discount:10},
  {id:1003,name:"Aashirvaad Atta",category:"bakery",weight:"5 kg",price:255,mrp:290,img:"https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200&h=200&fit=crop",discount:12},
  {id:1004,name:"Tropicana Orange Juice",category:"beverages",weight:"1 Litre",price:95,mrp:110,img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop",discount:14},
  {id:1005,name:"Lay's Classic Salted",category:"snacks",weight:"100g",price:20,mrp:20,img:"https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop",discount:0},
  {id:1006,name:"Fresh Bananas",category:"fruits",weight:"Dozen",price:45,mrp:52,img:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop",discount:13},
  {id:1007,name:"Onions",category:"vegetables",weight:"1 kg",price:35,mrp:40,img:"https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop",discount:13},
  {id:1008,name:"Tomatoes",category:"vegetables",weight:"500g",price:28,mrp:35,img:"https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=200&h=200&fit=crop",discount:20},
  {id:1009,name:"Amul Butter",category:"dairy",weight:"500g",price:265,mrp:280,img:"https://images.unsplash.com/photo-1589985269425-cf1d2048f24c?w=200&h=200&fit=crop",discount:5},
  {id:1010,name:"Dove Soap",category:"personal",weight:"100g x3",price:145,mrp:165,img:"https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop",discount:12},
  {id:1011,name:"Maggi Noodles",category:"snacks",weight:"12 packs",price:180,mrp:204,img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",discount:12},
  {id:1012,name:"Apple (Kashmiri)",category:"fruits",weight:"1 kg",price:160,mrp:200,img:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",discount:20},
  {id:1013,name:"Spinach (Palak)",category:"vegetables",weight:"500g",price:22,mrp:28,img:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop",discount:21},
  {id:1014,name:"Whole Wheat Bread",category:"bakery",weight:"400g",price:45,mrp:52,img:"https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200&h=200&fit=crop",discount:13},
  {id:1015,name:"Coconut Water",category:"beverages",weight:"250ml x6",price:120,mrp:144,img:"https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop",discount:17},
  {id:1016,name:"Head & Shoulders Shampoo",category:"personal",weight:"340ml",price:285,mrp:330,img:"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=200&h=200&fit=crop",discount:14},
];

const FOOD_CATEGORIES = [
  {id:"all",label:"All",emoji:"🍽️",color:"#fff0f1"},{id:"biryani",label:"Biryani",emoji:"🍛",color:"#fff4e0"},
  {id:"pizza",label:"Pizza",emoji:"🍕",color:"#fff0f1"},{id:"burger",label:"Burger",emoji:"🍔",color:"#fff9e0"},
  {id:"chinese",label:"Chinese",emoji:"🥡",color:"#f0fff4"},{id:"healthy",label:"Healthy",emoji:"🥗",color:"#eafff4"},
  {id:"desserts",label:"Desserts",emoji:"🍰",color:"#fdf0ff"},{id:"south",label:"South Indian",emoji:"🫓",color:"#fff4e0"},
];

const INITIAL_INVENTORY = [
  {id:1001,name:"Amul Full Cream Milk",stock:48,threshold:10,unit:"Litre",category:"dairy"},
  {id:1002,name:"Farm Fresh Eggs",stock:5,threshold:10,unit:"pcs",category:"dairy"},
  {id:1003,name:"Aashirvaad Atta",stock:22,threshold:8,unit:"kg",category:"bakery"},
  {id:1004,name:"Tropicana Orange Juice",stock:3,threshold:10,unit:"Litre",category:"beverages"},
  {id:1005,name:"Lay's Classic Salted",stock:60,threshold:15,unit:"pcs",category:"snacks"},
  {id:1006,name:"Fresh Bananas",stock:30,threshold:12,unit:"dozen",category:"fruits"},
  {id:1007,name:"Onions",stock:7,threshold:10,unit:"kg",category:"vegetables"},
  {id:1008,name:"Tomatoes",stock:2,threshold:10,unit:"kg",category:"vegetables"},
  {id:1009,name:"Amul Butter",stock:14,threshold:8,unit:"pcs",category:"dairy"},
  {id:1010,name:"Dove Soap",stock:20,threshold:10,unit:"pcs",category:"personal"},
  {id:1011,name:"Maggi Noodles",stock:45,threshold:20,unit:"packs",category:"snacks"},
  {id:1012,name:"Apple (Kashmiri)",stock:8,threshold:10,unit:"kg",category:"fruits"},
];

/* ============================================================
   CONTEXT
============================================================ */
const AppContext = createContext(null);
let orderIdCounter = 1001;

function AppProvider({ children }) {
  const [foodCart, setFoodCart] = useState([]);
  const [groceryCart, setGroceryCart] = useState([]);
  const [paymentScreen, setPaymentScreen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [rideBooked, setRideBooked] = useState(null);
  const [activeView, setActiveView] = useState("customer");
  const [restaurantOrders, setRestaurantOrders] = useState([]);
  const [groceryOrders, setGroceryOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [restaurantNotifications, setRestaurantNotifications] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [darkstoreNotifications, setDarkstoreNotifications] = useState([]);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  const addToFoodCart = (item, restaurant) => setFoodCart(p => { const e = p.find(i=>i.id===item.id); return e ? p.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i) : [...p,{...item,qty:1,restaurant}]; });
  const addToGroceryCart = (item) => setGroceryCart(p => { const e = p.find(i=>i.id===item.id); return e ? p.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i) : [...p,{...item,qty:1}]; });
  const removeFromFoodCart = (id) => setFoodCart(p => { const e=p.find(i=>i.id===id); return e&&e.qty>1?p.map(i=>i.id===id?{...i,qty:i.qty-1}:i):p.filter(i=>i.id!==id); });
  const removeFromGroceryCart = (id) => setGroceryCart(p => { const e=p.find(i=>i.id===id); return e&&e.qty>1?p.map(i=>i.id===id?{...i,qty:i.qty-1}:i):p.filter(i=>i.id!==id); });
  const clearCart = () => { setFoodCart([]); setGroceryCart([]); };

  const placeOrder = useCallback(({ payment, deliveryAddress, tip=0 }) => {
    const orderId = `ORD${orderIdCounter++}`;
    const timeStr = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const fTotal = foodCart.reduce((s,i)=>s+i.price*i.qty,0);
    const gTotal = groceryCart.reduce((s,i)=>s+i.price*i.qty,0);
    const grandTotal = fTotal+gTotal+(fTotal>0?30:0)+(gTotal>0?15:0)+5+tip;
    const byR = {};
    foodCart.forEach(item=>{ const r=item.restaurant||"Unknown"; if(!byR[r])byR[r]=[]; byR[r].push(item); });
    const newROrders = Object.entries(byR).map(([rName,items])=>({ id:`${orderId}-F`, orderId, type:"food", restaurant:rName, items, subtotal:items.reduce((s,i)=>s+i.price*i.qty,0), status:"new", customer:"Aditya K.", phone:"+91 98765 43210", address:deliveryAddress||"Boring Road, Patna", payment, time:timeStr, estimatedTime:25 }));
    let newGO = null;
    if(groceryCart.length>0){
      newGO = { id:`${orderId}-G`, orderId, type:"grocery", items:[...groceryCart], subtotal:gTotal, status:"new", customer:"Aditya K.", phone:"+91 98765 43210", address:deliveryAddress||"Boring Road, Patna", payment, time:timeStr, estimatedTime:10 };
      setInventory(prev=>prev.map(item=>{ const ci=groceryCart.find(g=>g.id===item.id); return ci?{...item,stock:Math.max(0,item.stock-ci.qty)}:item; }));
      const updInv = INITIAL_INVENTORY.map(item=>{ const ci=groceryCart.find(g=>g.id===item.id); return ci?{...item,stock:Math.max(0,item.stock-ci.qty)}:item; });
      updInv.filter(i=>{ const ci=groceryCart.find(g=>g.id===i.id); return ci&&(i.stock-ci.qty)<=i.threshold; }).forEach(item=>{
        const ns=Math.max(0,item.stock-(groceryCart.find(g=>g.id===item.id)?.qty||0));
        setDarkstoreNotifications(p=>[{id:Date.now()+Math.random(),type:"low_stock",title:"⚠️ Low Stock Alert",message:`${item.name} — only ${ns} ${item.unit} left`,item:{...item,stock:ns},time:timeStr,read:false},...p]);
        setAdminNotifications(p=>[{id:Date.now()+Math.random(),type:"low_stock",title:"⚠️ Inventory Alert",message:`${item.name} is running low (${ns} ${item.unit})`,time:timeStr,read:false},...p]);
      });
      setDarkstoreNotifications(p=>[{id:Date.now()+Math.random(),type:"new_order",title:"📦 New Grocery Order!",message:`Order ${newGO.id} • ${newGO.items.length} item(s) • ₹${gTotal}`,order:newGO,time:timeStr,read:false},...p]);
    }
    newROrders.forEach(ro=>setRestaurantNotifications(p=>[{id:Date.now()+Math.random(),type:"new_order",title:"🔔 New Order Received!",message:`${ro.id} • ${ro.items.length} item(s) • ₹${ro.subtotal}`,order:ro,time:timeStr,read:false},...p]));
    setAdminNotifications(p=>[{id:Date.now(),type:"new_order",title:"🛎️ New Order Placed",message:`${orderId} • ₹${grandTotal} via ${payment.toUpperCase()}`,time:timeStr,read:false},...p]);
    if(newROrders.length) setRestaurantOrders(p=>[...newROrders,...p]);
    if(newGO) setGroceryOrders(p=>[newGO,...p]);
    setAllOrders(p=>[...newROrders,...(newGO?[newGO]:[]),...p]);
    clearCart(); setPaymentScreen(false);
    setOrderSuccess({ orderId, total:grandTotal, payment, tip });
  }, [foodCart, groceryCart]);

  const updateOrderStatus = (id,status) => { setRestaurantOrders(p=>p.map(o=>o.id===id?{...o,status}:o)); setAllOrders(p=>p.map(o=>o.id===id?{...o,status}:o)); };
  const updateGroceryOrderStatus = (id,status) => { setGroceryOrders(p=>p.map(o=>o.id===id?{...o,status}:o)); setAllOrders(p=>p.map(o=>o.id===id?{...o,status}:o)); };
  const markNotificationRead = (panel,id) => { const s=panel==="restaurant"?setRestaurantNotifications:panel==="admin"?setAdminNotifications:setDarkstoreNotifications; s(p=>p.map(n=>n.id===id?{...n,read:true}:n)); };
  const restockItem = (itemId,qty) => setInventory(p=>p.map(i=>i.id===itemId?{...i,stock:i.stock+qty}:i));

  const foodTotal = foodCart.reduce((s,i)=>s+i.price*i.qty,0);
  const groceryTotal = groceryCart.reduce((s,i)=>s+i.price*i.qty,0);
  const totalItems = foodCart.reduce((s,i)=>s+i.qty,0)+groceryCart.reduce((s,i)=>s+i.qty,0);

  return <AppContext.Provider value={{ foodCart,groceryCart,addToFoodCart,addToGroceryCart,removeFromFoodCart,removeFromGroceryCart,clearCart,foodTotal,groceryTotal,totalItems,paymentScreen,setPaymentScreen,orderSuccess,setOrderSuccess,rideBooked,setRideBooked,activeView,setActiveView,placeOrder,restaurantOrders,groceryOrders,allOrders,updateOrderStatus,updateGroceryOrderStatus,restaurantNotifications,adminNotifications,darkstoreNotifications,markNotificationRead,inventory,restockItem }}>{children}</AppContext.Provider>;
}
const useApp = () => useContext(AppContext);

/* ============================================================
   AUTH PAGE
============================================================ */
const GoogleIcon = () => <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.7 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5.1l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.5 6l6.2 5.2C38.1 36 44 31 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>;
const GithubIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.4.6.11.82-.26.82-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.138 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>;
const AppleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>;

function GojoSilhouette() {
  return <svg className="nf-gojo" viewBox="0 0 260 520" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#00f5ff" stopOpacity="1"/><stop offset="60%" stopColor="#6e40ff" stopOpacity=".7"/><stop offset="100%" stopColor="#6e40ff" stopOpacity="0"/></radialGradient>
      <radialGradient id="bodyGlow" cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor="#c8a8ff" stopOpacity=".18"/><stop offset="100%" stopColor="#6e40ff" stopOpacity="0"/></radialGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="glowStrong"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="cloakGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a1040"/><stop offset="50%" stopColor="#0d0820"/><stop offset="100%" stopColor="#2a1060"/></linearGradient>
      <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5f0e8"/><stop offset="100%" stopColor="#d4c9b0"/></linearGradient>
    </defs>
    <ellipse cx="130" cy="200" rx="100" ry="180" fill="url(#bodyGlow)"/>
    <path d="M55 220 Q30 280 20 380 Q18 420 40 460 L130 480 L220 460 Q242 420 240 380 Q230 280 205 220 Q170 240 130 242 Q90 240 55 220Z" fill="url(#cloakGrad)"/>
    <path d="M130 242 Q120 300 110 400" stroke="#3d2080" strokeWidth="1.5" strokeOpacity=".5" fill="none"/>
    <path d="M130 242 Q140 300 150 400" stroke="#3d2080" strokeWidth="1.5" strokeOpacity=".5" fill="none"/>
    <path d="M40 460 Q80 490 130 495 Q180 490 220 460" stroke="#6e40ff" strokeWidth="1" strokeOpacity=".6" fill="none"/>
    <path d="M100 215 Q115 235 130 238 Q145 235 160 215 L155 205 Q140 220 130 222 Q120 220 105 205Z" fill="#f0ece0"/>
    <rect x="116" y="170" width="28" height="42" rx="10" fill="#f5ede0"/>
    <ellipse cx="130" cy="148" rx="46" ry="52" fill="#f5ede0"/>
    <ellipse cx="130" cy="175" rx="32" ry="18" fill="#e8d9c8" opacity=".5"/>
    <path d="M84 118 Q82 80 100 62 Q115 48 130 46 Q145 48 160 62 Q178 80 176 118" fill="url(#hairGrad)"/>
    <path d="M160 100 Q178 88 184 110 Q186 128 176 132" fill="url(#hairGrad)"/>
    <path d="M100 100 Q82 88 76 110 Q74 128 84 132" fill="url(#hairGrad)"/>
    <path d="M110 55 Q125 48 140 55" stroke="white" strokeWidth="2" opacity=".6" fill="none"/>
    <rect x="84" y="130" width="92" height="26" rx="13" fill="#1a1028"/>
    <rect x="84" y="130" width="92" height="26" rx="13" fill="none" stroke="#6e40ff" strokeWidth="1.5" opacity=".8"/>
    <circle cx="113" cy="143" r="8" fill="url(#eyeGlow)" opacity=".9" filter="url(#glowStrong)"/>
    <circle cx="147" cy="143" r="8" fill="url(#eyeGlow)" opacity=".9" filter="url(#glowStrong)"/>
    <circle cx="113" cy="143" r="3.5" fill="#00f5ff" filter="url(#glow)"/>
    <circle cx="147" cy="143" r="3.5" fill="#00f5ff" filter="url(#glow)"/>
    <path d="M126 165 Q130 170 134 165" stroke="#c8b4a0" strokeWidth="1.5" fill="none"/>
    <path d="M118 180 Q128 188 142 180" stroke="#c09080" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M84 225 Q60 230 42 250 Q32 265 36 290 Q40 305 54 310 Q64 312 72 300 Q80 285 82 265 Q84 248 84 235Z" fill="#1a1040"/>
    <ellipse cx="52" cy="310" rx="14" ry="10" fill="#f0e6d4"/>
    <path d="M176 225 Q200 230 218 250 Q228 265 224 290 Q220 305 206 310 Q196 312 188 300 Q180 285 178 265 Q176 248 176 235Z" fill="#1a1040"/>
    <ellipse cx="208" cy="310" rx="14" ry="10" fill="#f0e6d4"/>
    <circle cx="52" cy="310" r="22" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7" filter="url(#glow)"/>
    <circle cx="52" cy="310" r="32" fill="none" stroke="#6e40ff" strokeWidth="1" strokeDasharray="3 5" opacity=".4" filter="url(#glow)"/>
    <circle cx="208" cy="310" r="22" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7" filter="url(#glow)"/>
    <circle cx="208" cy="310" r="32" fill="none" stroke="#6e40ff" strokeWidth="1" strokeDasharray="3 5" opacity=".4" filter="url(#glow)"/>
    <path d="M52 288 Q45 275 55 265 Q65 255 58 245" stroke="#00f5ff" strokeWidth="1.5" fill="none" opacity=".6" filter="url(#glow)" strokeLinecap="round"/>
    <path d="M208 288 Q215 275 205 265 Q195 255 202 245" stroke="#00f5ff" strokeWidth="1.5" fill="none" opacity=".6" filter="url(#glow)" strokeLinecap="round"/>
    <ellipse cx="130" cy="495" rx="80" ry="10" fill="#6e40ff" opacity=".15"/>
  </svg>;
}

function AuthPage({ onLogin }) {
  const [stage, setStage] = useState("landing");
  const [authStep, setAuthStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const otpRefs = useRef([]);
  const timerRef = useRef(null);
  const particles = Array.from({length:24},(_,i)=>({ width:`${Math.random()*4+1}px`, height:`${Math.random()*4+1}px`, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, animationDuration:`${Math.random()*8+4}s`, animationDelay:`${Math.random()*6}s`, opacity:Math.random()*.6+.1 }));

  useEffect(()=>{
    if(authStep==="otp"){ setOtpTimer(30); timerRef.current=setInterval(()=>setOtpTimer(t=>{if(t<=1){clearInterval(timerRef.current);return 0;}return t-1;}),1000); }
    return ()=>clearInterval(timerRef.current);
  },[authStep]);

  const triggerShake = () => { setShake(true); setTimeout(()=>setShake(false),600); };
  const handleSendOTP = () => { if(phone.replace(/\D/g,"").length<10){triggerShake();return;} setLoading(true); setTimeout(()=>{setLoading(false);setAuthStep("otp");setTimeout(()=>otpRefs.current[0]?.focus(),100);},1200); };
  const handleOTPInput = (val,idx) => { if(!/^\d?$/.test(val))return; const next=[...otp]; next[idx]=val; setOtp(next); if(val&&idx<5)otpRefs.current[idx+1]?.focus(); if(next.every(d=>d!==""))verifyOTP(next); };
  const handleOTPKeyDown = (e,idx) => { if(e.key==="Backspace"&&!otp[idx]&&idx>0)otpRefs.current[idx-1]?.focus(); };
  const verifyOTP = (digits) => { setLoading(true); setTimeout(()=>{ setLoading(false); if(digits.join("").length===6){setAuthStep("done");setTimeout(onLogin,700);}else{triggerShake();setOtp(["","","","","",""]);otpRefs.current[0]?.focus();} },1000); };
  const handleSocial = () => { setLoading(true); setTimeout(()=>{setLoading(false);onLogin();},1400); };

  return (
    <div className="nf-root">
      <div className="nf-bg-base"/><div className="nf-bg-scenery"/><div className="nf-bg-fog"/><div className="nf-bg-vignette"/>
      <div className="nf-hexgrid" aria-hidden>{Array.from({length:18},(_,i)=><div key={i} className="nf-hex" style={{animationDelay:`${(i*.4)%6}s`}}/>)}</div>
      {particles.map((p,i)=><div key={i} className="nf-particle" style={p}/>)}
      <div className="nf-gojo-wrap"><GojoSilhouette/></div>

      {stage==="landing" && (
        <div className="nf-landing">
          <div className="nf-brand-pill">⚡ Neraa Flows</div>
          <h1 className="nf-headline">
            <span className="nf-headline-sub">Welcome to</span>
            <span className="nf-headline-main">Neraa Flows</span>
            <span className="nf-headline-tag">The Ecosystem that Changes Lives</span>
          </h1>
          <p className="nf-tagline">Food · Grocery · Rides — one universe,<br/>infinite possibilities.</p>
          <div className="nf-infinity-ring">
            <div className="nf-ring nf-ring-1"/><div className="nf-ring nf-ring-2"/><div className="nf-ring nf-ring-3"/>
          </div>
          <button className="nf-cta" onClick={()=>setStage("auth")}><span>Get Started</span><span className="nf-cta-arrow">→</span></button>
          <p className="nf-footer-note">By continuing you agree to our Terms &amp; Privacy</p>
        </div>
      )}

      {stage==="auth" && (
        <div className="nf-auth-wrap">
          <button className="nf-back-btn" onClick={()=>{setStage("landing");setAuthStep("phone");setPhone("");setOtp(["","","","","",""]);}}>{`← Back`}</button>
          <div className={`nf-auth-card ${shake?"nf-shake":""}`}>
            <div className="nf-card-glow-line"/>
            <div className="nf-auth-logo">⚡</div>
            <h2 className="nf-auth-title">{authStep==="phone"?"Enter your number":authStep==="otp"?"Verify OTP":"✅ Verified!"}</h2>
            <p className="nf-auth-sub">{authStep==="phone"?"We'll send a one-time code to your phone":authStep==="otp"?`Code sent to +91 ${phone}`:"Opening your universe…"}</p>

            {authStep==="phone" && (
              <div className="nf-form">
                <div className="nf-input-group">
                  <span className="nf-input-prefix">🇮🇳 +91</span>
                  <input className="nf-input" type="tel" placeholder="98765 43210" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} onKeyDown={e=>e.key==="Enter"&&handleSendOTP()} maxLength={10}/>
                </div>
                <button className="nf-primary-btn" onClick={handleSendOTP} disabled={loading}>{loading?<span className="nf-spinner"/>:"Send OTP"}</button>
                <div className="nf-divider"><span>or continue with</span></div>
                <div className="nf-social-row">
                  {[{l:"Google",i:<GoogleIcon/>},{l:"GitHub",i:<GithubIcon/>},{l:"Apple",i:<AppleIcon/>}].map(s=>(
                    <button key={s.l} className="nf-social-btn" onClick={handleSocial}>{s.i}<span>{s.l}</span></button>
                  ))}
                </div>
              </div>
            )}

            {authStep==="otp" && (
              <div className="nf-form">
                <div className="nf-otp-row">
                  {otp.map((d,idx)=>(
                    <input key={idx} ref={el=>otpRefs.current[idx]=el} className={`nf-otp-box ${d?"nf-otp-filled":""}`} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e=>handleOTPInput(e.target.value,idx)} onKeyDown={e=>handleOTPKeyDown(e,idx)}/>
                  ))}
                </div>
                {loading&&<div style={{textAlign:"center",padding:"12px 0"}}><span className="nf-spinner" style={{borderTopColor:"#00f5ff"}}/></div>}
                <div className="nf-otp-hint">Enter any 6 digits to proceed (demo)</div>
                <div className="nf-resend-row">
                  {otpTimer>0?<span className="nf-timer">Resend in {otpTimer}s</span>:<button className="nf-resend-btn" onClick={()=>{setOtpTimer(30);setOtp(["","","","","",""]);otpRefs.current[0]?.focus();}}>Resend OTP</button>}
                </div>
                <button className="nf-primary-btn" onClick={()=>verifyOTP(otp)} disabled={loading||otp.some(d=>!d)}>{loading?<span className="nf-spinner"/>:"Verify & Login"}</button>
              </div>
            )}

            {authStep==="done"&&<div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:48,marginBottom:8}}>🌀</div><p style={{color:"#00f5ff",fontWeight:700}}>Opening your universe…</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FLOATING CART
============================================================ */
function FloatingCart({ color="food" }) {
  const { foodCart, groceryCart, foodTotal, groceryTotal, setPaymentScreen } = useApp();
  const total = foodCart.reduce((s,i)=>s+i.qty,0)+groceryCart.reduce((s,i)=>s+i.qty,0);
  const grand = foodTotal+groceryTotal;
  if(total===0) return null;
  const isGreen = color==="grocery";
  return (
    <div className="floating-cart">
      <button className="floating-cart-btn" style={isGreen?{background:"linear-gradient(135deg,#2ed573,#0a9e52)",boxShadow:"0 8px 24px rgba(46,213,115,.45)"}:{}} onClick={()=>setPaymentScreen(true)}>
        <div className="floating-cart-left"><span className="floating-cart-count">{total} item{total>1?"s":""}</span><span className="floating-cart-text">Proceed to Pay</span></div>
        <span className="floating-cart-price">₹{grand} →</span>
      </button>
    </div>
  );
}

/* ============================================================
   BOTTOM NAV
============================================================ */
function BottomNav({ activeTab, setActiveTab }) {
  const { foodCart, groceryCart } = useApp();
  const total = foodCart.reduce((s,i)=>s+i.qty,0)+groceryCart.reduce((s,i)=>s+i.qty,0);
  return (
    <nav className="bottom-nav">
      {[{id:"food",label:"Food",emoji:"🍔"},{id:"grocery",label:"Grocery",emoji:"🛒"},{id:"ride",label:"Rides",emoji:"🚗"}].map(tab=>(
        <button key={tab.id} className={`nav-tab ${tab.id} ${activeTab===tab.id?"active":""}`} onClick={()=>setActiveTab(tab.id)}>
          <span className="nav-icon">{tab.emoji}{tab.id!=="ride"&&total>0&&activeTab!==tab.id&&<span className="nav-badge">{total}</span>}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ============================================================
   MENU PAGE
============================================================ */
function MenuPage({ restaurant, onBack }) {
  const { foodCart, addToFoodCart, removeFromFoodCart } = useApp();
  const menu = MENU_DATA[restaurant.id] || { categories:["Menu"], items:[] };
  const [activeCategory, setActiveCategory] = useState(menu.categories[0]);
  const [vegOnly, setVegOnly] = useState(false);
  const getQty = id => { const f=foodCart.find(i=>i.id===id); return f?f.qty:0; };
  const visible = menu.items.filter(item=>{ if(vegOnly&&!item.isVeg)return false; if(activeCategory==="Recommended")return item.isBestseller; return item.category===activeCategory; });
  return (
    <div className="menu-page">
      <div className="menu-hero">
        <img src={restaurant.img} alt={restaurant.name}/>
        <div className="menu-hero-overlay"/>
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="menu-hero-info">
          <h2>{restaurant.name}</h2><p>{restaurant.cuisine}</p>
          <p style={{marginTop:4}}><span className="gps-badge">📍 {restaurant.lat}°N, {restaurant.lng}°E</span></p>
        </div>
      </div>
      <div className="menu-stats">
        {[["⭐ "+restaurant.rating,"ratings"],["🕐 "+restaurant.deliveryTime,"minutes"],[restaurant.deliveryFee===0?"FREE":"₹"+restaurant.deliveryFee,"delivery"],["₹"+restaurant.minOrder,"min order"]].map(([v,l])=>(
          <div key={l} className="stat-box"><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderBottom:"1px solid #f0f0f0"}}>
        <span style={{fontWeight:700,fontSize:13}}>🌿 Veg Only</span>
        <div onClick={()=>setVegOnly(!vegOnly)} style={{width:44,height:24,borderRadius:12,background:vegOnly?"#2ed573":"#ddd",position:"relative",cursor:"pointer",transition:"background .2s"}}>
          <div style={{position:"absolute",top:2,left:vegOnly?22:2,width:20,height:20,borderRadius:10,background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,.2)",transition:"left .2s"}}/>
        </div>
      </div>
      <div className="menu-category-tabs">{menu.categories.map(cat=><button key={cat} className={`menu-tab ${activeCategory===cat?"active":""}`} onClick={()=>setActiveCategory(cat)}>{cat}</button>)}</div>
      <div className="menu-items">
        {visible.length>0&&<div className="menu-section-title">{activeCategory}</div>}
        {visible.map(item=>{
          const qty=getQty(item.id);
          return <div key={item.id} className="menu-item">
            <div className="menu-item-info">
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <div className={`veg-badge ${item.isVeg?"veg":"nonveg"}`}/>
                {item.isBestseller&&<span style={{fontSize:10,fontWeight:800,color:"#e67e22",background:"#fff4e0",padding:"1px 6px",borderRadius:4}}>🏆 BESTSELLER</span>}
              </div>
              <div className="menu-item-name">{item.name}</div>
              <div className="menu-item-price">₹{item.price}</div>
              <div className="menu-item-desc">{item.desc}</div>
            </div>
            <div className="menu-item-img-wrap">
              <img className="menu-item-img" src={item.img} alt={item.name}/>
              {qty===0?<button className="add-btn" onClick={()=>addToFoodCart(item,restaurant.name)}>ADD</button>:
              <div className="qty-ctrl"><button className="qty-btn" onClick={()=>removeFromFoodCart(item.id)}>−</button><span className="qty-val">{qty}</span><button className="qty-btn" onClick={()=>addToFoodCart(item,restaurant.name)}>+</button></div>}
            </div>
          </div>;
        })}
      </div>
      <FloatingCart/>
    </div>
  );
}

/* ============================================================
   FOOD SECTION
============================================================ */
function FoodSection() {
  const [selectedR, setSelectedR] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  if(selectedR) return <MenuPage restaurant={selectedR} onBack={()=>setSelectedR(null)}/>;
  const filtered = RESTAURANTS.filter(r=>{
    if(search&&!r.name.toLowerCase().includes(search.toLowerCase())&&!r.cuisine.toLowerCase().includes(search.toLowerCase()))return false;
    if(activeFilter==="rating"&&r.rating<4.0)return false;
    if(activeFilter==="veg"&&!r.isVeg)return false;
    if(activeFilter==="free"&&r.deliveryFee>0)return false;
    return true;
  });
  return (
    <div>
      <div className="section-header">
        <div className="header-top">
          <div className="location-row"><div><div className="location-label">Deliver to</div><div className="location-name">📍 Boring Road, Patna ▾</div></div></div>
          <div className="header-avatar">A</div>
        </div>
        <div className="search-bar">
          <span>🔍</span><input placeholder="Search restaurants, dishes..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>
      <div className="promo-banner">
        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=260&fit=crop" alt="promo"/>
        <div className="banner-overlay"><div className="banner-tag">🔥 Today's Deal</div><div className="banner-title">50% OFF<br/>First Order</div><div className="banner-sub">Use code: FIRST50</div></div>
      </div>
      <div className="category-scroll">{FOOD_CATEGORIES.map(cat=><div key={cat.id} className="cat-chip"><div className="cat-icon" style={{background:cat.color}}>{cat.emoji}</div><span className="cat-label">{cat.label}</span></div>)}</div>
      <div className="filter-row">
        {[{id:"rating",label:"⭐ Rating 4.0+"},{id:"veg",label:"🌿 Pure Veg"},{id:"free",label:"🚚 Free Delivery"}].map(f=>(
          <button key={f.id} className={`filter-chip ${activeFilter===f.id?"active":""}`} onClick={()=>setActiveFilter(activeFilter===f.id?null:f.id)}>{f.label}</button>
        ))}
      </div>
      <div className="sec-title"><span>🍽️ Restaurants Near You</span></div>
      <div className="restaurant-list">
        {filtered.map(r=>(
          <div key={r.id} className="restaurant-card" onClick={()=>setSelectedR(r)}>
            <div className="restaurant-img-wrap">
              <img className="restaurant-img" src={r.img} alt={r.name}/>
              {r.discount&&<div className="discount-badge">{r.discount}</div>}
              {!r.isOpen&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:800,fontSize:14}}>Currently Closed</span></div>}
            </div>
            <div className="restaurant-info">
              <div className="restaurant-name">{r.name}</div>
              <div className="restaurant-meta"><span className="rating">⭐ {r.rating}</span><span>•</span><span>🕐 {r.deliveryTime} min</span><span>•</span><span>📍 {r.distance}</span></div>
              <div className="restaurant-meta" style={{marginTop:3}}><span>{r.cuisine}</span></div>
              <div className="restaurant-tags">
                {r.deliveryFee===0?<span className="tag-chip" style={{color:"#2ed573"}}>🚚 Free Delivery</span>:<span className="tag-chip">🚚 ₹{r.deliveryFee} delivery</span>}
                <span className="tag-chip">Min ₹{r.minOrder}</span>
                {r.isVeg&&<span className="tag-chip" style={{color:"#2ed573"}}>🌿 Pure Veg</span>}
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#aaa"}}><div style={{fontSize:48,marginBottom:12}}>🍽️</div><div style={{fontWeight:700}}>No restaurants found</div></div>}
      </div>
      <div style={{height:20}}/>
      <FloatingCart/>
    </div>
  );
}

/* ============================================================
   GROCERY SECTION
============================================================ */
function GrocerySection() {
  const { groceryCart, addToGroceryCart, removeFromGroceryCart } = useApp();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const getQty = id => { const f=groceryCart.find(i=>i.id===id); return f?f.qty:0; };
  const filtered = GROCERY_ITEMS.filter(item=>{ if(activeCategory!=="all"&&item.category!==activeCategory)return false; if(search&&!item.name.toLowerCase().includes(search.toLowerCase()))return false; return true; });
  return (
    <div>
      <div className="section-header" style={{borderBottom:"2px solid #e8fff4"}}>
        <div className="header-top">
          <div><div className="location-label">Deliver to</div><div className="location-name" style={{color:"#0a9e52"}}>📍 Boring Road, Patna ▾</div></div>
          <div style={{background:"linear-gradient(135deg,#2ed573,#0a9e52)",borderRadius:10,padding:"6px 12px",fontSize:11,fontWeight:800,color:"#fff"}}>⚡ 10 min delivery</div>
        </div>
        <div className="search-bar"><span>🔍</span><input placeholder="Search groceries, fruits, veggies..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      </div>
      <div style={{margin:"8px 16px",background:"linear-gradient(135deg,#1e3c72,#2a5298)",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,color:"#fff"}}>
        <span style={{fontSize:28}}>⚡</span><div><div style={{fontWeight:800,fontSize:14}}>Delivery in 10 Minutes</div><div style={{fontSize:12,opacity:.8}}>Fresh, quality products at your door</div></div><span style={{fontSize:32}}>🛵</span>
      </div>
      <div className="promo-banner">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=260&fit=crop" alt="promo"/>
        <div className="banner-overlay"><div className="banner-tag" style={{background:"#0a9e52"}}>🥦 Fresh Deal</div><div className="banner-title">Flat ₹100 OFF<br/>on ₹499+</div></div>
      </div>
      <div className="category-scroll">
        {GROCERY_CATEGORIES.map(cat=><div key={cat.id} className="cat-chip" onClick={()=>setActiveCategory(cat.id)}>
          <div className="cat-icon" style={{background:activeCategory===cat.id?"#eafff4":"#f5f5f5",border:activeCategory===cat.id?"2px solid #2ed573":"2px solid transparent"}}>{cat.emoji}</div>
          <span className="cat-label" style={{color:activeCategory===cat.id?"#0a9e52":"#666"}}>{cat.label}</span>
        </div>)}
      </div>
      <div className="sec-title"><span>🛒 {activeCategory==="all"?"All Products":GROCERY_CATEGORIES.find(c=>c.id===activeCategory)?.label}</span><span style={{fontSize:12,color:"#aaa",fontWeight:600}}>{filtered.length} items</span></div>
      <div className="grocery-grid">
        {filtered.map(item=>{ const qty=getQty(item.id); return (
          <div key={item.id} className="grocery-card">
            <img className="grocery-img" src={item.img} alt={item.name}/>
            <div className="grocery-info">
              <div className="grocery-name">{item.name}</div>
              <div className="grocery-weight">{item.weight}</div>
              <div className="grocery-price-row">
                <div><div style={{display:"flex",alignItems:"center",gap:6}}><span className="grocery-price">₹{item.price}</span>{item.mrp>item.price&&<span className="grocery-mrp">₹{item.mrp}</span>}</div>{item.discount>0&&<span className="grocery-discount">{item.discount}% OFF</span>}</div>
                {qty===0?<button className="grocery-add-btn" onClick={()=>addToGroceryCart(item)}>ADD</button>:
                <div className="grocery-qty-ctrl"><button className="qty-btn" onClick={()=>removeFromGroceryCart(item.id)}>−</button><span className="qty-val">{qty}</span><button className="qty-btn" onClick={()=>addToGroceryCart(item)}>+</button></div>}
              </div>
            </div>
          </div>
        );})}
      </div>
      <div style={{height:20}}/>
      <FloatingCart color="grocery"/>
    </div>
  );
}

/* ============================================================
   RIDE SECTION
============================================================ */
const RIDE_TYPES = [
  {id:"auto",name:"Auto",icon:"🛺",desc:"Affordable 3-wheeler",basePrice:30,perKm:12,eta:"3 min",capacity:3},
  {id:"mini",name:"QuickGo Mini",icon:"🚗",desc:"Affordable compact cab",basePrice:50,perKm:16,eta:"5 min",capacity:4},
  {id:"sedan",name:"QuickGo Sedan",icon:"🚙",desc:"Comfortable sedan",basePrice:70,perKm:20,eta:"6 min",capacity:4},
  {id:"suv",name:"QuickGo SUV",icon:"🚐",desc:"Spacious for groups",basePrice:100,perKm:26,eta:"8 min",capacity:6},
];
const POPULAR_DESTINATIONS = [
  {name:"Patna Junction Railway Station",dist:"3.2 km"},{name:"Gandhi Maidan",dist:"2.1 km"},
  {name:"Patna Airport",dist:"8.5 km"},{name:"Kurji Holy Family Hospital",dist:"4.8 km"},
  {name:"Patna University",dist:"2.7 km"},{name:"Danapur",dist:"11.2 km"},
];

function RideSection() {
  const { setRideBooked, rideBooked } = useApp();
  const [pickup, setPickup] = useState("Boring Road, Patna");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [booking, setBooking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dist = destination ? parseFloat((Math.random()*8+2).toFixed(1)) : null;
  const calcFare = (ride) => Math.round(ride.basePrice + ride.perKm * (dist||5));

  const handleBook = () => {
    if(!selectedRide||!destination)return;
    setBooking(true);
    setTimeout(()=>{ setBooking(false); const ride=RIDE_TYPES.find(r=>r.id===selectedRide); setRideBooked({ride,destination,pickup,fare:calcFare(ride),payment:selectedPayment}); },2000);
  };

  return (
    <div>
      <div style={{position:"relative",height:260,background:"linear-gradient(135deg,#1a1a2e,#16213e)",overflow:"hidden"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30,144,255,0.07)" strokeWidth="1"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
          <line x1="0" y1="130" x2="430" y2="130" stroke="rgba(30,144,255,.15)" strokeWidth="12"/>
          <line x1="100" y1="0" x2="100" y2="260" stroke="rgba(30,144,255,.12)" strokeWidth="10"/>
          <line x1="280" y1="0" x2="280" y2="260" stroke="rgba(30,144,255,.1)" strokeWidth="8"/>
          {destination&&<path d="M215 130 C250 100 300 80 350 90" stroke="#1e90ff" strokeWidth="3" strokeDasharray="6,4" fill="none" opacity=".8"/>}
        </svg>
        {[{t:"20%",l:"15%"},{t:"60%",l:"70%"},{t:"30%",l:"75%"},{t:"70%",l:"25%"}].map((p,i)=>(
          <span key={i} style={{position:"absolute",top:p.t,left:p.l,fontSize:16,opacity:.6,animation:`drift 4s ease-in-out ${i*.8}s infinite`}}>🚗</span>
        ))}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:32,animation:"float 2s ease-in-out infinite",filter:"drop-shadow(0 4px 8px rgba(30,144,255,.6))"}}>📍</div>
        {destination&&<div style={{position:"absolute",top:"33%",left:"81%",transform:"translate(-50%,-50%)",fontSize:22}}>🏁</div>}
        <div style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.1)",backdropFilter:"blur(8px)",borderRadius:10,padding:"6px 10px",color:"#fff",fontSize:11,fontWeight:700,border:"1px solid rgba(255,255,255,.15)"}}>📍 25.612°N, 85.144°E</div>
        <div style={{position:"absolute",bottom:30,left:16,background:"rgba(30,144,255,.9)",borderRadius:20,padding:"4px 12px",color:"#fff",fontSize:12,fontWeight:700}}>🚗 12 drivers nearby</div>
      </div>

      <div style={{background:"#fff",borderRadius:"24px 24px 0 0",marginTop:-20,padding:"20px 16px",position:"relative",zIndex:2,boxShadow:"0 -4px 20px rgba(0,0,0,.1)"}}>
        <h3 style={{fontSize:18,fontWeight:900,marginBottom:16,fontFamily:"Nunito,sans-serif"}}>Where are you going?</h3>
        <div style={{background:"#f5f6f8",borderRadius:14,padding:4,marginBottom:12}}>
          {[{dot:"#2ed573",val:pickup,setVal:setPickup,ph:"Pickup location"},{dot:"#ff4757",val:destination,setVal:(v)=>{setDestination(v);setShowSuggestions(v.length>0);setSelectedRide(null);},ph:"Where to?"}].map((row,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 10px",borderBottom:i===0?"1px solid rgba(0,0,0,.05)":"none"}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:row.dot,flexShrink:0}}/>
              <input value={row.val} onChange={e=>row.setVal(e.target.value)} placeholder={row.ph} onFocus={()=>i===1&&setShowSuggestions(true)} style={{flex:1,border:"none",background:"transparent",fontFamily:"Nunito,sans-serif",fontSize:14,fontWeight:600,color:"#2d2d2d",outline:"none"}}/>
              {i===1&&destination&&<button onClick={()=>{setDestination("");setShowSuggestions(false);setSelectedRide(null);}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#aaa"}}>✕</button>}
            </div>
          ))}
        </div>

        {showSuggestions&&!selectedRide&&(
          <div style={{background:"#f8f9fa",borderRadius:12,marginBottom:12}}>
            <div style={{padding:"8px 14px",fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase"}}>Popular Places</div>
            {POPULAR_DESTINATIONS.map(dest=>(
              <div key={dest.name} onClick={()=>{setDestination(dest.name);setShowSuggestions(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid #eee"}}>
                <span style={{fontSize:18}}>📍</span>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{dest.name}</div><div style={{fontSize:11,color:"#aaa"}}>{dest.dist} away</div></div>
              </div>
            ))}
          </div>
        )}

        {destination&&(
          <>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:8}}>Choose a ride</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {RIDE_TYPES.map(ride=>(
                  <div key={ride.id} onClick={()=>setSelectedRide(ride.id)} style={{display:"flex",alignItems:"center",gap:12,padding:14,borderRadius:12,border:selectedRide===ride.id?"2px solid #1e90ff":"2px solid #f0f0f0",background:selectedRide===ride.id?"#e8f4ff":"#fff",cursor:"pointer",transition:"all .15s"}}>
                    <span style={{fontSize:28}}>{ride.icon}</span>
                    <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14}}>{ride.name}</div><div style={{fontSize:11,color:"#888"}}>{ride.desc} • {ride.capacity} seats • {ride.eta}</div>{dist&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>📏 ~{dist} km</div>}</div>
                    <div style={{fontSize:16,fontWeight:900}}>₹{calcFare(ride)}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedRide&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700,color:"#888",marginBottom:8}}>Payment</div>
                <div style={{display:"flex",gap:8}}>
                  {[{id:"cash",l:"Cash",e:"💵"},{id:"upi",l:"UPI",e:"📱"},{id:"card",l:"Card",e:"💳"}].map(pm=>(
                    <button key={pm.id} onClick={()=>setSelectedPayment(pm.id)} style={{flex:1,padding:"10px 6px",borderRadius:10,border:selectedPayment===pm.id?"2px solid #1e90ff":"2px solid #eee",background:selectedPayment===pm.id?"#e8f4ff":"#fff",cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:12,fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <span style={{fontSize:20}}>{pm.e}</span>{pm.l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleBook} disabled={!selectedRide||booking} style={{width:"100%",padding:16,background:(!selectedRide||booking)?"#ccc":"linear-gradient(135deg,#1e90ff,#0057ff)",color:"#fff",border:"none",borderRadius:14,fontFamily:"Nunito,sans-serif",fontSize:16,fontWeight:900,cursor:(!selectedRide||booking)?"default":"pointer",boxShadow:(!selectedRide||booking)?"none":"0 4px 20px rgba(30,144,255,.4)",transition:"all .2s"}}>
              {booking?"🔍 Finding your driver...":selectedRide?`Book ${RIDE_TYPES.find(r=>r.id===selectedRide)?.name} →`:"Select a ride to continue"}
            </button>
          </>
        )}
        {!destination&&<div style={{textAlign:"center",padding:"20px 0",color:"#aaa"}}><div style={{fontSize:40,marginBottom:8}}>🗺️</div><div style={{fontWeight:700,fontSize:14}}>Enter your destination</div><div style={{fontSize:12,marginTop:4}}>to see available rides and fares</div></div>}
      </div>

      {rideBooked&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn .3s",fontFamily:"Nunito,sans-serif"}}>
          <div style={{background:"#fff",borderRadius:24,padding:"32px 24px",textAlign:"center",width:"100%",maxWidth:320,animation:"bounceIn .5s cubic-bezier(.34,1.56,.64,1)"}}>
            <div style={{fontSize:64,marginBottom:8}}>🚗</div>
            <h3 style={{fontWeight:900,fontSize:22,marginBottom:6}}>Driver Found!</h3>
            <p style={{fontSize:13,color:"#888",marginBottom:16}}>{rideBooked.ride.name} is on the way</p>
            <div style={{background:"#f5f6f8",borderRadius:12,padding:14,marginBottom:16,textAlign:"left"}}>
              {[["🟢 Pickup",rideBooked.pickup],["🔴 Drop",rideBooked.destination],["💰 Fare",`₹${rideBooked.fare}`],["💳 Payment",rideBooked.payment.toUpperCase()],["⏱️ ETA",rideBooked.ride.eta]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:700}}>{v}</span></div>
              ))}
            </div>
            <button onClick={()=>setRideBooked(null)} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#1e90ff,#0057ff)",color:"#fff",border:"none",borderRadius:12,fontFamily:"Nunito,sans-serif",fontSize:15,fontWeight:900,cursor:"pointer"}}>Track Ride 📍</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAYMENT SCREEN
============================================================ */
const PM = [
  {id:"upi",label:"UPI / Google Pay",icon:"📱",sub:"Instant • Recommended",color:"#4CAF50"},
  {id:"card",label:"Credit / Debit Card",icon:"💳",sub:"Visa, Mastercard, Rupay",color:"#2196F3"},
  {id:"cod",label:"Cash on Delivery",icon:"💵",sub:"Pay when delivered",color:"#FF9800"},
  {id:"wallet",label:"QuickPay Wallet",icon:"👛",sub:"Balance: ₹250",color:"#9C27B0"},
];

function PaymentScreen() {
  const { foodCart,groceryCart,foodTotal,groceryTotal,setPaymentScreen,placeOrder,totalItems } = useApp();
  const [selPM, setSelPM] = useState("upi");
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const [address, setAddress] = useState("Boring Road, Patna 800001");
  const [editAddr, setEditAddr] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const deliveryFee = foodTotal>0?30:0;
  const packFee = groceryTotal>0?15:0;
  const platFee = 5;
  const actualTip = customTip?parseInt(customTip)||0:tip;
  const grand = foodTotal+groceryTotal+deliveryFee+packFee+platFee+actualTip;

  const handlePay = () => { setPlacing(true); setTimeout(()=>{ placeOrder({payment:selPM,deliveryAddress:address,tip:actualTip}); setPlacing(false); },1600); };

  return (
    <div style={{position:"fixed",inset:0,zIndex:80,background:"#f4f5f7",maxWidth:430,margin:"0 auto",overflowY:"auto",paddingBottom:100,fontFamily:"Nunito,sans-serif"}}>
      <div style={{background:"#fff",padding:16,display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #eee",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
        <button onClick={()=>setPaymentScreen(false)} style={{width:36,height:36,borderRadius:"50%",background:"#f5f5f5",border:"none",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div><div style={{fontWeight:900,fontSize:17}}>Checkout</div><div style={{fontSize:12,color:"#aaa"}}>{totalItems} item{totalItems>1?"s":""} in cart</div></div>
      </div>

      {/* Address */}
      <div style={{margin:"14px 16px 0",background:"#fff",borderRadius:16,padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontWeight:800,fontSize:13}}>📍 Delivery Address</span>
          <button onClick={()=>setEditAddr(!editAddr)} style={{background:"none",border:"none",fontSize:12,fontWeight:700,color:"#ff4757",cursor:"pointer"}}>{editAddr?"Save":"Change"}</button>
        </div>
        {editAddr?<textarea value={address} onChange={e=>setAddress(e.target.value)} rows={3} style={{width:"100%",border:"1.5px solid #ff4757",borderRadius:10,padding:"10px 12px",fontFamily:"Nunito,sans-serif",fontSize:13,fontWeight:600,resize:"none",outline:"none",lineHeight:1.5}}/>
        :<div style={{fontSize:13,fontWeight:600,color:"#555",lineHeight:1.5}}>🏠 {address}</div>}
        <div style={{fontSize:11,color:"#aaa",marginTop:6}}>Estimated delivery: <strong style={{color:"#2ed573"}}>25–35 mins</strong></div>
      </div>

      {/* Order summary */}
      <div style={{margin:"12px 16px 0",background:"#fff",borderRadius:16,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",fontWeight:800,fontSize:13,borderBottom:"1px solid #f0f0f0"}}>🧾 Order Summary</div>
        {foodCart.length>0&&<><div style={{padding:"8px 16px 2px",fontSize:11,fontWeight:700,color:"#ff4757",textTransform:"uppercase"}}>🍔 Food</div>{foodCart.map(item=><div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 16px",fontSize:13}}><span style={{fontWeight:600}}>{item.name} <span style={{color:"#aaa"}}>×{item.qty}</span></span><span style={{fontWeight:800}}>₹{item.price*item.qty}</span></div>)}</>}
        {groceryCart.length>0&&<><div style={{padding:"8px 16px 2px",fontSize:11,fontWeight:700,color:"#0a9e52",textTransform:"uppercase"}}>🛒 Grocery</div>{groceryCart.map(item=><div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 16px",fontSize:13}}><span style={{fontWeight:600}}>{item.name} <span style={{color:"#aaa"}}>×{item.qty}</span></span><span style={{fontWeight:800}}>₹{item.price*item.qty}</span></div>)}</>}
        <div style={{borderTop:"1px dashed #eee",padding:"10px 16px",marginTop:4}}>
          {[[`Item Total`,`₹${foodTotal+groceryTotal}`],deliveryFee>0&&[`🚚 Delivery`,`₹${deliveryFee}`],packFee>0&&[`📦 Packaging`,`₹${packFee}`],[`🏷️ Platform`,`₹${platFee}`]].filter(Boolean).map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:13,color:"#666"}}><span>{l}</span><span style={{fontWeight:700}}>{v}</span></div>
          ))}
          {actualTip>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:13,color:"#0a9e52"}}><span>💚 Tip</span><span style={{fontWeight:700}}>₹{actualTip}</span></div>}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 4px",fontSize:16,fontWeight:900,borderTop:"1px solid #eee",marginTop:6}}><span>Grand Total</span><span style={{color:"#ff4757"}}>₹{grand}</span></div>
        </div>
      </div>

      {/* Tip */}
      <div style={{margin:"12px 16px 0",background:"#fff",borderRadius:16,padding:"14px 16px"}}>
        <div style={{fontWeight:800,fontSize:13,marginBottom:10}}>💚 Tip delivery partner</div>
        <div style={{display:"flex",gap:8}}>
          {[0,20,30,50].map(t=><button key={t} onClick={()=>{setTip(t);setCustomTip("");}} style={{flex:1,padding:"8px 4px",borderRadius:10,border:tip===t&&!customTip?"2px solid #2ed573":"2px solid #eee",background:tip===t&&!customTip?"#eafff4":"#fff",fontFamily:"Nunito,sans-serif",fontSize:13,fontWeight:800,cursor:"pointer",color:tip===t&&!customTip?"#0a9e52":"#333"}}>{t===0?"None":`₹${t}`}</button>)}
          <input placeholder="Other" value={customTip} onChange={e=>{setCustomTip(e.target.value);setTip(0);}} style={{flex:1,padding:"8px 6px",textAlign:"center",border:customTip?"2px solid #2ed573":"2px solid #eee",borderRadius:10,fontFamily:"Nunito,sans-serif",fontSize:13,fontWeight:800,outline:"none",background:customTip?"#eafff4":"#fff"}}/>
        </div>
      </div>

      {/* Payment */}
      <div style={{margin:"12px 16px 0",background:"#fff",borderRadius:16,padding:"14px 16px"}}>
        <div style={{fontWeight:800,fontSize:13,marginBottom:10}}>💳 Payment Method</div>
        <div style={{background:"#fff8e0",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,color:"#c87c00",marginBottom:10}}>ℹ️ Food &amp; grocery paid together · Rides paid separately</div>
        {PM.map(pm=>(
          <div key={pm.id} onClick={()=>setSelPM(pm.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,border:selPM===pm.id?`2px solid ${pm.color}`:"2px solid #f0f0f0",background:selPM===pm.id?`${pm.color}11`:"#fff",cursor:"pointer",marginBottom:8,transition:"all .15s"}}>
            <span style={{fontSize:22}}>{pm.icon}</span>
            <div style={{flex:1}}><div style={{fontWeight:800,fontSize:13}}>{pm.label}</div><div style={{fontSize:11,color:"#aaa"}}>{pm.sub}</div></div>
            <div style={{width:18,height:18,borderRadius:"50%",border:selPM===pm.id?`5px solid ${pm.color}`:"2px solid #ddd",transition:"all .15s"}}/>
          </div>
        ))}
        {selPM==="upi"&&<input placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={e=>setUpiId(e.target.value)} style={{width:"100%",padding:"10px 14px",border:"1.5px solid #e5e5e5",borderRadius:10,fontFamily:"Nunito,sans-serif",fontSize:13,outline:"none",marginTop:4}}/>}
        {selPM==="card"&&<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
          <input placeholder="Card Number" value={cardNo} onChange={e=>setCardNo(e.target.value.replace(/\D/g,"").slice(0,16))} style={{padding:"10px 14px",border:"1.5px solid #e5e5e5",borderRadius:10,fontFamily:"Nunito,sans-serif",fontSize:13,outline:"none"}}/>
          <div style={{display:"flex",gap:8}}>
            <input placeholder="MM/YY" value={cardExp} onChange={e=>setCardExp(e.target.value)} style={{flex:1,padding:"10px 14px",border:"1.5px solid #e5e5e5",borderRadius:10,fontFamily:"Nunito,sans-serif",fontSize:13,outline:"none"}}/>
            <input placeholder="CVV" type="password" value={cardCVV} onChange={e=>setCardCVV(e.target.value.slice(0,3))} style={{flex:1,padding:"10px 14px",border:"1.5px solid #e5e5e5",borderRadius:10,fontFamily:"Nunito,sans-serif",fontSize:13,outline:"none"}}/>
          </div>
        </div>}
        <div style={{margin:"10px 0 0",display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#aaa",justifyContent:"center"}}>🔒 256-bit SSL encrypted · Safe & secure</div>
      </div>

      {/* Pay button */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",padding:"12px 16px 20px",borderTop:"1px solid #eee",boxShadow:"0 -4px 20px rgba(0,0,0,.08)"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#aaa",marginBottom:8,fontWeight:600}}><span>Total to pay</span><span style={{color:"#ff4757",fontWeight:900,fontSize:16}}>₹{grand}</span></div>
        <button onClick={handlePay} disabled={placing} style={{width:"100%",padding:16,background:placing?"#ccc":"linear-gradient(135deg,#ff4757,#ff2442)",color:"#fff",border:"none",borderRadius:14,fontFamily:"Nunito,sans-serif",fontSize:16,fontWeight:900,cursor:placing?"default":"pointer",boxShadow:placing?"none":"0 4px 20px rgba(255,71,87,.4)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {placing?<><span style={{display:"inline-block",width:18,height:18,borderRadius:"50%",border:"2.5px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin .7s linear infinite"}}/>Processing…</>:<><span>{selPM==="upi"?"📱":selPM==="card"?"💳":selPM==="cod"?"💵":"👛"}</span>Pay Now · ₹{grand}</>}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   ORDER SUCCESS MODAL
============================================================ */
function OrderSuccessModal() {
  const { orderSuccess, setOrderSuccess } = useApp();
  if(!orderSuccess) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.65)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,backdropFilter:"blur(4px)",fontFamily:"Nunito,sans-serif",animation:"fadeIn .3s"}}>
      <div style={{background:"#fff",borderRadius:24,padding:"32px 24px",textAlign:"center",width:"100%",maxWidth:320,animation:"bounceIn .5s cubic-bezier(.34,1.56,.64,1)"}}>
        <div style={{fontSize:64,marginBottom:8}}>🎉</div>
        <h3 style={{fontWeight:900,fontSize:22,marginBottom:6}}>Order Placed!</h3>
        <p style={{fontSize:13,color:"#888",marginBottom:16}}>Your order is confirmed and being prepared</p>
        <div style={{background:"#f8f9fa",borderRadius:14,padding:14,marginBottom:16,textAlign:"left"}}>
          {[["📋 Order ID",orderSuccess.orderId],["💰 Total Paid",`₹${orderSuccess.total}`],["💳 Payment",orderSuccess.payment?.toUpperCase()],orderSuccess.tip>0&&["💚 Tip",`₹${orderSuccess.tip}`],["⏱️ Est. Delivery","25–35 mins"]].filter(Boolean).map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0",borderBottom:"1px solid #eee"}}><span style={{color:"#888"}}>{l}</span><span style={{fontWeight:800}}>{v}</span></div>
          ))}
        </div>
        <button onClick={()=>setOrderSuccess(null)} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#ff4757,#ff2442)",color:"#fff",border:"none",borderRadius:12,fontFamily:"Nunito,sans-serif",fontSize:15,fontWeight:900,cursor:"pointer"}}>Track Order 🗺️</button>
      </div>
    </div>
  );
}

/* ============================================================
   RESTAURANT DASHBOARD
============================================================ */
const STATUS_CFG = {
  new:{label:"New Order",color:"#ff4757",bg:"#fff0f1",icon:"🔔"},
  accepted:{label:"Preparing",color:"#ff9f43",bg:"#fff9f0",icon:"👨‍🍳"},
  ready:{label:"Ready",color:"#2ed573",bg:"#eafff4",icon:"✅"},
  picked_up:{label:"Picked Up",color:"#1e90ff",bg:"#e8f4ff",icon:"🛵"},
  delivered:{label:"Delivered",color:"#888",bg:"#f5f5f5",icon:"🏁"},
  cancelled:{label:"Cancelled",color:"#ccc",bg:"#f5f5f5",icon:"❌"},
};
const NEXT_S = {new:"accepted",accepted:"ready",ready:"picked_up",picked_up:"delivered"};

function RestaurantDashboard() {
  const { restaurantOrders,restaurantNotifications,updateOrderStatus,markNotificationRead,setActiveView } = useApp();
  const [tab,setTab] = useState("orders");
  const [expanded,setExpanded] = useState(null);
  const [filterS,setFilterS] = useState("all");
  const unread = restaurantNotifications.filter(n=>!n.read).length;
  const filtered = restaurantOrders.filter(o=>filterS==="all"||o.status===filterS);
  const stats = { new:restaurantOrders.filter(o=>o.status==="new").length, prep:restaurantOrders.filter(o=>o.status==="accepted").length, ready:restaurantOrders.filter(o=>o.status==="ready").length, rev:restaurantOrders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.subtotal,0) };

  return (
    <div style={{minHeight:"100%",background:"#0f0f1a",fontFamily:"Nunito,sans-serif",color:"#fff"}}>
      <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div><div style={{fontSize:11,color:"rgba(255,255,255,.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Restaurant Panel</div><div style={{fontSize:20,fontWeight:900}}>🍳 Biryani Blues</div></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:"#2ed573",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:800}}>🟢 Open</div>
            <button onClick={()=>setActiveView("customer")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:10,padding:"6px 12px",color:"#fff",fontFamily:"Nunito,sans-serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>← App</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[{l:"New",v:stats.new,c:"#ff4757",e:"🔔"},{l:"Cooking",v:stats.prep,c:"#ff9f43",e:"👨‍🍳"},{l:"Ready",v:stats.ready,c:"#2ed573",e:"✅"},{l:"Revenue",v:`₹${stats.rev}`,c:"#1e90ff",e:"💰"}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,.07)",borderRadius:12,padding:"10px 8px",textAlign:"center",border:`1px solid ${s.c}33`}}><div style={{fontSize:18}}>{s.e}</div><div style={{fontSize:16,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:700}}>{s.l}</div></div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",background:"#1a1a2e",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        {[{id:"orders",l:"📋 Orders"},{id:"notifications",l:`🔔 Alerts${unread>0?` (${unread})`:""}`}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"14px 8px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #ff4757":"2px solid transparent",color:tab===t.id?"#ff4757":"rgba(255,255,255,.5)",fontFamily:"Nunito,sans-serif",fontSize:13,fontWeight:800,cursor:"pointer"}}>{t.l}</button>
        ))}
      </div>

      {tab==="orders"&&(
        <div style={{padding:"12px 16px"}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4}}>
            {["all","new","accepted","ready","delivered"].map(s=><button key={s} onClick={()=>setFilterS(s)} style={{padding:"6px 12px",borderRadius:20,border:"none",background:filterS===s?"#ff4757":"rgba(255,255,255,.1)",color:filterS===s?"#fff":"rgba(255,255,255,.6)",fontFamily:"Nunito,sans-serif",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>)}
          </div>
          {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:48,marginBottom:12}}>🍽️</div><div style={{fontWeight:700}}>No orders yet</div><div style={{fontSize:13,marginTop:4}}>Orders appear here in real-time after customer pays</div></div>}
          {filtered.map(order=>{
            const sc=STATUS_CFG[order.status]||STATUS_CFG.new; const isExp=expanded===order.id;
            return <div key={order.id} style={{background:"rgba(255,255,255,.06)",borderRadius:16,marginBottom:10,border:`1px solid ${sc.color}44`,overflow:"hidden"}}>
              <div style={{padding:"14px 16px",cursor:"pointer"}} onClick={()=>setExpanded(isExp?null:order.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:900,fontSize:14}}>{order.id}</span><span style={{background:sc.bg,color:sc.color,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:800}}>{sc.icon} {sc.label}</span></div><div style={{fontSize:13,color:"rgba(255,255,255,.7)",fontWeight:600}}>👤 {order.customer} • {order.time}</div><div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}>{order.items.length} item(s) • ₹{order.subtotal} • {order.payment?.toUpperCase()}</div></div>
                  <span style={{color:"rgba(255,255,255,.4)",fontSize:18}}>{isExp?"▲":"▼"}</span>
                </div>
              </div>
              {isExp&&<div style={{borderTop:"1px solid rgba(255,255,255,.08)",padding:"12px 16px"}}>
                {order.items.map(item=><div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13,color:"rgba(255,255,255,.8)"}}><span>{item.name} ×{item.qty}</span><span style={{fontWeight:700}}>₹{item.price*item.qty}</span></div>)}
                <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:6}}>📍 {order.address}</div>
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  {order.status==="new"&&<><button onClick={()=>updateOrderStatus(order.id,"accepted")} style={{flex:2,padding:12,background:"linear-gradient(135deg,#2ed573,#0a9e52)",border:"none",borderRadius:10,color:"#fff",fontFamily:"Nunito,sans-serif",fontWeight:800,fontSize:13,cursor:"pointer"}}>✅ Accept Order</button><button onClick={()=>updateOrderStatus(order.id,"cancelled")} style={{flex:1,padding:12,background:"rgba(255,71,87,.2)",border:"1px solid rgba(255,71,87,.4)",borderRadius:10,color:"#ff4757",fontFamily:"Nunito,sans-serif",fontWeight:800,fontSize:13,cursor:"pointer"}}>❌ Reject</button></>}
                  {order.status==="accepted"&&<button onClick={()=>updateOrderStatus(order.id,"ready")} style={{flex:1,padding:12,background:"linear-gradient(135deg,#ff9f43,#e67e22)",border:"none",borderRadius:10,color:"#fff",fontFamily:"Nunito,sans-serif",fontWeight:800,fontSize:13,cursor:"pointer"}}>✅ Mark Ready for Pickup</button>}
                  {order.status==="ready"&&<button onClick={()=>updateOrderStatus(order.id,"picked_up")} style={{flex:1,padding:12,background:"linear-gradient(135deg,#1e90ff,#0057ff)",border:"none",borderRadius:10,color:"#fff",fontFamily:"Nunito,sans-serif",fontWeight:800,fontSize:13,cursor:"pointer"}}>🛵 Mark Picked Up</button>}
                  {["delivered","cancelled","picked_up"].includes(order.status)&&<div style={{flex:1,padding:"10px 0",textAlign:"center",color:"rgba(255,255,255,.3)",fontSize:13,fontWeight:700}}>{sc.icon} {sc.label}</div>}
                </div>
              </div>}
            </div>;
          })}
        </div>
      )}

      {tab==="notifications"&&(
        <div style={{padding:"12px 16px"}}>
          {restaurantNotifications.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:48,marginBottom:12}}>🔕</div><div style={{fontWeight:700}}>No notifications yet</div></div>}
          {restaurantNotifications.map(n=>(
            <div key={n.id} onClick={()=>markNotificationRead("restaurant",n.id)} style={{background:n.read?"rgba(255,255,255,.04)":"rgba(255,71,87,.12)",borderRadius:14,padding:"14px 16px",marginBottom:8,border:n.read?"1px solid rgba(255,255,255,.06)":"1px solid rgba(255,71,87,.3)",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14,marginBottom:4}}>{n.title}</div><div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{n.message}</div>{n.order&&<div style={{marginTop:6,display:"flex",flexWrap:"wrap",gap:4}}>{n.order.items?.map(item=><span key={item.id} style={{background:"rgba(255,255,255,.08)",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600}}>{item.name} ×{item.qty}</span>)}</div>}</div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}><span style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{n.time}</span>{!n.read&&<span style={{width:8,height:8,borderRadius:"50%",background:"#ff4757",display:"block"}}/>}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DARK STORE DASHBOARD
============================================================ */
const GS = {new:{label:"New",color:"#ff4757",bg:"#fff0f1",icon:"📦"},packing:{label:"Packing",color:"#ff9f43",bg:"#fff9f0",icon:"📦"},packed:{label:"Packed",color:"#2ed573",bg:"#eafff4",icon:"✅"},out:{label:"Out for Delivery",color:"#1e90ff",bg:"#e8f4ff",icon:"🛵"},delivered:{label:"Delivered",color:"#888",bg:"#f5f5f5",icon:"🏁"}};
const GNEXT = {new:"packing",packing:"packed",packed:"out",out:"delivered"};

function DarkStoreDashboard() {
  const { groceryOrders,darkstoreNotifications,updateGroceryOrderStatus,markNotificationRead,inventory,restockItem,setActiveView } = useApp();
  const [tab,setTab] = useState("orders");
  const [expanded,setExpanded] = useState(null);
  const [restockQty,setRestockQty] = useState({});
  const unread = darkstoreNotifications.filter(n=>!n.read).length;
  const lowStock = inventory.filter(i=>i.stock<=i.threshold).length;
  const rev = groceryOrders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.subtotal,0);

  return (
    <div style={{minHeight:"100%",background:"linear-gradient(180deg,#0d2137,#0a1628)",fontFamily:"Nunito,sans-serif",color:"#fff"}}>
      <div style={{background:"rgba(0,0,0,.3)",padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{fontSize:11,color:"rgba(46,213,115,.7)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Dark Store</div><div style={{fontSize:20,fontWeight:900}}>🏪 QuickGo Store #1</div><div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:2}}>📍 Boring Road, Patna</div></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{background:"#2ed573",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:800}}>⚡ Live</div>
            <button onClick={()=>setActiveView("customer")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:10,padding:"6px 12px",color:"#fff",fontFamily:"Nunito,sans-serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>← App</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {[{l:"New",v:groceryOrders.filter(o=>o.status==="new").length,c:"#ff4757",e:"📦"},{l:"Packing",v:groceryOrders.filter(o=>o.status==="packing").length,c:"#ff9f43",e:"📦"},{l:"Low Stock",v:lowStock,c:lowStock>0?"#ff9f43":"#555",e:"⚠️"},{l:"Revenue",v:`₹${rev}`,c:"#2ed573",e:"💰"}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,.07)",borderRadius:12,padding:"10px 8px",textAlign:"center",border:`1px solid ${s.c}33`}}><div style={{fontSize:18}}>{s.e}</div><div style={{fontSize:16,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.5)",fontWeight:700}}>{s.l}</div></div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",background:"rgba(0,0,0,.2)",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        {[{id:"orders",l:"📦 Orders"},{id:"inventory",l:`🗂️ Inventory${lowStock>0?` ⚠️${lowStock}`:""}`},{id:"notifications",l:`🔔${unread>0?` (${unread})`:""}`}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"12px 6px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #2ed573":"2px solid transparent",color:tab===t.id?"#2ed573":"rgba(255,255,255,.5)",fontFamily:"Nunito,sans-serif",fontSize:12,fontWeight:800,cursor:"pointer"}}>{t.l}</button>
        ))}
      </div>

      {tab==="orders"&&<div style={{padding:"12px 16px"}}>
        {groceryOrders.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:48,marginBottom:12}}>🛒</div><div style={{fontWeight:700}}>No grocery orders yet</div></div>}
        {groceryOrders.map(order=>{
          const sc=GS[order.status]||GS.new; const isExp=expanded===order.id;
          return <div key={order.id} style={{background:"rgba(255,255,255,.06)",borderRadius:16,marginBottom:10,border:`1px solid ${sc.color}44`,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",cursor:"pointer"}} onClick={()=>setExpanded(isExp?null:order.id)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:900}}>{order.id}</span><span style={{background:sc.bg,color:sc.color,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:800}}>{sc.icon} {sc.label}</span></div><div style={{fontSize:13,color:"rgba(255,255,255,.7)",fontWeight:600}}>👤 {order.customer} • ⚡ {order.estimatedTime} min</div><div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}>{order.items.length} item(s) • ₹{order.subtotal}</div></div>
                <span style={{color:"rgba(255,255,255,.4)",fontSize:18}}>{isExp?"▲":"▼"}</span>
              </div>
            </div>
            {isExp&&<div style={{borderTop:"1px solid rgba(255,255,255,.08)",padding:"12px 16px"}}>
              {order.items.map(item=><div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13,color:"rgba(255,255,255,.8)",borderBottom:"1px solid rgba(255,255,255,.06)"}}><span>📦 {item.name} ×{item.qty}</span><span style={{fontWeight:700}}>₹{item.price*item.qty}</span></div>)}
              <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:8}}>📍 {order.address}</div>
              {GNEXT[order.status]&&<button onClick={()=>updateGroceryOrderStatus(order.id,GNEXT[order.status])} style={{width:"100%",marginTop:12,padding:12,background:"linear-gradient(135deg,#2ed573,#0a9e52)",border:"none",borderRadius:10,color:"#fff",fontFamily:"Nunito,sans-serif",fontWeight:800,fontSize:13,cursor:"pointer"}}>{order.status==="new"?"📦 Start Packing":order.status==="packing"?"✅ Packed":order.status==="packed"?"🛵 Dispatch":"🏁 Delivered"}</button>}
            </div>}
          </div>;
        })}
      </div>}

      {tab==="inventory"&&<div style={{padding:"12px 16px"}}>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",fontWeight:600,marginBottom:10}}>{inventory.filter(i=>i.stock<=i.threshold).length} items need restocking</div>
        {inventory.map(item=>{
          const isLow=item.stock<=item.threshold; const isCrit=item.stock<=Math.floor(item.threshold/2);
          const pct=Math.min(100,(item.stock/(item.threshold*5))*100);
          return <div key={item.id} style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:"14px 16px",marginBottom:8,border:isCrit?"1px solid rgba(255,71,87,.4)":isLow?"1px solid rgba(255,159,67,.3)":"1px solid rgba(255,255,255,.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div><div style={{fontWeight:700,fontSize:13}}>{item.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:.5}}>{item.category}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:900,fontSize:18,color:isCrit?"#ff4757":isLow?"#ff9f43":"#2ed573"}}>{item.stock}</div><div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>{item.unit}</div></div>
            </div>
            <div style={{height:6,background:"rgba(255,255,255,.1)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:isCrit?"#ff4757":isLow?"#ff9f43":"#2ed573",borderRadius:3,transition:"width .4s"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:11,color:"rgba(255,255,255,.4)"}}><span>Min: {item.threshold} {item.unit}</span>{isLow&&<span style={{color:isCrit?"#ff4757":"#ff9f43",fontWeight:700}}>{isCrit?"🚨 CRITICAL":"⚠️ LOW"}</span>}</div>
            {isLow&&<div style={{display:"flex",gap:6,marginTop:10}}>
              <input type="number" placeholder="Qty to add" value={restockQty[item.id]||""} onChange={e=>setRestockQty(p=>({...p,[item.id]:e.target.value}))} style={{flex:1,padding:"8px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.08)",color:"#fff",fontFamily:"Nunito,sans-serif",fontSize:13,outline:"none"}}/>
              <button onClick={()=>{restockItem(item.id,parseInt(restockQty[item.id])||10);setRestockQty(p=>({...p,[item.id]:""}));}} style={{padding:"8px 16px",borderRadius:10,background:"linear-gradient(135deg,#2ed573,#0a9e52)",border:"none",color:"#fff",fontFamily:"Nunito,sans-serif",fontWeight:800,fontSize:12,cursor:"pointer"}}>+ Restock</button>
            </div>}
          </div>;
        })}
      </div>}

      {tab==="notifications"&&<div style={{padding:"12px 16px"}}>
        {darkstoreNotifications.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:48,marginBottom:12}}>🔕</div><div style={{fontWeight:700}}>No alerts</div></div>}
        {darkstoreNotifications.map(n=>(
          <div key={n.id} onClick={()=>markNotificationRead("darkstore",n.id)} style={{background:n.read?"rgba(255,255,255,.04)":n.type==="low_stock"?"rgba(255,159,67,.12)":"rgba(46,213,115,.10)",borderRadius:14,padding:"14px 16px",marginBottom:8,cursor:"pointer",border:n.read?"1px solid rgba(255,255,255,.06)":n.type==="low_stock"?"1px solid rgba(255,159,67,.3)":"1px solid rgba(46,213,115,.3)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14,marginBottom:3}}>{n.title}</div><div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{n.message}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{n.time}</div>{!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#2ed573",marginTop:4,marginLeft:"auto"}}/>}</div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* ============================================================
   ADMIN DASHBOARD
============================================================ */
function AdminDashboard() {
  const { allOrders,adminNotifications,restaurantOrders,groceryOrders,markNotificationRead,setActiveView,inventory } = useApp();
  const [tab,setTab] = useState("overview");
  const unread = adminNotifications.filter(n=>!n.read).length;
  const lowStock = inventory.filter(i=>i.stock<=i.threshold);
  const totalRev = allOrders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.subtotal,0);
  const active = allOrders.filter(o=>!["delivered","cancelled"].includes(o.status)).length;
  const foodRev = restaurantOrders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.subtotal,0);
  const grocRev = groceryOrders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.subtotal,0);
  const SC = {new:"#ff4757",accepted:"#ff9f43",ready:"#2ed573",packing:"#ff9f43",packed:"#2ed573",out:"#1e90ff",delivered:"#888",cancelled:"#555",picked_up:"#1e90ff"};

  return (
    <div style={{minHeight:"100%",background:"linear-gradient(180deg,#0a0a1a,#111128)",fontFamily:"Nunito,sans-serif",color:"#fff"}}>
      <div style={{background:"rgba(0,0,0,.4)",padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div><div style={{fontSize:11,color:"rgba(255,215,0,.7)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Super Admin</div><div style={{fontSize:20,fontWeight:900}}>⚡ QuickApp HQ</div></div>
          <div style={{display:"flex",gap:8}}>
            {unread>0&&<div style={{background:"#ff4757",borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:800}}>🔔 {unread} new</div>}
            <button onClick={()=>setActiveView("customer")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:10,padding:"6px 12px",color:"#fff",fontFamily:"Nunito,sans-serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>← App</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          {[{l:"Total Revenue",v:`₹${totalRev}`,sub:"from completed orders",c:"#FFD700",e:"💰"},{l:"Active Orders",v:active,sub:"in progress now",c:"#2ed573",e:"📊"}].map(s=>(
            <div key={s.l} style={{background:`linear-gradient(135deg,${s.c}22,${s.c}08)`,border:`1px solid ${s.c}44`,borderRadius:14,padding:"14px"}}><div style={{fontSize:24}}>{s.e}</div><div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.5)",marginTop:2}}>{s.l}</div><div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{s.sub}</div></div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[{l:"Food Orders",v:restaurantOrders.length,c:"#ff4757",e:"🍔"},{l:"Grocery Orders",v:groceryOrders.length,c:"#2ed573",e:"🛒"},{l:"Low Stock",v:lowStock.length,c:lowStock.length>0?"#ff9f43":"#555",e:"⚠️"}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,.06)",borderRadius:12,padding:"10px 8px",textAlign:"center",border:`1px solid ${s.c}33`}}><div style={{fontSize:18}}>{s.e}</div><div style={{fontSize:18,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:700}}>{s.l}</div></div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",background:"rgba(0,0,0,.3)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        {[{id:"overview",l:"📊 Overview"},{id:"orders",l:"📋 Orders"},{id:"notifications",l:`🔔${unread>0?` (${unread})`:""}`}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"12px 6px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #FFD700":"2px solid transparent",color:tab===t.id?"#FFD700":"rgba(255,255,255,.4)",fontFamily:"Nunito,sans-serif",fontSize:12,fontWeight:800,cursor:"pointer"}}>{t.l}</button>
        ))}
      </div>

      {tab==="overview"&&<div style={{padding:"14px 16px"}}>
        <div style={{fontWeight:800,fontSize:14,marginBottom:10,color:"rgba(255,255,255,.7)"}}>📈 Revenue Breakdown</div>
        {[{l:"🍔 Food & Restaurant",v:foodRev,c:"#ff4757"},{l:"🛒 Grocery",v:grocRev,c:"#2ed573"}].map(item=>(
          <div key={item.l} style={{background:"rgba(255,255,255,.06)",borderRadius:14,padding:"14px 16px",marginBottom:8,border:`1px solid ${item.c}33`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700,fontSize:13}}>{item.l}</span><span style={{fontWeight:900,color:item.c}}>₹{item.v}</span></div>
            <div style={{height:6,background:"rgba(255,255,255,.1)",borderRadius:3}}><div style={{height:"100%",width:totalRev>0?`${(item.v/totalRev)*100}%`:"0%",background:item.c,borderRadius:3,transition:"width .5s"}}/></div>
          </div>
        ))}
        {lowStock.length>0&&<div style={{marginTop:14}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:8,color:"#ff9f43"}}>⚠️ Inventory Alerts</div>
          {lowStock.map(item=>{
            const isCrit=item.stock<=Math.floor(item.threshold/2);
            return <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:isCrit?"rgba(255,71,87,.1)":"rgba(255,159,67,.08)",border:`1px solid ${isCrit?"rgba(255,71,87,.3)":"rgba(255,159,67,.2)"}`,borderRadius:10,marginBottom:6}}>
              <div><div style={{fontWeight:700,fontSize:13}}>{item.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{item.category}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:900,fontSize:16,color:isCrit?"#ff4757":"#ff9f43"}}>{item.stock} {item.unit}</div><div style={{fontSize:10,color:isCrit?"#ff4757":"#ff9f43"}}>{isCrit?"🚨 CRITICAL":"⚠️ LOW"}</div></div>
            </div>;
          })}
        </div>}
      </div>}

      {tab==="orders"&&<div style={{padding:"12px 16px"}}>
        {allOrders.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:48,marginBottom:12}}>📋</div><div style={{fontWeight:700}}>No orders yet</div><div style={{fontSize:13,marginTop:4}}>Orders appear after customers checkout</div></div>}
        {allOrders.map(order=>(
          <div key={order.id} style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:"14px 16px",marginBottom:8,border:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontWeight:900,fontSize:13}}>{order.type==="food"?"🍔":"🛒"} {order.id}</span><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:800,background:`${SC[order.status]||"#888"}22`,color:SC[order.status]||"#888"}}>{order.status?.toUpperCase()}</span></div><div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:3}}>👤 {order.customer} • {order.time}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:900,fontSize:15,color:"#FFD700"}}>₹{order.subtotal}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{order.payment?.toUpperCase()}</div></div>
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>📍 {order.address}</div>
            {order.type==="food"&&<div style={{fontSize:11,color:"rgba(255,71,87,.7)",marginTop:3}}>🍳 {order.restaurant}</div>}
          </div>
        ))}
      </div>}

      {tab==="notifications"&&<div style={{padding:"12px 16px"}}>
        {adminNotifications.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"rgba(255,255,255,.3)"}}><div style={{fontSize:48,marginBottom:12}}>🔕</div><div style={{fontWeight:700}}>No notifications</div></div>}
        {adminNotifications.map(n=>(
          <div key={n.id} onClick={()=>markNotificationRead("admin",n.id)} style={{background:n.read?"rgba(255,255,255,.04)":n.type==="low_stock"?"rgba(255,159,67,.12)":"rgba(255,215,0,.08)",borderRadius:14,padding:"14px 16px",marginBottom:8,cursor:"pointer",border:n.read?"1px solid rgba(255,255,255,.06)":n.type==="low_stock"?"1px solid rgba(255,159,67,.3)":"1px solid rgba(255,215,0,.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}><div style={{fontWeight:800,fontSize:14,marginBottom:3}}>{n.title}</div><div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{n.message}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{n.time}</div>{!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#FFD700",marginTop:4,marginLeft:"auto"}}/>}</div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* ============================================================
   ROOT APP
============================================================ */
function AppInner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("food");
  const { activeView, setActiveView, paymentScreen, orderSuccess, restaurantNotifications, adminNotifications, darkstoreNotifications } = useApp();

  const rUnread = restaurantNotifications.filter(n=>!n.read).length;
  const aUnread = adminNotifications.filter(n=>!n.read).length;
  const dUnread = darkstoreNotifications.filter(n=>!n.read).length;

  if (!isLoggedIn) return <AuthPage onLogin={() => setIsLoggedIn(true)} />;

  if (activeView === "restaurant") return <div className="app-shell" style={{overflow:"auto"}}><RestaurantDashboard/></div>;
  if (activeView === "admin")      return <div className="app-shell" style={{overflow:"auto"}}><AdminDashboard/></div>;
  if (activeView === "darkstore")  return <div className="app-shell" style={{overflow:"auto"}}><DarkStoreDashboard/></div>;

  return (
    <div className="app-shell">
      {/* Demo panel switcher */}
      <div style={{display:"flex",background:"#1a1a2e",borderBottom:"1px solid rgba(255,255,255,.08)",overflowX:"auto",flexShrink:0}}>
        {[{id:"customer",l:"👤 Customer",c:"#ff4757"},{id:"restaurant",l:`🍳 Restaurant${rUnread>0?" 🔴":""}`,c:"#ff9f43"},{id:"darkstore",l:`🏪 Store${dUnread>0?" 🔴":""}`,c:"#2ed573"},{id:"admin",l:`⚡ Admin${aUnread>0?" 🔴":""}`,c:"#FFD700"}].map(v=>(
          <button key={v.id} onClick={()=>setActiveView(v.id)} style={{flex:"none",padding:"8px 12px",background:activeView===v.id?`${v.c}22`:"none",border:"none",borderBottom:activeView===v.id?`2px solid ${v.c}`:"2px solid transparent",color:activeView===v.id?v.c:"rgba(255,255,255,.4)",fontFamily:"Nunito,sans-serif",fontSize:11,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>{v.l}</button>
        ))}
      </div>

      {paymentScreen && <PaymentScreen/>}
      {orderSuccess && <OrderSuccessModal/>}

      <div className="app-content">
        {activeTab==="food"    && <FoodSection/>}
        {activeTab==="grocery" && <GrocerySection/>}
        {activeTab==="ride"    && <RideSection/>}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner/>
    </AppProvider>
  );
}
