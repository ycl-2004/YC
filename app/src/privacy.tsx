import ReactDOM from 'react-dom/client'
import LegalPage from './components/LegalPage'
import './index.css'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LegalPage titleZh="隐私政策" titleEn="Privacy Policy" updated="2026-06-21">
    <p>
      本站（YC 个人主页）是一个静态的个人作品集网页，不提供注册、登录、评论或表单提交功能。
      <span className="legal-en">
        This site (YC's personal homepage) is a static personal portfolio. It has no
        sign-up, login, comment, or form-submission features.
      </span>
    </p>

    <h2>我们收集什么 · What we collect</h2>
    <p>
      <strong>不收集任何个人数据。</strong>本站不使用追踪 Cookie、不接入第三方广告或分析脚本，也不会记录可识别你个人身份的信息。
      <span className="legal-en">
        <strong>Nothing personal.</strong> This site uses no tracking cookies and embeds
        no third-party advertising or analytics scripts, and does not store any
        personally identifiable information.
      </span>
    </p>

    <h2>第三方链接 · Third-party links</h2>
    <p>
      页面中通往小红书、Instagram、微信等平台的链接由对应平台各自的隐私政策约束。点击离开本站后，这些平台如何处理你的数据不在本站控制范围内。
      <span className="legal-en">
        Links to platforms such as Xiaohongshu, Instagram, and WeChat are governed by
        each platform's own privacy policy. Once you leave this site, how those services
        handle your data is outside our control.
      </span>
    </p>

    <h2>字体与托管 · Fonts &amp; hosting</h2>
    <p>
      本站使用 Google Fonts 加载网页字体，并托管于静态页面服务（GitHub Pages）。这些服务可能按其惯例记录基础的访问日志（如 IP 与浏览器类型），用于提供和保护服务。
      <span className="legal-en">
        This site loads web fonts via Google Fonts and is hosted on a static page service
        (GitHub Pages). These providers may keep basic access logs (such as IP and browser
        type) as part of normal operation.
      </span>
    </p>

    <h2>联系 · Contact</h2>
    <p>
      关于隐私的任何问题，欢迎通过<a href="./#find">首页的联系方式</a>与 YC 取得联系。
      <span className="legal-en">
        For any privacy questions, reach YC via the <a href="./#find">contact links on the
        home page</a>.
      </span>
    </p>
  </LegalPage>,
)
