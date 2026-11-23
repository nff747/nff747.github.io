/**
 * Memory buffer and ring structures for Nff747.Github.Io
 */

export interface MemorySlabDescriptor {
  readonly offset: number;
  readonly byteLength: number;
  readonly isAligned64: boolean;
}

export interface RingSlotMetadata {
  readonly sequence: bigint;
  readonly length: number;
  readonly flags: number;
}
