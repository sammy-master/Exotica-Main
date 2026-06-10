const https = require('https');

async function searchBB(query) {
  return new Promise((resolve) => {
    https.get(`https://www.bigbasket.com/product/get-products/?slug=${encodeURIComponent(query.replace(/ /g, '-'))}&type=ps`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(data.length > 100 ? 'worked' : 'failed');
      });
    });
  });
}

(async () => {
  console.log('BB:', await searchBB('ferrero rocher'));
})();
