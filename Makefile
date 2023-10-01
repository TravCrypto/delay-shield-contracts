include .env

$(eval export $(shell sed -ne 's/ *#.*$$//; /./ s/=.*$$// p' .env))

install: 
	bash script/install_hook.sh && yarn

format:
	forge fmt

snapshot:
	forge snapshot

verify:
	forge verify-contract \
 --chain-id 11155111 \
 --watch \
 --constructor-args $(cast abi-encode "constructor(address, bytes32)" "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0" "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000") \
 --etherscan-api-key $(ETHERSCAN_APIKEY) \
 --compiler-version v0.8.21+commit.d9974bed \
 $(CONSUMER_ADDRESS) \
 src/DelayShield.sol:DelayShield

step-1:
	npx ts-node ./script/1_deployConsumer.ts

step-2:
	npx ts-node ./script/2_provideLiquidity.ts	

step-3:
	npx ts-node ./script/3_buyInsurance.ts

step-4:
	npx ts-node ./script/4_request.ts

step-5:
	npx ts-node ./script/5_readResponse.ts
