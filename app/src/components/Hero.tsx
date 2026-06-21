import { useState } from "react";
import type { CSSProperties } from "react";
import { asset } from "../lib/asset";

// Each pose carries its own switch effect (`fx`) and entrance animation
// (`enter`) so no two transitions feel the same.
const POSES = [
  {
    src: "assets/stickers/yc-stand.png",
    label: "叉腰站立",
    note: "稳的稳的",
    fx: "halo",
    enter: "pop",
  },
  {
    src: "assets/stickers/yc-wave.png",
    label: "挥手打招呼",
    note: "看看我",
    fx: "wave",
    enter: "tilt",
  },
  {
    src: "assets/stickers/yc-peace.png",
    label: "比耶",
    note: "耶～～",
    fx: "star",
    enter: "pop",
  },
  {
    src: "assets/stickers/yc-thumb.png",
    label: "点赞",
    note: "超赞呀呀",
    fx: "like",
    enter: "pop",
  },
  {
    src: "assets/stickers/yc-cross.png",
    label: "抱臂",
    note: "酷到飞起",
    fx: "cool",
    enter: "slide",
  },
  {
    src: "assets/stickers/yc-jump.png",
    label: "起跳",
    note: "嘻嘻开心",
    fx: "jump",
    enter: "bounce",
  },
  {
    src: "assets/stickers/yc-heart.png",
    label: "比心",
    note: "上头了我不说",
    fx: "heart",
    enter: "soft",
  },
  {
    src: "assets/stickers/yc-cheer.png",
    label: "欢呼",
    note: "啊啊啊啊啊",
    fx: "cheer",
    enter: "pop",
  },
];

const cv = (o: Record<string, string | number>) => o as CSSProperties;

// Even ring of N particles, centred on the figure.
const radial = (n: number, dist: number) =>
  Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    return cv({
      "--tx": `${Math.round(Math.cos(a) * dist)}px`,
      "--ty": `${Math.round(Math.sin(a) * dist)}px`,
      "--d": `${(k % 4) * 0.025}s`,
    });
  });

const CONFETTI = ["#e8657a", "#5b8cd1", "#f4b740", "#5E8C68", "#b23a48"];

function fxParticles(fx: string) {
  switch (fx) {
    case "star": // peace → gold starburst
      return radial(7, 96).map((s, k) => (
        <i key={k} className="st" style={s}>
          {["✦", "✧", "★"][k % 3]}
        </i>
      ));
    case "cheer": // cheer → colorful confetti explosion
      return radial(12, 112).map((s, k) => (
        <i
          key={k}
          className="cf"
          style={cv({ ...(s as object), "--c": CONFETTI[k % CONFETTI.length] })}
        />
      ));
    case "heart": // heart → stream of hearts floating up
      return Array.from({ length: 7 }, (_, k) => (
        <i
          key={k}
          className="ht"
          style={cv({
            "--x": `${(k - 3) * 16}px`,
            "--drift": `${(k % 2 ? 1 : -1) * 14}px`,
            "--d": `${k * 0.06}s`,
            fontSize: `${0.8 + (k % 3) * 0.35}rem`,
          })}
        >
          ♥
        </i>
      ));
    case "wave": // wave → dots fanning up from the hand
      return Array.from({ length: 5 }, (_, k) => {
        const ang = ((-150 + k * 22) * Math.PI) / 180;
        const dist = 34 + k * 5;
        return (
          <i
            key={k}
            className="d"
            style={cv({
              "--tx": `${Math.round(Math.cos(ang) * dist)}px`,
              "--ty": `${Math.round(Math.sin(ang) * dist)}px`,
              "--d": `${k * 0.05}s`,
            })}
          />
        );
      });
    case "like": // thumbs up → 👍 and +1 rising
      return [
        <i
          key="t"
          className="lk thumb"
          style={cv({ "--x": "0px", "--d": "0s" })}
        >
          👍
        </i>,
        ...(
          [
            ["+1", "-26px", ".08s"],
            ["+1", "24px", ".16s"],
            ["♥", "-6px", ".24s"],
          ] as const
        ).map(([t, x, d], k) => (
          <i key={k} className="lk plus" style={cv({ "--x": x, "--d": d })}>
            {t}
          </i>
        )),
      ];
    case "cool": // arms crossed → shutter glint sweep + glasses sparkle
      return [
        <span key="g" className="glint" />,
        <i
          key="a"
          className="gl"
          style={cv({ left: "40%", top: "40%", "--d": ".12s" })}
        >
          ✦
        </i>,
        <i
          key="b"
          className="gl"
          style={cv({ left: "58%", top: "40%", "--d": ".2s" })}
        >
          ✦
        </i>,
      ];
    case "jump": // jump → dust puff at feet + upward energy streaks
      return [
        <span key="d" className="dust" />,
        ...Array.from({ length: 5 }, (_, k) => (
          <i
            key={k}
            className="ln"
            style={cv({ "--x": `${(k - 2) * 22}px`, "--d": `${k * 0.04}s` })}
          />
        )),
      ];
    case "halo": // calm → soft halo pulse, no particles
    default:
      return [
        <span key="r1" className="hl" />,
        <span key="r2" className="hl r2" />,
      ];
  }
}

export default function Hero() {
  const [pose, setPose] = useState(0);
  const [clicks, setClicks] = useState(0);
  const nextPose = () => {
    setPose((p) => (p + 1) % POSES.length);
    setClicks((c) => c + 1);
  };
  const current = POSES[pose];
  const figureNote = clicks > 0 ? current.note : "红发 + 眼镜，认准我";
  return (
    <header className="hero">
      <div className="aurora" aria-hidden="true">
        <span className="a1"></span>
        <span className="a2"></span>
        <span className="a3"></span>
      </div>
      <span className="hero-bgword" data-parallax="0.25" aria-hidden="true">
        YC
      </span>

      <div className="hero-left">
        <p className="eyebrow">
          Personal IP <span className="dot"></span>{" "}
          <span>Build · Share · Inspire</span>
        </p>
        <p className="hero-greeting">你好，我是</p>
        <div className="hero-namerow">
          <h1 className="hero-name serif">
            <span className="hero-name-glow" aria-hidden="true"></span>
            <span className="name name-shine">YC</span>
          </h1>
          <p className="hero-roles deco">
            a{" "}
            <span className="rot" id="rotator">
              creator
            </span>
          </p>
        </div>
        <p className="hero-intro">
          <span className="hero-intro-line">
            <b>认真生活，浪漫创作</b>
          </span>
          <span className="hero-intro-line">
            用 AI、设计、音乐和文字，把生活慢慢做成<b>作品</b>，也<b>和你相遇</b>。
          </span>
        </p>
        <p className="hero-start">
          <span className="hero-start-title">第一次认识 YC？</span>
          <span className="hero-start-line">
            分享 <b>AI 工具</b>，<b>创作系统</b>，<b>音乐灵感</b>，和认真生活的切片
          </span>
          <span className="hero-start-line">——真的很高兴遇见也有兴趣的妳</span>
        </p>
        <div className="hero-actions">
          <a href="#now" className="btn btn-primary shimmer" data-magnetic>
            看看最近的 YC <span className="ar">↓</span>
          </a>
          <a href="#find" className="btn btn-ghost" data-magnetic>
            关注 YC <span className="ar">→</span>
          </a>
        </div>
        <div className="hero-stats">
          <div className="st">
            <div className="n" data-count="5">
              0
            </div>
            <div className="l">
              <span>创作方向</span>
              <i aria-hidden="true">·</i>
              <span className="stat-en">directions</span>
            </div>
          </div>
          <div className="st">
            <div className="n" data-count="8">
              0
            </div>
            <div className="l">
              <span>性格标签</span>
              <i aria-hidden="true">·</i>
              <span className="stat-en">traits</span>
            </div>
          </div>
          <div className="st">
            <div className="n">∞</div>
            <div className="l">
              <span>可能性</span>
              <i aria-hidden="true">·</i>
              <span className="stat-en">possibilities</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="figure-stage" id="figStage">
          <div className="fig-ring"></div>
          <div className="fig-ring r2"></div>
          <div className="fig-disc"></div>
          <span className="fig-beam" aria-hidden="true"></span>
          <button
            type="button"
            className="fig-figure"
            onClick={nextPose}
            aria-label={`YC 的 chibi 形象，当前造型「${current.label}」，点击换下一个造型`}
          >
            <img
              key={pose}
              className={`fig-img enter-${current.enter}`}
              src={asset(current.src)}
              alt={`YC 本人 · 酒红乱发 + 透明圆框眼镜 + 牛仔外套的 chibi 形象（${current.label}）`}
            />
          </button>
          {clicks > 0 && (
            <span
              className={`fig-fx fx-${current.fx}`}
              key={clicks}
              aria-hidden="true"
            >
              {fxParticles(current.fx)}
            </span>
          )}
          <span className="fig-heart" aria-hidden="true">
            ♥
          </span>
          <div className="fig-badges" aria-label="YC 的兴趣标签">
            <span className="fig-badge b1">
              <span className="e">🤖</span>AI
            </span>
            <span className="fig-badge b2">
              <span className="e">♪</span>music
            </span>
            <span className="fig-badge b3">
              <span className="e">📚</span>books
            </span>
            <span className="fig-badge b4">
              <span className="e">🎨</span>design
            </span>
            <span className="fig-badge b5">
              <span className="e">🌿</span>life
            </span>
          </div>
          <span className="fig-note script">{figureNote}</span>
        </div>
      </div>

      <div className="scrollcue" aria-hidden="true">
        <span>scroll</span>
        <span className="line"></span>
      </div>
    </header>
  );
}
