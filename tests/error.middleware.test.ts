import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler } from '../src/middleware/error.middleware.js';

vi.mock('../src/config/index.js', () => ({
	config: {
		nodeEnv: 'development',
	},
}));

describe('ErrorHandler Middleware', () => {
	let mockReq: any;
	let mockJson: ReturnType<typeof vi.fn>;
	let mockStatus: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockJson = vi.fn();
		mockStatus = vi.fn().mockReturnValue({ json: mockJson });
		mockReq = {};
	});

	it('should return 500 with error message', () => {
		const mockRes = {
			status: mockStatus,
			json: mockJson,
		};

		const error = new Error('Something went wrong');

		errorHandler(error, mockReq, mockRes as any, vi.fn());

		expect(mockStatus).toHaveBeenCalledWith(500);
		expect(mockJson).toHaveBeenCalledWith({
			success: false,
			error: {
				message: 'Something went wrong',
			},
		});
	});

	it('should use default error message when none provided', () => {
		const mockRes = {
			status: mockStatus,
			json: mockJson,
		};

		const error = new Error();

		errorHandler(error, mockReq, mockRes as any, vi.fn());

		expect(mockStatus).toHaveBeenCalledWith(500);
		expect(mockJson).toHaveBeenCalledWith({
			success: false,
			error: {
				message: 'Internal server error',
			},
		});
	});
});
