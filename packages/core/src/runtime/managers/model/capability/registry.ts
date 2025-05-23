import { Logger } from "winston";

import logger from "../../../../lib/logger";

/**
 * Registry for model capabilities
 */
export class CapabilityRegistry {
  private capabilities = new Map<string, Set<string>>();
  private defaultModels = new Map<string, string>();

  public get logger(): Logger {
    return logger.child({ scope: "model.capability.registry" });
  }

  /**
   * Register a capability for a model
   */
  public registerCapability(modelId: string, capabilityId: string): void {
    if (!this.capabilities.has(capabilityId)) {
      this.capabilities.set(capabilityId, new Set([modelId]));
    }
  }

  /**
   * Set the default model for a capability
   */
  public setDefaultModelForCapability(
    capabilityId: string,
    modelId: string
  ): void {
    if (
      !this.capabilities.has(capabilityId) ||
      !this.capabilities.get(capabilityId)!.has(modelId)
    ) {
      throw new Error(
        `Model ${modelId} does not support capability ${capabilityId}`
      );
    }
    this.defaultModels.set(capabilityId, modelId);
  }

  /**
   * Get the default model for a capability
   */
  public getDefaultModelForCapability(
    capabilityId: string
  ): string | undefined {
    return this.defaultModels.get(capabilityId);
  }

  /**
   * Get all models that support a capability
   */
  public getModelsWithCapability(capabilityId: string): string[] {
    return Array.from(this.capabilities.get(capabilityId) || new Set());
  }

  /**
   * Get all registered capabilities
   */
  public getAllCapabilities(): string[] {
    return Array.from(this.capabilities.keys());
  }

  /**
   * Check if any model supports a capability
   */
  public hasCapability(capabilityId: string): boolean {
    return (
      this.capabilities.has(capabilityId) &&
      this.capabilities.get(capabilityId)!.size > 0
    );
  }
}
