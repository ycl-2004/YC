import { useEffect, useState } from "react";
import { asset } from "../lib/asset";

const FRAME_COUNT = 16;
const CLIP_ASSET_VERSION = "frames-16-clean-v14";
const DEFAULT_STAGE_IMAGE = "assets/wardrobe-default-coffee-moon.png";

const versionedAsset = (path: string) =>
  `${asset(path)}?v=${CLIP_ASSET_VERSION}`;

type WardrobeClipConfig = {
  slug: string;
  label: string;
  alt: string;
  stageImage: string;
  sceneAlt: string;
  tags: readonly string[];
  frameMs: number;
  frameHoldMultipliers?: Partial<Record<number, number>>;
};

const wardrobeClips = [
  {
    slug: "tidy-clothes",
    label: "帅到飞起",
    alt: "YC 整理黑色外套，摆出酷酷的姿态",
    stageImage: "assets/wardrobe-scenes/city-dusk.jpg",
    sceneAlt: "一座有路灯与城市天际线的黄昏天台",
    tags: ["独立感", "秩序感", "工程思维", "一直在成长"],
    frameMs: 110,
  },
  {
    slug: "listen-music",
    label: "乐坛独秀",
    alt: "YC 戴着耳机听音乐，随节奏点头",
    stageImage: "assets/wardrobe-scenes/music-room.jpg",
    sceneAlt: "一间摆着唱机、耳机与暖灯的音乐小屋",
    tags: ["热爱音乐", "浪漫主义者", "温暖友善", "梦想家"],
    frameMs: 110,
  },
  {
    slug: "adjust-glasses-cool",
    label: "180展示",
    alt: "YC 展示穿搭，推了下眼镜",
    stageImage: "assets/wardrobe-scenes/style-studio.jpg",
    sceneAlt: "一间带落地镜与衣架的晨光穿搭工作室",
    tags: ["风格表达", "审美直觉", "记录灵感", "真诚投入"],
    frameMs: 110,
  },
  {
    slug: "love-brain",
    label: "上头了是真上头",
    alt: "YC 的恋爱脑日常：打招呼、自拍、心动",
    stageImage: "assets/wardrobe-scenes/flower-date.jpg",
    sceneAlt: "一条有红色郁金香、单车与花藤拱门的约会小径",
    tags: ["温暖友善", "真诚投入", "浪漫主义者", "很会读人"],
    frameMs: 110,
    frameHoldMultipliers: { 11: 3 },
  },
  {
    slug: "late-backpack-run",
    label: "跑！！",
    alt: "YC 背着包慌张跑步，像快迟到了一样",
    stageImage: "assets/wardrobe-scenes/morning-platform.jpg",
    sceneAlt: "一座有小钟、咖啡与晨光列车站台的清晨场景",
    tags: ["行动力", "生活节奏", "一直在成长", "赶路也浪漫"],
    frameMs: 110,
  },
] as const satisfies readonly WardrobeClipConfig[];

type WardrobeClip = (typeof wardrobeClips)[number];

function wardrobeFrameSrc(clip: WardrobeClip, frame: number) {
  return versionedAsset(
    `assets/animate_clips/wardrobe-clean/${clip.slug}/frame_${String(frame).padStart(2, "0")}.png`,
  );
}

function wardrobeFrameSources(clip: WardrobeClip) {
  return Array.from({ length: FRAME_COUNT }, (_, index) =>
    wardrobeFrameSrc(clip, index + 1),
  );
}

const imagePreloadCache = new Map<string, Promise<void>>();
const clipPreloadCache = new Map<WardrobeClip["slug"], Promise<void>>();
const clipReadyCache = new Set<WardrobeClip["slug"]>();

function preloadImage(src: string) {
  const cached = imagePreloadCache.get(src);
  if (cached) return cached;

  const request = new Promise<void>((resolve) => {
    const image = new Image();

    image.decoding = "async";
    image.onload = () => {
      const decode = image.decode?.();
      if (decode) {
        void decode.then(resolve, resolve);
        return;
      }
      resolve();
    };
    image.onerror = () => resolve();
    image.src = src;
    if (image.complete) {
      resolve();
    }
  });

  imagePreloadCache.set(src, request);
  return request;
}

function preloadWardrobeClip(clip: WardrobeClip) {
  const cached = clipPreloadCache.get(clip.slug);
  if (cached) return cached;

  const request = Promise.all([
    preloadImage(asset(clip.stageImage)),
    ...wardrobeFrameSources(clip).map(preloadImage),
  ]).then(() => {
    clipReadyCache.add(clip.slug);
  });

  clipPreloadCache.set(clip.slug, request);
  return request;
}

function frameDelayMs(clip: WardrobeClip, frame: number) {
  const frameHoldMultipliers = (
    "frameHoldMultipliers" in clip ? clip.frameHoldMultipliers : undefined
  ) as Partial<Record<number, number>> | undefined;
  return clip.frameMs * (frameHoldMultipliers?.[frame] ?? 1);
}

function useWardrobeClipReady(clip: WardrobeClip | null) {
  const [isReady, setIsReady] = useState(!clip || clipReadyCache.has(clip.slug));

  useEffect(() => {
    let isCancelled = false;

    if (!clip) {
      setIsReady(true);
      return () => {
        isCancelled = true;
      };
    }

    if (clipReadyCache.has(clip.slug)) {
      setIsReady(true);
      return () => {
        isCancelled = true;
      };
    }

    setIsReady(false);
    void preloadWardrobeClip(clip).then(() => {
      if (!isCancelled) setIsReady(true);
    });

    return () => {
      isCancelled = true;
    };
  }, [clip]);

  return isReady;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function useHoverCapable() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCapability = () => setCanHover(media.matches);

    updateCapability();
    media.addEventListener("change", updateCapability);

    return () => media.removeEventListener("change", updateCapability);
  }, []);

  return canHover;
}

function WardrobeStage({
  clip,
  position,
  canTogglePlayback,
}: {
  clip: WardrobeClip | null;
  position: number;
  canTogglePlayback: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isClipReady = useWardrobeClipReady(clip);
  const [frame, setFrame] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setFrame(1);
    setIsPaused(false);
  }, [clip?.slug, prefersReducedMotion]);

  useEffect(() => {
    if (
      !clip ||
      !isClipReady ||
      prefersReducedMotion ||
      isPaused ||
      frame >= FRAME_COUNT
    )
      return;

    const timer = window.setTimeout(
      () => {
        setFrame((currentFrame) => Math.min(currentFrame + 1, FRAME_COUNT));
      },
      frameDelayMs(clip, frame),
    );

    return () => window.clearTimeout(timer);
  }, [clip, frame, isClipReady, isPaused, prefersReducedMotion]);

  const isPlaybackInteractive =
    canTogglePlayback && Boolean(clip) && isClipReady && !prefersReducedMotion;
  const isPreparingClip = Boolean(clip) && !prefersReducedMotion && !isClipReady;

  const togglePlayback = () => {
    if (!isPlaybackInteractive) return;
    if (frame >= FRAME_COUNT) {
      setFrame(1);
      setIsPaused(false);
      return;
    }
    setIsPaused((current) => !current);
  };

  const stageNumber = clip ? String(position).padStart(2, "0") : "00";
  const stageClassName = [
    "wardrobe-stage",
    isPlaybackInteractive ? "is-interactive" : "",
    isPreparingClip ? "is-loading" : "",
    isPaused ? "is-paused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const stageContent = (
    <>
      <div
        className={`wardrobe-stage-visual${clip ? ` is-${clip.slug}` : " is-default"}`}
        key={clip?.slug ?? "moon-note"}
        style={{
          backgroundImage: `url(${asset(clip?.stageImage ?? DEFAULT_STAGE_IMAGE)})`,
        }}
      >
        <div className="wardrobe-stage-topline" aria-hidden="true">
          <span>YC&apos;s little world</span>
          <span>
            {clip
              ? `${stageNumber} / ${String(wardrobeClips.length).padStart(2, "0")}`
              : "day to night"}
          </span>
        </div>
        {clip ? (
          <>
            <img
              className="wardrobe-stage-character"
              src={wardrobeFrameSrc(clip, frame)}
              alt={clip.alt}
              draggable={false}
              loading="eager"
            />
            <div
              className="wardrobe-keyword-cloud"
              aria-label={`${clip.label}的主题标签`}
            >
              {clip.tags.map((tag) => (
                <span className="wardrobe-keyword" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <span className="wardrobe-playback-pill" aria-hidden="true">
              {isPreparingClip
                ? "准备动画..."
                : isPaused
                ? "已暂停 · 点击继续"
                : frame >= FRAME_COUNT
                  ? "再看一次"
                  : ""}
            </span>
            <span className="sr-only" aria-live="polite">
              {isPreparingClip
                ? `${clip.label}动画正在加载。`
                : isPaused
                ? `${clip.label}动画已暂停。`
                : `${clip.label}动画播放到第 ${frame} 帧。`}
            </span>
          </>
        ) : (
          <p className="sr-only">
            YC 在月光下望着月亮。悬停下方造型可进入不同小场景。
          </p>
        )}
      </div>
    </>
  );

  if (!isPlaybackInteractive) {
    return (
      <div className={stageClassName} role="status" aria-live="polite">
        {stageContent}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={stageClassName}
      aria-label={`${clip?.label ?? "当前造型"}动画：${isPaused ? "继续播放" : frame >= FRAME_COUNT ? "重新播放" : "切换播放状态"}`}
      aria-pressed={isPaused}
      onClick={togglePlayback}
    >
      {stageContent}
    </button>
  );
}

function WardrobeLook({
  clip,
  isActive,
  canHover,
  onPreview,
  onActivate,
}: {
  clip: WardrobeClip;
  isActive: boolean;
  canHover: boolean;
  onPreview: () => void;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      className={`ward-clip${isActive ? " is-active" : ""}`}
      aria-label={`选择「${clip.label}」造型：${clip.sceneAlt}`}
      aria-pressed={isActive}
      onClick={() => {
        if (!canHover) onActivate();
      }}
      onFocus={() => {
        if (canHover) onPreview();
      }}
      onPointerEnter={(event) => {
        if (canHover && event.pointerType === "mouse") onPreview();
      }}
    >
      <span
        className="ward-clip-scene"
        style={{ backgroundImage: `url(${asset(clip.stageImage)})` }}
        aria-hidden="true"
      />
      <img
        className="ward-clip-character"
        src={wardrobeFrameSrc(clip, 1)}
        alt=""
        draggable={false}
        loading="lazy"
      />
      <span className="ward-caption" aria-hidden="true">
        {clip.label}
      </span>
    </button>
  );
}

export default function About() {
  const [activeSlug, setActiveSlug] = useState<WardrobeClip["slug"] | null>(
    null,
  );
  const canHover = useHoverCapable();
  const activeIndex = activeSlug
    ? wardrobeClips.findIndex((clip) => clip.slug === activeSlug)
    : -1;
  const activeClip = activeIndex >= 0 ? wardrobeClips[activeIndex] : null;

  useEffect(() => {
    wardrobeClips.forEach((clip) => {
      void preloadImage(asset(clip.stageImage));
      void preloadImage(wardrobeFrameSrc(clip, 1));
    });

    const warmTimers: number[] = [];
    const warmAllClips = () => {
      wardrobeClips.forEach((clip, index) => {
        warmTimers.push(
          window.setTimeout(() => {
            void preloadWardrobeClip(clip);
          }, index * 220),
        );
      });
    };

    const clearWarmTimers = () => {
      warmTimers.forEach((timer) => window.clearTimeout(timer));
    };

    const requestIdle = window.requestIdleCallback?.bind(window);
    const cancelIdle = window.cancelIdleCallback?.bind(window);

    if (requestIdle && cancelIdle) {
      const idleId = requestIdle(warmAllClips, {
        timeout: 1600,
      });

      return () => {
        cancelIdle(idleId);
        clearWarmTimers();
      };
    }

    const timer = window.setTimeout(warmAllClips, 500);
    return () => {
      window.clearTimeout(timer);
      clearWarmTimers();
    };
  }, []);

  return (
    <section className="about pad" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="reveal">
            <span className="sec-num">01</span>
            <h2 className="sec-title serif">关于我</h2>
            <p>
              <span className="hl">理性</span> 和{" "}
              <span className="hl-d">浪漫</span> 共存
            </p>
            <p>
              用工程思维把事情做扎实，把<span className="hl">浪漫</span>
              感受留在<span className="hl">细节</span>里。
            </p>
            <p>
              <span className="hl-d">恋爱脑</span>
              ，也上进。认真对待每一个关系，想法，和作品。
            </p>
            <p>
              不追求一路完美，只追求路上永远：
              <span className="hl-b">Progress &gt; Perfection.</span>
            </p>
            <span className="about-sign script">— YC ♥ Content Creater</span>
          </div>
          <div className="reveal reveal-d1">
            <div
              className="wardrobe"
              onPointerLeave={(event) => {
                if (canHover && event.pointerType === "mouse")
                  setActiveSlug(null);
              }}
            >
              <p className="lbl script">
                多面 <b>YC</b>；，都是我 →
              </p>
              <WardrobeStage
                clip={activeClip}
                position={activeIndex + 1}
                canTogglePlayback={canHover}
              />
              <div className="ward-rail">
                {wardrobeClips.map((clip) => (
                  <WardrobeLook
                    clip={clip}
                    isActive={clip.slug === activeSlug}
                    key={clip.slug}
                    canHover={canHover}
                    onPreview={() => setActiveSlug(clip.slug)}
                    onActivate={() => {
                      setActiveSlug((current) =>
                        current === clip.slug ? null : clip.slug,
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
