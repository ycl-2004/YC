import { useEffect, useState } from "react";
import { asset } from "../lib/asset";

type FrameSequence = {
  directory: string;
  frameCount: number;
  intervalMs: number;
  version: string;
};

type MotionPortraitProps = {
  variant: "ai" | "design" | "music" | "read" | "photo";
  animatedSrc?: string;
  frameSequence?: FrameSequence;
  staticSrc: string;
  alt: string;
};

function MotionPortrait({
  variant,
  animatedSrc,
  frameSequence,
  staticSrc,
  alt,
}: MotionPortraitProps) {
  const [animationReady, setAnimationReady] = useState(false);
  const [animationFailed, setAnimationFailed] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const usesFrameSequence = Boolean(frameSequence) && !prefersReducedMotion;
  const shouldLoadAnimation =
    Boolean(animatedSrc) &&
    !usesFrameSequence &&
    !prefersReducedMotion &&
    !animationFailed;
  const currentFrameSrc =
    usesFrameSequence && frameSequence
      ? `${frameSequence.directory}/frame_${String(frameIndex + 1).padStart(2, "0")}.png?v=${frameSequence.version}`
      : staticSrc;

  useEffect(() => {
    if (!frameSequence || prefersReducedMotion) {
      setFrameIndex(0);
      return;
    }

    const frameSources = Array.from(
      { length: frameSequence.frameCount },
      (_, index) =>
        asset(
          `${frameSequence.directory}/frame_${String(index + 1).padStart(2, "0")}.png?v=${frameSequence.version}`,
        ),
    );
    frameSources.forEach((source) => {
      const frame = new Image();
      frame.src = source;
    });

    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frameSequence.frameCount);
    }, frameSequence.intervalMs);

    return () => window.clearInterval(timer);
  }, [
    frameSequence?.directory,
    frameSequence?.frameCount,
    frameSequence?.intervalMs,
    frameSequence?.version,
    prefersReducedMotion,
  ]);

  return (
    <button
      type="button"
      className={`motion-portrait motion-${variant}`}
      aria-label="放大查看角色动画"
      data-frame-dir={
        frameSequence ? asset(frameSequence.directory) : undefined
      }
      data-frame-count={frameSequence?.frameCount}
      data-frame-interval={frameSequence?.intervalMs}
      data-frame-version={frameSequence?.version}
    >
      <div
        className={`motion-picture${animationReady ? " animation-ready" : ""}${usesFrameSequence ? " frame-sequence" : ""}`}
      >
        {/* The reading scene advances through its PNG frames directly: this avoids browser-specific SVG image offsets. */}
        <img
          className="pillar-img motion-static"
          src={asset(currentFrameSrc)}
          alt={alt}
          loading="eager"
          decoding="async"
          style={{ opacity: animationReady ? 0 : undefined }}
        />
        {shouldLoadAnimation && animatedSrc && (
          <img
            className={`pillar-img motion-animation${animationReady ? " is-ready" : ""}`}
            src={asset(animatedSrc)}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            style={{ opacity: animationReady ? 0.98 : 0 }}
            onLoad={() => setAnimationReady(true)}
            onError={() => setAnimationFailed(true)}
          />
        )}
      </div>
    </button>
  );
}

export default function Work() {
  return (
    <section className="pad" id="work">
      <div className="ambient" data-ambient="petal" aria-hidden="true"></div>
      <div className="container">
        <div className="pillars-head reveal">
          <span className="sec-num">03</span>
          <h2 className="sec-title serif">主要分享</h2>
          <p className="sec-sub">
            五个内容，一种方式：
            <span className="deco">Romantic Engineering.</span>
          </p>
          <p className="universe-line" aria-label="YC 的内容世界">
            <span>AI Lab</span>
            <i>·</i>
            <span>Design Room</span>
            <i>·</i>
            <span>Music Corner</span>
            <i>·</i>
            <span>Book Shelf</span>
            <i>·</i>
            <span>Life Diary</span>
          </p>
        </div>
        <div className="pillar-grid">
          <div className="pillar reveal reveal-d1">
            <span className="pillar-bgnum">1</span>
            <span className="emoji">⌨️</span>
            <span className="en">AI Creator Life</span>
            <h3>让 AI 变成创作系统</h3>
            <div className="kw">
              <span>AI Tools</span>
              <span>Agents</span>
              <span>Automation</span>
              <span>Build Log</span>
            </div>
            <MotionPortrait
              variant="ai"
              animatedSrc="assets/animate_svg/img_1/animation.svg?v=4"
              staticSrc="assets/animate_svg/img_1/frames/frame_01.png?v=4"
              alt="YC 坐着使用笔记本电脑写代码和构建 AI 工具"
            />
          </div>
          <div className="pillar reveal reveal-d2">
            <span className="pillar-bgnum">2</span>
            <svg className="spark s1" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" />
            </svg>
            <svg className="spark s2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" />
            </svg>
            <span className="emoji">💡</span>
            <span className="en">Design My Own</span>
            <h3>把想法做成表达</h3>
            <div className="kw">
              <span>Visual Design</span>
              <span>Personal Brand</span>
              <span>Web</span>
              <span>Covers</span>
            </div>
            <MotionPortrait
              variant="design"
              animatedSrc="assets/animate_svg/img_2/animation.svg?v=4"
              staticSrc="assets/animate_svg/img_2/frames/frame_01.png?v=4"
              alt="YC 在笔记本上写字，记录灵感和规划想法"
            />
          </div>
          <div className="pillar reveal reveal-d3">
            <span className="pillar-bgnum">3</span>
            <span className="emoji">♪</span>
            <span className="en">Music &amp; Mood</span>
            <h3>用旋律记录情绪</h3>
            <div className="kw">
              <span>Guitar</span>
              <span>Melody</span>
              <span>Mood</span>
              <span>Rap</span>
            </div>
            <MotionPortrait
              variant="music"
              animatedSrc="assets/animate_svg/img_6/animation.svg?v=7"
              staticSrc="assets/animate_svg/img_6/frames/frame_01.png?v=7"
              alt="YC 坐着弹木吉他，投入地创作音乐"
            />
          </div>
          <div className="pillar span2 reveal reveal-d1">
            <MotionPortrait
              variant="read"
              frameSequence={{
                directory: "assets/animate_svg/img_4/frames",
                frameCount: 16,
                intervalMs: 688,
                version: "4",
              }}
              staticSrc="assets/animate_svg/img_4/frames/frame_01.png?v=4"
              alt="YC 坐在一摞书上专注阅读"
            />
            <div className="p-body">
              <span className="emoji">📚</span>
              <span className="en">Books / Mind / Growth</span>
              <h3>读书，思考，慢慢长成自己</h3>
              <div className="kw">
                <span>Books</span>
                <span>Mind</span>
                <span>Psychology</span>
                <span>Long-term Growth</span>
              </div>
            </div>
          </div>
          <div className="pillar reveal reveal-d2">
            <span className="pillar-bgnum">5</span>
            <span className="emoji">🌿</span>
            <span className="en">Soft Life Diary</span>
            <h3>把日常过成作品</h3>
            <div className="kw">
              <span>Coffee</span>
              <span>City Walks</span>
              <span>Travel</span>
              <span>Soft Life</span>
            </div>
            <MotionPortrait
              variant="photo"
              animatedSrc="assets/animate_svg/img_5/animation.svg?v=4"
              staticSrc="assets/animate_svg/img_5/frames/frame_01.png?v=4"
              alt="YC 穿橄榄色外套拿着相机记录生活"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
