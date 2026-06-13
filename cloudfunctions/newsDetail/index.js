const cloud = require('wx-server-sdk');
const https = require('https');
const { URL } = require('url');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

/** 解码 HTML 实体 */
function decodeHtmlEntities(text) {
  const entities = {
    '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&quot;': '"', '&#39;': "'", '&mdash;': '—', '&ndash;': '–',
    '&hellip;': '…', '&ldquo;': '“', '&rdquo;': '”',
    '&lsquo;': "'", '&rsquo;': "'", '&ensp;': ' ', '&emsp;': '  ',
  };
  return text.replace(/&[a-zA-Z0-9#]+;/g, match => entities[match] || match);
}

/** 把相对路径补全为绝对路径 */
function resolveUrl(base, target) {
  try {
    return new URL(target, base).href;
  } catch {
    return target;
  }
}

/** 提取标题 */
function extractTitle(html, baseUrl) {
  // 优先：辽科大详情页 h1
  const h1Match = html.match(/<div[^>]*class=["'][^"']*newslefttit[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return stripTags(h1Match[1]).trim();

  // 其次：通用 title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) return titleMatch[1].replace(/\s+/g, ' ').trim();

  return '';
}

/** 去除所有 HTML 标签 */
function stripTags(html) {
  return html.replace(/<[^>]+>/g, '');
}

/** 把正文 HTML 转为纯文本（保留段落） */
function htmlToText(html, baseUrl) {
  if (!html) return '';

  // 1. 去掉 script/style/noscript/iframe/svg
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');

  // 2. 把图片转成 [图片: 描述/链接] 占位文本
  text = text.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, (match, src) => {
    const absSrc = resolveUrl(baseUrl, src);
    return `\n[图片: ${absSrc}]\n`;
  });

  // 3. 把常见块级标签替换为换行
  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<td[^>]*>/gi, ' ')
    .replace(/<th[^>]*>/gi, ' ');

  // 4. 去掉剩余标签
  text = stripTags(text);

  // 5. 解码实体并清理空白
  text = decodeHtmlEntities(text)
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(line => line.length > 0)
    .join('\n');

  return text;
}

/** 提取正文 HTML（优先辽科大 vsb_content，否则 fallback body） */
function extractContentHtml(html, baseUrl) {
  // 辽科大新闻网正文容器
  const vsbMatch = html.match(/<div[^>]*id=["']vsb_content["'][^>]*>([\s\S]*?)<\/div>\s*<p[^>]*style=["']text-align:\s*left/i)
    || html.match(/<div[^>]*id=["']vsb_content["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/i);

  if (vsbMatch) {
    // 去掉末尾的编辑信息
    let content = vsbMatch[1];
    // 尝试匹配到下一个 div 结束（处理嵌套）
    const nestedMatch = html.match(/<div[^>]*id=["']vsb_content["'][^>]*>([\s\S]+?)<\/div>\s*(?=<p[^>]*style=["']text-align:\s*left|<\/div>)/i);
    if (nestedMatch) content = nestedMatch[1];
    return content;
  }

  // fallback：提取 body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

/** 请求 URL 返回 HTML */
function fetchHtml(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(targetUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, targetUrl).href;
        fetchHtml(redirectUrl).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          // 该校新闻网为 UTF-8
          resolve(buffer.toString('utf8'));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('request timeout'));
    });
    req.end();
  });
}

exports.main = async (event) => {
  try {
    const url = event.url;
    if (!url || !url.startsWith('http')) {
      return { code: -1, msg: '缺少有效的 url 参数' };
    }

    // 示例地址直接返回提示
    if (url.includes('example.com')) {
      return { code: 0, data: { title: '示例新闻', content: '这是示例新闻的正文内容，真实新闻将抓取官网原文。', url } };
    }

    const html = await fetchHtml(url);
    const title = extractTitle(html, url);
    const contentHtml = extractContentHtml(html, url);
    const content = htmlToText(contentHtml, url);

    return {
      code: 0,
      data: {
        title,
        content,
        url,
        fetchAt: Date.now(),
      },
    };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
