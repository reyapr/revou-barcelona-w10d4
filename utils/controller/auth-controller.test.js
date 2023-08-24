
const { register } = require('../../controller/auth-controller.js')
const bcrypt = require('bcrypt')
const StandardError = require('../standard-error.js')

jest.mock('bcrypt')

describe('Auth Controller', () => {
  it('[POSITIVE] should success to register new user', async () => {
    const user = {
      username: 'user123',
      password: 'pass123',
      role: 'admin'
    }
    
    const collectionMock = { 
      findOne: jest.fn().mockReturnValue(null),
      insertOne: jest.fn().mockReturnValue(user)
    }
    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock)
    }
    const reqMock = { db: dbMock, body: user }
    
    // ketika hashing success dengan suatu nilai
    jest.spyOn(bcrypt, 'hash').mockReturnValue('!@#123')
    
    // terakhir res status.json berhasil dipanggil
    const statusJsonMock = {
      json: jest.fn()
    }
    const resMock = {
      status: jest.fn().mockReturnValue(statusJsonMock)
    }
    
    await register(reqMock, resMock, null)
    
    // assertion
    expect(dbMock.collection).toHaveBeenCalledTimes(2)
    expect(dbMock.collection).toHaveBeenNthCalledWith(1, 'users');
    expect(collectionMock.findOne).toHaveBeenCalledWith({ username: 'user123'})
    expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10)
    expect(dbMock.collection).toHaveBeenNthCalledWith(2, 'users');
    expect(collectionMock.insertOne).toHaveBeenCalledWith({
      username: 'user123',
      password: '!@#123',
      role: 'admin'
    })
    expect(resMock.status).toHaveBeenCalledWith(200)
    expect(statusJsonMock.json).toHaveBeenCalledWith({
      message: 'User successfully registered',
      data: user
    })
    
  })
  
  it('[NEGATIVE] should failed to register because username already exists', async () => {
    const user = {
      username: 'user123',
      password: 'pass123',
      role: 'admin'
    }
    
    const collectionMock = {
      findOne: jest.fn().mockReturnValue(user)
    }
    
    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock)
    }
    
    const reqMock = { db: dbMock, body: user }
    const nextMock = jest.fn()
    
    await register(reqMock, null, nextMock)
    
    expect(dbMock.collection).toHaveBeenCalledWith('users')
    expect(dbMock.collection).toHaveBeenCalledTimes(1)
    expect(nextMock).toHaveBeenCalledWith(expect.any(StandardError))
    expect(nextMock).toHaveBeenCalledWith(expect.objectContaining({
      status: 500,
      message: 'Username already exists'
    }))
  })
})