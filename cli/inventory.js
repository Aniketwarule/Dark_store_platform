const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Inventory Data Structure (Updated with Sections & Levels)
let inventory = {
    1: { sectionid: 1, level: 1, product_name: "Aashirvaad Atta", category: "Grocery", brand: "Aashirvaad", quantity: 5, price: 200, expiry: "2025-12-31" },
    2: { sectionid: 1, level: 2, product_name: "Amul Ice Cream", category: "Frozen", brand: "Amul", quantity: 13, price: 150, expiry: "2024-08-15" },
    3: { sectionid: 1, level: 3, product_name: "Tata Salt", category: "Grocery", brand: "Tata", quantity: 20, price: 50, expiry: "2026-06-10" },

    4: { sectionid: 2, level: 1, product_name: "Pepsi", category: "Beverages", brand: "Pepsi", quantity: 30, price: 40, expiry: "2024-05-01" },
    5: { sectionid: 2, level: 2, product_name: "Britannia Cake", category: "Snacks", brand: "Britannia", quantity: 10, price: 120, expiry: "2024-09-30" },
    6: { sectionid: 2, level: 3, product_name: "Nestle Milk", category: "Dairy", brand: "Nestle", quantity: 8, price: 80, expiry: "2024-07-20" },

    7: { sectionid: 3, level: 1, product_name: "Colgate Toothpaste", category: "Personal Care", brand: "Colgate", quantity: 15, price: 90, expiry: "2026-03-15" },
    8: { sectionid: 3, level: 2, product_name: "Nivea Cream", category: "Personal Care", brand: "Nivea", quantity: 6, price: 250, expiry: "2025-10-05" },
    9: { sectionid: 3, level: 3, product_name: "Dettol Soap", category: "Personal Care", brand: "Dettol", quantity: 12, price: 30, expiry: "2026-01-01" }
};

// Store order history for optimization analysis
let orderHistory = [];
let orders = {};
let staff_assignments = {
    1: { name: "Aniket", section: 1, tasks: [] },
    2: { name: "Aditya", section: 2, tasks: [] },
    3: { name: "Jayesh", section: 3, tasks: [] }
};

// Functions
function placeOrder(orderId, items) {
    // Check if items are valid and in stock
    let valid = true;
    for (let pid in items) {
        if (!inventory[pid]) {
            console.log(`❌ Product ID ${pid} not found in inventory!`);
            valid = false;
            continue;
        }
        if (inventory[pid].quantity < items[pid]) {
            console.log(`❌ Insufficient stock for ${inventory[pid].product_name}. Available: ${inventory[pid].quantity}, Requested: ${items[pid]}`);
            valid = false;
        }
    }

    if (!valid) {
        console.log("⚠️ Order could not be placed due to errors.");
        return;
    }

    // Update inventory quantities
    for (let pid in items) {
        inventory[pid].quantity -= items[pid];
    }

    orders[orderId] = { items, timestamp: Date.now() };

    // Add to order history for optimization
    orderHistory.push({ orderId, items, timestamp: Date.now() });

    console.log(`\n🛒 Order ${orderId} placed successfully!`);
    autoAssignStaff(orderId, items);
}

function autoAssignStaff(orderId, items) {
    // Create an object to track items per section
    let sectionItems = {};

    // Count items by section
    for (let pid in items) {
        if (inventory[pid]) {
            const sectionId = inventory[pid].sectionid;
            if (!sectionItems[sectionId]) {
                sectionItems[sectionId] = {};
            }
            sectionItems[sectionId][pid] = items[pid];
        }
    }

    // Try to assign items from each section to corresponding staff
    let allAssigned = true;

    for (let sectionId in sectionItems) {
        let sectionAssigned = false;

        // Find a staff assigned to this section
        for (let staffId in staff_assignments) {
            if (staff_assignments[staffId].section == sectionId && staff_assignments[staffId].tasks.length < 3) {
                staff_assignments[staffId].tasks.push({
                    oid: orderId,
                    items: sectionItems[sectionId],
                    sectionId: parseInt(sectionId)
                });
                console.log(`👨‍🔧 Items from Section ${sectionId} assigned to ${staff_assignments[staffId].name}`);
                sectionAssigned = true;
                break;
            }
        }

        if (!sectionAssigned) {
            console.log(`⚠️ No available staff for items in Section ${sectionId}!`);
            allAssigned = false;
        }
    }

    if (allAssigned) {
        console.log(`✅ All items from Order ${orderId} have been assigned to staff.`);
    } else {
        console.log(`⚠️ Some items from Order ${orderId} could not be assigned due to staff unavailability.`);
    }
}

function deleteOrder(orderId) {
    if (orders[orderId]) {
        // Return items to inventory
        const items = orders[orderId].items;
        for (let pid in items) {
            if (inventory[pid]) {
                inventory[pid].quantity += items[pid];
                console.log(`📦 Returned ${items[pid]} units of ${inventory[pid].product_name} to inventory`);
            }
        }

        delete orders[orderId];
        console.log(`✅ Order ${orderId} deleted successfully!`);

        // Remove from staff assignments
        for (let staffId in staff_assignments) {
            staff_assignments[staffId].tasks = staff_assignments[staffId].tasks.filter(task => task.oid !== orderId);
        }
    } else {
        console.log("❌ Order not found!");
    }
}

function viewInventory() {
    console.log("\n📦 Current Inventory:");
    console.table(inventory);
}

function updateInventory(id, quantity) {
    if (inventory[id]) {
        // Check if removing more than available
        if (quantity < 0 && Math.abs(quantity) > inventory[id].quantity) {
            console.log(`❌ Cannot remove ${Math.abs(quantity)} units. Only ${inventory[id].quantity} units available.`);
            return;
        }

        inventory[id].quantity += quantity;
        console.log(`✅ Inventory updated! New quantity of ${inventory[id].product_name}: ${inventory[id].quantity}`);
    } else {
        console.log("❌ Product not found!");
    }
}

function viewOrders() {
    console.log("\n🛍️ Current Orders:");
    if (Object.keys(orders).length === 0) {
        console.log("No orders found.");
        return;
    }

    for (let orderId in orders) {
        console.log(`\nOrder ID: ${orderId}`);
        console.log("Items:");
        for (let pid in orders[orderId].items) {
            console.log(`- ${inventory[pid]?.product_name || "Unknown Product"} (Qty: ${orders[orderId].items[pid]})`);
        }
    }
}

function viewStaffAssignments() {
    console.log("\n👨‍🔧 Staff Assignments:");
    for (let staffId in staff_assignments) {
        console.log(`Staff: ${staff_assignments[staffId].name} (Section ${staff_assignments[staffId].section})`);
        if (staff_assignments[staffId].tasks.length === 0) {
            console.log("  No tasks assigned");
            continue;
        }

        staff_assignments[staffId].tasks.forEach(task => {
            console.log(`- Order: ${task.oid}, Items from Section ${task.sectionId || 'Unknown'}: `);
            for (let pid in task.items) {
                console.log(`  • ${inventory[pid]?.product_name || "Unknown Product"} (Qty: ${task.items[pid]})`);
            }
        });
    }
}

function optimizeInventory() {
    console.log("\n🔄 Optimizing inventory based on purchase frequency...");

    // Check if we have any order data
    if (orderHistory.length === 0 && Object.keys(orders).length === 0) {
        console.log("⚠️ No order data available for optimization. Place some orders first.");
        return;
    }

    // Calculate purchase frequency from order history and current orders
    let purchaseFrequency = {};

    // Initialize frequency counter for all products
    for (let pid in inventory) {
        purchaseFrequency[pid] = 0;
    }

    // Count frequency from order history
    orderHistory.forEach(order => {
        for (let pid in order.items) {
            if (purchaseFrequency[pid] !== undefined) {
                purchaseFrequency[pid] += order.items[pid];
            }
        }
    });

    // Also count from current orders
    for (let orderId in orders) {
        for (let pid in orders[orderId].items) {
            if (purchaseFrequency[pid] !== undefined) {
                purchaseFrequency[pid] += orders[orderId].items[pid];
            }
        }
    }

    // Check if any purchases were recorded
    let totalPurchases = 0;
    for (let pid in purchaseFrequency) {
        totalPurchases += purchaseFrequency[pid];
    }

    if (totalPurchases === 0) {
        console.log("⚠️ No purchase data available for optimization. Place some orders first.");
        return;
    }

    // Organize products by section
    let sectionProducts = {
        1: [],
        2: [],
        3: []
    };

    for (let pid in inventory) {
        sectionProducts[inventory[pid].sectionid].push({
            pid: parseInt(pid),
            frequency: purchaseFrequency[pid]
        });
    }

    // Sort each section's products by frequency (descending)
    for (let sectionId in sectionProducts) {
        sectionProducts[sectionId].sort((a, b) => b.frequency - a.frequency);
    }

    // Assign levels based on frequency (1=high, 2=medium, 3=low)
    for (let sectionId in sectionProducts) {
        const products = sectionProducts[sectionId];
        const totalProducts = products.length;

        // Skip sections with no products
        if (totalProducts === 0) continue;

        // Define thresholds for level assignment
        const level1Threshold = Math.ceil(totalProducts / 3);
        const level2Threshold = Math.ceil(2 * totalProducts / 3);

        for (let i = 0; i < totalProducts; i++) {
            const product = products[i];
            const oldLevel = inventory[product.pid].level;
            let newLevel;

            if (i < level1Threshold) {
                newLevel = 1; // High frequency
            } else if (i < level2Threshold) {
                newLevel = 2; // Medium frequency
            } else {
                newLevel = 3; // Low frequency
            }

            // Update level if it changed
            if (oldLevel !== newLevel) {
                inventory[product.pid].level = newLevel;
                console.log(`${inventory[product.pid].product_name}: Level ${oldLevel} → Level ${newLevel} (Frequency: ${product.frequency})`);
            } else {
                console.log(`${inventory[product.pid].product_name}: Remains at Level ${newLevel} (Frequency: ${product.frequency})`);
            }
        }
    }

    console.log("\n✅ Inventory optimization complete!");

    // Display frequency report
    console.log("\n📊 Purchase Frequency Report:");
    console.log("---------------------------");

    for (let sectionId in sectionProducts) {
        console.log(`\nSection ${sectionId}:`);

        if (sectionProducts[sectionId].length === 0) {
            console.log("  No products in this section");
            continue;
        }

        sectionProducts[sectionId].forEach(product => {
            console.log(`${inventory[product.pid].product_name}: ${product.frequency} units (Level ${inventory[product.pid].level})`);
        });
    }
}

// CLI Menu
function showMenu() {
    console.log("\n=== Dark Store Management CLI ===");
    console.log("1. Place Order");
    console.log("2. View Orders");
    console.log("3. Delete Order");
    console.log("4. View Staff Assignments");
    console.log("5. View Inventory");
    console.log("6. Update Inventory");
    console.log("7. Optimize Inventory");
    console.log("8. Exit");
    rl.question("Choose an option: ", handleMenu);
}

function handleMenu(choice) {
    switch (choice) {
        case "1":
            rl.question("Enter Order ID and Items (format: orderId,pid1:qty1,pid2:qty2): ", input => {
                const parts = input.split(",").map(s => s.trim());
                const orderId = parseInt(parts[0]);

                if (isNaN(orderId)) {
                    console.log("❌ Invalid Order ID!");
                    showMenu();
                    return;
                }

                if (orders[orderId]) {
                    console.log("❌ Order ID already exists!");
                    showMenu();
                    return;
                }

                const items = {};
                let valid = true;

                for (let i = 1; i < parts.length; i++) {
                    const [pid, qty] = parts[i].split(":");
                    const pidNum = parseInt(pid);
                    const qtyNum = parseInt(qty);

                    if (isNaN(pidNum) || isNaN(qtyNum) || qtyNum <= 0) {
                        console.log(`❌ Invalid product format: ${parts[i]}`);
                        valid = false;
                        continue;
                    }

                    items[pidNum] = qtyNum;
                }

                if (!valid || Object.keys(items).length === 0) {
                    console.log("❌ No valid items to order!");
                    showMenu();
                    return;
                }

                placeOrder(orderId, items);
                showMenu();
            });
            break;
        case "2":
            viewOrders();
            showMenu();
            break;
        case "3":
            rl.question("Enter Order ID to delete: ", input => {
                deleteOrder(parseInt(input));
                showMenu();
            });
            break;
        case "4":
            viewStaffAssignments();
            showMenu();
            break;
        case "5":
            viewInventory();
            showMenu();
            break;
        case "6":
            rl.question("Enter Product ID and Quantity to Update (format: id,quantity): ", input => {
                const [id, quantity] = input.split(",").map(s => parseInt(s.trim()));

                if (isNaN(id) || isNaN(quantity)) {
                    console.log("❌ Invalid input format! Use: id,quantity");
                    showMenu();
                    return;
                }

                updateInventory(id, quantity);
                showMenu();
            });
            break;
        case "7":
            optimizeInventory();
            showMenu();
            break;
        case "8":
            console.log("👋 Exiting...");
            rl.close();
            break;
        default:
            console.log("❌ Invalid choice! Try again.");
            showMenu();
    }
}

showMenu();