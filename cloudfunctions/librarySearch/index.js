const cloud = require('wx-server-sdk');
const http = require('http');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

/** 请求图书馆 HTML */
function requestHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/** 解析汇文 OPAC 搜索结果 HTML */
function parseSearchHtml(html) {
  const books = [];

  // 策略1：常见汇文结构——<li> 包裹的结果项
  const liMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
  liMatches.forEach(item => {
    // 提取详情页 ID 参数（如 marcNo=xxx 或 bookId=xxx）
    const idMatch = item.match(/detail\.action\?([^"'\s]+)/);
    if (!idMatch) return;
    const id = idMatch[1];

    // 提取书名（通常在 <a> 标签内）
    const titleMatch = item.match(/<a[^>]*>([\s\S]*?)<\/a>/);
    let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // 提取辅助信息（<em>、<span class="info"> 等常见标签）
    const infoList = [];
    const emMatches = item.match(/<em>(.*?)<\/em>/g);
    if (emMatches) {
      emMatches.forEach(e => infoList.push(e.replace(/<\/?em>/g, '')));
    }
    // 如果 <em> 没命中，尝试 <span class="..."> 里的文本
    if (infoList.length === 0) {
      const spanMatches = item.match(/<span[^>]*>([\s\S]*?)<\/span>/g);
      if (spanMatches) {
        spanMatches.forEach(s => {
          const text = s.replace(/<[^>]+>/g, '').trim();
          if (text && text !== title) infoList.push(text);
        });
      }
    }

    // 提取 ISBN
    const isbnMatch = item.match(/isbn=["']([\d-]+)/i) || item.match(/ISBN[:\s]*([\d-]{10,})/i);
    const isbn = isbnMatch ? isbnMatch[1].replace(/-/g, '') : '';

    if (title) {
      books.push({ id, title, infoList, isbn, img: '' });
    }
  });

  // 策略2：如果 <li> 没命中，尝试 <tr> 包裹的表格行（某些汇文版本用 table）
  if (books.length === 0) {
    const trMatches = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
    trMatches.forEach(tr => {
      const idMatch = tr.match(/detail\.action\?([^"'\s]+)/);
      const titleMatch = tr.match(/<a[^>]*>([\s\S]*?)<\/a>/);
      if (idMatch && titleMatch) {
        const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        const tds = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [];
        const infoList = tds.map(td => td.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
        books.push({ id: idMatch[1], title, infoList, isbn: '', img: '' });
      }
    });
  }

  // 提取页码：匹配 "第 X 页 / 共 Y 页" 或 "page=X" 等
  const pageMatch = html.match(/第\s*(\d+)\s*页\s*\/\s*共\s*(\d+)\s*页/);
  const currentPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;
  const totalPage = pageMatch ? parseInt(pageMatch[2], 10) : 1;

  return { books, currentPage, totalPage };
}

exports.main = async (event) => {
  const { keyword, page = 1 } = event;
  if (!keyword) return { code: -1, msg: '关键词不能为空' };

  const url = `http://libw.ustl.edu.cn:8080/sms/opac/search/showSearch.action?searchType=simple&searchWay0=title&searchValue0=${encodeURIComponent(keyword)}&page=${page}`;

  try {
    const html = await requestHtml(url);
    const result = parseSearchHtml(html);

    // 如果解析为空，可能是 HTML 结构不匹配，把原始 HTML 也带回去方便前端/开发者调试
    return {
      code: 0,
      data: {
        list: result.books,
        page: result.currentPage,
        totalPage: result.totalPage,
        rawHtml: html.substring(0, 5000), // 截断防止体积过大
      }
    };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
