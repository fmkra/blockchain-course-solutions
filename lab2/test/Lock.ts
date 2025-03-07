import { expect } from 'chai'
import hre from 'hardhat'

describe('NumberStorage', function () {
    async function deployContract() {
        const NumberStorage = await hre.ethers.getContractFactory('NumberStorage')
        const numberStorage = await NumberStorage.deploy()
        return numberStorage
    }

    it('Should initialize to 0', async function () {
        const numberStorage = await deployContract()
        expect(await numberStorage.value()).to.equal(0)
    })

    it('Should add correctly', async function () {
        const numberStorage = await deployContract()

        await numberStorage.add()
        expect(await numberStorage.value()).to.equal(3)

        await numberStorage.add()
        expect(await numberStorage.value()).to.equal(6)

        await numberStorage.add()
        expect(await numberStorage.value()).to.equal(9)
    })

    it('Should multiply initial value', async function () {
        const numberStorage = await deployContract()

        await numberStorage.multiply()
        expect(await numberStorage.value()).to.equal(0)
    })

    it('Should multiply and add correctly', async function () {
        const numberStorage = await deployContract()

        await numberStorage.add()
        expect(await numberStorage.value()).to.equal(3)

        await numberStorage.multiply()
        expect(await numberStorage.value()).to.equal(6)

        await numberStorage.multiply()
        expect(await numberStorage.value()).to.equal(12)

        await numberStorage.add()
        expect(await numberStorage.value()).to.equal(15)

        await numberStorage.multiply()
        expect(await numberStorage.value()).to.equal(30)

        await numberStorage.add()
        expect(await numberStorage.value()).to.equal(33)

        await numberStorage.add()
        expect(await numberStorage.value()).to.equal(36)
    })
})
