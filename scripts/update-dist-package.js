const fs = require('fs')

/* package version copy */
  const rootPack = require('../package.json')
  const packPath = require.resolve('../dist/package.json')
  const packLockPath = require.resolve('../dist/package-lock.json')
  const pack = require(packPath)
  const packLock = require(packLockPath)

  pack.version = rootPack.version
  packLock.version = rootPack.version
  pack.jsDependencies = rootPack.jsDependencies

  fs.writeFileSync(packPath, JSON.stringify(pack, null, 2))
  fs.writeFileSync(packLockPath, JSON.stringify(packLock, null, 2))
/* end : package version copy */

/* copy readme */
  const path = require('path')

  const fromReadMe = path.join(packPath,'../../','README.md')
  const toReadMe = path.join(packPath,'../','README.md')
  fs.writeFileSync(toReadMe, fs.readFileSync(fromReadMe))

  console.log('\x1b[33m[dist]:\x1b[0m', 'updated dist package version to ', pack.version)
/* end : copy readme */

/*
function manageExample(){
  const exPackPath = require.resolve('../example/package.json')
  const exPack = require(exPackPath)
  exPack.devDependencies = rootPack.devDependencies
  fs.writeFileSync(exPackPath, JSON.stringify(exPack, null, 2))
}

manageExample()*/