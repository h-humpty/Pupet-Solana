import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Keypair, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';

import { SolanaPuppet } from "../target/types/solana_puppet";
import { PuppetShadow } from "../target/types/puppet_shadow";

describe("solana-puppet", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const puppetProgram = anchor.workspace.SolanaPuppet as Program<SolanaPuppet>;
  const puppetShadowProgram = anchor.workspace.PuppetShadow as Program<PuppetShadow>;

  const puppetKeypair = Keypair.generate();

  it('Does CPI!', async () => {
    await puppetProgram.rpc.initialize({
      accounts: {
        puppet: puppetKeypair.publicKey,
        user: anchor.getProvider().wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [puppetKeypair]
    });

    await puppetShadowProgram.rpc.pullStrings(new anchor.BN(42), {
      accounts: {
        puppetProgram: puppetProgram.programId,
        puppet: puppetKeypair.publicKey
      }
    });

    expect((
      await puppetProgram.account.data.fetch(
        puppetKeypair.publicKey
      )
    ).data.toNumber()).to.equal(42);
  });
});
