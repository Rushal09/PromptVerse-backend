import mongoose from "mongoose";
import Promt from "../models/promt.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Sample image URLs - category-specific relevant images
const categoryImages = {
  ChatGPT: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", // AI/ChatGPT
    "https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=800", // AI chat
    "https://images.unsplash.com/photo-1686191128892-c121e5c4e5f5?w=800", // AI technology
  ],
  Midjourney: [
    "https://images.unsplash.com/photo-1707343843344-011332037abb?w=800", // AI art
    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800", // Abstract art
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800", // Digital art
  ],
  Dalle: [
    "https://images.unsplash.com/photo-1696258686454-60082b2c33e2?w=800", // AI generated
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800", // Digital creation
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800", // AI art
  ],
  Claude: [
    "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=800", // AI assistant
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", // AI technology
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800", // Technology
  ],
  Writing: [
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800", // Writing/typewriter
    "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800", // Notebook
    "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800", // Writing desk
  ],
  Coding: [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800", // Code on screen
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", // Laptop coding
    "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800", // Programming
  ],
  Marketing: [
    "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800", // Marketing analytics
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", // Business chart
    "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800", // Marketing content
  ],
  Education: [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800", // Education/books
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800", // Learning
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800", // Study
  ],
  Business: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800", // Business meeting
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800", // Business person
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", // Business analytics
  ],
};

// Helper function to get image for category
const getImageForCategory = (category, index) => {
  const images = categoryImages[category] || categoryImages.ChatGPT;
  return images[index % images.length];
};

// Sample PDF links (educational content)
const samplePDFs = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "https://www.africau.edu/images/default/sample.pdf",
];

const promptsData = [
  {
    title: "Professional Email Writer",
    description:
      "Transform your ideas into polished, professional emails. Perfect for business communication, client outreach, and formal correspondence. This prompt helps you craft emails with the right tone, structure, and professionalism.",
    category: "Writing",
    tags: ["email", "business", "professional", "communication"],
    price: 0,
    isfree: true,
  },
  {
    title: "AI Art Generation - Cyberpunk City",
    description:
      "Create stunning cyberpunk cityscapes with neon lights, futuristic buildings, and atmospheric rain. Optimized for Midjourney and DALL-E. Includes detailed parameters for lighting, composition, and style.",
    category: "Midjourney",
    tags: ["art", "cyberpunk", "cityscape", "neon", "futuristic"],
    price: 4.99,
    isfree: false,
  },
  {
    title: "SEO Blog Post Generator",
    description:
      "Generate SEO-optimized blog posts that rank well on Google. Includes keyword research, meta descriptions, headers, and engaging content structure. Perfect for content marketers and bloggers.",
    category: "Marketing",
    tags: ["seo", "blog", "content", "marketing", "keywords"],
    price: 9.99,
    isfree: false,
  },
  {
    title: "Python Code Debugger",
    description:
      "Advanced debugging assistant for Python code. Identifies bugs, suggests fixes, explains errors, and provides optimized solutions. Supports all Python versions and popular frameworks like Django and Flask.",
    category: "Coding",
    tags: ["python", "debugging", "code", "programming"],
    price: 0,
    isfree: true,
  },
  {
    title: "Social Media Content Calendar",
    description:
      "Create a 30-day social media content calendar for any niche. Includes post ideas, hashtags, best posting times, and engagement strategies for Instagram, Twitter, and LinkedIn.",
    category: "Marketing",
    tags: ["social-media", "content", "calendar", "marketing", "strategy"],
    price: 7.99,
    isfree: false,
  },
  {
    title: "Fantasy Character Designer",
    description:
      "Design unique fantasy characters with detailed descriptions, backstories, abilities, and visual prompts for AI art generation. Perfect for writers, game developers, and D&D players.",
    category: "Dalle",
    tags: ["fantasy", "character", "design", "storytelling", "rpg"],
    price: 5.99,
    isfree: false,
  },
  {
    title: "Excel Formula Generator",
    description:
      "Convert plain English to complex Excel formulas. Supports VLOOKUP, INDEX-MATCH, pivot tables, and advanced functions. Includes explanations and examples for each formula.",
    category: "Business",
    tags: ["excel", "formulas", "spreadsheet", "data", "productivity"],
    price: 0,
    isfree: true,
  },
  {
    title: "Product Description Writer",
    description:
      "Create compelling product descriptions that convert browsers into buyers. Optimized for e-commerce platforms like Shopify, Amazon, and WooCommerce. Includes SEO optimization and persuasive copywriting.",
    category: "Marketing",
    tags: ["ecommerce", "product", "copywriting", "sales", "conversion"],
    price: 6.99,
    isfree: false,
  },
  {
    title: "AI Portrait Photography Style",
    description:
      "Generate professional portrait photographs with studio lighting, perfect composition, and artistic styles. Includes parameters for different moods, lighting setups, and post-processing effects.",
    category: "Midjourney",
    tags: ["portrait", "photography", "studio", "lighting", "professional"],
    price: 8.99,
    isfree: false,
  },
  {
    title: "Interactive Story Creator",
    description:
      "Build interactive, branching stories with multiple endings. Perfect for game developers, educators, and creative writers. Includes character development, plot structures, and decision trees.",
    category: "Writing",
    tags: ["story", "interactive", "narrative", "creative", "writing"],
    price: 0,
    isfree: true,
  },
  {
    title: "React Component Generator",
    description:
      "Generate production-ready React components with TypeScript, styled-components, and best practices. Includes props validation, documentation, and test cases.",
    category: "Coding",
    tags: ["react", "javascript", "component", "frontend", "typescript"],
    price: 12.99,
    isfree: false,
  },
  {
    title: "LinkedIn Post Creator",
    description:
      "Craft engaging LinkedIn posts that boost your professional brand. Includes hooks, storytelling frameworks, and CTA strategies to increase engagement and reach.",
    category: "Marketing",
    tags: [
      "linkedin",
      "social-media",
      "professional",
      "networking",
      "engagement",
    ],
    price: 4.99,
    isfree: false,
  },
  {
    title: "Abstract Art Generator",
    description:
      "Create stunning abstract art with geometric patterns, vibrant colors, and modern aesthetics. Optimized for wall art, digital backgrounds, and creative projects.",
    category: "Dalle",
    tags: ["abstract", "art", "geometric", "modern", "creative"],
    price: 5.99,
    isfree: false,
  },
  {
    title: "Meeting Minutes Template",
    description:
      "Professional meeting minutes template with action items, decisions, and follow-ups. Includes AI assistant to summarize discussions and extract key points from transcripts.",
    category: "Business",
    tags: ["meeting", "notes", "business", "productivity", "template"],
    price: 0,
    isfree: true,
  },
  {
    title: "YouTube Script Writer",
    description:
      "Write engaging YouTube scripts with hooks, storytelling, and audience retention techniques. Includes title suggestions, thumbnail ideas, and SEO optimization for maximum views.",
    category: "Writing",
    tags: ["youtube", "video", "script", "content", "storytelling"],
    price: 8.99,
    isfree: false,
  },
  {
    title: "SQL Query Optimizer",
    description:
      "Optimize slow SQL queries with expert suggestions. Analyzes query execution plans, suggests indexes, and provides refactored queries for better performance.",
    category: "Coding",
    tags: ["sql", "database", "optimization", "performance", "query"],
    price: 0,
    isfree: true,
  },
  {
    title: "Brand Identity Designer",
    description:
      "Create comprehensive brand identity guidelines including logo concepts, color palettes, typography, and visual style. Perfect for startups and rebranding projects.",
    category: "Business",
    tags: ["brand", "identity", "design", "logo", "marketing"],
    price: 15.99,
    isfree: false,
  },
  {
    title: "Lesson Plan Creator",
    description:
      "Design engaging lesson plans for any subject and grade level. Includes learning objectives, activities, assessments, and differentiation strategies for diverse learners.",
    category: "Education",
    tags: ["education", "teaching", "lesson", "curriculum", "students"],
    price: 6.99,
    isfree: false,
  },
  {
    title: "ChatGPT Prompt Engineer",
    description:
      "Master prompt engineering with proven frameworks and techniques. Learn to create effective prompts for any task, with examples and best practices for optimal AI responses.",
    category: "ChatGPT",
    tags: ["chatgpt", "prompts", "ai", "engineering", "optimization"],
    price: 0,
    isfree: true,
  },
  {
    title: "API Documentation Generator",
    description:
      "Create comprehensive API documentation with endpoints, parameters, examples, and error codes. Supports REST, GraphQL, and WebSocket APIs with OpenAPI/Swagger format.",
    category: "Coding",
    tags: ["api", "documentation", "rest", "swagger", "developer"],
    price: 9.99,
    isfree: false,
  },
  {
    title: "Instagram Reel Ideas Generator",
    description:
      "Generate 50+ viral Instagram Reel ideas for any niche. Includes trending audio suggestions, hook ideas, and engagement strategies to boost your reach.",
    category: "Marketing",
    tags: ["instagram", "reels", "viral", "content", "social-media"],
    price: 5.99,
    isfree: false,
  },
  {
    title: "Anime Character Art Style",
    description:
      "Create beautiful anime-style characters with detailed features, expressive eyes, and dynamic poses. Includes style parameters for different anime aesthetics from shoujo to seinen.",
    category: "Midjourney",
    tags: ["anime", "character", "manga", "art", "japanese"],
    price: 7.99,
    isfree: false,
  },
  {
    title: "Business Plan Writer",
    description:
      "Write comprehensive business plans for startups and investors. Includes market analysis, financial projections, competitive analysis, and executive summary templates.",
    category: "Business",
    tags: ["business", "startup", "plan", "strategy", "investors"],
    price: 0,
    isfree: true,
  },
  {
    title: "CSS Animation Generator",
    description:
      "Generate smooth, performant CSS animations with keyframes, transitions, and transforms. Includes popular animation libraries and custom timing functions.",
    category: "Coding",
    tags: ["css", "animation", "frontend", "web", "design"],
    price: 4.99,
    isfree: false,
  },
  {
    title: "Resume Optimizer for ATS",
    description:
      "Optimize your resume to pass Applicant Tracking Systems (ATS). Includes keyword optimization, formatting tips, and industry-specific examples for maximum job opportunities.",
    category: "Writing",
    tags: ["resume", "ats", "job", "career", "optimization"],
    price: 8.99,
    isfree: false,
  },
  {
    title: "3D Isometric Illustration",
    description:
      "Create stunning 3D isometric illustrations for websites, presentations, and marketing materials. Includes lighting, shadows, and modern color schemes.",
    category: "Dalle",
    tags: ["3d", "isometric", "illustration", "design", "modern"],
    price: 6.99,
    isfree: false,
  },
  {
    title: "Customer Support Response Templates",
    description:
      "Professional customer support response templates for common inquiries. Includes empathy statements, solutions, and follow-up strategies to ensure customer satisfaction.",
    category: "Business",
    tags: ["customer-support", "templates", "service", "communication"],
    price: 0,
    isfree: true,
  },
  {
    title: "Scientific Paper Summarizer",
    description:
      "Summarize complex scientific papers into digestible insights. Extracts key findings, methodology, and conclusions while maintaining academic accuracy.",
    category: "Education",
    tags: ["science", "research", "academic", "summary", "education"],
    price: 7.99,
    isfree: false,
  },
  {
    title: "Podcast Episode Outliner",
    description:
      "Create detailed podcast episode outlines with intro hooks, segment breakdowns, guest questions, and outro scripts. Perfect for podcast producers and hosts.",
    category: "Writing",
    tags: ["podcast", "audio", "outline", "content", "script"],
    price: 5.99,
    isfree: false,
  },
  {
    title: "Data Visualization with Python",
    description:
      "Generate Python code for stunning data visualizations using matplotlib, seaborn, and plotly. Includes chart types, customization options, and best practices.",
    category: "Coding",
    tags: ["python", "data", "visualization", "charts", "analytics"],
    price: 0,
    isfree: true,
  },
];

const seedPrompts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing prompts to avoid duplicates
    await Promt.deleteMany({});
    console.log("✅ Cleared existing prompts");

    // Get a user to assign as creator (use the first admin user or create a seed user)
    let seedUser = await User.findOne({ userType: "admin" });

    if (!seedUser) {
      console.log(
        "No admin user found. Please create an admin user first or modify this script."
      );
      process.exit(1);
    }

    console.log(`Using user: ${seedUser.username} (${seedUser._id})`);

    // Create prompts with category-specific images
    const prompts = promptsData.map((promptData, index) => {
      // Find how many prompts of this category we've already seen
      const categoryIndex = promptsData
        .slice(0, index)
        .filter((p) => p.category === promptData.category).length;

      return {
        ...promptData,
        image: getImageForCategory(promptData.category, categoryIndex),
        file: index % 3 === 0 ? samplePDFs[index % samplePDFs.length] : "", // Add PDF to every 3rd prompt
        createdBy: seedUser._id,
        createdByUsername: seedUser.username,
        createdByProfilePicture: seedUser.profilePicture,
        likes: [],
        comments: [],
        views: Math.floor(Math.random() * 1000) + 50, // Random views between 50-1050
      };
    });

    const createdPrompts = await Promt.insertMany(prompts);
    console.log(`✅ Successfully created ${createdPrompts.length} prompts!`);

    // Print summary
    console.log("\n📊 Summary:");
    console.log(`- Total prompts: ${createdPrompts.length}`);
    console.log(`- Free prompts: ${prompts.filter((p) => p.isfree).length}`);
    console.log(`- Paid prompts: ${prompts.filter((p) => !p.isfree).length}`);
    console.log(
      `- Categories: ${[...new Set(prompts.map((p) => p.category))].join(", ")}`
    );

    mongoose.connection.close();
    console.log("\n✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedPrompts();
