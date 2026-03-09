import { getSynapse } from './synapse.js';

const MIN_BYTES = 127;

export async function synapseUpload(json: string): Promise<string> {
  const encoder = new TextEncoder();
  let data = encoder.encode(json);

  if (data.length < MIN_BYTES) {
    const padded = new Uint8Array(MIN_BYTES);
    padded.set(data);
    data = padded;
  }

  const synapse = await getSynapse();
  const { pieceCid, copies, failures } = await synapse.storage.upload(data);

  if (failures && failures.length > 0) {
    console.warn(`[Synapse] ${failures.length} copy attempt(s) failed`);
  }
  console.log(`[Synapse] Stored on ${copies?.length ?? 0} provider(s), pieceCid: ${pieceCid}`);

  return pieceCid.toString();
}
