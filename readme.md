# **Typeorm Easy Transaction Manager with Typescript Decorators**

📚 Abstracted Typeorm transaction control for Typescript decorators, to facilitate transaction management and make the code cleaner.

<br>

[![tests](https://github.com/plinioduartt/typeorm-ez-transaction/actions/workflows/tests.yml/badge.svg?branch=master)](https://github.com/plinioduartt/typeorm-ez-transaction/actions/workflows/tests.yml)
[![ci](https://github.com/plinioduartt/typeorm-ez-transaction/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/plinioduartt/typeorm-ez-transaction/actions/workflows/ci.yml)

<br>

## **Only supported ORMs: [Typeorm]**

<br>

## **Why to use**

This is an abstract implementation to work with Typeorm transactions.

The main objective is to facilitate the flow of implementation and provide a powerfull feature, you can use the @Transactional decorator at multiple usecases/services/adapters layers without the fear of coupling the layers of your application with the ORM specific syntax.

<br>

## **Quickstart**

<br>

### **Configuration:**
```
import { DataSource } from 'typeorm'
import { TransactionManager } from 'typeorm-ez-transaction'

const dataSource = new DataSource({
	...options
})

dataSource.initialize()

TransactionManager.setDatasource(dataSource)
```
<br>

### **Example of use:**
- Let's say you need to handle multiple transactions at the same time, if there is some error you'll need to rollback all and if success you commit all. 
```
import { Transactional } from 'typeorm-ez-transaction'

class Example1 {
	constructor(...) {...}

	@Transactional()
	methodToBeCalled() {
		usersRepository.createUser()
		addressRepository.createAddress()
		paymentsRepository.newPayment()
	}
}
```
- Important to say that all repositories **have** to use the EntityManager from TransactionManager.getManager() that is a Typeorm EntityManager concurrent-proof.

```
import { TransactionManager } from 'typeorm-ez-transaction'

class UsersRepository {
	const repository = TransactionManager
		.getManager()
		.getRepository(UserEntity)

	async createUser(data) {
		await repository.create(data)
	}
}
```

### **Optional arguments:**
```
TransactionalOptions {
  logging?: boolean
}
```
<br>

**If you pass logging: true, then you'll see logs like that:**
```
TRACE:

[01:21:05.906] INFO: [OrderUsecase][executeWithSuccess] is being intercepted by Transactional decorator...
[01:21:05.914] INFO: [OrderUsecase][executeWithFailure] is being intercepted by Transactional decorator...

SUCCESS: 

[01:23:29.425] INFO: [OrderUsecase][executeWithSuccess][Typeorm] transaction initialized.
[01:23:29.463] INFO: [OrderUsecase][executeWithSuccess][Typeorm] transaction completed successfully.

FAILURES: 

[01:21:12.494] INFO: [OrderUsecase][executeWithFailure][Typeorm] transaction initialized.
[01:21:12.526] INFO: [OrderUsecase][executeWithFailure][Typeorm] has failed. Rollback realized successfully.
```

