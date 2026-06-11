const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const SEARCH_BASE = 'https://libw.ustl.edu.cn/sms/opac/search/showSearch.action';

/** POST 请求图书馆搜索 */
function requestSearch(keyword, page) {
  return new Promise((resolve, reject) => {
    const postData = `searchType=simple&searchWay0=title&searchValue0=${encodeURIComponent(keyword)}&page=${page}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(SEARCH_BASE, options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/** 解析汇文 OPAC 搜索结果 HTML */
function parseSearchHtml(html) {
  const books = [];

  const liMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
  liMatches.forEach(item => {
    const idMatch = item.match(/detail\.action\?([^"'\s]+)/);
    if (!idMatch) return;
    const id = idMatch[1];

    const titleMatch = item.match(/<a[^>]*>([\s\S]*?)<\/a>/);
    let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const infoList = [];
    const emMatches = item.match(/<em>(.*?)<\/em>/g);
    if (emMatches) {
      emMatches.forEach(e => infoList.push(e.replace(/<\/?em>/g, '')));
    }
    if (infoList.length === 0) {
      const spanMatches = item.match(/<span[^>]*>([\s\S]*?)<\/span>/g);
      if (spanMatches) {
        spanMatches.forEach(s => {
          const text = s.replace(/<[^>]+>/g, '').trim();
          if (text && text !== title) infoList.push(text);
        });
      }
    }

    const isbnMatch = item.match(/isbn=["']([\d-]+)/i) || item.match(/ISBN[:\s]*([\d-]{10,})/i);
    const isbn = isbnMatch ? isbnMatch[1].replace(/-/g, '') : '';

    if (title) {
      books.push({ id, title, infoList, isbn, img: '' });
    }
  });

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

  const pageMatch = html.match(/第\s*(\d+)\s*页\s*\/\s*共\s*(\d+)\s*页/);
  const currentPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;
  const totalPage = pageMatch ? parseInt(pageMatch[2], 10) : 1;

  return { books, currentPage, totalPage };
}

exports.main = async (event) => {
  const { keyword, page = 1 } = event;
  if (!keyword) return { code: -1, msg: '关键词不能为空' };

  try {
    const html = await requestSearch(keyword, page);
    const result = parseSearchHtml(html);
    return {
      code: 0,
      data: {
        list: result.books,
        page: result.currentPage,
        totalPage: result.totalPage,
      }
    };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
