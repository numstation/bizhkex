import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  // Create categories
  const categories = [
    { name: 'Office Selection Guide', slug: 'office-selection-guide', description: 'Learn how to choose the perfect office space for your business' },
    { name: 'Lease & Negotiation', slug: 'lease-negotiation', description: 'Tips and strategies for negotiating favorable lease terms' },
    { name: 'Location Guides', slug: 'location-guides', description: 'Comprehensive guides to Hong Kong\'s top business districts' },
    { name: 'Business Tips', slug: 'business-tips', description: 'General business advice and workplace insights' },
  ];

  console.log('Creating article categories...');
  for (const category of categories) {
    await connection.execute(
      'INSERT INTO articleCategories (name, slug, description, displayOrder) VALUES (?, ?, ?, ?)',
      [category.name, category.slug, category.description, categories.indexOf(category)]
    );
  }

  // Get category IDs
  const [categoryRows] = await connection.execute('SELECT id, slug FROM articleCategories');
  const categoryMap = {};
  categoryRows.forEach(row => {
    categoryMap[row.slug] = row.id;
  });

  // Create articles
  const articles = [
    {
      categorySlug: 'office-selection-guide',
      title: 'Complete Guide to Choosing Your First Office Space',
      slug: 'choosing-first-office-space',
      excerpt: 'Discover the key factors to consider when selecting your first office space in Hong Kong, from location to amenities.',
      content: `# Choosing Your First Office Space

Finding the right office space is crucial for your business success. Here are the key factors to consider:

## Location Matters
The location of your office can significantly impact your business. Consider proximity to clients, employees, and transportation hubs.

## Budget Considerations
Determine your budget before searching. Factor in not just rent, but also utilities, maintenance, and parking.

## Amenities & Facilities
Look for offices that offer the amenities your business needs, such as meeting rooms, parking, and high-speed internet.

## Flexibility
Consider whether you need a flexible lease that allows you to scale up or down as your business grows.

## Visit in Person
Always visit potential offices in person to get a feel for the space and neighborhood.`,
      featured: true,
    },
    {
      categorySlug: 'lease-negotiation',
      title: '10 Proven Strategies for Negotiating Better Lease Terms',
      slug: 'lease-negotiation-strategies',
      excerpt: 'Master the art of lease negotiation with these 10 proven strategies that can save your business thousands.',
      content: `# Lease Negotiation Strategies

Negotiating lease terms can save your business significant money. Here are 10 strategies to consider:

## 1. Know the Market
Research comparable properties to understand fair market rates in the area.

## 2. Negotiate Early
Start negotiations early in the process before you\'ve fallen in love with a space.

## 3. Ask for Concessions
Request rent abatement, free parking, or other concessions instead of just negotiating price.

## 4. Lease Term Length
Consider negotiating shorter initial terms to maintain flexibility.

## 5. Renewal Options
Secure renewal options at predetermined rates to protect against future increases.

## 6. Maintenance Responsibilities
Clarify who is responsible for maintenance and repairs.

## 7. Subletting Rights
Ensure you have the right to sublet if your business needs change.

## 8. Expansion Options
Negotiate the right to expand into adjacent spaces if available.

## 9. Break Clauses
Include break clauses that allow you to exit early if circumstances change.

## 10. Professional Help
Consider hiring a commercial real estate broker to negotiate on your behalf.`,
      featured: true,
    },
    {
      categorySlug: 'location-guides',
      title: 'Central District: Hong Kong\'s Premier Business Hub',
      slug: 'central-district-guide',
      excerpt: 'Explore why Central is the top choice for premium office space in Hong Kong.',
      content: `# Central District Business Guide

Central is Hong Kong\'s most prestigious business district, home to major financial institutions and multinational corporations.

## Why Choose Central?

### Prestige & Image
A Central address carries significant prestige and can enhance your business image.

### Connectivity
Central is well-connected by MTR, tram, and ferry services, making it easy for employees and clients to access.

### Amenities
The area offers world-class restaurants, shopping, and entertainment options.

### Business Ecosystem
Being in Central puts you at the heart of Hong Kong\'s business community.

## Cost Considerations
Central commands premium prices, with office rents among the highest in Hong Kong. Budget accordingly and consider whether the prestige justifies the cost for your business.

## Alternative Areas
If Central is too expensive, consider nearby areas like Admiralty or Sheung Wan for similar connectivity at lower costs.`,
      featured: false,
    },
    {
      categorySlug: 'location-guides',
      title: 'Kowloon East: The Rising Business District',
      slug: 'kowloon-east-guide',
      excerpt: 'Discover why Kowloon East is becoming the preferred choice for modern businesses.',
      content: `# Kowloon East Business Guide

Kowloon East has emerged as a vibrant alternative to traditional Central, offering modern facilities at competitive prices.

## Why Kowloon East?

### Modern Infrastructure
Kowloon East features state-of-the-art office buildings with modern amenities.

### Competitive Pricing
Rents are significantly lower than Central while still offering premium facilities.

### Tech Hub
The area is becoming a hub for tech startups and innovative companies.

### Transportation
Excellent MTR connectivity via Kwun Tong Line and Tseung Kwan O Line.

## Popular Neighborhoods
- Taikoo Place: Premium office buildings
- Kowloon Bay: Emerging tech hub
- Quarry Bay: Industrial lofts and creative spaces

## Growing Community
The area has a vibrant community of businesses, making it ideal for networking and collaboration.`,
      featured: false,
    },
    {
      categorySlug: 'business-tips',
      title: 'Creating a Productive Workspace: Design Tips for Modern Offices',
      slug: 'productive-workspace-design',
      excerpt: 'Learn how to design an office space that maximizes productivity and employee satisfaction.',
      content: `# Designing a Productive Workspace

The design of your office space can significantly impact productivity and employee satisfaction.

## Natural Light
Maximize natural light in your office. Studies show that natural light improves mood and productivity.

## Flexible Spaces
Create flexible spaces that can be adapted for different types of work - focused work, collaboration, and relaxation.

## Ergonomic Furniture
Invest in ergonomic furniture to reduce strain and improve comfort for your employees.

## Collaboration Areas
Designate areas for collaboration and informal meetings to encourage teamwork.

## Quiet Zones
Create quiet zones for focused work and concentration.

## Break Areas
Provide comfortable break areas where employees can relax and recharge.

## Technology
Ensure your office has reliable high-speed internet and modern technology infrastructure.

## Aesthetics
Pay attention to colors, artwork, and plants to create an inspiring environment.`,
      featured: false,
    },
  ];

  console.log('Creating articles...');
  for (const article of articles) {
    const categoryId = categoryMap[article.categorySlug];
    const publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await connection.execute(
      'INSERT INTO articles (title, slug, categoryId, content, excerpt, author, featured, publishedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        article.title,
        article.slug,
        categoryId,
        article.content,
        article.excerpt,
        'BizHKEx Team',
        article.featured ? 1 : 0,
        publishedAt,
      ]
    );
  }

  console.log('✓ Knowledge hub sample data created successfully!');
  console.log(`✓ Created ${categories.length} categories`);
  console.log(`✓ Created ${articles.length} articles`);

} catch (error) {
  console.error('Error seeding knowledge hub data:', error);
  process.exit(1);
} finally {
  await connection.end();
}
