// utils/idGenerator.ts
export class IdGenerator {
	private static readonly SEPARATOR = "__";

	/**
	 * Generate unique ID using crypto
	 */
	static generateId(): string {
		return crypto.randomUUID();
	}

	/**
	 * Generate unique node ID
	 * Format: {uuid}__{nodeType}
	 */
	static generateNodeId(nodeType: string): string {
		return `${crypto.randomUUID()}${this.SEPARATOR}${nodeType}`;
	}

	/**
	 * Generate unique handle ID
	 * Format: {nodeId}__{handleId}
	 */
	static generateHandleId(nodeId: string, handleId: string): string {
		const cleanHandleId = handleId.split(this.SEPARATOR).pop() || handleId;
		return `${nodeId}${this.SEPARATOR}${cleanHandleId}`;
	}

	/**
	 * Generate unique edge ID
	 * Format: {sourceNodeId}__{sourceHandleId}__{targetNodeId}__{targetHandleId}
	 */
	static generateEdgeId(
		sourceNodeId: string,
		sourceHandleId: string,
		targetNodeId: string,
		targetHandleId: string,
	): string {
		return `${sourceNodeId}${this.SEPARATOR}${sourceHandleId}${this.SEPARATOR}${targetNodeId}${this.SEPARATOR}${targetHandleId}`;
	}

	/**
	 * Extract node ID from handle ID
	 * Format: {nodeId}__{handleId} -> {nodeId}
	 */
	static getNodeIdFromHandleId(handleId: string): string {
		const parts = handleId.split(this.SEPARATOR);
		return parts.slice(0, -1).join(this.SEPARATOR);
	}

	/**
	 * Extract handle name from handle ID
	 * Format: {nodeId}__{handleId} -> {handleId}
	 */
	static getHandleName(handleId: string): string {
		const parts = handleId.split(this.SEPARATOR);
		return parts[parts.length - 1];
	}

	/**
	 * Extract node type from node ID
	 * Format: {uuid}__{nodeType} -> {nodeType}
	 */
	static getNodeType(nodeId: string): string {
		const parts = nodeId.split(this.SEPARATOR);
		return parts[parts.length - 1];
	}
}
