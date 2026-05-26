const cloud = require('wx-server-sdk');
const http = require('http');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

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

function parseDetailHtml(html) {
  // 提取书名（常见在 h1/h2 中）
  const nameMatch = html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // 提取书目基本信息表格（汇文通常在 td/th 表格中）
 const info = [];
  const trMatches = html.match(/<tr[^>]*>([\s\S]*?)<\/tr>/g) || [];
  trMatches.forEach(tr => {
    const tdMatches = tr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g);
    if (tdMatches && tdMatches.length >= 2) {
      const label = tdMatches[0].replace(/<[^>]+>/g, '').trim();
      const value = tdMatches[1].replace(/<[^>]+>/g, '').trim();
      if (label && value) info.push(`${label}: ${value}`);
    }
  });

  // 提取馆藏状态（通常在 class="storage" 或某个 table 中）
  const storage = [];
  // 先尝试提取所有 table 中的文本，找包含"馆藏"、"在架"、"借出"等关键词的段落
  const tableMatches = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi);
  if (tableMatches) {
    tableMatches.forEach(table => {
      const text = table.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length > 5) storage.push(text);
    });
  }

  return { name, info, storage };
}

exports.main = async (event) => {
  const { id } = event;
  if (!id) return { code: -1, msg: 'ID 不能为空' };

  const url = `http://libw.ustl.edu.cn:8080/sms/opac/book/detail.action?${id}`;

  try {
    const html = await requestHtml(url);
    const result = parseDetailHtml(html);
    return {
      code: 0,
      data: {
        name: result.name,
        info: result.info,
        storage: result.storage,
        rawHtml: html.substring(0, 5000),
      }
    };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
