"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/db");
const sampleData_1 = require("./config/sampleData");
// Run the seed function
(0, sampleData_1.seedDatabase)()
    .then(() => {
    console.log('Database seeded successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
});
