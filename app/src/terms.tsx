import ReactDOM from 'react-dom/client'
import LegalPage from './components/LegalPage'
import './index.css'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LegalPage titleZh="使用条款" titleEn="Terms of Use" updated="2026-06-21">
    <p>
      欢迎访问 YC 个人主页。访问或使用本站，即表示你同意以下条款。
      <span className="legal-en">
        Welcome to YC's personal homepage. By accessing or using this site, you agree to
        the terms below.
      </span>
    </p>

    <h2>原创内容与版权 · Original content &amp; copyright</h2>
    <p>
      本站的视觉形象、插画、IP 设计、动画与文字均为 YC（Yi-Chen Lin）原创，版权归 YC 所有。未经书面许可，请勿用于商业用途、二次分发、训练数据或衍生再创作。
      <span className="legal-en">
        The visual identity, illustrations, IP design, animations, and writing on this
        site are original works by YC (Yi-Chen Lin) and remain YC's property. Please do
        not use them for commercial purposes, redistribution, training data, or derivative
        works without written permission.
      </span>
    </p>

    <h2>个人允许的使用 · Permitted personal use</h2>
    <p>
      你可以浏览、分享本站链接，并出于非商业的个人欣赏目的引用少量内容（请注明出处为 YC）。
      <span className="legal-en">
        You may browse the site, share its link, and quote small portions for
        non-commercial personal appreciation (please credit YC).
      </span>
    </p>

    <h2>免责声明 · Disclaimer</h2>
    <p>
      本站内容按“现状”提供，仅代表 YC 的个人观点与创作记录，不构成任何专业建议。本站尽力保持信息准确，但不对其完整性或时效性作出保证。
      <span className="legal-en">
        Content is provided "as is", reflects YC's personal views and creative log, and
        does not constitute professional advice. We strive for accuracy but make no
        guarantee of completeness or timeliness.
      </span>
    </p>

    <h2>外部链接 · External links</h2>
    <p>
      本站包含通往第三方平台的链接，对这些外部网站的内容与行为不承担责任。
      <span className="legal-en">
        This site contains links to third-party platforms and is not responsible for the
        content or practices of those external sites.
      </span>
    </p>

    <h2>条款更新 · Changes</h2>
    <p>
      本条款可能随时更新，更新后即时生效。重大变更会在本页注明更新日期。
      <span className="legal-en">
        These terms may be updated at any time and take effect upon posting. Significant
        changes will be reflected in the "Last updated" date on this page.
      </span>
    </p>
  </LegalPage>,
)
