import mysql from 'mysql2/promise';

const photoUrls = {
  'Central Premium Tower': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-central-premium-cWwAwMUWzSBHRemh3xuwkq.webp',
  'Causeway Bay Business Hub': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-causeway-bay-KQ6Fqeu4ZnzfbkdAwET46B.webp',
  'Admiralty Executive Suites': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-admiralty-CgyTkP7NhzrEtcAx6HvjJh.webp',
  'Mong Kok Tech Space': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-mongkok-2xUagTu6ymSmys3tG2BZT9.webp',
  'Tsim Sha Tsui Premium Office': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663420495849/BfsnfJd79pxjiN3WP72MmA/office-tsim-sha-tsui-irBHFKMqrVS5M7a6nQwdXH.webp',
};

async function updateOfficePhotos() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: 'Amazon RDS',
  });

  try {
    for (const [officeName, photoUrl] of Object.entries(photoUrls)) {
      const [result] = await connection.execute(
        'UPDATE offices SET thumbnailUrl = ? WHERE name = ?',
        [photoUrl, officeName]
      );
      console.log(`Updated ${officeName}: ${result.affectedRows} rows`);
    }
    console.log('All office photos updated successfully!');
  } catch (error) {
    console.error('Error updating photos:', error);
  } finally {
    await connection.end();
  }
}

updateOfficePhotos();
