const { User, Organization, Brand, Course, ApiKey } = require('../../models');
const { generateTokens } = require('../../utils/jwt');
const faker = require('faker');

/**
 * Create test organization
 */
async function createTestOrganization(overrides = {}) {
  return await Organization.create({
    name: overrides.name || faker.company.companyName(),
    description: overrides.description || faker.company.catchPhrase(),
    ...overrides
  });
}

/**
 * Create test brand
 */
async function createTestBrand(organizationId, overrides = {}) {
  return await Brand.create({
    name: overrides.name || faker.company.companyName() + ' Education',
    description: overrides.description || faker.company.catchPhrase(),
    organizationId,
    ...overrides
  });
}

/**
 * Create test user
 */
async function createTestUser(organizationId, overrides = {}) {
  const user = await User.create({
    name: overrides.name || faker.name.findName(),
    email: overrides.email || faker.internet.email(),
    password: overrides.password || 'TestPassword123!',
    firstName: overrides.firstName || faker.name.firstName(),
    lastName: overrides.lastName || faker.name.lastName(),
    phone: overrides.phone || faker.phone.phoneNumber(),
    organizationId,
    ...overrides
  });

  // Generate tokens
  const tokens = generateTokens(user);
  await user.update({ refreshToken: tokens.refreshToken });

  return { user, tokens };
}

/**
 * Create test course
 */
async function createTestCourse(organizationId, overrides = {}) {
  return await Course.create({
    title: overrides.title || faker.lorem.sentence(4),
    description: overrides.description || faker.lorem.paragraph(),
    content: overrides.content || faker.lorem.paragraphs(3),
    organizationId,
    brandId: overrides.brandId || null,
    status: overrides.status || 'draft',
    createdBy: overrides.createdBy || null,
    updatedBy: overrides.updatedBy || null,
    ...overrides
  });
}

/**
 * Create test API key
 */
async function createTestApiKey(organizationId, overrides = {}) {
  const key = overrides.key || `org_${organizationId}_brand_${overrides.brandId || 'direct'}_${faker.random.alphaNumeric(12)}`;
  
  return await ApiKey.create({
    key,
    organizationId,
    brandId: overrides.brandId || null,
    isActive: overrides.isActive !== undefined ? overrides.isActive : true,
    ...overrides
  });
}

/**
 * Create complete test setup
 */
async function createTestSetup() {
  const org = await createTestOrganization();
  const brand = await createTestBrand(org.id);
  const { user, tokens } = await createTestUser(org.id);
  const course = await createTestCourse(org.id, { 
    brandId: brand.id, 
    createdBy: user.id,
    updatedBy: user.id 
  });
  const apiKey = await createTestApiKey(org.id, { brandId: brand.id });

  return {
    organization: org,
    brand,
    user,
    tokens,
    course,
    apiKey
  };
}

/**
 * Generate JWT token for testing
 */
function generateTestToken(user) {
  const { generateTokens } = require('../../utils/jwt');
  return generateTokens(user);
}

/**
 * Create test request headers
 */
function createAuthHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

function createApiKeyHeaders(apiKey) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
}

module.exports = {
  createTestOrganization,
  createTestBrand,
  createTestUser,
  createTestCourse,
  createTestApiKey,
  createTestSetup,
  generateTestToken,
  createAuthHeaders,
  createApiKeyHeaders
};
