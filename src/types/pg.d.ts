declare module 'pg' {
	export interface PoolConfig {
		connectionString?: string;
		host?: string;
		port?: number;
		user?: string;
		password?: string;
		database?: string;
	}

	export class Pool {
		constructor(config?: PoolConfig);
		connect(): Promise<unknown>;
		end(): Promise<void>;
	}
}
