use anchor_lang::prelude::*;
use solana_puppet::cpi::accounts::SetData;
use solana_puppet::program::SolanaPuppet;
use solana_puppet::{self, Data};

declare_id!("HmbTLCmaGvZhKnn1Zfa1JVnp7vkMV4DYVxPLWBVoN65L");

#[program]
pub mod puppet_shadow {
    use super::*;

    pub fn pull_strings(_ctx: Context<PullStrings>, data: u64) -> Result<()> {
        solana_puppet::cpi::set_data(_ctx.accounts.set_data_ctx(), data)
    }
}

#[derive(Accounts)]
pub struct PullStrings<'info> {
    #[account(mut)]
    pub puppet: Account<'info, Data>,
    pub puppet_program: Program<'info, SolanaPuppet>
}

impl<'info> PullStrings<'info> {
    pub fn set_data_ctx(&self) -> CpiContext<'_, '_, '_, 'info, SetData<'info>> {
        let cpi_program = self.puppet_program.to_account_info();
        let cpi_accounts = SetData {
            puppet: self.puppet.to_account_info(),
        };
        
        CpiContext::new(cpi_program, cpi_accounts)
    }
}