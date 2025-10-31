/**
 * Initialize Firebase Collections with Sample Data
 * Run this script once to populate your Firebase collections
 * 
 * INSTRUCTIONS:
 * 1. Open browser console (F12) on any admin page
 * 2. Copy and paste this entire script
 * 3. Run: initializeFirebaseData()
 * 4. Wait for confirmation messages
 */

async function initializeFirebaseData() {
    const db = firebase.firestore();
    
    console.log('🚀 Starting Firebase data initialization...');
    
    try {
        // ==================== PRODUCTS ====================
        console.log('📦 Adding products...');
        const products = [
            {
                name: 'Organic Milk',
                barcode: '8901234567890',
                category: 'dairy',
                brand: 'Fresh Farms',
                description: 'Fresh organic whole milk',
                ingredients: ['Milk', 'Vitamin D'],
                allergens: ['lactose'],
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Whole Wheat Bread',
                barcode: '8901234567891',
                category: 'bakery',
                brand: 'Baker\'s Best',
                description: 'Freshly baked whole wheat bread',
                ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar'],
                allergens: ['gluten'],
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Peanut Butter',
                barcode: '8901234567892',
                category: 'snacks',
                brand: 'Nutty Delight',
                description: 'Creamy peanut butter',
                ingredients: ['Roasted Peanuts', 'Sugar', 'Palm Oil', 'Salt'],
                allergens: ['peanuts'],
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Greek Yogurt',
                barcode: '8901234567893',
                category: 'dairy',
                brand: 'Protein Plus',
                description: 'High protein Greek yogurt',
                ingredients: ['Milk', 'Live Cultures', 'Sugar'],
                allergens: ['lactose'],
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Chocolate Chip Cookies',
                barcode: '8901234567894',
                category: 'snacks',
                brand: 'Sweet Treats',
                description: 'Classic chocolate chip cookies',
                ingredients: ['Wheat Flour', 'Chocolate Chips', 'Sugar', 'Butter', 'Eggs'],
                allergens: ['gluten', 'lactose', 'eggs'],
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        ];

        for (const product of products) {
            await db.collection('products').add(product);
        }
        console.log('✅ Products added successfully!');

        // ==================== INGREDIENTS ====================
        console.log('🧪 Adding ingredients...');
        const ingredients = [
            {
                name: 'Vitamin D',
                category: 'additive',
                allergens: [],
                riskLevel: 'safe',
                description: 'Essential vitamin added to dairy products',
                productsUsing: 0,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Wheat Flour',
                category: 'natural',
                allergens: ['gluten'],
                riskLevel: 'low',
                description: 'Common grain ingredient',
                productsUsing: 0,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Roasted Peanuts',
                category: 'natural',
                allergens: ['peanuts'],
                riskLevel: 'high',
                description: 'Tree nut ingredient - major allergen',
                productsUsing: 0,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Milk',
                category: 'natural',
                allergens: ['lactose'],
                riskLevel: 'medium',
                description: 'Dairy product - common allergen',
                productsUsing: 0,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Soy Lecithin',
                category: 'additive',
                allergens: ['soy'],
                riskLevel: 'low',
                description: 'Emulsifier derived from soybeans',
                productsUsing: 0,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Eggs',
                category: 'natural',
                allergens: ['eggs'],
                riskLevel: 'medium',
                description: 'Common baking ingredient - allergen',
                productsUsing: 0,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        ];

        for (const ingredient of ingredients) {
            await db.collection('ingredients').add(ingredient);
        }
        console.log('✅ Ingredients added successfully!');

        // ==================== ALLERGENS ====================
        console.log('⚠️ Adding allergens...');
        const allergens = [
            {
                name: 'Peanuts',
                icon: 'fa-peanut',
                color: '#F59E0B',
                products: 0,
                users: 0,
                severity: 'high',
                description: 'Tree nut allergen - can cause severe reactions',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Lactose',
                icon: 'fa-cheese',
                color: '#3B82F6',
                products: 0,
                users: 0,
                severity: 'medium',
                description: 'Milk sugar - causes digestive issues',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Gluten',
                icon: 'fa-bread-slice',
                color: '#EF4444',
                products: 0,
                users: 0,
                severity: 'high',
                description: 'Wheat protein - celiac disease trigger',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Soy',
                icon: 'fa-seedling',
                color: '#10B981',
                products: 0,
                users: 0,
                severity: 'low',
                description: 'Soybean allergen - common in processed foods',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Shellfish',
                icon: 'fa-fish',
                color: '#8B5CF6',
                products: 0,
                users: 0,
                severity: 'high',
                description: 'Seafood allergen - can be severe',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Eggs',
                icon: 'fa-egg',
                color: '#F97316',
                products: 0,
                users: 0,
                severity: 'medium',
                description: 'Common allergen in baked goods',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Tree Nuts',
                icon: 'fa-acorn',
                color: '#EAB308',
                products: 0,
                users: 0,
                severity: 'high',
                description: 'Includes almonds, cashews, walnuts',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                name: 'Fish',
                icon: 'fa-fish-fins',
                color: '#06B6D4',
                products: 0,
                users: 0,
                severity: 'medium',
                description: 'Fish protein allergen',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        ];

        for (const allergen of allergens) {
            await db.collection('allergens').add(allergen);
        }
        console.log('✅ Allergens added successfully!');

        // ==================== USERS ====================
        console.log('👥 Adding sample users...');
        const users = [
            {
                name: 'John Doe',
                email: 'john.doe@email.com',
                role: 'user',
                allergenTracking: ['peanuts', 'lactose'],
                joinedDate: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@email.com',
                role: 'admin',
                allergenTracking: ['gluten'],
                joinedDate: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            },
            {
                name: 'Mike Johnson',
                email: 'mike.j@email.com',
                role: 'user',
                allergenTracking: [],
                joinedDate: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            }
        ];

        for (const user of users) {
            await db.collection('users').add(user);
        }
        console.log('✅ Users added successfully!');

        // ==================== SURVEY ====================
        console.log('📊 Adding sample survey...');
        const surveys = [
            {
                title: 'Customer Satisfaction Survey',
                type: 'customer',
                status: 'active',
                responses: 0,
                createdDate: firebase.firestore.FieldValue.serverTimestamp(),
                endsOn: new Date('2024-12-31')
            }
        ];

        for (const survey of surveys) {
            await db.collection('survey').add(survey);
        }
        console.log('✅ Surveys added successfully!');

        // ==================== ANALYTICS ====================
        console.log('📈 Adding sample analytics data...');
        const analyticsData = [
            {
                type: 'allergen_alert',
                user: 'John Doe',
                product: 'Organic Milk',
                allergen: 'Lactose',
                severity: 'medium',
                status: 'resolved',
                dateTime: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                type: 'allergen_alert',
                user: 'Jane Smith',
                product: 'Whole Wheat Bread',
                allergen: 'Gluten',
                severity: 'high',
                status: 'active',
                dateTime: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                type: 'product_scan',
                product: 'Organic Milk',
                user: 'John Doe',
                dateTime: firebase.firestore.FieldValue.serverTimestamp()
            }
        ];

        for (const data of analyticsData) {
            await db.collection('analytics').add(data);
        }
        console.log('✅ Analytics data added successfully!');

        console.log('');
        console.log('🎉 ============================================');
        console.log('🎉 FIREBASE INITIALIZATION COMPLETE!');
        console.log('🎉 ============================================');
        console.log('');
        console.log('📊 Summary:');
        console.log(`   • Products: ${products.length} added`);
        console.log(`   • Ingredients: ${ingredients.length} added`);
        console.log(`   • Allergens: ${allergens.length} added`);
        console.log(`   • Users: ${users.length} added`);
        console.log(`   • Surveys: ${surveys.length} added`);
        console.log(`   • Analytics: ${analyticsData.length} added`);
        console.log('');
        console.log('✅ Refresh the page to see your data!');

    } catch (error) {
        console.error('❌ Error initializing data:', error);
        console.error('Please check your Firebase permissions and try again.');
    }
}

// Instructions
console.log('');
console.log('📝 To initialize Firebase with sample data, run:');
console.log('   initializeFirebaseData()');
console.log('');
