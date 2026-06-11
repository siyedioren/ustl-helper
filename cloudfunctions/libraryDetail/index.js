const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const DETAIL_BASE = 'https://libw.ustl.edu.cn/sms/opac/book/detail.action';

function requestDetail(id) {
  return new Promise((resolve, reject) => {
    https.get(`${DETAIL_BASE}?${id}`, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseDetailHtml(html) {
  const nameMatch = html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';

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

  const storage = [];
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

  try {
    const html = await requestDetail(id);
    const result = parseDetailHtml(html);
    return {
      code: 0,
      data: {
        name: result.name,
        info: result.info,
        storage: result.storage,
      }
    };
  } catch (err) {
    return { code: -1, msg: String(err) };
  }
};
