const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

const Country = require('./models/Country');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const PaymentMethod = require('./models/PaymentMethod');

function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max, dec = 1) { return Math.round((Math.random() * (max - min) + min) * Math.pow(10, dec)) / Math.pow(10, dec); }

// Food image database by cuisine
const foodImages = {
  Indian: [
    'https://www.spiceroots.com/spiceroots/wp-content/uploads/2008/05/butterchicken-1024x682.jpg', // Butter Chicken
    'https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=800&h=600&fit=crop', // Biryani
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop', // Palak Paneer
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop', // Naan
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop', // Samosa
    'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=800&h=600&fit=crop', // Dosa
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop', // Chole Bhature
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop', // Pizza
  ],
  Italian: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop', // Pizza
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop', // Pasta
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop', // Pizza Margherita
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop', // Spaghetti
  ],
  Chinese: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop', // Noodles
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop', // Dumplings
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop', // Spring Rolls
  ],
  American: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop', // Burger
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop', // Fries
    'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=800&h=600&fit=crop', // Hot Dog
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop', // Burger Closeup
  ],
  Mexican: [
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop', // Tacos
    'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=600&fit=crop', // Burrito
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop', // Quesadilla
  ],
  Japanese: [
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop', // Sushi
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop', // Ramen
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop', // Sashimi
  ],
  Mediterranean: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop', // Hummus
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop', // Salad
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop', // Greek Salad
  ],
  Fusion: [
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop', // Fusion Dish
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop', // Modern Cuisine
  ]
};

// Food items database with specific images for popular dishes
const foodItemsDatabase = {
  'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
  'Biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=800&h=600&fit=crop',
  'Paneer Tikka': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
  'Vada Pav': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
  'Masala Dosa': 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?w=800&h=600&fit=crop',
  'Pepperoni Pizza': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&h=600&fit=crop',
  'Margherita Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
  'Cheeseburger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
  'French Fries': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&h=600&fit=crop',
  'Sushi Roll': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
  'Tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
  'Pasta Alfredo': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
  'Spring Rolls': 'https://d1mxd7n691o8sz.cloudfront.net/static/recipe/recipe/2023-12/Vegetable-Spring-Rolls-2-1-906001560ca545c8bc72baf473f230b4.jpg',
  'Fried Chicken': 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=800&h=600&fit=crop',
  'Chocolate Brownie': 'https://images.unsplash.com/photo-1579500965798-8d1592a5d6e2?w=800&h=600&fit=crop',
  'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop',
  'Mango Lassi': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop',
  'Caesar Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
  'Garlic Naan': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&h=600&fit=crop',
  'Samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
};

// Get image for food item
function getFoodImage(itemName, cuisine) {
  // Check if we have a specific image for this item
  if (foodItemsDatabase[itemName]) {
    return foodItemsDatabase[itemName];
  }
  
  // Otherwise, get a random image for the cuisine
  const cuisineImages = foodImages[cuisine] || foodImages['Indian'];
  return randChoice(cuisineImages);
}

async function seed() {
  await connectDB();
  console.log('Seeding database with food images...');

  // Clear existing data
  await Country.deleteMany({});
  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});
  await PaymentMethod.deleteMany({});

  // Countries
  const india = await Country.create({ code: 'IN', name: 'India' });
  const usa = await Country.create({ code: 'US', name: 'United States' });

  // Users
  const salt = await bcrypt.genSalt(10);
  const admin = await User.create({
    email: 'admin@foodapp.com',
    passwordHash: await bcrypt.hash('adminpass', salt),
    displayName: 'Admin',
    role: 'ADMIN',
    country: null
  });
  const managerIN = await User.create({
    email: 'manager@in.com',
    passwordHash: await bcrypt.hash('managerpass', salt),
    displayName: 'Manager-IN',
    role: 'MANAGER',
    country: india._id
  });
  const memberUS = await User.create({
    email: 'member@us.com',
    passwordHash: await bcrypt.hash('memberpass', salt),
    displayName: 'Member-US',
    role: 'MEMBER',
    country: usa._id
  });

  // Create some additional users for variety
  await User.create({
    email: 'chef@indian.com',
    passwordHash: await bcrypt.hash('chefpass', salt),
    displayName: 'Chef Arjun',
    role: 'MEMBER',
    country: india._id
  });

  await User.create({
    email: 'foodie@usa.com',
    passwordHash: await bcrypt.hash('foodiepass', salt),
    displayName: 'Foodie Sarah',
    role: 'MEMBER',
    country: usa._id
  });

  console.log('Users created');

  // Restaurant names with images
  const restaurantsData = [
    {
      name: "Bombay Bites",
      address: "123 Mumbai Street, Mumbai, India",
      country: india._id,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    },
    {
      name: "Delhi Durbar",
      address: "456 Delhi Road, Delhi, India",
      country: india._id,
      image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop',
    },
    {
      name: "NYC Pizza Co",
      address: "789 Broadway, New York, USA",
      country: usa._id,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    },
    {
      name: "Texas BBQ Hut",
      address: "101 Austin Street, Texas, USA",
      country: usa._id,
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop',
    },
    {
      name: "Chennai Chettinad",
      address: "202 Chennai Road, Chennai, India",
      country: india._id,
      image: 'https://images.unsplash.com/photo-1559749284-2c6c5dd67b22?w=800&h=600&fit=crop',
    },
    {
      name: "LA Burger Club",
      address: "303 Hollywood Blvd, Los Angeles, USA",
      country: usa._id,
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop',
    },
  ];

  const restaurants = [];
  for (const data of restaurantsData) {
    restaurants.push(await Restaurant.create(data));
  }

  console.log('Restaurants created with images');

  // Categories and Cuisines
  const categories = ['Main', 'Starter', 'Dessert', 'Drink', 'Street', 'Snack', 'Salad', 'Soup'];
  const cuisines = ['Indian', 'Italian', 'Chinese', 'American', 'Mexican', 'Japanese', 'Mediterranean', 'Fusion'];
  
  // Popular food items with descriptions
  const foodItems = [
    // Indian
    { name: 'Butter Chicken', cuisine: 'Indian', category: 'Main', priceRange: [120, 350] },
    { name: 'Biryani', cuisine: 'Indian', category: 'Main', priceRange: [150, 400] },
    { name: 'Paneer Tikka', cuisine: 'Indian', category: 'Starter', priceRange: [80, 250] },
    { name: 'Masala Dosa', cuisine: 'Indian', category: 'Main', priceRange: [70, 200] },
    { name: 'Palak Paneer', cuisine: 'Indian', category: 'Main', priceRange: [100, 280] },
    { name: 'Chole Bhature', cuisine: 'Indian', category: 'Main', priceRange: [90, 220] },
    { name: 'Samosa', cuisine: 'Indian', category: 'Snack', priceRange: [20, 80] },
    { name: 'Garlic Naan', cuisine: 'Indian', category: 'Main', priceRange: [30, 100] },
    { name: 'Mango Lassi', cuisine: 'Indian', category: 'Drink', priceRange: [40, 120] },
    { name: 'Gulab Jamun', cuisine: 'Indian', category: 'Dessert', priceRange: [50, 150] },
    
    // American
    { name: 'Cheeseburger', cuisine: 'American', category: 'Main', priceRange: [150, 400] },
    { name: 'French Fries', cuisine: 'American', category: 'Snack', priceRange: [60, 180] },
    { name: 'Pepperoni Pizza', cuisine: 'American', category: 'Main', priceRange: [200, 500] },
    { name: 'BBQ Ribs', cuisine: 'American', category: 'Main', priceRange: [250, 600] },
    { name: 'Caesar Salad', cuisine: 'American', category: 'Salad', priceRange: [100, 280] },
    { name: 'Chicken Wings', cuisine: 'American', category: 'Starter', priceRange: [120, 350] },
    { name: 'Mac & Cheese', cuisine: 'American', category: 'Main', priceRange: [100, 300] },
    { name: 'Apple Pie', cuisine: 'American', category: 'Dessert', priceRange: [80, 220] },
    { name: 'Milkshake', cuisine: 'American', category: 'Drink', priceRange: [70, 200] },
    { name: 'Hot Dog', cuisine: 'American', category: 'Street', priceRange: [60, 180] },
    
    // Italian
    { name: 'Margherita Pizza', cuisine: 'Italian', category: 'Main', priceRange: [180, 450] },
    { name: 'Pasta Carbonara', cuisine: 'Italian', category: 'Main', priceRange: [160, 400] },
    { name: 'Tiramisu', cuisine: 'Italian', category: 'Dessert', priceRange: [90, 250] },
    { name: 'Bruschetta', cuisine: 'Italian', category: 'Starter', priceRange: [70, 200] },
    
    // Chinese
    { name: 'Spring Rolls', cuisine: 'Chinese', category: 'Starter', priceRange: [60, 180] },
    { name: 'Fried Rice', cuisine: 'Chinese', category: 'Main', priceRange: [120, 320] },
    { name: 'Kung Pao Chicken', cuisine: 'Chinese', category: 'Main', priceRange: [140, 380] },
    
    // Japanese
    { name: 'Sushi Roll', cuisine: 'Japanese', category: 'Main', priceRange: [200, 500] },
    { name: 'Ramen', cuisine: 'Japanese', category: 'Main', priceRange: [180, 450] },
    { name: 'Tempura', cuisine: 'Japanese', category: 'Starter', priceRange: [120, 350] },
    
    // Mexican
    { name: 'Tacos', cuisine: 'Mexican', category: 'Main', priceRange: [100, 300] },
    { name: 'Burrito', cuisine: 'Mexican', category: 'Main', priceRange: [150, 400] },
    { name: 'Guacamole', cuisine: 'Mexican', category: 'Starter', priceRange: [80, 220] },
  ];

  // Create menu items for each restaurant
  let menuItemCount = 0;
  
  for (const restaurant of restaurants) {
    console.log(`Creating menu for ${restaurant.name}...`);
    
    // Determine cuisine focus based on restaurant name/location
    let restaurantCuisines = [];
    if (restaurant.name.includes('Bombay') || restaurant.name.includes('Delhi') || restaurant.name.includes('Chennai')) {
      restaurantCuisines = ['Indian'];
    } else if (restaurant.name.includes('Pizza') || restaurant.name.includes('LA')) {
      restaurantCuisines = ['American', 'Italian'];
    } else if (restaurant.name.includes('BBQ') || restaurant.name.includes('Texas')) {
      restaurantCuisines = ['American'];
    } else {
      restaurantCuisines = ['Indian', 'Chinese', 'Italian'];
    }
    
    // Create 8-12 menu items per restaurant
    const itemCount = randInt(8, 12);
    
    for (let i = 0; i < itemCount; i++) {
      const cuisine = randChoice(restaurantCuisines);
      const availableItems = foodItems.filter(item => item.cuisine === cuisine);
      
      if (availableItems.length === 0) continue;
      
      const foodItem = randChoice(availableItems);
      const [minPrice, maxPrice] = foodItem.priceRange;
      const priceCents = randInt(minPrice, maxPrice);
      
      const description = `${foodItem.name} - A delicious ${foodItem.cuisine.toLowerCase()} ${foodItem.category.toLowerCase()} made with fresh ingredients and authentic spices.`;
      
      // Get appropriate image for this food item
      const image = getFoodImage(foodItem.name, foodItem.cuisine);
      
      // Create the menu item
      await MenuItem.create({
        restaurant: restaurant._id,
        name: foodItem.name,
        description: description,
        priceCents: priceCents,
        image: image,
        rating: randFloat(3.5, 5.0, 1),
        isAvailable: Math.random() > 0.1, // 90% available
        category: foodItem.category,
        cuisine: foodItem.cuisine,
        tags: getTagsForCuisine(foodItem.cuisine),
      });
      
      menuItemCount++;
    }
  }
  
  function getTagsForCuisine(cuisine) {
    const tagMap = {
      'Indian': ['spicy', 'vegetarian', 'traditional', 'flavorful'],
      'American': ['cheesy', 'grilled', 'comfort-food', 'hearty'],
      'Italian': ['cheesy', 'creamy', 'authentic', 'fresh'],
      'Chinese': ['spicy', 'stir-fried', 'savory', 'umami'],
      'Japanese': ['fresh', 'healthy', 'light', 'authentic'],
      'Mexican': ['spicy', 'zesty', 'fresh', 'colorful'],
      'Mediterranean': ['healthy', 'fresh', 'light', 'herbs'],
      'Fusion': ['innovative', 'modern', 'creative', 'unique']
    };
    
    const tags = tagMap[cuisine] || ['delicious', 'popular'];
    // Return 2-3 random tags
    const count = randInt(2, 3);
    return tags.slice(0, count);
  }

  // Create some payment methods
  await PaymentMethod.create([
    {
      user: admin._id,
      type: 'CARD',
      provider: 'Visa',
      last4: '4242',
      isActive: true
    },
    {
      user: admin._id,
      type: 'UPI',
      provider: 'Google Pay',
      last4: '1234',
      isActive: true
    },
    {
      user: managerIN._id,
      type: 'CARD',
      provider: 'Mastercard',
      last4: '5555',
      isActive: true
    }
  ]);

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Statistics:`);
  console.log(`   - Users: 5`);
  console.log(`   - Restaurants: ${restaurants.length}`);
  console.log(`   - Menu Items: ${menuItemCount}`);
  console.log(`   - Payment Methods: 3`);
  console.log('');
  console.log('🔑 Test Accounts:');
  console.log('   Admin: admin@foodapp.com / adminpass');
  console.log('   Manager (India): manager@in.com / managerpass');
  console.log('   Member (USA): member@us.com / memberpass');
  console.log('');
  console.log('🍽️ All food items now have beautiful images!');

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});