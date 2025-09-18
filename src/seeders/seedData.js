const { Organization, Brand, Course, User, ApiKey } = require("../models");
const bcrypt = require("bcrypt");

async function seedData() {
  try {
    console.log(" Seeding data will come as fast as I can...");

    const org1 = await Organization.create({
      name: "TechCorp",
      description:
        "TechCorp is a technology company that provides technology solutions to businesses.",
      isActive: true,
    });

    const org2 = await Organization.create({
      name: "EduSoft",
      description: "Educational software solutions",
      isActive: true,
    });

    const org3 = await Organization.create({
      name: "LearnHub",
      description: "Online learning platform",
      isActive: true,
    });

    const org4 = await Organization.create({
      name: "HealthCare",
      description: "Healthcare solutions",
      isActive: true,
    });

    const org5 = await Organization.create({
      name: "Finance",
      description: "Finance solutions",
      isActive: true,
    });
    console.log("Organizations created successfully✔️");

    const brand1 = await Brand.create({
      name: "TechCorp Education",
      description:
        "TechCorp Education is a technology company that provides technology solutions to businesses.",
      organizationId: org1.id,
      isActive: true,
    });

    const brand2 = await Brand.create({
      name: "TechCorp Professional",
      description: "Professional development courses",
      organizationId: org1.id,
      isActive: true,
    });

    // Create Brands for LearnHub
    const brand3 = await Brand.create({
      name: "LearnHub Kids",
      description: "Courses for children",
      organizationId: org3.id,
      isActive: true,
    });

    const brand4 = await Brand.create({
      name: "LearnHub Adults",
      description: "Adult learning courses",
      organizationId: org3.id,
      isActive: true,
    });

    const brand5 = await Brand.create({
      name: "HealthCare Solutions",
      description: "Healthcare solutions",
      organizationId: org4.id,
      isActive: true,
    });

    const brand6 = await Brand.create({
      name: "Finance Solutions",
      description: "Finance solutions",
      organizationId: org5.id,
      isActive: true,
    });
    console.log("Brands created successfully✔️");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "TechCorp Admin",
      email: "admin@techcorp.com",
      password: hashedPassword,
      role: "admin",
      organizationId: org1.id,
      isActive: true,
    });

    await User.create({
      name: "EduSoft Admin",
      email: "admin@edusoft.com",
      password: hashedPassword,
      role: "admin",
      organizationId: org2.id,
      isActive: true,
    });

    await User.create({
      name: "LearnHub Admin",
      email: "admin@learnhub.com",
      password: hashedPassword,
      role: "admin",
      organizationId: org3.id,
      isActive: true,
    });

    await User.create({
      name: "HealthCare Admin",
      email: "admin@healthcare.com",
      password: hashedPassword,
      role: "admin",
      organizationId: org4.id,
      isActive: true,
    });

    await User.create({
      name: "Finance Admin",
      email: "admin@finance.com",
      password: hashedPassword,
      role: "admin",
      organizationId: org5.id,
      isActive: true,
    });
    console.log("Users created successfully✔️");

    await ApiKey.create({
      key: "org_1_brand_1_abc123def456",
      name: "TechCorp Education API Key",
      organizationId: org1.id,
      brandId: brand1.id,
      isActive: true,
    });

    await ApiKey.create({
      key: "org_1_brand_2_xyz789uvw012",
      name: "TechCorp Professional API Key",
      organizationId: org1.id,
      brandId: brand2.id,
      isActive: true,
    });

    await ApiKey.create({
      key: "org_2_direct_ghi789jkl012",
      name: "EduSoft Direct API Key",
      organizationId: org2.id,
      brandId: null,
      isActive: true,
    });

    await ApiKey.create({
      key: "org_3_brand_3_def456ghi789",
      name: "LearnHub Kids API Key",
      organizationId: org3.id,
      brandId: brand3.id,
      isActive: true,
    });

    await ApiKey.create({
      key: "org_3_brand_4_mno123pqr456",
      name: "LearnHub Adults API Key",
      organizationId: org3.id,
      brandId: brand4.id,
      isActive: true,
    });

    await ApiKey.create({
      key: "org_4_brand_5_rst789tuv012",
      name: "HealthCare Solutions API Key",
      organizationId: org4.id,
      brandId: brand5.id,
      isActive: true,
    });

    await ApiKey.create({
      key: "org_5_brand_6_wxy123zab456",
      name: "Finance Solutions API Key",
      organizationId: org5.id,
      brandId: brand6.id,
      isActive: true,
    });
    console.log("ApiKeys created successfully✔️");

    // TechCorp Education courses
    await Course.create({
      title: "Python Basics",
      description: "Learn Python programming from scratch",
      content: "Introduction to Python syntax, variables, loops, and functions",
      organizationId: org1.id,
      brandId: brand1.id,
      isActive: true,
    });

    await Course.create({
      title: "Web Development Fundamentals",
      description: "HTML, CSS, and JavaScript basics",
      content: "Learn the fundamentals of web development",
      organizationId: org1.id,
      brandId: brand1.id,
      isActive: true,
    });

    // TechCorp Professional courses
    await Course.create({
      title: "Advanced Python",
      description: "Advanced Python concepts and frameworks",
      content: "Django, Flask, and advanced Python patterns",
      organizationId: org1.id,
      brandId: brand2.id,
      isActive: true,
    });

    await Course.create({
      title: "DevOps Fundamentals",
      description: "Introduction to DevOps practices",
      content: "Docker, CI/CD, and deployment strategies",
      organizationId: org1.id,
      brandId: brand2.id,
      isActive: true,
    });

    // EduSoft direct courses (no brand)
    await Course.create({
      title: "JavaScript Fundamentals",
      description: "Complete JavaScript course",
      content: "Variables, functions, objects, and modern ES6+ features",
      organizationId: org2.id,
      brandId: null,
      isActive: true,
    });

    await Course.create({
      title: "React Mastery",
      description: "Master React development",
      content: "Components, hooks, state management, and routing",
      organizationId: org2.id,
      brandId: null,
      isActive: true,
    });

    // LearnHub Kids courses
    await Course.create({
      title: "Math for Kids",
      description: "Fun math learning for children",
      content: "Basic arithmetic, shapes, and problem solving",
      organizationId: org3.id,
      brandId: brand3.id,
      isActive: true,
    });

    // LearnHub Adults courses
    await Course.create({
      title: "Business Analytics",
      description: "Data analysis for business professionals",
      content: "Excel, SQL, and data visualization techniques",
      organizationId: org3.id,
      brandId: brand4.id,
      isActive: true,
    });

    // HealthCare courses
    await Course.create({
      title: "Medical Coding",
      description: "Learn medical coding and billing",
      content: "ICD-10, CPT, and HCPCS codes",
      organizationId: org4.id,
      brandId: brand5.id,
      isActive: true,
    });

    await Course.create({
      title: "Medical Billing",
      description: "Learn medical billing and insurance",
      content: "Claims processing, insurance verification, and reimbursement",
      organizationId: org4.id,
      brandId: brand5.id,
      isActive: true,
    });

    // Finance courses
    await Course.create({
      title: "Financial Modeling",
      description: "Learn financial modeling and forecasting",
      content: "DCF, LBO, and valuation techniques",
      organizationId: org5.id,
      brandId: brand6.id,
      isActive: true,
    });
    console.log("Courses created successfully✔️");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

module.exports = seedData;
