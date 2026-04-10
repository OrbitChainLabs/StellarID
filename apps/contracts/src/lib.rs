#![no_std]

use soroban_sdk::{contractimpl, env::Env, symbol, Address, BytesN};

pub struct StellarIdContract;

#[contractimpl]
impl StellarIdContract {
    pub fn hello(env: Env) -> String {
        env.bytes_new(b"hello").to_string()
    }
}
