& webpack --config webpack.vendor-bundles.js
& webpack --config webpack.prod.js
write-output "\nBuild completed, beginning copy"
& robocopy ./ "\\192.168.3.173\Node Server\client" webpack.*.js config.js
& robocopy ./dist "\\192.168.3.173\Node Server\client\dist" /mir
write-output "\nCopy completed"