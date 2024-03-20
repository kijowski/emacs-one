import edge from 'edge.js'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as clarityIcons } from '@iconify-json/clarity'

/**
 * Add heroIcons collection
 */
addCollection(clarityIcons)

// const edge = Edge.create()

/**
 * Register the plugin
 */
edge.use(edgeIconify)
