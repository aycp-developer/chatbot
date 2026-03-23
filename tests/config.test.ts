import { describe, it, expect } from 'vitest';
import { config } from '../src/config/index.js';

describe('Config', () => {
	it('should have required gemini config', () => {
		expect(config.gemini).toBeDefined();
		expect(config.gemini.apiKey).toBeDefined();
		expect(config.gemini.baseUrl).toBeDefined();
		expect(config.gemini.model).toContain('gemini');
	});

	it('should have port configured', () => {
		expect(config.port).toBeDefined();
		expect(typeof config.port).toBe('number');
	});

	it('should have nodeEnv configured', () => {
		expect(config.nodeEnv).toBeDefined();
		expect(typeof config.nodeEnv).toBe('string');
	});
});
