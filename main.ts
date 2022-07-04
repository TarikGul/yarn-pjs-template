import '@polkadot/api-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN_ZERO } from '@polkadot/util';
import { createTestPairs } from '@polkadot/keyring/testingPairs';

// Credit to polkadot-js: ./packages/types/src/extrinsic/v4/ExtrinsicSignature.spec.ts
const signOptions = {
    blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
    genesisHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
    nonce: '0x69',
    runtimeVersion: {
        apis: [],
        authoringVersion: BN_ZERO,
        implName: String('test'),
        implVersion: BN_ZERO,
        specName: String('test'),
        specVersion: BN_ZERO,
        transactionVersion: BN_ZERO
    }
};

const pairs = createTestPairs({ type: 'ed25519' });

/**
 * Simple polkadot-js template to test and reproduce things locally
 */
const main = async () => {
    const api = await ApiPromise.create({
        provider: new WsProvider('ws://127.0.0.1:9944'),
    });

    const call = '0x1a02283c01db0700003c01d00700003c01d40700003c01d60700003c01dc0700003c00db070000e8030000009001003c00d0070000e8030000009001003c00d4070000e8030000009001003c00d6070000e8030000009001003c00dc070000e803000000900100';

    const ext = api.registry.createType('Extrinsic', api.registry.createType('Call', call)).signFake(
        pairs.alice.publicKey,
        signOptions
    ).toHex()

    const { weight, partialFee, class: dispatchClass } = await api.rpc.payment.queryInfo(ext);

    console.log('Weight: ', weight.toString());
    console.log('PartialFee: ', partialFee.toString());
    console.log('Class: ', dispatchClass.toString())
};

main().catch(err => console.log(err)).finally(() => process.exit());
