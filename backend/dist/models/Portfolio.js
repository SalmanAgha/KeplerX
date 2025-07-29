"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const portfolioSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: true
    },
    client: String,
    description: String,
    challenge: String,
    solution: String,
    results: String,
    completionDate: Date,
    technologies: String,
    testimonial: {
        text: String,
        author: String,
        position: String
    },
    image: String,
    images: [String],
    bgColor: {
        type: String,
        default: '#045e63'
    },
    whatWeDelivered: {
        description: String,
        items: [{
                title: String,
                icon: String
            }]
    }
}, {
    timestamps: true
});
const Portfolio = mongoose_1.default.model('Portfolio', portfolioSchema);
exports.default = Portfolio;
