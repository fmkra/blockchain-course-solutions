import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

describe('MyToken', function () {
    async function deployMyTokenFixture() {
        const [deployer, ...users] = await hre.ethers.getSigners()

        const MyToken = await hre.ethers.getContractFactory('MyToken')
        const token = await MyToken.deploy()

        return { token, deployer, users }
    }

    it('Should correctly initialize contract', async function () {
        const { token, deployer } = await loadFixture(deployMyTokenFixture)

        expect(await token.totalSupply()).to.equal(100 * 100)
        expect(await token.balanceOf(deployer)).to.equal(100 * 100)
        expect(await token.name()).to.equal('MyToken')
        expect(await token.symbol()).to.equal('MTK')
        expect(await token.decimals()).to.equal(2)
    })

    it('Should correctly transfer tokens', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        expect(await token.balanceOf(user1)).to.equal(100 * 100)

        await token.connect(user1).transfer(user2, 100)

        expect(await token.balanceOf(user2)).to.equal(100)
        expect(await token.balanceOf(user1)).to.equal(9900)
    })

    it('Should not transfer to zero address', async function () {
        const { token, deployer } = await loadFixture(deployMyTokenFixture)

        await expect(token.connect(deployer).transfer(hre.ethers.ZeroAddress, 100)).to.be.revertedWithCustomError(
            token,
            'ERC20InvalidReceiver'
        )
    })

    it('Should not transfer with 0 balance', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        await expect(token.connect(user2).transfer(user1, 1)).to.be.revertedWithCustomError(
            token,
            'ERC20InsufficientBalance'
        )
    })

    it('Should not transfer with insufficient balance', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        await token.connect(user1).transfer(user2, 100)

        await expect(token.connect(user2).transfer(user1, 101)).to.be.revertedWithCustomError(
            token,
            'ERC20InsufficientBalance'
        )
    })

    it('Should set allowance', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        expect(await token.allowance(user1, user2)).to.equal(0)

        await token.connect(user1).approve(user2, 100)

        expect(await token.allowance(user1, user2)).to.equal(100)
    })

    it('Should not set allowance to zero address', async function () {
        const { token, deployer } = await loadFixture(deployMyTokenFixture)

        await expect(token.connect(deployer).approve(hre.ethers.ZeroAddress, 100)).to.be.revertedWithCustomError(
            token,
            'ERC20InvalidSpender'
        )
    })

    it('Should not transfer without allowance', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        await expect(token.connect(user2).transferFrom(user1, user2, 1)).to.be.revertedWithCustomError(
            token,
            'ERC20InsufficientAllowance'
        )
    })

    it('Should not transfer with insufficient allowance', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        await token.connect(user1).approve(user2, 100)

        await expect(token.connect(user2).transferFrom(user1, user2, 101)).to.be.revertedWithCustomError(
            token,
            'ERC20InsufficientAllowance'
        )
    })

    it('Should transfer with allowance', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        await token.connect(user1).approve(user2, 100)

        await token.connect(user2).transferFrom(user1, user2, 100)

        expect(await token.balanceOf(user2)).to.equal(100)
        expect(await token.balanceOf(user1)).to.equal(9900)
    })

    it('Should decrease allowance', async function () {
        const {
            token,
            deployer: user1,
            users: [user2],
        } = await loadFixture(deployMyTokenFixture)

        await token.connect(user1).approve(user2, 100)

        await token.connect(user2).transferFrom(user1, user2, 67)

        expect(await token.allowance(user1, user2)).to.equal(33)
        expect(await token.balanceOf(user2)).to.equal(67)
        expect(await token.balanceOf(user1)).to.equal(9933)
    })
})
