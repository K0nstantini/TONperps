import { Blockchain, SandboxContract, TreasuryContract, printTransactionFees } from '@ton/sandbox';
import { address, toNano } from '@ton/core';
import { Main } from '../wrappers/Main';
import '@ton/test-utils';
import { randomAddress } from '@ton/test-utils';

describe('Main', () => {
	let blockchain: Blockchain;
	let deployer: SandboxContract<TreasuryContract>;
	let main: SandboxContract<Main>;
	let random: SandboxContract<TreasuryContract>;

	beforeEach(async () => {
		blockchain = await Blockchain.create();
		main = blockchain.openContract(await Main.fromInit());
		deployer = await blockchain.treasury('deployer');
		random = await blockchain.treasury('random');

		const deployResult = await main.send(
			deployer.getSender(),
			{
				value: toNano('0.05'),
			},
			{
				$$type: 'Deploy',
				queryId: 0n,
			}
		);

		expect(deployResult.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			deploy: true,
			success: true,
		});
	});

	it('should deploy', async () => {
		// the check is done inside beforeEach
		// blockchain and main are ready to use
	});

	it('change owner', async () => {
		let res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'ChangeOwner',
			queryId: 0n,
			newOwner: random.address,
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: true,
		});

		let owner = await main.getOwner();
		expect(owner).toEqualAddress(random.address);
	});

	it('add/remove trusted addr', async () => {
		var res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'AddTrustedAddress',
			addr: random.address,
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: true,
		});

		var trustedAddressses = await main.getGetTrustedAddresses();
		let addedAddress = trustedAddressses.has(random.address);
		expect(addedAddress).toBeTruthy();

		res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'RemoveTrustedAddress',
			addr: random.address,
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: true,
		});

		trustedAddressses = await main.getGetTrustedAddresses();
		let emptyAddresses = trustedAddressses.size == 0;
		expect(emptyAddresses).toBeTruthy();
	});

	it('set base jetton', async () => {
		var res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'SetBaseJetton',
			addr: random.address,
			decimal: 6n,
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: true,
		});

		let jetton = await main.getGetBaseJetton();
		expect(jetton?.addr).toEqualAddress(random.address);

		res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'SetBaseJetton',
			addr: main.address,
			decimal: 6n,
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: false,
		});
	});

	it('add/remove jetton', async () => {
		var res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'AddJetton',
			addr: random.address,
			decimal: 6n,
			active: true
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: true,
		});

		var jettons = await main.getGetJettons();
		var record = jettons.get(random.address);
		expect(record?.active).toBeTruthy();

		res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'AddJetton',
			addr: random.address,
			decimal: 6n,
			active: false
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: true,
		});

		jettons = await main.getGetJettons();
		record = jettons.get(random.address);
		expect(record?.active).toBeFalsy();

		res = await main.send(deployer.getSender(), {
			value: toNano('0.05')
		}, {
			$$type: 'RemoveJetton',
			addr: random.address,
		});

		expect(res.transactions).toHaveTransaction({
			from: deployer.address,
			to: main.address,
			success: true,
		});

		jettons = await main.getGetJettons();
		expect(jettons.size).toEqual(0);
	});



});
