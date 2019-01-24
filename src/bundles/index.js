import { composeBundles, createCacheBundle } from 'redux-bundler'
import ipfsBundle from 'ipfs-redux-bundle'
import { exploreBundle } from 'ipld-explorer-components'
import appIdle from './app-idle'
import nodeBandwidthChartBundle from './node-bandwidth-chart'
import nodeBandwidthBundle from './node-bandwidth'
import peersBundle from './peers'
import peerLocationsBundle from './peer-locations'
import routesBundle from './routes'
import redirectsBundle from './redirects'
import filesBundle from './files'
import configBundle from './config'
import configSaveBundle from './config-save'
import navbarBundle from './navbar'
import statsBundle from './stats'
import notifyBundle from './notify'
import connectedBundle from './connected'
import retryInitBundle from './retry-init'
import identityBundle from './identity'
import bundleCache from '../lib/bundle-cache'
import ipfsDesktop from './ipfs-desktop'
import repoStats from './repo-stats'

export default composeBundles(
  createCacheBundle(bundleCache.set),
  appIdle({ idleTimeout: 5000 }),
  ipfsBundle({
    tryWindow: false
  }),
  identityBundle,
  navbarBundle,
  routesBundle,
  redirectsBundle,
  statsBundle,
  filesBundle(),
  exploreBundle(async () => {
    const [
      // IPLD
      ipld,
      // IPLD Formats
      ipldBitcoin, ipldDagCbor, ipldDagPb, ipldGit, ipldRaw, ipldZcash,
      { ethAccountSnapshot, ethBlock, ethBlockList, ethStateTrie, ethStorageTrie, ethTxTrie, ethTx }
    ] = await Promise.all([
      import('ipld'),
      import('ipld-bitcoin'),
      import('ipld-dag-cbor'),
      import('ipld-dag-pb'),
      import('ipld-git'),
      import('ipld-raw'),
      import('ipld-zcash'),
      import('ipld-ethereum')
    ])

    return {
      ipld: ipld,
      formats: [
        ipldBitcoin, ipldDagCbor, ipldDagPb, ipldGit, ipldRaw, ipldZcash,
        ethAccountSnapshot, ethBlock, ethBlockList, ethStateTrie, ethStorageTrie, ethTxTrie, ethTx
      ]
    }
  }),
  configBundle,
  configSaveBundle,
  nodeBandwidthBundle,
  nodeBandwidthChartBundle(),
  peersBundle,
  peerLocationsBundle({ concurrency: 1 }),
  notifyBundle,
  connectedBundle,
  retryInitBundle,
  ipfsDesktop,
  repoStats
)
